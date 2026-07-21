import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { verifyToken, verifyCustomer, verifyAdmin } from '../middlewares/auth.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Send an order-lifecycle email without letting delivery failures break the request
const sendOrderEmail = (sendFn, customer, ...args) => {
  if (!customer?.email || customer.preferences?.notifications === false) return;
  sendFn(customer.email, ...args).catch((error) => {
    console.error(`Failed to send order email to ${customer.email}:`, error.message);
  });
};

// POST /orders - Create order from cart
router.post('/', verifyToken, verifyCustomer, async (req, res) => {
  const { shippingAddress, billingAddress, shippingMethodId } = req.body;

  const cart = await Cart.findOne({ customerId: req.user.userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  // Calculate totals
  let subtotal = 0;
  for (let item of cart.items) {
    subtotal += item.price * item.quantity;
  }

  const shippingCharge = 60; // Default shipping
  const total = subtotal + shippingCharge;

  const order = new Order({
    customerId: req.user.userId,
    orderNumber: generateOrderNumber(),
    items: cart.items,
    shippingAddress,
    billingAddress,
    shippingMethodId,
    subtotal,
    shippingCharge,
    total,
    status: 'pending',
  });

  await order.save();

  // Clear cart
  cart.items = [];
  await cart.save();

  const customer = await Customer.findById(req.user.userId);
  sendOrderEmail(emailService.sendOrderConfirmationEmail, customer, order, customer);

  res.status(201).json({ success: true, message: 'Order created', data: order });
});

// POST /orders/:id/payment - Submit payment proof
router.post('/:id/payment', verifyToken, verifyCustomer, async (req, res) => {
  const { senderMobile, transactionId, screenshotUrl } = req.body;

  if (!senderMobile || (!transactionId && !screenshotUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Sender mobile required. At least one proof (TxnID or screenshot) required.',
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const payment = new Payment({
    orderId: order._id,
    senderMobile,
    transactionId,
    screenshotUrl,
    amount: order.total,
    status: 'pending',
  });

  await payment.save();
  order.paymentId = payment._id;
  await order.save();

  res.json({ success: true, message: 'Payment submitted', data: { orderId: order._id, paymentStatus: 'pending' } });
});

// PUT /orders/:id/payment/confirm - Verify payment and confirm order (admin only)
router.put('/:id/payment/confirm', verifyToken, verifyAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('paymentId');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  if (!order.paymentId) {
    return res.status(400).json({ success: false, message: 'No payment proof submitted for this order' });
  }

  const payment = await Payment.findByIdAndUpdate(
    order.paymentId._id,
    { status: 'verified', verifiedAt: new Date(), verifiedBy: req.user.userId },
    { new: true }
  );

  order.status = 'confirmed';
  order.paymentId = payment;
  await order.save();

  const customer = await Customer.findById(order.customerId);
  sendOrderEmail(emailService.sendPaymentReceivedEmail, customer, order, customer);

  res.json({ success: true, message: 'Payment confirmed', data: { order, payment } });
});

// GET /orders - Get customer's orders
router.get('/', verifyToken, verifyCustomer, async (req, res) => {
  const orders = await Order.find({ customerId: req.user.userId })
    .populate('items.productId shippingMethodId paymentId')
    .sort({ createdAt: -1 });

  res.json({ success: true, message: 'Orders retrieved', data: orders });
});

// GET /orders/:id - Get order details
router.get('/:id', verifyToken, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.productId paymentId');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, message: 'Order retrieved', data: order });
});

// PUT /orders/:id/status - Update order status (admin only)
router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  const { status, parcelId } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, parcelId },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const customer = await Customer.findById(order.customerId);
  if (status === 'shipped') {
    sendOrderEmail(emailService.sendShippingNotificationEmail, customer, order, customer);
  } else if (status === 'delivered') {
    sendOrderEmail(emailService.sendDeliveryNotificationEmail, customer, order, customer);
  }

  res.json({ success: true, message: 'Order updated', data: order });
});

export default router;

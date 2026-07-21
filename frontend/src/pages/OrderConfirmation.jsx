import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getOrderById } from '../api/order'

// Shown after a Cash on Delivery order is placed; no online payment gateway is involved
export default function OrderConfirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(id)
      setOrder(response.data.data)
    } catch (error) {
      console.error('Error fetching order:', error)
      navigate('/my-orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!order) return <div className="text-center py-12">Order not found</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded shadow text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-3xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Our customer service agent will contact you shortly to confirm your order.
        </p>

        <div className="bg-gray-50 rounded p-4 text-left space-y-2 mb-6">
          <p><strong>Order Number:</strong> {order.orderNumber}</p>
          <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ৳{order.total}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
        </div>

        <p className="text-gray-600 mb-3">Need help now? Reach us directly:</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <a
            href="tel:+8801234567890"
            className="flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 rounded hover:bg-gray-50"
          >
            📞 Call +880 1234 567890
          </a>
          <a
            href="https://wa.me/8801234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            WhatsApp Us
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/orders/${order._id}/tracking`}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Track Order
          </Link>
          <Link
            to="/shop"
            className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

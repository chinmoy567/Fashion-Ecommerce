# Backend Setup Guide

## Email & Database Configuration

This guide explains how to set up email and database services for the Clothing E-Commerce Platform.

---

## 1. Environment Variables

The `.env` file contains all configuration needed for email and database.

### Configuration Shape (see `.env.example`, real values live only in your local `.env`):

```
# Database Configuration
MONGODB_URI=<your MongoDB Atlas connection string>

# Email Configuration
SMTP_MAIL=<your Gmail address>
SMTP_PASSWORD=<your Gmail app-specific password>
EMAIL_FROM=noreply@fashionhub.com
ADMIN_EMAIL=<admin login email>
ADMIN_PASSWORD=<admin login password>

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
```

⚠️ Never commit real values for these to `SETUP_GUIDE.md`, `.env.example`, or any
other tracked file — only `.env` (gitignored) should hold actual secrets.

---

## 2. Database Setup

### Connection Details

- **Database URL**: MongoDB Atlas
- **Database Name**: clothing-ecommerce
- **Auto-indexes**: Created on server startup

### What Gets Created

1. **Customers Collection**
   - Unique index on email
   - Index on (isActive, createdAt)

2. **Products Collection**
   - Unique index on SKU
   - Indexes on categoryId, brandId, status
   - Full-text search on name and description

3. **Orders Collection**
   - Unique index on orderId
   - Indexes on (customerId, orderPlacedDate)
   - Index on (status, orderPlacedDate)

4. **Cart Collection**
   - Index on customerId

5. **Payments Collection**
   - Indexes on orderId and status

### Initialize Database

Run the initialization script (one-time):

```bash
# From backend directory
node scripts/initializeDB.js
```

**What it does:**
- Creates all database indexes for optimal performance
- Creates default admin user (if not exists), using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`
  - If `ADMIN_PASSWORD` is not set, admin user creation is skipped

---

## 3. Email Service

### Gmail SMTP Configuration

The email service uses Gmail SMTP for sending emails.

**Current Setup:**
- SMTP Host: `smtp.gmail.com`
- SMTP Port: `587`
- User: configured via `SMTP_MAIL` in `.env`
- Password: App-specific password, configured via `SMTP_PASSWORD` in `.env`

### Emails Sent By System

1. **OTP Verification**
   - Sent on registration
   - Contains 6-digit OTP
   - Expires in 10 minutes

2. **Order Confirmation**
   - Sent when order is placed
   - Contains order details and items

3. **Payment Confirmation**
   - Sent when payment is verified
   - Updates customer on order status

4. **Shipping Notification**
   - Sent when order ships
   - Contains tracking information

5. **Delivery Confirmation**
   - Sent when order is delivered
   - Requests review/feedback

6. **Password Reset**
   - Sent on forgot password request
   - Contains 6-digit OTP (expires in 10 minutes)

### Testing Email

```javascript
// In your Node.js console or test file
import emailService from './src/services/emailService.js';

// Test OTP email
await emailService.sendOTPEmail('test@example.com', '123456', 'John Doe');

// Test order confirmation
await emailService.sendOrderConfirmationEmail(
  'customer@example.com',
  { _id: '123', subtotal: 1000, shipping: 100, total: 1100, items: [] },
  { name: 'Customer Name' }
);
```

---

## 4. Cloudinary Setup

### File Upload Service

Cloudinary is used for storing product images and user uploads.

**Current Setup:**
- Cloud Name: configured via `CLOUDINARY_CLOUD_NAME` in `.env`
- API Key: configured via `CLOUDINARY_API_KEY` in `.env`
- API Secret: configured via `CLOUDINARY_API_SECRET` in `.env`

### Supported Uploads

1. **Product Images** - Multiple images per product
2. **User Profile Pictures** - Customer avatars
3. **Invoice/Documents** - PDF receipts

---

## 5. Service Initialization

On server startup (`npm start`), the following happens automatically:

```
📡 Initializing services...

✅ MongoDB connected
✅ Email service connected
✅ Cloudinary service connected

✅ Services initialization complete

🚀 Server running on port 5001
📍 Environment: development
📧 Admin Email: chinmoy6667@gmail.com

🔗 API: http://localhost:5001
📺 Frontend: http://localhost:5173
```

---

## 6. Manual Setup Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Verify Environment Variables

Check that `.env` file has:
- ✅ MONGODB_URI
- ✅ SMTP_MAIL & SMTP_PASSWORD
- ✅ CLOUDINARY_* keys
- ✅ JWT_SECRET & JWT_EXPIRE
- ✅ ADMIN_EMAIL & ADMIN_PASSWORD

### Step 3: Initialize Database (One-time)

```bash
node scripts/initializeDB.js
```

Expected output:
```
🔄 Initializing Database...

✅ Connected to MongoDB

📊 Creating indexes...
  ✓ Customer indexes
  ✓ Product indexes
  ✓ Order indexes
  ✓ Cart indexes
  ✓ Payment indexes
  ✓ Category indexes
✅ All indexes created successfully

👤 Setting up admin user...
  ✓ Admin user created: chinmoy6667@gmail.com
  ⚠️  Password set from ADMIN_PASSWORD env var. Change it after first login.

✅ Database initialization complete
```

### Step 4: Start Server

```bash
npm start
```

Expected output:
```
📡 Initializing services...

✅ MongoDB connected: cluster0.mongodb.net
✅ Email service connected successfully
✅ Cloudinary service connected successfully

✅ Services initialization complete

🚀 Server running on port 5001
📍 Environment: development
📧 Admin Email: chinmoy6667@gmail.com

🔗 API: http://localhost:5001
📺 Frontend: http://localhost:5173
```

---

## 7. Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoDB connection warning: ENOTFOUND cluster0...`

**Solutions:**
1. Check internet connection
2. Verify MONGODB_URI in `.env`
3. Check MongoDB Atlas IP whitelist includes your IP
4. Try connecting with MongoDB Compass using the connection string

### Email Service Issues

**Error**: `Email service warning: Invalid login...`

**Solutions:**
1. Verify SMTP_MAIL and SMTP_PASSWORD in `.env`
2. For Gmail, use app-specific password (not account password)
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password to SMTP_PASSWORD
3. Enable "Less secure app access" if using regular password

### Cloudinary Issues

**Error**: `Cloudinary service warning: Missing required...`

**Solutions:**
1. Verify all CLOUDINARY_* variables in `.env`
2. Check API credentials at https://cloudinary.com/console
3. Ensure API key and secret are correct

---

## 8. Production Considerations

### Email

For production, consider:
- Using SendGrid or AWS SES for better deliverability
- Implementing email templates in a template engine
- Setting up SPF/DKIM records for domain authentication
- Monitoring email delivery rates

### Database

For production:
- Enable MongoDB replica set for transactions
- Configure automated backups
- Set up monitoring and alerts
- Use connection pooling
- Implement query optimization

### Cloudinary

For production:
- Use CDN delivery URLs
- Implement image optimization
- Set up usage monitoring
- Configure security policies

---

## 9. Admin Credentials

### Default Admin Account

After running `scripts/initializeDB.js`, an admin user is created using the
`ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `.env`. If `ADMIN_PASSWORD` is
not set, no admin account is created.

⚠️ **IMPORTANT**: Never commit real admin credentials to `.env.example` or this
guide. Change the password after first login and keep `.env` out of version
control.

---

## 10. Configuration Files

### `/backend/src/config/database.js`
- MongoDB connection and index creation
- Auto-run on server startup

### `/backend/src/config/email.js`
- Email transporter configuration
- Connection validation

### `/backend/src/config/cloudinary.js`
- Cloudinary SDK configuration
- Connection validation

### `/backend/scripts/initializeDB.js`
- One-time database initialization
- Admin user creation

---

## Quick Reference

| Component | Status | Configuration |
|-----------|--------|---------------|
| MongoDB | ✅ Active | `MONGODB_URI` |
| Email (Gmail) | ✅ Active | `SMTP_MAIL`, `SMTP_PASSWORD` |
| Cloudinary | ✅ Active | `CLOUDINARY_*` |
| JWT | ✅ Active | `JWT_SECRET`, `JWT_EXPIRE` |
| Admin | ✅ Set | `ADMIN_EMAIL`, `ADMIN_PASSWORD` |

---

**Last Updated**: 2026-07-21
**Status**: ✅ Ready for Development

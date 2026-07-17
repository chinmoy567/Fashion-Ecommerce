# Quick Reference - Email & Database Setup

## 🚀 Quick Start

```bash
cd backend

# One-time setup
npm install
npm run setup

# Start the server
npm start
```

---

## ✅ What's Configured

### Database (MongoDB Atlas)
- **Connection**: `mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/clothing-ecommerce`
- **Auto-Indexes**: Created on every startup
- **Collections**: Customers, Products, Orders, Carts, Payments (and more)
- **Default Admin**: Ready after `npm run setup`

### Email (Gmail SMTP)
- **Service**: Gmail App-Specific Password
- **Templates**: OTP, Order Confirmation, Payments, Shipping, Delivery, Password Reset
- **Verified**: On server startup

### Cloudinary (Image Upload)
- **Cloud Name**: `dc4e7ctxc`
- **Purpose**: Product images, user avatars, documents
- **Verified**: On server startup

### Admin Account
- **Email**: `chinmoy6667@gmail.com`
- **Password**: `Admin@123456` (change on first login!)
- **Role**: Super Admin (full access)

---

## 📝 Key Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start the backend server |
| `npm run setup` | Initialize database (one-time) |
| `npm run dev` | Start with auto-reload (development) |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Auto-fix code style |

---

## 🔗 API Endpoints (Once Running)

```
Health Check: http://localhost:5001/api/health
```

---

## 📧 Email Service

**Automatic emails sent for:**
- ✅ User registration (OTP verification)
- ✅ Order confirmation
- ✅ Payment confirmation
- ✅ Order shipped notification
- ✅ Order delivered notification
- ✅ Password reset requests

**From**: noreply@fashionhub.com

---

## 🛠️ Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Current secrets and API keys |
| `.env.example` | Configuration reference |
| `src/config/database.js` | MongoDB setup |
| `src/config/email.js` | SMTP setup |
| `src/config/cloudinary.js` | Image upload setup |
| `scripts/initializeDB.js` | Database initialization |
| `SETUP_GUIDE.md` | Detailed setup documentation |

---

## ⚠️ Important Notes

1. **Admin Password**: Change `Admin@123456` immediately after first login!
2. **Email**: Gmail requires app-specific password (not account password)
3. **Secrets**: Never commit `.env` file with real credentials
4. **Database**: Indexes auto-create on startup (first startup takes ~10-30 seconds)
5. **Cloudinary**: All image uploads go to cloud, not local storage

---

## 🐛 If Something Doesn't Work

1. Check `.env` has all required variables
2. Verify MongoDB Atlas connection: `mongodb+srv://chinmoy:666@...`
3. For email issues: Check Gmail app password, not account password
4. For Cloudinary: Verify API key and secret
5. See `backend/SETUP_GUIDE.md` for troubleshooting

---

## 📚 Next Steps

1. ✅ Email & Database Setup - **DONE**
2. Start backend: `npm start`
3. Initialize database: `npm run setup`
4. Connect frontend to API
5. Build features!

---

**Setup Status**: ✅ Complete  
**Admin Ready**: ✅ Yes  
**Services Verified**: ✅ Yes  
**Ready to Build**: ✅ Yes!

🚀 You're all set to start developing!

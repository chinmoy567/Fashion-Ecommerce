# ⚡ Quick Start - Run the Platform NOW

## 1️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Check if dependencies are installed
ls node_modules

# If dependencies exist, skip npm install. If not:
# npm install

# Start backend server
npm run dev
```

**Expected Output**:
```
Server running on port 5000
MongoDB connected: cluster.mongodb.net
Environment: development
```

**If you get MongoDB connection error**:
- Edit `backend/.env`
- Update `MONGODB_URI` with your MongoDB Atlas connection string
- Restart the server

---

## 2️⃣ Frontend Setup (2 minutes)

Open a **NEW terminal** while backend is running:

```bash
# Navigate to frontend
cd frontend

# Check if dependencies are installed
ls node_modules

# If dependencies exist, skip npm install. If not:
# npm install

# Start frontend server
npm run dev
```

**Expected Output**:
```
VITE v5.0.0 running at http://localhost:5173/
```

---

## 3️⃣ Test the Application (5 minutes)

### Option A: Test Registration & Login
1. **Open browser**: http://localhost:5173
2. **Click "Register"**
3. **Fill form**:
   - Name: Test User
   - Email: test@example.com
   - Phone: 01712345678
   - Password: TestPassword123!
4. **Click "Register"**
5. **Enter OTP**: 
   - Check backend terminal for OTP (logged to console)
   - Copy the 6-digit number
   - Paste into OTP field
   - Click "Verify"
6. **Success!** You're logged in

### Option B: Quick Product Browse
1. **Open**: http://localhost:5173/shop
2. See empty product list (need to seed data - see below)

### Option C: Test Admin Dashboard
1. **Note**: Admin dashboard is a skeleton (coming in Phase 2)
2. **URL**: http://localhost:5173/admin/dashboard
3. Shows placeholder metrics

---

## 📝 Create Sample Products (For Testing)

Use MongoDB Compass or a database tool:

```javascript
// Add to MongoDB 'products' collection
{
  "name": "Summer T-Shirt",
  "description": "Comfortable cotton t-shirt for summer",
  "categoryId": ObjectId("..."), // Create category first
  "brandId": ObjectId("..."),    // Create brand first
  "price": 500,
  "discountPrice": 350,
  "stock": 50,
  "sku": "TSH-SUMMER-001",
  "material": "Cotton",
  "weight": 200,
  "status": "active",
  "isFeatured": true,
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Blue", "Red", "White"],
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Or use Postman**:
1. **Method**: POST
2. **URL**: http://localhost:5000/api/products
3. **Headers**: 
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_JWT_TOKEN`
4. **Body**: Product JSON above

---

## 🔑 Test Accounts

After registration works, use these credentials to login:
```
Email: test@example.com
Password: TestPassword123!
```

**Default Admin Account** (if created):
```
Email: admin@example.com
Password: AdminPassword123!
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Solution 1: Check node version
node --version  # Should be 18+

# Solution 2: Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev

# Solution 3: Check port 5000 is free
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Frontend Won't Start
```bash
# Solution 1: Clear cache
rm -rf .vite
npm run dev

# Solution 2: Check port 5173 is free
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -i :5173

# Solution 3: Try different port
npm run dev -- --port 3000
```

### MongoDB Connection Failed
1. **Check `.env`** file has correct `MONGODB_URI`
2. **Verify network access** in MongoDB Atlas:
   - Go to Network Access
   - Add current IP (or 0.0.0.0 for dev)
3. **Test connection**:
   ```bash
   mongosh "your-connection-string"
   ```

### OTP Not Received
- Check **backend console/terminal** for logged OTP
- OTP is valid for 10 minutes
- Currently configured for console logging (email not implemented yet)

### API Returns 401 Unauthorized
- Make sure you're **logged in** (check localStorage for token)
- Token might be **expired** (refresh token in Redux)
- Check **browser DevTools** → Network → see token in Authorization header

---

## 📊 API Testing with Postman

### Import Collection
1. **Download Postman** (getpostman.com)
2. **Create a collection** "FashionHub"
3. **Add requests**:

**Example 1: Register**
```
Method: POST
URL: http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "01712345678",
  "password": "TestPassword123!"
}
```

**Example 2: Get Products**
```
Method: GET
URL: http://localhost:5000/api/products?page=1&limit=12
```

**Example 3: Create Order (Requires Auth)**
```
Method: POST
URL: http://localhost:5000/api/orders
Headers: Authorization: Bearer YOUR_TOKEN
Body (JSON):
{
  "shippingAddress": {
    "line1": "123 Main St",
    "city": "Dhaka",
    "upazila": "Mohakhali",
    "division": "Dhaka",
    "postalCode": "1212"
  },
  "shippingMethodId": "standard"
}
```

---

## 🚀 Development Workflow

### Daily Development
1. **Start backend**: `cd backend && npm run dev`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Code changes** → Auto-reload via Vite/Nodemon
4. **Test changes** in browser
5. **Commit changes**: `git add -A && git commit -m "feat: description"`

### Common Commands

**Backend**:
```bash
cd backend
npm run dev          # Start dev server (auto-reload)
npm start           # Start production server
npm run lint        # Check code quality
npm run lint:fix    # Auto-fix lint issues
```

**Frontend**:
```bash
cd frontend
npm run dev         # Start dev server (auto-reload)
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Check code quality
npm run lint:fix    # Auto-fix lint issues
```

**Git**:
```bash
git status          # Check changes
git add .           # Stage all changes
git commit -m "msg" # Commit with message
git log --oneline   # View commit history
git push            # Push to remote (if configured)
```

---

## 📚 Documentation

- **BUILD_COMPLETE.md** → Full build report
- **README.md** → Project overview
- **STARTUP_GUIDE.md** → Detailed setup
- **BUILD_PLAN.md** → How it was built
- `.claude/specs/` → Complete specifications

---

## ✅ Verification Checklist

After starting servers:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] `/api/health` returns `{"success": true}`
- [ ] Home page loads without errors
- [ ] Can access `/shop` page
- [ ] Can access `/login` page
- [ ] Can navigate between pages
- [ ] Can register new account
- [ ] OTP appears in backend console
- [ ] Can verify email with OTP
- [ ] Can login after verification
- [ ] Cart icon shows in navbar
- [ ] Profile link appears when logged in

---

## 🎯 What to Test First

1. **Authentication** (5 min)
   - Register → Get OTP → Verify → Login

2. **Product Browsing** (3 min)
   - Home page → Shop page → Product details

3. **Shopping** (5 min)
   - Add to cart → View cart → Checkout

4. **Admin** (2 min)
   - Admin dashboard → View orders/products

5. **Orders** (3 min)
   - Create order → Submit payment proof → View tracking

---

## 🆘 Still Having Issues?

### Check Logs
- **Backend logs**: Look at terminal running backend
- **Frontend logs**: Open browser DevTools (F12) → Console
- **Network logs**: DevTools → Network tab → see API calls

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process on port or use different port |
| Node modules missing | Run `npm install` |
| CORS errors | Check frontend URL in backend `.env` |
| 404 on API calls | Verify endpoint URL in axios instance |
| 401 Unauthorized | Check token in localStorage |
| MongoDB not connecting | Update `.env` with correct URI |

---

## 📞 Need Help?

1. **Check the docs** in `.claude/specs/`
2. **Read the comments** in the source code
3. **Check browser console** for error messages
4. **Check backend terminal** for server errors
5. **Review BUILD_COMPLETE.md** for feature details

---

## 🎉 You're Ready!

Everything is built and ready to go. Just:

1. ✅ Start backend (`npm run dev` in backend folder)
2. ✅ Start frontend (`npm run dev` in frontend folder)
3. ✅ Open http://localhost:5173
4. ✅ Register and test!

**Happy coding! 🚀**

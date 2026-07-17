# ⚠️ MongoDB Connection Error - Troubleshooting Guide

## Error Encountered

```
❌ Error seeding database: querySrv ECONNREFUSED _mongodb._tcp.cluster0.yfyovpw.mongodb.net
```

## What This Means

Your MongoDB Atlas cluster is not responding. This could be due to:

1. **Network Connectivity Issue** - Internet/VPN problem
2. **MongoDB Atlas Cluster Down** - Server issue
3. **IP Whitelist** - Your IP not whitelisted in MongoDB Atlas
4. **Connection String Error** - Incorrect credentials or URL
5. **Firewall/DNS** - Local network blocking DNS resolution

---

## ✅ Solutions to Try

### Solution 1: Check Internet Connection

```bash
ping 8.8.8.8
# If this fails, your internet is down
```

### Solution 2: Verify MongoDB Atlas Cluster Status

1. Go to: https://cloud.mongodb.com/
2. Log in to your account
3. Check cluster status:
   - Look for green checkmark (running)
   - If yellow/red, cluster is down/paused
4. If paused: Click "Resume" to restart

### Solution 3: Check IP Whitelist

MongoDB Atlas blocks unknown IPs for security.

1. Go to: https://cloud.mongodb.com/
2. Navigate to: **Network Access** → **IP Whitelist**
3. Check if your IP is listed:
   - Look for your current IP address
   - Or look for `0.0.0.0/0` (allows all IPs)
4. If not listed:
   - Click "Add IP Address"
   - Enter your current IP (or 0.0.0.0/0 for development)
   - Click "Confirm"
5. Wait 2-3 minutes for changes to take effect

### Solution 4: Verify Connection String

Check your `.env` file:

```bash
# .env (in backend folder)
MONGODB_URI=mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/clothing-ecommerce?retryWrites=true&w=majority&appName=Cluster0
```

Verify:
- ✅ Username: `chinmoy` (before first colon)
- ✅ Password: `666` (after colon, before @)
- ✅ Cluster: `cluster0` (between @ and .mongodb.net)
- ✅ Database: `clothing-ecommerce`

If incorrect, update it.

### Solution 5: Check DNS Resolution

```bash
nslookup cluster0.yfyovpw.mongodb.net
# Should return IP addresses
# If "server not found", DNS issue
```

### Solution 6: Try Local MongoDB (Fallback)

If Atlas is not working, use local MongoDB:

```bash
# 1. Make sure MongoDB service is running
net start MongoDB  # Windows
# or
brew services start mongodb-community  # Mac
# or
sudo systemctl start mongod  # Linux

# 2. Run seed with local connection
cd backend
# Edit .env to use local:
# MONGODB_URI=mongodb://localhost:27017/deerfit

# 3. Run seed
npm run seed
```

---

## 🔍 Detailed Troubleshooting

### Step 1: Test Network Connection

```bash
# Can you reach Google?
ping google.com

# Can you reach MongoDB?
ping cluster0.yfyovpw.mongodb.net

# Both should respond
```

### Step 2: Test Connection String

```bash
# Try connecting with mongosh
mongosh "mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/clothing-ecommerce"

# If it connects, MongoDB is working
# If it fails, credentials or network is wrong
```

### Step 3: Check Firewall

Windows Firewall might be blocking Node.js:

1. Open: Settings → Privacy & Security → Firewall
2. Look for "Node.js" in allowed apps
3. If not listed, click "Allow app through firewall"
4. Select Node.js and click OK

### Step 4: Verify Credentials

In MongoDB Atlas:

1. Go to: **Database** → **Connect** → **Drivers**
2. Click "Standard Connection String"
3. Copy the connection string
4. Check username and password:
   - Click "Database Access"
   - Find your user (chinmoy)
   - Check if password is correct
   - If forgotten, reset it

---

## 🚀 What To Do Next

### Option A: Fix MongoDB Atlas (Recommended)

1. ✅ Verify cluster is running
2. ✅ Add your IP to whitelist
3. ✅ Check connection string
4. ✅ Run: `npm run seed`

**Expected output:**
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Created 5 brands
✓ Created 4 categories
✓ Successfully seeded 40 products
✨ DeerFit database is ready!
```

### Option B: Use Local MongoDB (Temporary)

1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/deerfit
   ```
4. Run: `npm run seed`

---

## 📋 Troubleshooting Checklist

- [ ] Checked internet connection (ping google.com)
- [ ] Verified MongoDB Atlas cluster is running (green status)
- [ ] Added IP address to whitelist in MongoDB Atlas
- [ ] Confirmed connection string in .env is correct
- [ ] Checked username/password are correct
- [ ] Tested DNS resolution (nslookup works)
- [ ] Checked firewall allows Node.js
- [ ] Waited 2-3 minutes for IP whitelist to apply
- [ ] Tried `npm run seed` again

If all checked and still failing → Try local MongoDB

---

## 🎯 Quick Fix Checklist

### Most Common Issues (Try These First):

1. **MongoDB Atlas cluster is paused**
   - Solution: Resume cluster in MongoDB Atlas dashboard
   - Time: 1-2 minutes

2. **Your IP not whitelisted**
   - Solution: Add 0.0.0.0/0 to IP Whitelist in MongoDB Atlas
   - Time: 5 minutes + 2-3 min wait
   - ⚠️ Security warning: Only for development!

3. **Wrong password in .env**
   - Solution: Reset password in Database Access
   - Time: 5 minutes

4. **Network/Firewall blocking**
   - Solution: Check Windows Firewall, check network
   - Time: 10 minutes

---

## 💻 Commands to Try

```bash
# Test network
ping google.com
ping cluster0.yfyovpw.mongodb.net

# Test MongoDB connection
mongosh "mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/clothing-ecommerce"

# List local databases (if using local MongoDB)
mongosh
show dbs

# Seed database
npm run seed

# Seed with detailed errors
node scripts/seedDatabase.js 2>&1 | tee seed.log
```

---

## 📞 Need More Help?

1. **MongoDB Atlas Help**: https://docs.mongodb.com/manual/
2. **Connection String Format**: https://docs.mongodb.com/manual/reference/connection-string/
3. **IP Whitelist Guide**: https://docs.mongodb.com/manual/reference/atlas/security/

---

## ✅ Success Indicators

When fixed, you'll see:

```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Created 5 brands
✓ Created 4 categories
✓ Successfully seeded 40 products

📊 Database Seed Summary:
   ✓ Categories: 4
   ✓ Products: 40
   ✓ Brands: 5
   ✓ Images: 40 (SVG Data URLs - no server storage)

✨ DeerFit database is ready!
```

---

## 🔄 After Fixing

Once MongoDB is working:

1. Run: `npm run seed`
2. Wait for success message
3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`
5. Visit: `http://localhost:5173/products`

---

## 📝 Current Status

| Item | Status |
|------|--------|
| MongoDB Atlas Connection | ❌ Failed |
| Network Check | ⏳ Unknown |
| IP Whitelist | ⏳ Unknown |
| Credentials | ⏳ Unknown |
| Seed Script | ✅ Ready (waiting for MongoDB) |
| Documentation | ✅ Complete |
| All Other Setup | ✅ Complete |

**Action Required**: Fix MongoDB connection before seeding database.

---

**Last Updated**: 2026-07-17  
**Next Step**: Follow solutions above to restore MongoDB connection

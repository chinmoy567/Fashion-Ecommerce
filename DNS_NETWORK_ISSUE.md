# DNS/Network Issue - Troubleshooting Guide

## Current Status

✅ **MongoDB Atlas**: Properly configured with IP whitelisted (0.0.0.0/0)
❌ **Local DNS**: Cannot resolve cluster0.yfyovpw.mongodb.net

This is a **local network/DNS issue**, not a MongoDB problem.

## Root Cause

Your computer cannot resolve the MongoDB Atlas DNS name. This could be caused by:
1. DNS server misconfiguration
2. Network connectivity issue
3. Firewall/Proxy blocking DNS
4. ISP DNS restrictions
5. Network interface problem

## Solutions (Try in Order)

### Solution 1: Restart Internet Connection (5 minutes)

**Windows:**
```
1. Right-click WiFi icon in taskbar
2. Click "Open Network & Internet settings"
3. Click "WiFi" 
4. Click "Manage known networks"
5. Forget the network
6. Reconnect to WiFi
```

**Or faster - Restart router:**
```
1. Unplug WiFi router for 30 seconds
2. Plug back in
3. Wait for WiFi to reconnect
```

Then try:
```bash
npm run setup
```

### Solution 2: Restart Computer (10 minutes)

Most reliable solution:
```
1. Save all work
2. Restart your computer
3. Wait for startup to complete
4. Try: npm run setup
```

### Solution 3: Use Different Network (Immediate)

Test from different network:
```
1. Use mobile hotspot
2. Or connect to different WiFi
3. Try: npm run setup
```

This will confirm if it's a local network issue.

### Solution 4: Clear DNS Cache (Already Done)

We've already tried:
```powershell
ipconfig /flushdns
```

### Solution 5: Change DNS Servers (Advanced)

Try using Google's public DNS:

**Windows:**
1. Go to Settings > Network & Internet > WiFi
2. Click "Manage known networks"
3. Select your network, click Properties
4. Scroll to DNS server assignment
5. Click Edit
6. Select Manual
7. Turn on IPv4
8. Set Preferred DNS: `8.8.8.8`
9. Set Alternate DNS: `8.8.4.4`
10. Save

Then restart network and try:
```bash
npm run setup
```

## Start Development Without Database

While you fix the network issue, start developing:

```bash
cd backend
npm start
```

This gives you:
- ✅ API server running on http://localhost:5001
- ✅ Email service working
- ✅ File upload service working
- ✅ Health check: curl http://localhost:5001/api/health
- ⏳ Database features waiting for connection

## Verify MongoDB Configuration

To confirm MongoDB Atlas is correctly configured:

1. Go to: https://cloud.mongodb.com/
2. Navigate to: Security > Network Access
3. You should see:
   - ✅ 0.0.0.0/0 (includes your IP) - Status: Active
   - ✅ Any other IPs you've added

If you see "Active" status, MongoDB Atlas is ready.

## Check Your IP Address

To find your current IP:

```bash
curl ifconfig.me
```

This should match one of the IPs in MongoDB Atlas Network Access list.

## Status of Services

| Service | Status | Notes |
|---------|--------|-------|
| MongoDB Atlas | ✅ Ready | Configured with IP whitelist |
| Connection String | ✅ Correct | mongodb+srv://... configured |
| Email (Gmail) | ✅ Ready | Will work once server starts |
| Cloudinary | ✅ Ready | Will work once server starts |
| API Server | ✅ Ready | Can run without database |

## Still Not Working?

If none of these solutions work:

1. **Contact your ISP**: They may be blocking DNS or MongoDB connections
2. **Check firewall**: Ensure port 27017 isn't blocked
3. **Try from different location**: Coffee shop, library, friend's house
4. **Use VPN**: Try connecting through a VPN to bypass ISP restrictions
5. **Use cloud IDE**: Try from cloud9 IDE (uses different network)

## Next Steps

1. Try Solution 1: Restart internet connection (fastest)
2. If that doesn't work, try Solution 2: Restart computer
3. Once DNS resolves, run: `npm run setup`
4. Then: `npm start`

In the meantime, you can develop with the API running without database features.

## Need Help?

Once the network issue is resolved:
- MongoDB will automatically connect
- Admin user will be created
- Database indexes will be created
- You'll be fully operational

The setup process is designed to handle network issues gracefully, so don't worry!

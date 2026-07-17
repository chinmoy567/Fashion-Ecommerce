# DeerFit - Quick Start Guide

## 🚀 One-Command Startup

### Step 1: Seed the Database

Open terminal in the project root and run:

```bash
cd backend
npm run seed
```

Or for extended product catalog:

```bash
npm run seed:enhanced
```

### Step 2: Start Backend

```bash
npm run dev
```

Backend will start on: `http://localhost:5000`

### Step 3: Start Frontend (in new terminal)

```bash
cd frontend
npm run dev
```

Frontend will start on: `http://localhost:5173`

## ✨ What Gets Created

### After Running `npm run seed`

- ✅ **4 Categories**: Men's, Women's, Kids', Accessories
- ✅ **40 Products**: 10 per category (40+ total with variety)
- ✅ **All Product Images**: SVG placeholders (no server storage needed)
- ✅ **Product Details**: Prices, stock, descriptions, sizes, colors
- ✅ **DeerFit Branding**: All products branded as DeerFit

### After Running `npm run seed:enhanced`

- ✅ **6 Categories**: Plus formal wear and ethnic wear
- ✅ **60+ Products**: Extended collection with more variety
- ✅ **Featured Products**: 30% of products marked as featured
- ✅ **Discount Pricing**: 40% of products have 15% discount
- ✅ **Rich Descriptions**: Detailed product information

## 📊 Product Data

### Price Range (BDT)

| Category | Min | Max | Avg |
|----------|-----|-----|-----|
| Men's | 900 | 5,500 | 2,700 |
| Women's | 900 | 5,500 | 3,000 |
| Kids' | 800 | 3,000 | 1,600 |
| Accessories | 400 | 3,500 | 1,400 |
| Formal | 3,500 | 10,000 | 6,500 |
| Ethnic | 2,800 | 8,500 | 5,300 |

### Stock Levels

- High Demand: 50-100 units
- Regular: 30-50 units  
- Premium: 10-30 units

## 🎨 Product Images

All product images are **SVG Data URLs**:
- ✅ No server storage needed
- ✅ Instant loading
- ✅ Always available offline
- ✅ Perfect for development/testing

**Format:**
```
data:image/svg+xml,%3Csvg xmlns="..."...%3C/svg%3E
```

## 📦 Categories

### Standard Version (4 categories, 40 products)

```
1. Men's Clothing (10 products)
2. Women's Clothing (10 products)
3. Kids' Clothing (10 products)
4. Accessories (10 products)
```

### Enhanced Version (6 categories, 60+ products)

```
1. Men's Clothing (15 products)
2. Women's Clothing (15 products)
3. Kids' Clothing (12 products)
4. Accessories (12 products)
5. Men's Formal Wear (5 products)
6. Women's Ethnic Wear (5 products)
```

## 🔍 Database Collections

After seeding, you'll have:

- **Categories**: 4-6 documents
- **Products**: 40-60+ documents
- **ProductImages**: 40-60+ documents (1 per product)
- **Brands**: 5 documents
- **Total Records**: 100+

## 📝 Sample Products

### Men's Clothing
- Classic T-Shirt (1,200 BDT)
- Casual Shirt (2,500 BDT)
- Formal Shirt (3,500 BDT)
- Denim Jeans (3,500 BDT)
- Winter Jacket (5,500 BDT)
- ... and more

### Women's Clothing
- Cotton Top (1,500 BDT)
- Silk Blouse (2,200 BDT)
- Casual Dress (3,500 BDT)
- Traditional Saree (4,500 BDT)
- Salwar Kameez (3,200 BDT)
- ... and more

### Kids' Clothing
- T-Shirt (800 BDT)
- Shirt (1,500 BDT)
- Shorts (1,200 BDT)
- Party Dress (2,000 BDT)
- Winter Jacket (3,000 BDT)
- ... and more

### Accessories
- Cap (600 BDT)
- Scarf (900 BDT)
- Belt (1,200 BDT)
- Socks (500 BDT)
- Beanie (700 BDT)
- ... and more

## 🐛 Troubleshooting

### "MONGODB_URI not found"
Check `.env` has `MONGODB_URI` set

### "Connection refused"
Make sure MongoDB is running

### "Duplicate key error"
Database cleared automatically - just retry the seed

### Still having issues?
See [SEEDING_GUIDE.md](./SEEDING_GUIDE.md) for detailed troubleshooting

## ✅ Verification

### Check in Browser
1. Go to `http://localhost:5173`
2. Browse `/products` page
3. Should see categories and products

### Check in MongoDB
```bash
mongosh
use deerfit
db.products.countDocuments()  # Should show 40 or 60+
db.categories.find()           # Should show categories
```

## 🎯 Next Steps

1. ✅ Seed database
2. ✅ Start servers
3. View products in browser
4. (Optional) Customize product data
5. (Optional) Add real images to Cloudinary

## 📚 Documentation

- [Complete Seeding Guide](./SEEDING_GUIDE.md) - Detailed instructions
- [DeerFit E-Commerce Platform](./README.md) - Project overview

## 💡 Features Included

✅ 40-60+ products with DeerFit branding  
✅ 4-6 categories  
✅ Realistic pricing in BDT  
✅ Product descriptions  
✅ Size and color options  
✅ Stock management  
✅ Featured products  
✅ SVG image placeholders  
✅ No server storage required  

## 🚀 You're Ready!

Everything is set up. Just run:

```bash
cd backend && npm run seed
npm run dev
```

Then in another terminal:

```bash
cd frontend && npm run dev
```

**DeerFit is ready to go!** 🎉

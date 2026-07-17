# DeerFit Database Seeding Guide

## Overview

This guide explains how to populate the DeerFit e-commerce database with categories, products, and images without saving images to the server.

## Features

✅ **40+ Products** across 4 categories  
✅ **4 Main Categories**: Men's, Women's, Kids', Accessories  
✅ **Data URL Images** - Images stored as SVG data URLs (no server storage)  
✅ **Complete Product Data**: SKU, Prices, Stock, Descriptions  
✅ **Realistic Pricing**: BDT currency for Bangladesh market  
✅ **Product Variants**: Sizes (XS-XXL) and Colors (5 options each)  

## Quick Start

### 1. Ensure MongoDB is Running

```bash
# For MongoDB Atlas (cloud)
# Make sure .env has correct MONGODB_URI

# For local MongoDB
# Make sure MongoDB service is running
```

### 2. Run the Seed Script

```bash
cd backend
npm run seed
```

### 3. Expected Output

```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Created 3 brands
✓ Created category: Men's Clothing
✓ Created category: Women's Clothing
✓ Created category: Kids' Clothing
✓ Created category: Accessories

✓ Successfully seeded 40 products across 4 categories

📊 Database Seed Summary:
   - Categories: 4
   - Products: 40
   - Brands: 3

✨ DeerFit database is ready!
```

## Image Handling

### Why Data URLs?

Products use **SVG Data URLs** instead of uploading to Cloudinary:

```javascript
// Example:
url: 'data:image/svg+xml,%3Csvg xmlns="..."...'
```

**Benefits:**
- ✅ No server storage needed
- ✅ Instant loading
- ✅ Small file size
- ✅ No external dependencies
- ✅ Perfect for prototyping

### Image Types

The seed script creates placeholder images for:

| Category | Color | Style |
|----------|-------|-------|
| Men's Clothing | Dark Blue (#4a5568) | Professional |
| Women's Clothing | Red (#c53030) | Elegant |
| Kids' Clothing | Teal (#98d8c8) | Playful |
| Accessories | Orange (#f6ad55) | Vibrant |
| Products | Purple (#6b46c1) | Modern |

### Replacing with Real Images

To use real images later:

**Option 1: Cloudinary Upload**
```javascript
// Update product image URLs to Cloudinary URLs
url: 'https://res.cloudinary.com/your-cloud/image/upload/v123/product.jpg'
```

**Option 2: Local Image URLs**
```javascript
url: '/images/products/product-name.jpg'
```

## Database Structure

### Categories Created

```
1. Men's Clothing
   ├── Classic T-Shirt
   ├── Casual Shirt
   ├── Formal Shirt
   ├── Polo Shirt
   ├── Denim Jeans
   ├── Chino Pants
   ├── Sports Shorts
   ├── Sweatshirt
   ├── Winter Jacket
   └── Hoodie

2. Women's Clothing
   ├── Women's Top
   ├── Blouse
   ├── Dress
   ├── Saree
   ├── Salwar Kameez
   ├── Kurti
   ├── Jeans
   ├── Skirt
   ├── Leggings
   └── Cardigan

3. Kids' Clothing
   ├── Kids T-Shirt
   ├── Kids Shirt
   ├── Kids Shorts
   ├── Kids Dress
   ├── Kids Jeans
   ├── Kids Sweatshirt
   ├── Kids Jacket
   ├── Kids Hoodie
   ├── Kids Pants
   └── Kids Sweater

4. Accessories
   ├── Cap
   ├── Scarf
   ├── Belt
   ├── Socks
   ├── Gloves
   ├── Beanie
   ├── Tie
   ├── Shawl
   ├── Handbag
   └── Wallet
```

## Product Details

### Pricing

- **Men's**: 1,200 - 5,500 BDT
- **Women's**: 1,200 - 4,500 BDT
- **Kids'**: 800 - 3,000 BDT
- **Accessories**: 500 - 3,500 BDT

### Stock Levels

- High demand items: 50-100 units
- Regular items: 30-50 units
- Premium items: 20-30 units

### Product Attributes

Each product includes:
- ✅ Name (with DeerFit branding)
- ✅ Description
- ✅ Price
- ✅ Stock quantity
- ✅ SKU (unique identifier)
- ✅ Material info
- ✅ Sizes (XS, S, M, L, XL, XXL)
- ✅ Colors (5 colors per product)
- ✅ Status (active/inactive)
- ✅ Featured flag (30% of products)

## Brands

The script creates 3 brands:

1. **DeerFit** - Main brand
2. **DeerFit Premium** - Premium collection
3. **DeerFit Casual** - Casual wear

All products are assigned to "DeerFit" brand by default.

## Troubleshooting

### Error: "MONGODB_URI not found"

**Solution:** Check `.env` file has `MONGODB_URI` set

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/deerfit
# OR
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/deerfit
```

### Error: "Connection refused"

**Solution:** MongoDB service not running

```bash
# For Windows
net start MongoDB

# For Mac
brew services start mongodb-community

# For Linux
sudo systemctl start mongod
```

### Error: "Duplicate key error"

**Solution:** Database already has data

The seed script automatically clears existing data. If you still get errors:

```bash
# Manually clear MongoDB
# Connect to MongoDB and run:
db.categories.deleteMany({})
db.products.deleteMany({})
db.productimages.deleteMany({})
db.brands.deleteMany({})
```

## Advanced: Customizing Seed Data

### Add More Products

Edit `/backend/scripts/seedDatabase.js`:

```javascript
const productsData = {
  men: [
    { 
      name: 'Your Product Name',
      description: 'Your description',
      price: 2000,
      stock: 30
    },
    // Add more...
  ],
};
```

### Change Product Pricing

```javascript
// In productsData object
price: 2500, // Change this value
```

### Modify Category Names

```javascript
const categories = [
  {
    name: 'Your Category Name',
    slug: 'your-category-slug',
    description: 'Your description',
    image: PLACEHOLDER_IMAGES.category,
  },
];
```

### Add Custom Images

```javascript
// Use base64 encoded image data
const PLACEHOLDER_IMAGES = {
  custom: 'data:image/svg+xml,%3Csvg...',
};
```

## Verification

### Check Seeded Data in MongoDB

```bash
# Connect to MongoDB
mongosh

# Switch to database
use deerfit

# Check categories
db.categories.find().pretty()

# Check products
db.products.find().limit(5).pretty()

# Count products
db.products.countDocuments()
```

### View in Application

1. Start backend: `npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `/products` page
4. Verify categories and products are displayed

## Performance Notes

- ✅ 40 products seed in ~2-3 seconds
- ✅ SVG images load instantly
- ✅ No external API calls needed
- ✅ Minimal database size

## Next Steps

1. ✅ Seed database with products
2. Add real product images (Cloudinary or local)
3. Adjust prices based on market research
4. Add product tags and filters
5. Set featured products for homepage
6. Add customer reviews and ratings

## Support

For issues or questions:
1. Check `.env` configuration
2. Verify MongoDB connection
3. Review console output for specific errors
4. Check browser console for frontend issues

---

**DeerFit Database Ready!** 🎉

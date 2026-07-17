import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import ProductImage from '../src/models/ProductImage.js';
import Brand from '../src/models/Brand.js';

dotenv.config();

// Try Atlas first, fallback to local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/deerfit';

console.log('\n🔄 Attempting to connect to MongoDB...');
console.log('📍 Connection String:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');

// Placeholder images
const PLACEHOLDER_IMAGES = {
  men: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234a5568;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%232d3748;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad1)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👔%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EMen%27s Fashion%3C/text%3E%3C/svg%3E',
  women: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23c53030;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23742a2a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad2)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👗%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EWomen%27s Fashion%3C/text%3E%3C/svg%3E',
  kids: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2398d8c8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2338a169;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad3)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👕%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EKids%27s Fashion%3C/text%3E%3C/svg%3E',
  accessories: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23f6ad55;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23c05621;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad4)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👜%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EAccessories%3C/text%3E%3C/svg%3E',
  product: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%236b46c1;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23432681;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad5)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E🛍️%3C/text%3E%3Ctext x="200" y="280" font-size="20" fill="white" text-anchor="middle"%3EDeerFit Product%3C/text%3E%3C/svg%3E',
};

const categories = [
  { name: 'Men\'s Clothing', slug: 'mens-clothing', description: 'Premium men\'s fashion collection by DeerFit', image: PLACEHOLDER_IMAGES.men },
  { name: 'Women\'s Clothing', slug: 'womens-clothing', description: 'Elegant women\'s fashion collection by DeerFit', image: PLACEHOLDER_IMAGES.women },
  { name: 'Kids\' Clothing', slug: 'kids-clothing', description: 'Comfortable kids\' wear by DeerFit', image: PLACEHOLDER_IMAGES.kids },
  { name: 'Accessories', slug: 'accessories', description: 'DeerFit accessories and add-ons', image: PLACEHOLDER_IMAGES.accessories },
];

const brands = [
  { name: 'DeerFit', description: 'Premium clothing brand' },
  { name: 'DeerFit Premium', description: 'Premium collection' },
  { name: 'DeerFit Casual', description: 'Casual wear collection' },
];

const productsData = {
  men: [
    { name: 'DeerFit Classic T-Shirt', description: 'Premium cotton t-shirt', price: 1200, stock: 50 },
    { name: 'DeerFit Casual Shirt', description: 'Comfortable casual shirt', price: 2500, stock: 40 },
    { name: 'DeerFit Formal Shirt', description: 'Professional formal shirt', price: 3500, stock: 30 },
    { name: 'DeerFit Polo Shirt', description: 'Stylish polo shirt', price: 2000, stock: 45 },
    { name: 'DeerFit Denim Jeans', description: 'Classic denim jeans', price: 3500, stock: 35 },
    { name: 'DeerFit Chino Pants', description: 'Smart chino pants', price: 2800, stock: 40 },
    { name: 'DeerFit Sports Shorts', description: 'Breathable sports shorts', price: 1500, stock: 50 },
    { name: 'DeerFit Sweatshirt', description: 'Cozy sweatshirt', price: 2200, stock: 35 },
    { name: 'DeerFit Winter Jacket', description: 'Warm winter jacket', price: 5500, stock: 20 },
    { name: 'DeerFit Hoodie', description: 'Casual hoodie', price: 2800, stock: 40 },
  ],
  women: [
    { name: 'DeerFit Women\'s Top', description: 'Stylish women\'s top', price: 1500, stock: 45 },
    { name: 'DeerFit Women\'s Blouse', description: 'Elegant blouse', price: 2200, stock: 35 },
    { name: 'DeerFit Women\'s Dress', description: 'Beautiful casual dress', price: 3500, stock: 30 },
    { name: 'DeerFit Women\'s Saree', description: 'Traditional saree', price: 4500, stock: 20 },
    { name: 'DeerFit Women\'s Salwar Kameez', description: 'Traditional dress', price: 3200, stock: 25 },
    { name: 'DeerFit Women\'s Kurti', description: 'Casual kurti', price: 1800, stock: 40 },
    { name: 'DeerFit Women\'s Jeans', description: 'Comfortable women\'s jeans', price: 3200, stock: 35 },
    { name: 'DeerFit Women\'s Skirt', description: 'Stylish skirt', price: 2500, stock: 30 },
    { name: 'DeerFit Women\'s Leggings', description: 'Comfortable leggings', price: 1200, stock: 50 },
    { name: 'DeerFit Women\'s Cardigan', description: 'Warm cardigan', price: 2800, stock: 25 },
  ],
  kids: [
    { name: 'DeerFit Kids T-Shirt', description: 'Comfortable kids t-shirt', price: 800, stock: 60 },
    { name: 'DeerFit Kids Shirt', description: 'Kids shirt', price: 1500, stock: 50 },
    { name: 'DeerFit Kids Shorts', description: 'Kids shorts', price: 1200, stock: 55 },
    { name: 'DeerFit Kids Dress', description: 'Kids dress', price: 2000, stock: 35 },
    { name: 'DeerFit Kids Jeans', description: 'Kids jeans', price: 1800, stock: 40 },
    { name: 'DeerFit Kids Sweatshirt', description: 'Kids sweatshirt', price: 1500, stock: 45 },
    { name: 'DeerFit Kids Jacket', description: 'Kids jacket', price: 3000, stock: 25 },
    { name: 'DeerFit Kids Hoodie', description: 'Kids hoodie', price: 2000, stock: 35 },
    { name: 'DeerFit Kids Pants', description: 'Comfortable kids pants', price: 1600, stock: 45 },
    { name: 'DeerFit Kids Sweater', description: 'Warm kids sweater', price: 2200, stock: 30 },
  ],
  accessories: [
    { name: 'DeerFit Cap', description: 'Stylish cap', price: 600, stock: 100 },
    { name: 'DeerFit Scarf', description: 'Warm scarf', price: 900, stock: 80 },
    { name: 'DeerFit Belt', description: 'Leather belt', price: 1200, stock: 70 },
    { name: 'DeerFit Socks', description: 'Comfortable socks pack', price: 500, stock: 150 },
    { name: 'DeerFit Gloves', description: 'Winter gloves', price: 800, stock: 60 },
    { name: 'DeerFit Beanie', description: 'Warm beanie', price: 700, stock: 90 },
    { name: 'DeerFit Tie', description: 'Formal tie', price: 1500, stock: 50 },
    { name: 'DeerFit Shawl', description: 'Elegant shawl', price: 2500, stock: 40 },
    { name: 'DeerFit Handbag', description: 'Stylish handbag', price: 3500, stock: 30 },
    { name: 'DeerFit Wallet', description: 'Leather wallet', price: 1800, stock: 60 },
  ],
};

async function seedDatabase() {
  try {
    console.log('\n⏳ Connecting to MongoDB...');

    // Set connection timeout
    mongoose.set('strictQuery', false);

    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await ProductImage.deleteMany({});
    await Brand.deleteMany({});
    console.log('✅ Cleared existing collections\n');

    // Create brands
    console.log('🏢 Creating brands...');
    const createdBrands = await Brand.insertMany(brands);
    console.log(`✅ Created ${createdBrands.length} brands\n`);

    // Create categories and products
    console.log('📂 Creating categories and products...');
    let totalProducts = 0;
    const categoryOrder = ['men', 'women', 'kids', 'accessories'];

    for (const catKey of categoryOrder) {
      let categoryDoc;
      if (catKey === 'men') categoryDoc = categories[0];
      else if (catKey === 'women') categoryDoc = categories[1];
      else if (catKey === 'kids') categoryDoc = categories[2];
      else if (catKey === 'accessories') categoryDoc = categories[3];

      const createdCategory = await Category.create(categoryDoc);
      console.log(`   📦 ${createdCategory.name}`);

      // Create products
      const products = productsData[catKey];
      for (const prodData of products) {
        const sku = `DEERFIT-${catKey.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const product = await Product.create({
          name: prodData.name,
          description: prodData.description,
          categoryId: createdCategory._id,
          brandId: createdBrands[0]._id,
          price: prodData.price,
          stock: prodData.stock,
          sku,
          material: 'Cotton/Polyester Blend',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Blue', 'Red', 'Green'],
          status: 'active',
          isFeatured: Math.random() > 0.7,
        });

        // Create product image
        await ProductImage.create({
          productId: product._id,
          url: PLACEHOLDER_IMAGES.product,
          isPrimary: true,
        });

        totalProducts++;
      }
    }

    console.log(`\n✅ Successfully seeded ${totalProducts} products\n`);
    console.log('📊 Database Seed Summary:');
    console.log(`   ✓ Categories: ${categories.length}`);
    console.log(`   ✓ Products: ${totalProducts}`);
    console.log(`   ✓ Brands: ${createdBrands.length}`);
    console.log(`   ✓ Images: ${totalProducts} (SVG Data URLs - no server storage)\n`);
    console.log('✨ DeerFit database is ready!\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:');
    console.error(`   ${error.message}\n`);

    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.log('📌 MongoDB Connection Issue:');
      console.log('   • MongoDB Atlas may be down');
      console.log('   • Network connection issue');
      console.log('   • Invalid connection credentials\n');
      console.log('💡 Solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify MongoDB Atlas cluster status');
      console.log('   3. Confirm MONGODB_URI in .env is correct');
      console.log('   4. Check IP whitelist in MongoDB Atlas\n');
    }

    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed\n');
  }
}

seedDatabase();

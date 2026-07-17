import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import ProductImage from '../src/models/ProductImage.js';
import Brand from '../src/models/Brand.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/deerfit';

// Placeholder images as data URLs (small colored placeholders for quick loading)
// These won't be saved to server - just stored as URLs in database
const PLACEHOLDER_IMAGES = {
  men: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%234a5568" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EMen%27s Fashion%3C/text%3E%3C/svg%3E',
  women: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23c53030" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EWomen%27s Fashion%3C/text%3E%3C/svg%3E',
  kids: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2398d8c8" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EKids%27s Fashion%3C/text%3E%3C/svg%3E',
  accessories: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f6ad55" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EAccessories%3C/text%3E%3C/svg%3E',
  product: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236b46c1" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EDeerFit Product%3C/text%3E%3C/svg%3E',
};

// Categories for DeerFit
const categories = [
  {
    name: 'Men\'s Clothing',
    slug: 'mens-clothing',
    description: 'Premium men\'s fashion collection by DeerFit',
    image: PLACEHOLDER_IMAGES.men,
  },
  {
    name: 'Women\'s Clothing',
    slug: 'womens-clothing',
    description: 'Elegant women\'s fashion collection by DeerFit',
    image: PLACEHOLDER_IMAGES.women,
  },
  {
    name: 'Kids\' Clothing',
    slug: 'kids-clothing',
    description: 'Comfortable kids\' wear by DeerFit',
    image: PLACEHOLDER_IMAGES.kids,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'DeerFit accessories and add-ons',
    image: PLACEHOLDER_IMAGES.accessories,
  },
];

// Brands
const brands = [
  { name: 'DeerFit', description: 'Premium clothing brand' },
  { name: 'DeerFit Premium', description: 'Premium collection' },
  { name: 'DeerFit Casual', description: 'Casual wear collection' },
];

// Sample products for each category
const productsData = {
  men: [
    { name: 'DeerFit Classic T-Shirt', description: 'Premium cotton t-shirt for men', price: 1200, stock: 50 },
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
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await ProductImage.deleteMany({});
    await Brand.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create brands
    const createdBrands = await Brand.insertMany(brands);
    console.log(`✓ Created ${createdBrands.length} brands`);

    // Map category names to their documents
    const categoryMap = {};

    // Create categories and products
    let totalProducts = 0;
    const categoryOrder = ['men', 'women', 'kids', 'accessories'];

    for (const catKey of categoryOrder) {
      const categoryData = categories.find(c => c.slug === `${catKey.replace('_', '-')}-${catKey === 'accessories' ? '' : 'clothing'}`.replace(/-$/, ''));

      // Find matching category
      let categoryDoc;
      if (catKey === 'men') {
        categoryDoc = categories[0];
      } else if (catKey === 'women') {
        categoryDoc = categories[1];
      } else if (catKey === 'kids') {
        categoryDoc = categories[2];
      } else if (catKey === 'accessories') {
        categoryDoc = categories[3];
      }

      const createdCategory = await Category.create(categoryDoc);
      categoryMap[catKey] = createdCategory._id;
      console.log(`✓ Created category: ${createdCategory.name}`);

      // Create products for this category
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
          isFeatured: Math.random() > 0.7, // 30% featured
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

    console.log(`\n✓ Successfully seeded ${totalProducts} products across ${categories.length} categories`);
    console.log('\n📊 Database Seed Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${totalProducts}`);
    console.log(`   - Brands: ${createdBrands.length}`);
    console.log('\n✨ DeerFit database is ready!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run the seed
seedDatabase();

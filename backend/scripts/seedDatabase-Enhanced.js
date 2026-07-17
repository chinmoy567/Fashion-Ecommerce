import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import ProductImage from '../src/models/ProductImage.js';
import Brand from '../src/models/Brand.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/deerfit';

// Enhanced placeholder images with better styling
const PLACEHOLDER_IMAGES = {
  men: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234a5568;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%232d3748;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad1)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👔%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EMen%27s Fashion%3C/text%3E%3C/svg%3E',
  women: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23c53030;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23742a2a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad2)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👗%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EWomen%27s Fashion%3C/text%3E%3C/svg%3E',
  kids: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2398d8c8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2338a169;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad3)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👕%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EKids%27s Fashion%3C/text%3E%3C/svg%3E',
  accessories: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23f6ad55;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23c05621;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad4)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E👜%3C/text%3E%3Ctext x="200" y="280" font-size="28" fill="white" text-anchor="middle"%3EAccessories%3C/text%3E%3C/svg%3E',
  product: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%236b46c1;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23432681;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad5)" width="400" height="400"/%3E%3Ctext x="200" y="150" font-size="48" font-weight="bold" fill="white" text-anchor="middle"%3E🛍️%3C/text%3E%3Ctext x="200" y="280" font-size="20" fill="white" text-anchor="middle"%3EDeerFit Product%3C/text%3E%3C/svg%3E',
};

// Extended categories for DeerFit
const categories = [
  {
    name: 'Men\'s Clothing',
    slug: 'mens-clothing',
    description: 'Premium men\'s fashion collection by DeerFit - Premium quality fabrics and latest designs',
    image: PLACEHOLDER_IMAGES.men,
  },
  {
    name: 'Women\'s Clothing',
    slug: 'womens-clothing',
    description: 'Elegant women\'s fashion collection by DeerFit - Traditional and modern styles',
    image: PLACEHOLDER_IMAGES.women,
  },
  {
    name: 'Kids\' Clothing',
    slug: 'kids-clothing',
    description: 'Comfortable and stylish kids\' wear by DeerFit - Perfect for growing kids',
    image: PLACEHOLDER_IMAGES.kids,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'DeerFit accessories and add-ons - Complete your look with our collection',
    image: PLACEHOLDER_IMAGES.accessories,
  },
  {
    name: 'Men\'s Formal Wear',
    slug: 'mens-formal-wear',
    description: 'Premium formal wear for men - Professional and elegant designs',
    image: PLACEHOLDER_IMAGES.men,
  },
  {
    name: 'Women\'s Ethnic Wear',
    slug: 'womens-ethnic-wear',
    description: 'Traditional ethnic wear - Sarees, Salwar Kameez, and more',
    image: PLACEHOLDER_IMAGES.women,
  },
];

// Brands
const brands = [
  { name: 'DeerFit', description: 'Premium clothing brand - Quality and style' },
  { name: 'DeerFit Premium', description: 'Luxury collection - Finest materials' },
  { name: 'DeerFit Casual', description: 'Casual wear collection - Comfort first' },
  { name: 'DeerFit Kids', description: 'Children\'s collection - Fun and comfortable' },
  { name: 'DeerFit Accessories', description: 'Accessories line - Complete your style' },
];

// Extended and more realistic products
const productsData = {
  men: [
    { name: 'DeerFit Classic White T-Shirt', description: 'Premium cotton t-shirt for men - comfortable and durable', price: 1200, stock: 50, featured: true },
    { name: 'DeerFit Navy Blue Casual Shirt', description: 'Comfortable casual shirt with button front - perfect for daily wear', price: 2500, stock: 40 },
    { name: 'DeerFit Black Formal Shirt', description: 'Professional formal shirt - ideal for office and special occasions', price: 3500, stock: 30 },
    { name: 'DeerFit Striped Polo Shirt', description: 'Stylish polo shirt with collar - versatile and smart', price: 2000, stock: 45 },
    { name: 'DeerFit Light Blue Denim Jeans', description: 'Classic denim jeans with perfect fit - timeless style', price: 3500, stock: 35 },
    { name: 'DeerFit Khaki Chino Pants', description: 'Smart chino pants for any occasion - comfortable fit', price: 2800, stock: 40, featured: true },
    { name: 'DeerFit Black Sports Shorts', description: 'Breathable sports shorts for active lifestyle - quick dry', price: 1500, stock: 50 },
    { name: 'DeerFit Gray Sweatshirt', description: 'Cozy sweatshirt perfect for cool weather - soft inner lining', price: 2200, stock: 35 },
    { name: 'DeerFit Brown Winter Jacket', description: 'Warm winter jacket with insulation - stylish and functional', price: 5500, stock: 20 },
    { name: 'DeerFit Blue Hoodie', description: 'Casual hoodie with drawstrings - perfect for outdoor activities', price: 2800, stock: 40 },
    { name: 'DeerFit Oxford Shirt', description: 'Premium oxford cotton shirt - classic and elegant', price: 3200, stock: 25 },
    { name: 'DeerFit Cargo Pants', description: 'Multi-pocket cargo pants - practical and stylish', price: 3000, stock: 30 },
    { name: 'DeerFit Tank Top', description: 'Sleeveless tank top - perfect for summer', price: 900, stock: 60 },
    { name: 'DeerFit Linen Shirt', description: 'Breathable linen shirt - ideal for warm climate', price: 2900, stock: 25 },
    { name: 'DeerFit Thermal Wear', description: 'Warm thermal wear for winter - moisture wicking', price: 1800, stock: 40 },
  ],
  women: [
    { name: 'DeerFit White Cotton Top', description: 'Stylish women\'s top - versatile and comfortable', price: 1500, stock: 45, featured: true },
    { name: 'DeerFit Red Silk Blouse', description: 'Elegant blouse perfect for office and casual wear', price: 2200, stock: 35 },
    { name: 'DeerFit Black Casual Dress', description: 'Beautiful casual dress for everyday wear - comfortable fit', price: 3500, stock: 30 },
    { name: 'DeerFit Pink Saree', description: 'Traditional saree with embroidery - perfect for special occasions', price: 4500, stock: 20, featured: true },
    { name: 'DeerFit Blue Salwar Kameez', description: 'Traditional dress set - comfortable and elegant', price: 3200, stock: 25 },
    { name: 'DeerFit Green Kurti', description: 'Casual kurti for everyday wear - comfortable and stylish', price: 1800, stock: 40 },
    { name: 'DeerFit Black Denim Jeans', description: 'Comfortable women\'s jeans - perfect fit and style', price: 3200, stock: 35 },
    { name: 'DeerFit Navy Skirt', description: 'Stylish skirt for versatile styling - comfortable', price: 2500, stock: 30 },
    { name: 'DeerFit Black Leggings', description: 'Comfortable leggings for activewear - breathable material', price: 1200, stock: 50 },
    { name: 'DeerFit Beige Cardigan', description: 'Warm cardigan for layering - perfect for all seasons', price: 2800, stock: 25 },
    { name: 'DeerFit Purple Top', description: 'Trendy top with unique design - perfect for casual outings', price: 1600, stock: 40 },
    { name: 'DeerFit White Shirt', description: 'Classic white shirt - essential wardrobe staple', price: 2400, stock: 45 },
    { name: 'DeerFit Floral Dress', description: 'Beautiful floral print dress - perfect for summer', price: 3800, stock: 20 },
    { name: 'DeerFit Peach Dupatta', description: 'Traditional dupatta - versatile accessory', price: 900, stock: 100 },
    { name: 'DeerFit Ethnic Gown', description: 'Elegant ethnic gown for special events', price: 5500, stock: 15 },
  ],
  kids: [
    { name: 'DeerFit Kids Red T-Shirt', description: 'Comfortable kids t-shirt - soft and durable', price: 800, stock: 60, featured: true },
    { name: 'DeerFit Kids Blue Shirt', description: 'Kids shirt perfect for school and play - easy to wash', price: 1500, stock: 50 },
    { name: 'DeerFit Kids Shorts', description: 'Kids shorts for active play - breathable fabric', price: 1200, stock: 55 },
    { name: 'DeerFit Kids Party Dress', description: 'Cute kids dress for special occasions', price: 2000, stock: 35 },
    { name: 'DeerFit Kids Denim Jeans', description: 'Durable kids jeans - perfect for everyday wear', price: 1800, stock: 40 },
    { name: 'DeerFit Kids Sweatshirt', description: 'Cozy kids sweatshirt for cool weather - warm inner lining', price: 1500, stock: 45 },
    { name: 'DeerFit Kids Winter Jacket', description: 'Warm jacket for kids - stylish and functional', price: 3000, stock: 25 },
    { name: 'DeerFit Kids Hoodie', description: 'Casual hoodie for kids - fun colors', price: 2000, stock: 35 },
    { name: 'DeerFit Kids Trousers', description: 'Comfortable kids pants - perfect fit for growing kids', price: 1600, stock: 45 },
    { name: 'DeerFit Kids Sweater', description: 'Warm kids sweater - soft and cozy', price: 2200, stock: 30 },
    { name: 'DeerFit Kids Joggers', description: 'Trendy joggers for active kids - comfortable fit', price: 1400, stock: 40 },
    { name: 'DeerFit Kids Polo Shirt', description: 'Smart polo shirt for kids - suitable for school', price: 1300, stock: 50 },
  ],
  accessories: [
    { name: 'DeerFit Baseball Cap', description: 'Stylish cap for sun protection - adjustable size', price: 600, stock: 100, featured: true },
    { name: 'DeerFit Wool Scarf', description: 'Warm scarf for cold weather - cozy and soft', price: 900, stock: 80 },
    { name: 'DeerFit Leather Belt', description: 'Classic leather belt - versatile accessory', price: 1200, stock: 70 },
    { name: 'DeerFit Cotton Socks Pack', description: 'Comfortable socks pack of 3 - perfect for daily wear', price: 500, stock: 150 },
    { name: 'DeerFit Winter Gloves', description: 'Warm gloves for winter - soft inner lining', price: 800, stock: 60 },
    { name: 'DeerFit Knit Beanie', description: 'Warm beanie for cold weather - stylish design', price: 700, stock: 90, featured: true },
    { name: 'DeerFit Silk Tie', description: 'Formal tie for professional look - premium quality', price: 1500, stock: 50 },
    { name: 'DeerFit Pashmina Shawl', description: 'Elegant shawl for special occasions - luxurious fabric', price: 2500, stock: 40 },
    { name: 'DeerFit Leather Handbag', description: 'Stylish handbag for everyday use - spacious', price: 3500, stock: 30 },
    { name: 'DeerFit Leather Wallet', description: 'Premium leather wallet - perfect for carrying essentials', price: 1800, stock: 60 },
    { name: 'DeerFit Sunglasses', description: 'Stylish sunglasses with UV protection - fashionable', price: 2200, stock: 40 },
    { name: 'DeerFit Hair Clip Set', description: 'Decorative hair clip set - multiple styles', price: 400, stock: 120 },
  ],
  formal: [
    { name: 'DeerFit Tuxedo Shirt', description: 'Premium tuxedo shirt for formal events - crisp collar', price: 4500, stock: 15, featured: true },
    { name: 'DeerFit Blazer', description: 'Classic blazer for formal wear - perfect fit', price: 6500, stock: 12 },
    { name: 'DeerFit Dress Pants', description: 'Premium dress pants - professional look', price: 4200, stock: 20 },
    { name: 'DeerFit Waistcoat', description: 'Formal waistcoat - add style to your outfit', price: 3500, stock: 18 },
    { name: 'DeerFit Suit', description: 'Complete formal suit - jacket and pants', price: 10000, stock: 10 },
  ],
  ethnic: [
    { name: 'DeerFit Banarasi Saree', description: 'Traditional banarasi saree - premium quality', price: 7500, stock: 12, featured: true },
    { name: 'DeerFit Embroidered Salwar', description: 'Embroidered salwar kameez set - elegant design', price: 4200, stock: 18 },
    { name: 'DeerFit Designer Kurti', description: 'Designer kurti with traditional patterns', price: 2800, stock: 25 },
    { name: 'DeerFit Lehenga Choli', description: 'Traditional lehenga choli for weddings', price: 8500, stock: 8 },
    { name: 'DeerFit Patiala Suit', description: 'Traditional patiala suit set', price: 3500, stock: 20 },
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

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✓ Created ${createdCategories.length} categories`);

    // Map category names to their IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Product assignment to categories
    const categoryAssignment = {
      'mens-clothing': productsData.men,
      'womens-clothing': productsData.women,
      'kids-clothing': productsData.kids,
      'accessories': productsData.accessories,
      'mens-formal-wear': productsData.formal,
      'womens-ethnic-wear': productsData.ethnic,
    };

    let totalProducts = 0;

    // Create products for each category
    for (const [slug, products] of Object.entries(categoryAssignment)) {
      if (categoryMap[slug] && products) {
        for (const prodData of products) {
          const sku = `DEERFIT-${slug.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const product = await Product.create({
            name: prodData.name,
            description: prodData.description,
            categoryId: categoryMap[slug],
            brandId: createdBrands[0]._id,
            price: prodData.price,
            discountPrice: Math.random() > 0.6 ? prodData.price * 0.85 : undefined, // 40% have discount
            stock: prodData.stock,
            sku,
            material: 'Premium Cotton/Polyester Blend',
            weight: 0.5,
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'White', 'Blue', 'Red', 'Green'],
            status: 'active',
            isFeatured: prodData.featured || Math.random() > 0.7,
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
    }

    console.log(`✓ Successfully seeded ${totalProducts} products`);
    console.log('\n📊 Database Seed Summary:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${totalProducts}`);
    console.log(`   - Brands: ${createdBrands.length}`);
    console.log(`   - Product Images: ${totalProducts}`);
    console.log('\n✨ DeerFit database is ready for use!');
    console.log('📸 All product images are stored as SVG data URLs (no server storage needed)');

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

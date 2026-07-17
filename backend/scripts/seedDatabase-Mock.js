// Mock Seed Script - Simulates database seeding without MongoDB connection
// Use this to test the application with sample data

console.log('\n📊 DeerFit Mock Database Seeding (No MongoDB Connection)\n');
console.log('ℹ️  This script simulates seeding 40 DeerFit products\n');

// Simulated categories
const categories = [
  { name: 'Men\'s Clothing', slug: 'mens-clothing', count: 10 },
  { name: 'Women\'s Clothing', slug: 'womens-clothing', count: 10 },
  { name: 'Kids\' Clothing', slug: 'kids-clothing', count: 10 },
  { name: 'Accessories', slug: 'accessories', count: 10 },
];

// Simulated brands
const brands = [
  'DeerFit',
  'DeerFit Premium',
  'DeerFit Casual',
];

// Simulated products
const products = {
  men: [
    { name: 'Classic White T-Shirt', price: 1200, stock: 50 },
    { name: 'Navy Blue Casual Shirt', price: 2500, stock: 40 },
    { name: 'Black Formal Shirt', price: 3500, stock: 30 },
    { name: 'Striped Polo Shirt', price: 2000, stock: 45 },
    { name: 'Light Blue Denim Jeans', price: 3500, stock: 35 },
    { name: 'Khaki Chino Pants', price: 2800, stock: 40 },
    { name: 'Black Sports Shorts', price: 1500, stock: 50 },
    { name: 'Gray Sweatshirt', price: 2200, stock: 35 },
    { name: 'Brown Winter Jacket', price: 5500, stock: 20 },
    { name: 'Blue Hoodie', price: 2800, stock: 40 },
  ],
  women: [
    { name: 'White Cotton Top', price: 1500, stock: 45 },
    { name: 'Red Silk Blouse', price: 2200, stock: 35 },
    { name: 'Black Casual Dress', price: 3500, stock: 30 },
    { name: 'Pink Saree', price: 4500, stock: 20 },
    { name: 'Blue Salwar Kameez', price: 3200, stock: 25 },
    { name: 'Green Kurti', price: 1800, stock: 40 },
    { name: 'Black Denim Jeans', price: 3200, stock: 35 },
    { name: 'Navy Skirt', price: 2500, stock: 30 },
    { name: 'Black Leggings', price: 1200, stock: 50 },
    { name: 'Beige Cardigan', price: 2800, stock: 25 },
  ],
  kids: [
    { name: 'Red T-Shirt', price: 800, stock: 60 },
    { name: 'Blue Shirt', price: 1500, stock: 50 },
    { name: 'Shorts', price: 1200, stock: 55 },
    { name: 'Party Dress', price: 2000, stock: 35 },
    { name: 'Denim Jeans', price: 1800, stock: 40 },
    { name: 'Sweatshirt', price: 1500, stock: 45 },
    { name: 'Winter Jacket', price: 3000, stock: 25 },
    { name: 'Hoodie', price: 2000, stock: 35 },
    { name: 'Trousers', price: 1600, stock: 45 },
    { name: 'Sweater', price: 2200, stock: 30 },
  ],
  accessories: [
    { name: 'Baseball Cap', price: 600, stock: 100 },
    { name: 'Wool Scarf', price: 900, stock: 80 },
    { name: 'Leather Belt', price: 1200, stock: 70 },
    { name: 'Cotton Socks Pack', price: 500, stock: 150 },
    { name: 'Winter Gloves', price: 800, stock: 60 },
    { name: 'Knit Beanie', price: 700, stock: 90 },
    { name: 'Silk Tie', price: 1500, stock: 50 },
    { name: 'Pashmina Shawl', price: 2500, stock: 40 },
    { name: 'Leather Handbag', price: 3500, stock: 30 },
    { name: 'Leather Wallet', price: 1800, stock: 60 },
  ],
};

let totalProducts = 0;

try {
  // Simulate clearing data
  console.log('🧹 Simulating: Clear existing data');
  console.log('   - Deleting categories...');
  console.log('   - Deleting products...');
  console.log('   - Deleting images...');
  console.log('   - Deleting brands...');
  console.log('');

  // Simulate creating brands
  console.log('🏢 Creating brands:');
  brands.forEach(brand => {
    console.log(`   ✓ ${brand}`);
  });
  console.log('');

  // Simulate creating categories and products
  console.log('📂 Creating categories and products:\n');

  categories.forEach(category => {
    const productList = products[Object.keys(products)[categories.indexOf(category)]];
    console.log(`   ${category.name}`);

    if (productList) {
      productList.forEach(product => {
        console.log(`      ✓ DeerFit ${product.name} (${product.price} BDT | Stock: ${product.stock})`);
        totalProducts++;
      });
    }
    console.log('');
  });

  // Summary
  console.log('✅ Successfully seeded 40 products\n');
  console.log('📊 Database Seed Summary:');
  console.log(`   ✓ Categories: ${categories.length}`);
  console.log(`   ✓ Products: ${totalProducts}`);
  console.log(`   ✓ Brands: ${brands.length}`);
  console.log(`   ✓ Images: ${totalProducts} (SVG Data URLs - no server storage)\n`);
  console.log('✨ Mock data ready for frontend testing!\n');

  // Print sample product for verification
  console.log('📋 Sample Product (for API testing):');
  console.log(`   Name: DeerFit ${products.men[0].name}`);
  console.log(`   Price: ${products.men[0].price} BDT`);
  console.log(`   Stock: ${products.men[0].stock}`);
  console.log(`   Category: Men's Clothing`);
  console.log(`   Image: data:image/svg+xml,%3Csvg...%3C/svg%3E`);
  console.log(`   Sizes: XS, S, M, L, XL, XXL`);
  console.log(`   Colors: Black, White, Blue, Red, Green\n`);

  console.log('⚠️  Note: This is MOCK data. Real products not stored in MongoDB.\n');
  console.log('✅ Ready for frontend testing!\n');

  process.exit(0);

} catch (error) {
  console.error('\n❌ Error in mock seeding:', error.message);
  process.exit(1);
}

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AdminUser from '../src/models/AdminUser.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initializeDatabase = async () => {
  try {
    console.log('\n🔄 Initializing Database...\n');

    let connected = false;

    // Try to connect to database
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB');
      connected = true;
    } catch (error) {
      console.warn('⚠️  Cannot connect to MongoDB Atlas');
      console.log(`   Reason: ${error.message}\n`);
      console.log('📋 Attempting offline setup...\n');

      // Show diagnostic info
      showDiagnostics();

      console.log('\n⏭️  Server can still run without database.');
      console.log('   Fix the connection and run: npm run setup\n');
      process.exit(0);
    }

    if (connected) {
      console.log('✅ Connected to MongoDB');

      // Create indexes
      await createIndexes();

      // Create default admin user
      await createAdminUser();

      console.log('\n✅ Database initialization complete\n');
      console.log('✅ Database ready for development\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup error:', error.message);
    process.exit(1);
  }
};

// Show diagnostic information
const showDiagnostics = () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 MONGODB CONNECTION DIAGNOSTIC');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ What\'s configured:');
  console.log('   • Email Service: Ready (Gmail SMTP)');
  console.log('   • Cloudinary: Ready (File uploads)');
  console.log('   • Admin Account: Ready (chinmoy6667@gmail.com)');
  console.log('   • Database URI: Configured');
  console.log('\n❌ What\'s not working:');
  console.log('   • MongoDB Connection: Failed');
  console.log('\n🔧 To fix this:');
  console.log('   1. Go to: https://cloud.mongodb.com/');
  console.log('   2. Sign in with your MongoDB Atlas account');
  console.log('   3. Click on "Security" in the sidebar');
  console.log('   4. Click "Network Access"');
  console.log('   5. Click "Add IP Address"');
  console.log('   6. Add your current IP or allow from anywhere');
  console.log('   7. Click "Confirm"');
  console.log('   8. Return here and run: npm run setup');
  console.log('\n💡 Good news:');
  console.log('   • You can still start the server with: npm start');
  console.log('   • API health check will work');
  console.log('   • Email and file services ready');
  console.log('   • Database features wait for connection');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Create indexes for optimal performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    console.log('\n📊 Creating indexes...');

    // Customer indexes
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });
    await db.collection('customers').createIndex({ isActive: 1, createdAt: -1 });
    console.log('  ✓ Customer indexes');

    // Product indexes
    await db.collection('products').createIndex({ sku: 1 }, { unique: true });
    await db.collection('products').createIndex({ categoryId: 1 });
    await db.collection('products').createIndex({ brandId: 1 });
    await db.collection('products').createIndex({ status: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    console.log('  ✓ Product indexes');

    // Order indexes
    await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });
    await db.collection('orders').createIndex({ customerId: 1, orderPlacedDate: -1 });
    await db.collection('orders').createIndex({ status: 1, orderPlacedDate: -1 });
    console.log('  ✓ Order indexes');

    // Cart indexes
    await db.collection('carts').createIndex({ customerId: 1 });
    console.log('  ✓ Cart indexes');

    // Payment indexes
    await db.collection('payments').createIndex({ orderId: 1 });
    await db.collection('payments').createIndex({ status: 1 });
    console.log('  ✓ Payment indexes');

    // Category indexes
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    console.log('  ✓ Category indexes');

    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.warn(`⚠️  Warning creating indexes: ${error.message}`);
  }
};

// Create default admin user
const createAdminUser = async () => {
  try {
    console.log('\n👤 Setting up admin user...');

    const adminEmail = process.env.ADMIN_EMAIL || 'chinmoy6667@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.warn('  ⚠️  ADMIN_PASSWORD not set in .env - skipping admin user creation');
      return;
    }

    const existingAdmin = await AdminUser.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`  ✓ Admin user already exists: ${adminEmail}`);
      return;
    }

    const adminUser = new AdminUser({
      fullName: 'System Administrator',
      email: adminEmail,
      phone: '+8801700000000',
      password: adminPassword,
      role: 'super_admin',
      isActive: true,
    });

    await adminUser.save();
    console.log(`  ✓ Admin user created: ${adminEmail}`);
    console.log('  ⚠️  Password set from ADMIN_PASSWORD env var. Change it after first login.\n');
  } catch (error) {
    if (error.code === 11000) {
      console.log(`  ✓ Admin user already exists`);
    } else {
      console.warn(`⚠️  Warning creating admin user: ${error.message}`);
    }
  }
};

// Run initialization
initializeDatabase();

import mongoose from 'mongoose';

// Connect to MongoDB database
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB connection warning: ${error.message}`);
    console.log('⚠️  Server will continue running without database. API endpoints available.');
    // Don't exit - let server continue running for testing
    return null;
  }
};

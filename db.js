const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/busgo';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // If local MongoDB isn't running, seamlessly activate zero-setup in-memory database
    console.log(`⚡ Local MongoDB daemon not running. Activating built-in database for development...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Connected to Built-in Database: ${memoryUri}`);
      console.log(`💡 Note: For cloud storage, add your MongoDB Atlas URI in server/.env`);
      return conn;
    } catch (memError) {
      console.error(`❌ Failed to start database:`, memError.message);
      console.error(`Please ensure MongoDB is running or specify a valid MONGODB_URI in .env`);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

module.exports = { connectDB, disconnectDB };

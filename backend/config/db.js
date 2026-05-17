// config/db.js
// MongoDB Atlas connection configuration using Mongoose

const mongoose = require("mongoose");

/**
 * Connect to MongoDB Atlas
 * Uses the MONGODB_URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options ensure stable connection
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process if DB connection fails - app can't run without DB
    process.exit(1);
  }
};

module.exports = connectDB;

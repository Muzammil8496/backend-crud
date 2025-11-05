const mongoose = require('mongoose');
require('dotenv').config(); // 👈 ye line add karni zaroori hai

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully (Local Compass)");
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error);
  }
};

module.exports = connectDB;

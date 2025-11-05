const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 👇 Local MongoDB Compass Connection String
    await mongoose.connect("mongodb://127.0.0.1:27017/salonDB");
    console.log("✅ MongoDB Connected Successfully (Local Compass)");
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error);
  }
};

module.exports = connectDB;

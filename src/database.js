const mongoose = require("mongoose");
const dotenv = require("dotenv");
const env = dotenv.config();
const { createClient } = require("redis");
const redis = createClient();

async function redisConnect() {
  try {
    await redis.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
}
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = {
  connectDB, 
  redisConnect,
}

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/pos";

mongoose.set("strictQuery", false);

async function connectDB() {
  try {
    // connect without deprecated/unsupported options
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB();

export default mongoose;

import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: String,
  discount: Number, // 0.9 = 10% off
});

export default mongoose.model("Coupon", CouponSchema);

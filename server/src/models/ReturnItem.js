import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema({
  itemID: { type: Number, required: true },
  daysSinceReturn: { type: Number, required: true },
});

export default returnItemSchema;

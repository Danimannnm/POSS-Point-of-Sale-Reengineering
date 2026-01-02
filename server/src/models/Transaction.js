import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  itemID: Number,
  itemName: String,
  price: Number,
  amount: Number,
});

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // for POSPage
  type: { type: String }, // Sale, Rental, Return
  items: [ItemSchema],
  totalPrice: { type: Number, default: 0 },
  returnSale: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
  phone: String, // optional for returns
  tax: { type: Number, default: 1.06 },
});

export default mongoose.model("Transaction", TransactionSchema);

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const InventorySchema = new Schema(
  {
    itemID: { type: Number, index: true, unique: false }, // numeric id used in tests/routes
    itemName: { type: String },                            // alternate name used in some code/tests
    name: { type: String, required: true },
    sku: { type: String, index: true, unique: false }, // set unique true if needed
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 0 }, // canonical quantity field
    amount: { type: Number, default: 0 },                   // alias used by some controllers/routes
    stock: { type: Number, default: 0 },                    // another alias (keeps compatibility)
    category: { type: String },
    // ...add other fields your controllers expect...
  },
  { timestamps: true }
);

export default model("Inventory", InventorySchema);

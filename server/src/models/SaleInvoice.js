import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SaleItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    subtotal: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const SaleInvoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    items: { type: [SaleItemSchema], required: true, default: [] },
    totalAmount: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" }, // adjust ref if different
    cashier: { type: Schema.Types.ObjectId, ref: "Employee" }, // adjust ref if different
    paymentMethod: { type: String, default: "cash" },
    status: { type: String, enum: ["paid", "pending", "cancelled"], default: "paid" },
  },
  { timestamps: true }
);

export default model("SaleInvoice", SaleInvoiceSchema);

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RentalSchema = new Schema(
  {
    // minimal fields — extend as needed to match transactionController usage
    item: {
      type: Schema.Types.ObjectId,
      ref: "Inventory", // adjust ref to your inventory model name if different
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Employee", // adjust ref to your user/employee model name if different
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, default: "active" },
    amount: { type: Number, default: 0 },
    // ...add other fields used by transactionController...
    phone: { type: String, required: true },
    items: [
      {
        itemID: Number,
        itemName: String,
        price: Number,
        amount: Number,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// static helper to record rental — keep simple for tests
RentalSchema.statics.addRental = async function (phone, items) {
  return this.create({ phone, items });
};

export default model("Rental", RentalSchema);

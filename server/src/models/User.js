import mongoose from "mongoose";

// Subdocument for items being returned
const returnItemSchema = new mongoose.Schema({
  itemID: { type: Number, required: true },       // ID of the rented item
  returned: { type: Boolean, default: false },    // Whether it has been returned
  daysLate: { type: Number, default: 0 },         // Number of days late
});

// Main user schema
const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },  // user's phone number
  name: { type: String },                                  // optional, can store customer name
  returnItems: [returnItemSchema],                         // array of rented items
}, { timestamps: true }); // automatically tracks createdAt and updatedAt

export default mongoose.model("User", userSchema);

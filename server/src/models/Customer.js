const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);

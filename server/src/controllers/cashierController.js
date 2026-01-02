import User from "../models/User.js"; // use User (customers stored here)
import Transaction from "../models/Transaction.js";

export async function checkCustomer(req, res) {
  const phone = req.params.phone;
  try {
    const customer = await User.findOne({ phone });
    res.json({ exists: !!customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createCustomer(req, res) {
  const { phone, name } = req.body;
  try {
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: "Customer already exists" });
    const customer = new User({ phone, name: name || `Customer-${phone}`, role: "Customer" });
    await customer.save();
    res.json({ message: "Customer registered", customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function checkTempTransaction(req, res) {
  try {
    // Check if there's any uncompleted transaction
    const tempTransaction = await Transaction.findOne({ completed: false }).sort({ createdAt: -1 });
    if (tempTransaction) {
      res.json({ hasTemp: true, operation: tempTransaction.type || "Sale", transactionId: tempTransaction._id });
    } else {
      res.json({ hasTemp: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function continueTransaction(req, res) {
  const { phone } = req.body;
  try {
    const tempTransaction = await Transaction.findOne({ completed: false }).sort({ createdAt: -1 });
    if (!tempTransaction) return res.status(404).json({ message: "No temp transaction found" });
    
    // Update transaction with customer phone
    tempTransaction.phone = phone;
    await tempTransaction.save();
    
    res.json({ message: "Continuing transaction", operation: tempTransaction.type || "Sale", transactionId: tempTransaction._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function logout(req, res) {
  res.json({ message: "Logged out successfully" });
}

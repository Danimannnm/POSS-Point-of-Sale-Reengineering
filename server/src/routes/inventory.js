import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// Get all inventory items
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
});

// Get single inventory item by ID
router.get("/:id", async (req, res) => {
  try {
    // ensure numeric comparison if itemID is stored as number
    const id = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id);
    const item = await Inventory.findOne({ itemID: id });
    if (!item) return res.json({ exists: false });
    res.json({ exists: true, name: item.itemName || item.name, price: item.price, amount: item.amount || item.quantity });
  } catch (err) {
    res.status(500).json({ exists: false });
  }
});

// Update inventory after transaction
router.post("/update", async (req, res) => {
  const { transactionItems, type } = req.body; // type: "Sale" | "Rental" | "Return"
  try {
    for (let tItem of transactionItems) {
      const item = await Inventory.findOne({ itemID: tItem.itemID });
      if (!item) continue;

      if (type === "Sale" || type === "Rental") item.amount = (item.amount || item.quantity) - tItem.amount;
      if (type === "Return") item.amount = (item.amount || item.quantity) + tItem.amount;

      await item.save();
    }
    res.json({ message: "Inventory updated" });
  } catch (err) {
    res.status(500).json({ message: "Inventory update failed" });
  }
});

// Add new inventory item
router.post("/", async (req, res) => {
  try {
    const { itemID, name, itemName, price, quantity, amount, description, category, sku } = req.body;
    
    const newItem = new Inventory({
      itemID: itemID || Date.now(), // Generate ID if not provided
      name: name || itemName,
      itemName: name || itemName,
      price: price || 0,
      quantity: quantity || amount || 0,
      amount: quantity || amount || 0,
      stock: quantity || amount || 0,
      description: description || "",
      category: category || "General",
      sku: sku || `SKU-${Date.now()}`
    });

    await newItem.save();
    console.log(`✓ Inventory item added: ${newItem.name} (ID: ${newItem.itemID})`);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("✗ Add inventory failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update inventory item
router.put("/:id", async (req, res) => {
  try {
    const id = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id);
    const { name, itemName, price, quantity, amount, description, category } = req.body;
    
    const item = await Inventory.findOne({ itemID: id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (name || itemName) {
      item.name = name || itemName;
      item.itemName = name || itemName;
    }
    if (price !== undefined) item.price = price;
    if (quantity !== undefined || amount !== undefined) {
      const newQty = quantity !== undefined ? quantity : amount;
      item.quantity = newQty;
      item.amount = newQty;
      item.stock = newQty;
    }
    if (description !== undefined) item.description = description;
    if (category !== undefined) item.category = category;

    await item.save();
    console.log(`✓ Inventory item updated: ${item.name} (ID: ${item.itemID})`);
    res.json(item);
  } catch (err) {
    console.error("✗ Update inventory failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete inventory item
router.delete("/:id", async (req, res) => {
  try {
    const id = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id);
    const item = await Inventory.findOneAndDelete({ itemID: id });
    
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    console.log(`✓ Inventory item deleted: ${item.name} (ID: ${item.itemID})`);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("✗ Delete inventory failed:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

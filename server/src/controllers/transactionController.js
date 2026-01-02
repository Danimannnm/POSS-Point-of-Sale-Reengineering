// server/controllers/transactionController.js
import Transaction from "../models/Transaction.js";
import Inventory from "../models/Inventory.js";
import User from "../models/User.js";
import Rental from "../models/Rental.js";
import SaleInvoice from "../models/SaleInvoice.js";

/**
 * --- LOGIN ---
 */
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Username not found" });
    if (user.password !== password) return res.status(401).json({ message: "Incorrect password" });

    user.lastLogin = new Date();
    await user.save();

    res.json({ message: "Login successful", role: user.role, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * --- LOGOUT ---
 */
export async function logout(req, res) {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Username not found" });

    user.lastLogout = new Date();
    await user.save();

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * --- CREATE TRANSACTION ---
 */
export async function createTransaction(req, res) {
  const { userId, type, items, phone } = req.body;
  try {
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.amount, 0);
    const transaction = await Transaction.create({
      userId,
      type,
      phone: phone || null,
      items,
      totalPrice,
      completed: false,
      tax: 1.06,
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * --- DELETE ITEM FROM TEMP TRANSACTION ---
 */
export async function deleteTempItem(req, res) {
  const { transactionId, itemId } = req.params;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    transaction.items = transaction.items.filter(i => i.itemID !== parseInt(itemId));
    transaction.totalPrice = transaction.items.reduce((sum, i) => sum + i.price * i.amount, 0);

    await transaction.save();
    res.json({ message: "Item deleted", transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * --- FINALIZE TRANSACTION ---
 */
export async function endPOS(req, res) {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Ensure numeric totalPrice and tax
    transaction.totalPrice = Number(transaction.totalPrice) || 0;
    const taxFactor = Number(transaction.tax) || 1.06;
    transaction.totalPrice = transaction.totalPrice * taxFactor;

    // Update inventory stock (update multiple possible fields for compatibility)
    if (Array.isArray(transaction.items)) {
      for (const item of transaction.items) {
        try {
          const amt = Number(item.amount) || 0;
          // Logic:
          // Sale: decreases stock (-amt)
          // Rental: decreases stock (-amt) (assuming rental takes item out)
          // Return: increases stock (+amt)
          let stockChange = 0;
          if (transaction.type === "Return") {
            stockChange = amt;
          } else {
            stockChange = -amt;
          }

          if (isNaN(stockChange)) continue;

          await Inventory.updateOne(
            { itemID: item.itemID },
            { $inc: { quantity: stockChange, amount: stockChange, stock: stockChange } }
          );
        } catch (invErr) {
          // log and continue; don't abort finalization due to inventory update failure
          console.error("Inventory update failed for item", item, invErr?.message || invErr);
        }
      }
    }

    // Handle Rental transactions
    if (transaction.type === "Rental" && transaction.phone) {
      try {
        let user = await User.findOne({ phone: transaction.phone });
        if (!user) {
          user = await User.create({ phone: transaction.phone, returnItems: [] });
        }
        transaction.items?.forEach(item => {
          const exists = user.returnItems.find(r => r.itemID === item.itemID && !r.returned);
          if (!exists) {
            user.returnItems.push({ itemID: item.itemID, returned: false, daysLate: 0 });
          }
        });
        await user.save();

        // Log rental in Rental collection if method exists
        if (Rental && typeof Rental.addRental === "function") {
          try {
            await Rental.addRental(transaction.phone, transaction.items || []);
          } catch (rErr) {
            console.error("Rental.addRental failed:", rErr?.message || rErr);
          }
        }
      } catch (rentalErr) {
        console.error("Rental handling failed:", rentalErr?.message || rentalErr);
      }
    }

    // Handle Return transactions (late fees)
    if (transaction.type === "Return" && transaction.phone) {
      try {
        const user = await User.findOne({ phone: transaction.phone });
        if (user) {
          let lateFees = 0;
          transaction.items?.forEach(item => {
            const returnInfo = user.returnItems.find(r => r.itemID === item.itemID && !r.returned);
            if (returnInfo) {
              const fee = (Number(item.amount) || 0) * (Number(item.price) || 0) * 0.1 * (Number(returnInfo.daysLate) || 0);
              lateFees += fee;
              returnInfo.returned = true;
            }
          });
          await user.save();
          transaction.totalPrice = Number(transaction.totalPrice || 0) + lateFees;
        }
      } catch (retErr) {
        console.error("Return handling failed:", retErr?.message || retErr);
      }
    }

    // Log Sale transactions
    if (transaction.type === "Sale") {
      if (SaleInvoice && typeof SaleInvoice.create === "function") {
        try {
          await SaleInvoice.create({
            transactionId: transaction._id,
            date: new Date(),
            items: transaction.items,
            totalPrice: transaction.totalPrice,
          });
        } catch (invErr) {
          console.error("SaleInvoice.create failed:", invErr?.message || invErr);
        }
      }
    }

    transaction.completed = true;
    await transaction.save();

    res.json({ message: "Transaction finalized", totalPrice: transaction.totalPrice });
  } catch (err) {
    console.error("endPOS error:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * --- RETRIEVE TEMP TRANSACTION ---
 */
export async function retrieveTransaction(req, res) {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * --- CHECK TEMP TRANSACTION ---
 */
export async function checkTemp(req, res) {
  const { userId } = req.params;
  try {
    const tempTransaction = await Transaction.findOne({ userId, completed: false });
    res.json({ exists: !!tempTransaction, transaction: tempTransaction || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * --- CONTINUE TEMP TRANSACTION ---
 */
export async function continueTemp(req, res) {
  const { userId } = req.params;
  try {
    const transaction = await Transaction.findOne({ userId, completed: false });
    if (!transaction) return res.status(404).json({ message: "No temp transaction found" });
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

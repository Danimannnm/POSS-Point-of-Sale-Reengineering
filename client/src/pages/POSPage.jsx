import React, { useState, useEffect } from "react";
import axios from "axios";

const POSPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [itemID, setItemID] = useState("");
  const [amount, setAmount] = useState(1);
  const [transactionType, setTransactionType] = useState("Sale"); // Sale | Rental | Return
  const [transactionId, setTransactionId] = useState(null);
  const [phone, setPhone] = useState("");

  // --- LOGIN ---
  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/users/login", { username, password });
      setUser(res.data.user);
      checkTempTransaction(res.data.user._id);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // --- CHECK TEMP TRANSACTION ---
  const checkTempTransaction = async (userId) => {
    try {
      const res = await axios.get(`/api/transactions/temp/${userId}`);
      if (res.data.exists) {
        setTransactionId(res.data.transaction._id);
        setCart(res.data.transaction.items);
        setTransactionType(res.data.transaction.type);
        setPhone(res.data.transaction.phone || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- ADD ITEM ---
  const handleAddItem = async () => {
    if (!user) {
      return alert("Please login first");
    }

    // ensure we have a transaction id (create if missing)
    let currentTransactionId = transactionId;
    if (!currentTransactionId) {
      const res = await axios.post("/api/transactions", {
        userId: user._id,
        type: transactionType,
        items: [],
        phone: phone || null,
      });
      // support several possible response shapes
      currentTransactionId = res.data._id || res.data.transaction?._id || res.data.id;
      setTransactionId(currentTransactionId);
    }

    // fetch item details (use same inventory endpoint as TransactionPage)
    const itemRes = await axios.get(`/api/inventory/${itemID}`);
    if (!itemRes.data.exists) return alert("Item not found");

    const newItem = {
      itemID: parseInt(itemID),
      itemName: itemRes.data.name,
      price: itemRes.data.price,
      amount: parseInt(amount),
    };

    const updatedCart = [...cart, newItem];
    setCart(updatedCart);

    // update transaction in DB using the ensured id
    await axios.post(`/api/transactions/update/${currentTransactionId}`, { items: updatedCart });
  };

  // --- DELETE ITEM ---
  const handleDeleteItem = async (itemId) => {
    try {
      if (transactionId) {
        await axios.delete(`/api/transactions/${transactionId}/item/${itemId}`);
      }
    } catch (err) {
      console.error(err);
    }
    setCart(cart.filter((i) => i.itemID !== itemId));
  };

  // --- FINALIZE TRANSACTION ---
  const handleFinalize = async () => {
    if (!transactionId) return alert("No active transaction to finalize");
    const res = await axios.post(`/api/transactions/end/${transactionId}`);
    alert(`Transaction finalized. Total: $${res.data.totalPrice}`);
    setCart([]);
    setTransactionId(null);
  };

  // parse numeric inputs in UI handlers
  const onItemIdChange = (v) => setItemID(v);
  const onAmountChange = (v) => setAmount(parseInt(v || "0", 10));

  return (
    <div className="p-4">
      {!user ? (
        <div>
          <h2>Employee Login</h2>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>POS Dashboard - {transactionType}</h2>
          {transactionType === "Rental" && (
            <input placeholder="Customer Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          )}

          <div>
            <input placeholder="Item ID" value={itemID} onChange={e => onItemIdChange(e.target.value)} />
            <input placeholder="Amount" type="number" value={amount} onChange={e => onAmountChange(e.target.value)} />
            <button onClick={handleAddItem}>Add Item</button>
          </div>

          <h3>Cart</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.itemID}>
                {item.itemName} x {item.amount} - ${item.price * item.amount}
                <button onClick={() => handleDeleteItem(item.itemID)}>Remove</button>
              </li>
            ))}
          </ul>

          <button onClick={handleFinalize}>Finalize Transaction</button>
        </div>
      )}
    </div>
  );
};

export default POSPage;

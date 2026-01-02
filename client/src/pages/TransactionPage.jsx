// src/pages/TransactionPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EnterItemModal from "./EnterItemModal";
import "../App.css";

export default function TransactionPage() {
  const { type, phone } = useParams(); // Sale, Rental, Return + optional phone
  const navigate = useNavigate();

  // State
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [addFlag, setAddFlag] = useState(true);
  const [customerPhone, setCustomerPhone] = useState(phone || "");
  const [total, setTotal] = useState(0);

  // Keypad State
  const [keypadInput, setKeypadInput] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    // Recalculate total whenever cart changes
    const totalPrice = cart.reduce((sum, i) => sum + i.amount * i.price, 0);
    setTotal(totalPrice);
  }, [cart]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredInventory(inventory);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredInventory(inventory.filter(i =>
        (i.name && i.name.toLowerCase().includes(lower)) ||
        (i.itemID && i.itemID.toString().includes(lower))
      ));
    }
  }, [searchTerm, inventory]);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory');
      setInventory(res.data);
      setFilteredInventory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.itemID === item.itemID);
    if (existing) {
      // Increment amount
      setCart(cart.map(c => c.itemID === item.itemID ? { ...c, amount: c.amount + 1 } : c));
    } else {
      setCart([...cart, {
        itemID: item.itemID,
        itemName: item.name || item.itemName,
        amount: 1,
        price: item.price
      }]);
    }
  };

  const removeFromCart = (itemID) => {
    setCart(cart.filter(c => c.itemID !== itemID));
  };

  const handleManualAdd = () => {
    if (!keypadInput) return;
    const itemID = parseInt(keypadInput);
    // Find item in inventory to get details
    const item = inventory.find(i => i.itemID === itemID);
    if (item) {
      addToCart(item);
      setKeypadInput("");
    } else {
      // Try fetching from API if not in local list (edge case)
      axios.get(`/api/inventory/${itemID}`)
        .then(res => {
          if (res.data.exists) {
            addToCart({
              itemID: res.data.itemID || itemID,
              name: res.data.name,
              price: res.data.price
            });
            setKeypadInput("");
          } else {
            alert("Item not found");
          }
        })
        .catch(err => alert("Error finding item"));
    }
  };

  const handleKeypadPress = (val) => {
    if (val === 'C') {
      setKeypadInput("");
    } else if (val === 'Enter') {
      handleManualAdd();
    } else {
      setKeypadInput(prev => prev + val);
    }
  };

  const handleSubmitTransaction = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    let finalPhone = customerPhone;
    if (type === "Rental" && !finalPhone) {
      finalPhone = prompt("Enter customer's phone number:");
      if (!finalPhone) return;
      setCustomerPhone(finalPhone);
    }

    try {
      // 1. Create Transaction (Draft)
      const res = await axios.post("/api/transaction", {
        type,
        phone: finalPhone || null,
        items: cart,
      });

      // 2. Finalize Transaction (Update Inventory)
      // Support various response structures just in case
      const transactionId = res.data._id || res.data.transaction?._id || res.data.id;

      if (transactionId) {
        await axios.post(`/api/transaction/${transactionId}/end`);
        alert(`Transaction completed! Total: $${total.toFixed(2)}`);
      } else {
        console.warn("No ID returned from creation, skipping finalization");
        alert("Transaction created but finalization failed (No ID)");
      }

      navigate("/cashier");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2>{type}</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="text-muted">User: Admin/Cashier</div> {/* Placeholder for user info */}
          <button className="neu-btn" onClick={() => navigate('/cashier')}>Back</button>
        </div>
      </div>

      <div className="transaction-content">
        {/* LEFT: Product Grid */}
        <div className="product-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="product-grid">
            {filteredInventory.map(item => (
              <div key={item._id || item.itemID} className="product-card" onClick={() => addToCart(item)}>
                <div className="product-name">{item.name || item.itemName}</div>
                <div className="product-price">${item.price}</div>
                <div className="product-stock">ID: {item.itemID} | Stock: {item.quantity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Cart & Keypad */}
        <div className="sidebar-section">
          <div className="cart-section">
            <h3>Cart ({cart.reduce((a, c) => a + c.amount, 0)})</h3>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="text-muted text-center" style={{ padding: '2rem' }}>Cart Empty</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <div className="item-details">
                      <div className="item-name">{item.itemName}</div>
                      <div className="item-info">
                        {item.amount} x ${item.price}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold' }}>${(item.amount * item.price).toFixed(2)}</div>
                      <button
                        style={{ padding: '0.25rem 0.5rem', background: 'var(--danger-color)', color: 'white', borderRadius: '4px' }}
                        onClick={(e) => { e.stopPropagation(); removeFromCart(item.itemID); }}
                      >x</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-total">
              <div className="total-label">Total</div>
              <div className="total-amount">${total.toFixed(2)}</div>
            </div>
          </div>

          <div className="actions-section" style={{ marginTop: '2rem' }}>
            {type === "Rental" && (
              <input
                className="neu-input"
                style={{ marginBottom: '1rem' }}
                placeholder="Customer Phone"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
              />
            )}

            <div className="keypad-input-wrapper" style={{ marginBottom: '1rem' }}>
              <input
                className="neu-input"
                placeholder="Enter ID Manually"
                value={keypadInput}
                readOnly
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '2px' }}
              />
            </div>

            <div className="keypad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className="keypad-btn" onClick={() => handleKeypadPress(n.toString())}>{n}</button>
              ))}
              <button className="keypad-btn" style={{ color: 'var(--danger-color)' }} onClick={() => handleKeypadPress('C')}>C</button>
              <button className="keypad-btn" onClick={() => handleKeypadPress('0')}>0</button>
              <button className="keypad-btn" style={{ color: 'var(--success-color)' }} onClick={() => handleKeypadPress('Enter')}>↵</button>
            </div>

            <button className="neu-btn" style={{ width: '100%', background: 'var(--primary-color)', color: 'white' }} onClick={handleSubmitTransaction}>
              Complete {type}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

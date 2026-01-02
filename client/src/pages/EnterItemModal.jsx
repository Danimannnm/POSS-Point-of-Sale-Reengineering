// src/components/EnterItemModal.jsx
import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function EnterItemModal({
  isOpen,
  onClose,
  onSubmit,
  addFlag = true,
}) {
  const [itemID, setItemID] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!itemID) return alert("Item ID is required");
    if (addFlag && (!amount || parseInt(amount) <= 0)) return alert("Valid amount is required");

    onSubmit({ itemID: parseInt(itemID), amount: parseInt(amount) || 1 });
    setItemID("");
    setAmount("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Enter Item"
    // Style handled by App.css .ReactModal__Content
    >
      <h2>{addFlag ? "Add Item" : "Remove Item"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Item ID:
          <input
            type="number"
            value={itemID}
            onChange={(e) => setItemID(e.target.value)}
            required
            placeholder="Enter Item ID"
          />
        </label>

        {addFlag && (
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Quantity"
            />
          </label>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: '1rem' }}>
          <button type="submit">Enter</button>
          <button type="button" className="danger" onClick={onClose}>Exit</button>
        </div>
      </form>
    </Modal>
  );
}

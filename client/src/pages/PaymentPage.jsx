// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage({ transaction, operation, phone, returnOrNot }) {
  const navigate = useNavigate();
  const [dialogText, setDialogText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [cash, setCash] = useState(0);
  const [cashBack, setCashBack] = useState(0);

  // Update dialog text
  useEffect(() => {
    let text = "";

    if (operation === "Return" && phone) {
      axios
        .get(`/api/users/returns/${phone}`)
        .then((res) => {
          const returnList = res.data.items;
          transaction.cart.forEach((item) => {
            const returned = returnList.find((r) => r.itemID === item.itemID);
            const itemPrice = returned ? item.amount * item.price * 0.1 * returned.daysPassed : 0;
            text += `Item ID: ${item.itemID}    Item Name: ${item.itemName}    Amount: x${item.amount}    Days Late: ${returned ? returned.daysPassed : 0}   To be paid: $${itemPrice.toFixed(2)}\n`;
          });
          text += `\nTotal: $${transaction.getTotal().toFixed(2)}\n`;
          setDialogText(text);
        })
        .catch(console.error);
    } else {
      transaction.cart.forEach((item) => {
        text += `${item.itemID}\t${item.itemName} \tx${item.amount}\t$${(item.amount * item.price).toFixed(2)}\n`;
      });
      text += `\nTotal: $${transaction.getTotal().toFixed(2)}\n`;
      setDialogText(text);
    }
  }, [transaction, operation, phone]);

  const handleCashPayment = async () => {
    let cashInput = prompt("Amount paid in cash:");
    cashInput = parseFloat(cashInput);
    if (isNaN(cashInput) || cashInput < transaction.getTotal()) {
      alert("Value must be greater than total value");
      return;
    }

    setCash(cashInput);
    const change = cashInput - transaction.getTotal();
    if (change > 0) alert(`Change $: ${change.toFixed(2)}`);

    let text = dialogText + `\n\nPaid: $${cashInput.toFixed(2)}\nChange: $${change.toFixed(2)}\n`;

    if (operation === "Rental") {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);
      text += `Return Date: ${returnDate.toLocaleDateString()}\n`;
    }

    setDialogText(text);
    setShowConfirm(true);
  };

  const handleElectronicPayment = () => {
    const cardNo = prompt("Card Number:");
    if (!transaction.creditCard(cardNo)) {
      alert("Invalid credit card number");
      return;
    }

    let text = dialogText;
    if (!returnOrNot) {
      const cashBackInput = prompt("If you desire cash back, type the quantity:") || "0";
      const cashBackAmount = parseFloat(cashBackInput);
      setCashBack(cashBackAmount);
      text += `\n\nCash back: $${cashBackAmount.toFixed(2)}\n`;
      text += `Total price: $${(cashBackAmount + transaction.getTotal()).toFixed(2)}\n`;

      if (operation === "Rental") {
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 14);
        text += `Return Date: ${returnDate.toLocaleDateString()}\n`;
      }
    }
    setDialogText(text);
    setShowConfirm(true);
  };

  const handleCancel = () => {
    alert("Transaction canceled");
    navigate("/cashier"); // redirect to cashier page
  };

  const handleConfirm = () => {
    alert("Payment confirmed");
    navigate("/cashier"); // redirect to cashier page
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment - {operation}</h2>
      <textarea
        readOnly
        value={dialogText}
        style={{
          width: "60%",
          height: "70vh",
          fontSize: "16px",
          whiteSpace: "pre-line",
          padding: 10,
        }}
      />
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {!showConfirm && (
          <>
            <button onClick={handleCashPayment}>Cash Payment</button>
            <button onClick={handleElectronicPayment}>Pay Electronically</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        )}
        {showConfirm && <button onClick={handleConfirm}>Confirm Payment</button>}
      </div>
    </div>
  );
}

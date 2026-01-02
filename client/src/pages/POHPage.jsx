import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function POHPage() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/transactions/temp/${transactionId}`)
      .then(res => setTransaction(res.data))
      .catch(console.error);
  }, [transactionId]);

  const addItem = async (itemID, amount) => {
    const res = await axios.post("/api/transactions/enter-item", { transactionId, itemID, amount });
    setTransaction(res.data);
  };

  const removeItem = async (itemID) => {
    const res = await axios.delete(`/api/transactions/remove-item/${transactionId}/${itemID}`);
    setTransaction(res.data);
  };

  const applyCouponCode = async () => {
    const res = await axios.post("/api/transactions/apply-coupon", { transactionId, couponCode: coupon });
    setTransaction(res.data.transaction);
  };

  const finalizeTransaction = async () => {
    const res = await axios.post(`/api/transactions/end/${transactionId}`);
    alert(`Transaction completed! Total: $${res.data.totalPrice}`);
    navigate("/cashier");
  };

  if (!transaction) return <p>Loading...</p>;

  return (
    <div>
      <h2>Transaction: {transactionId}</h2>
      <ul>
        {transaction.items.map(item => (
          <li key={item.itemID}>
            {item.itemName} x{item.amount} - ${item.price * item.amount}
            <button onClick={() => removeItem(item.itemID)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${transaction.totalPrice.toFixed(2)}</p>
      <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" />
      <button onClick={applyCouponCode}>Apply Coupon</button>
      <button onClick={finalizeTransaction}>Finalize Transaction</button>
    </div>
  );
}

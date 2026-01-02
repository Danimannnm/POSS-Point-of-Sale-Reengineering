import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function CashierHome() {
  const navigate = useNavigate();

  const handleAction = (type) => {
    navigate(`/transaction/${type}`);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="cashier-container">
      <div className="cashier-header">
        <h2>SG Technologies</h2>
        <p>Cashier Dashboard</p>
      </div>

      <div className="cashier-actions">
        <button className="cashier-btn sale" onClick={() => handleAction('Sale')}>
          💰 Sale
        </button>
        <button className="cashier-btn rental" onClick={() => handleAction('Rental')}>
          📦 Rental
        </button>
        <button className="cashier-btn return" onClick={() => handleAction('Return')}>
          🔄 Returns
        </button>
        <button className="cashier-btn logout" onClick={handleLogout}>
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}

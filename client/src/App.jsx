import React from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import POSPage from "./pages/POSPage";
import AdminPage from "./pages/AdminPage";
import TransactionPage from "./pages/TransactionPage";
import PORPage from "./pages/PORPage";
import POHPage from "./pages/POHPage";
import PaymentPage from "./pages/PaymentPage";
import AddEmployee from "./pages/AddEmployee";
import CashierHome from "./pages/CashierHome"; // <-- add this import if you create a new component

// prefer native bundler env (Vite) then fallback to server-injected window.process
const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  (typeof window !== "undefined" && window.process?.env?.API_URL) ||
  "http://localhost:5000";

axios.defaults.baseURL = API_URL;

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pos" element={<POSPage />} />
      <Route path="/cashier" element={<CashierHome />} />

      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/add-employee" element={<AddEmployee />} />

      <Route path="/transaction/:type" element={<TransactionPage />} />
      <Route path="/transaction/:type/:phone" element={<TransactionPage />} />

      <Route path="/por" element={<PORPage />} />
      <Route path="/poh/:transactionId" element={<POHPage />} />

      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
};

export default App;
// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // <-- added role state
  const navigate = useNavigate();

  const handleLogin = async () => {
    // trim client-side to avoid accidental trailing spaces
    const payload = { username: username.trim(), password: password.trim(), role }; // send role to server

    try {
      // Single reliable endpoint handles both Admin and Cashier
      const res = await axios.post("/api/admin/login", payload);

      // Normalize role extraction
      const returnedRole = res.data?.user?.role || res.data?.role || res.data?.roleName;

      // If user explicitly selected a role, ensure it matches server-returned role
      if (role && returnedRole && role !== returnedRole) {
        alert(`Role mismatch: selected "${role}" but server returned "${returnedRole}"`);
        return;
      }

      if (returnedRole === "Cashier") {
        navigate("/cashier");
      } else if (returnedRole === "Admin") {
        navigate("/admin");
      } else {
        alert("Wrong Authentication Credentials");
        setUsername("");
        setPassword("");
        setRole("");
      }
    } catch (err) {
      console.error(err);
      // Give more specific error if possible
      const msg = err.response?.data?.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>SG Technologies</h2>
          <p>Point of Sale System</p>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Select Role --</option>
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="form-actions">
          <button onClick={handleLogin}>Login</button>
          <button className="outline" onClick={() => { setUsername(""); setPassword(""); setRole(""); }}>Clear</button>
        </div>
      </div>
    </div>
  );
}

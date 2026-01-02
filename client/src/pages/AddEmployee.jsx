import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("Cashier");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/admin/employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        username,
        password,
        position, // backend expects 'position' but maps to 'role'
      }),
    });

    navigate("/admin");
  };

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <h2>Register Employee</h2>

      <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Position:</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="Cashier">Cashier</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit">Enter</button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>
          Exit
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;

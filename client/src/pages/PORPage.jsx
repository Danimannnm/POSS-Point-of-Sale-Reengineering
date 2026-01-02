import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PORPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/por")
      .then((res) => {
        if (!mounted) return;
        setList(res.data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError("Failed to load POR list");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading PORs...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>POR List</h2>
      {list.length === 0 ? (
        <p>No POR records found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #000" }}>
                <th style={{ textAlign: "left", padding: 8 }}>ID</th>
                <th style={{ textAlign: "left", padding: 8 }}>Supplier</th>
                <th style={{ textAlign: "left", padding: 8 }}>Date</th>
                <th style={{ textAlign: "left", padding: 8 }}>Total</th>
                <th style={{ textAlign: "left", padding: 8 }}>Status</th>
                <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p._id || p.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: 8 }}>{p._id || p.id}</td>
                  <td style={{ padding: 8 }}>{p.supplier || p.vendor || "—"}</td>
                  <td style={{ padding: 8 }}>{p.date ? new Date(p.date).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: 8 }}>${Number(p.total || p.totalPrice || 0).toFixed(2)}</td>
                  <td style={{ padding: 8 }}>{p.status || "N/A"}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => navigate(`/poh/${p._id || p.id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

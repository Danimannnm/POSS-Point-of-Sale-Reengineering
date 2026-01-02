// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // accessibility

export default function AdminPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'inventory'

  const navigate = useNavigate();

  // Employee Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'update'
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Employee Form state
  const [form, setForm] = useState({ name: '', username: '', password: '', position: 'Cashier' });

  // Inventory Modal state
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({ name: '', price: '', quantity: '', category: '', description: '' });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/admin/employees');
      setEmployees(res.data.employees || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchInventory();
    setLoading(false);
  }, []);

  // Employee Modal handlers
  const openModal = (type, emp = null) => {
    setModalType(type);
    setCurrentEmployee(emp);
    if (emp && (emp.name || emp.username || emp.password || emp.role || emp.position)) {
      setForm({
        name: emp.name || "",
        username: emp.username || "",
        password: emp.password || "",
        position: emp.role || emp.position || "Cashier",
      });
    } else {
      setForm({ name: "", username: "", password: "", position: "Cashier" });
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // Inventory Modal handlers
  const openInventoryModal = () => {
    setInventoryForm({ name: '', price: '', quantity: '', category: 'General', description: '' });
    setInventoryModalOpen(true);
  };

  const closeInventoryModal = () => setInventoryModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await axios.post('/api/admin/employee', form);
      } else if (modalType === 'update') {
        await axios.put(`/api/admin/employee/${currentEmployee._id}`, form);
      }
      closeModal();
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure numeric values
      const payload = {
        ...inventoryForm,
        price: Number(inventoryForm.price),
        quantity: Number(inventoryForm.quantity)
      };
      await axios.post('/api/inventory', payload);
      closeInventoryModal();
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await axios.delete(`/api/admin/employee/${id}`);
      fetchEmployees();
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await axios.delete(`/api/inventory/${id}`);
      fetchInventory();
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/admin/logout');
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="header-controls">
          <div className="tab-buttons" style={{ marginRight: '20px' }}>
            <button
              onClick={() => setActiveTab('employees')}
              className={activeTab === 'employees' ? 'active' : 'secondary'}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={activeTab === 'inventory' ? 'active' : 'secondary'}
            >
              Inventory
            </button>
          </div>

          <div className="action-buttons">
            {activeTab === 'employees' ? (
              <>
                <button onClick={() => openModal('add', { position: 'Cashier' })}>Add Cashier</button>
                <button onClick={() => openModal('add', { position: 'Admin' })}>Add Admin</button>
              </>
            ) : (
              <button onClick={openInventoryModal}>Add Item</button>
            )}
            <button className="secondary" onClick={() => navigate('/cashier')}>Cashier View</button>
            <button className="danger" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'employees' ? (
          <div className="employee-table-container">
            <h3>Employee Management</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Name</th>
                    <th>Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(e => (
                    <tr key={e._id}>
                      <td>{e.username}</td>
                      <td>{e.role}</td>
                      <td>{e.name}</td>
                      <td>{e.password}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => openModal('update', e)}>Update</button>
                          <button className="danger" onClick={() => handleDelete(e._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="inventory-table-container">
            <h3>Inventory Management</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.itemID || item._id}>
                      <td>{item.itemID}</td>
                      <td>{item.name || item.itemName}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity || item.amount}</td>
                      <td>{item.category}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="danger" onClick={() => handleDeleteItem(item.itemID)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Employee Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Employee Form"
      // Style handled by App.css .ReactModal__Content
      >
        <h2>{modalType === 'add' ? 'Add Employee' : 'Update Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            required
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            required
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            required
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <select
            value={form.position}
            onChange={e => setForm({ ...form, position: e.target.value })}
          >
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
          </select>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={closeModal} className="danger">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Inventory Modal */}
      <Modal
        isOpen={inventoryModalOpen}
        onRequestClose={closeInventoryModal}
        contentLabel="Add Inventory Item"
      // Style handled by App.css .ReactModal__Content
      >
        <h2>Add Inventory Item</h2>
        <form onSubmit={handleInventorySubmit}>
          <input
            type="text"
            placeholder="Item Name"
            value={inventoryForm.name}
            required
            onChange={e => setInventoryForm({ ...inventoryForm, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={inventoryForm.price}
            required
            min="0"
            step="0.01"
            onChange={e => setInventoryForm({ ...inventoryForm, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={inventoryForm.quantity}
            required
            min="0"
            onChange={e => setInventoryForm({ ...inventoryForm, quantity: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={inventoryForm.category}
            onChange={e => setInventoryForm({ ...inventoryForm, category: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={inventoryForm.description}
            onChange={e => setInventoryForm({ ...inventoryForm, description: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button type="submit">Add Item</button>
            <button type="button" onClick={closeInventoryModal} className="danger">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

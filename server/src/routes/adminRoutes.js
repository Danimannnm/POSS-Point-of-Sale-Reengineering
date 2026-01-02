import express from "express";
import { getEmployees, addEmployee, updateEmployee, removeEmployee, logout, login } from "../controllers/adminController.js";

const router = express.Router();

// Get all employees
router.get("/employees", getEmployees);

// Add employee
router.post("/employee", addEmployee);

// Update employee
router.put("/employee/:id", updateEmployee);

// Delete employee
router.delete("/employee/:id", removeEmployee);

// Logout
router.post("/logout", logout);

// Login (hardcoded)
router.post("/login", login);

// Added aliases to cover common mount variations
router.post("/admin/login", login);
router.post("/api/login", login);
router.post("/api/admin/login", login);

// Alias in case router is mounted differently (supports /.../users/login)
router.post("/users/login", login);

export default router;

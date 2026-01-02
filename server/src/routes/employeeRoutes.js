import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { name, password, role } = req.body;

  try {
    const emp = await Employee.create({
      name,
      password,
      role: role || "Cashier",
      username: req.body.username || name.toLowerCase().replace(/\s/g, ""),
    });

    res.json({ success: true, employee: emp });
  } catch (err) {
    res.status(500).json({ error: "Error adding employee" });
  }
});

export default router;

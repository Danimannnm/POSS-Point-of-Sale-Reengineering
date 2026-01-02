import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Employee.findOne({ username, password });
    if (!user) return res.json({ role: null });

    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ role: null });
  }
});

export default router;

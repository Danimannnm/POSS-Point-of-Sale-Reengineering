import express from "express";
import { checkCustomer, createCustomer, checkTempTransaction, continueTransaction, logout } from "../controllers/cashierController.js";

const router = express.Router();

router.get("/customer/:phone", checkCustomer);
router.post("/customer", createCustomer);
router.get("/transaction/temp", checkTempTransaction);
router.post("/transaction/continue", continueTransaction);
router.post("/logout", logout);

export default router;

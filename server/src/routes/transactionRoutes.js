import express from "express";
import {
  login, logout,
  createTransaction, deleteTempItem,
  endPOS, retrieveTransaction,
  checkTemp, continueTemp
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/", createTransaction);
router.delete("/:transactionId/item/:itemId", deleteTempItem);
router.post("/:transactionId/end", endPOS);
router.get("/:transactionId", retrieveTransaction);
router.get("/temp/check/:userId", checkTemp);
router.get("/temp/continue/:userId", continueTemp);

export default router;

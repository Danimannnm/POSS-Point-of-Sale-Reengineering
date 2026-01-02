import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import supertest from "supertest";

vi.mock("../../controllers/transactionController.js", () => ({
  login: vi.fn((req, res) => res.json({ ok: true })),
  logout: vi.fn((req, res) => res.json({ ok: true })),
  createTransaction: vi.fn((req, res) => res.status(201).json({ id: "t1" })),
  deleteTempItem: vi.fn((req, res) => res.json({ message: "Item deleted" })),
  endPOS: vi.fn((req, res) => res.json({ message: "Transaction finalized", totalPrice: 100 })),
  retrieveTransaction: vi.fn((req, res) => res.json({ id: req.params.transactionId })),
  checkTemp: vi.fn((req, res) => res.json({ exists: false, transaction: null })),
  continueTemp: vi.fn((req, res) => res.json({ message: "continued" })),
}));

describe("transactionRoutes", () => {
  let request;
  beforeEach(async () => {
    const transactionRoutes = (await import("../../routes/transactionRoutes.js")).default;
    const app = express();
    app.use(express.json());
    app.use("/api/transaction", transactionRoutes);
    request = supertest(app);
  });

  it("POST /api/transaction/login -> login handler", async () => {
    const res = await request.post("/api/transaction/login").send({ username: "u", password: "p" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
  });

  it("POST /api/transaction -> createTransaction", async () => {
    const res = await request.post("/api/transaction").send({ items: [] });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "t1");
  });

  it("POST /api/transaction/:transactionId/end -> endPOS", async () => {
    const res = await request.post("/api/transaction/t1/end").send();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Transaction finalized");
  });

  it("GET /api/transaction/temp/check/:userId -> checkTemp", async () => {
    const res = await request.get("/api/transaction/temp/check/u1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("exists", false);
  });
});

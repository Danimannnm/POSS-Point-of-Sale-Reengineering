import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import supertest from "supertest";

vi.mock("../../controllers/cashierController.js", () => ({
  checkCustomer: vi.fn((req, res) => res.json({ exists: true })),
  createCustomer: vi.fn((req, res) => res.status(201).json({ message: "Customer registered" })),
}));

describe("cashierRoutes", () => {
  let request;
  beforeEach(async () => {
    const cashierRoutes = (await import("../../routes/cashierRoutes.js")).default;
    const app = express();
    app.use(express.json());
    app.use("/api/cashier", cashierRoutes);
    request = supertest(app);
  });

  it("GET /api/cashier/customer/:phone -> uses checkCustomer", async () => {
    const res = await request.get("/api/cashier/customer/123");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("exists", true);
  });

  it("POST /api/cashier/customer -> uses createCustomer", async () => {
    const res = await request.post("/api/cashier/customer").send({ phone: "123" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Customer registered");
  });
});

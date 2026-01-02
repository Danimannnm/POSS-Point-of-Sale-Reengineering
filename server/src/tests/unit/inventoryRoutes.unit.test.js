import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import supertest from "supertest";

// mock Inventory model used by the route
vi.mock("../../models/Inventory.js", () => {
  const mockItem = (id) => ({ itemID: id, itemName: "I", price: 5, amount: 10, save: async () => {} });
  return {
    default: {
      find: vi.fn(async () => [mockItem(1), mockItem(2)]),
      findOne: vi.fn(async (q) => mockItem(q.itemID || q.itemID)),
    },
  };
});

describe("inventoryRoutes", () => {
  let request;
  beforeEach(async () => {
    const inventoryRoutes = (await import("../../routes/inventory.js")).default;
    const app = express();
    app.use(express.json());
    app.use("/api/inventory", inventoryRoutes);
    request = supertest(app);
  });

  it("GET /api/inventory -> returns items", async () => {
    const res = await request.get("/api/inventory");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/inventory/:id -> returns item details", async () => {
    const res = await request.get("/api/inventory/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("exists", true);
    expect(res.body).toHaveProperty("name");
  });

  it("POST /api/inventory/update -> updates and returns success", async () => {
    const payload = { transactionItems: [{ itemID: 1, amount: 2 }], type: "Sale" };
    const res = await request.post("/api/inventory/update").send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Inventory updated");
  });
});

import { describe, it, beforeAll, afterAll, expect } from "vitest";
import supertest from "supertest";
import { setup, teardown } from "./testUtils.js";

let app, request, mongod;
let Inventory;

beforeAll(async () => {
  const s = await setup();
  app = s.app;
  mongod = s.mongod;
  request = supertest(app);

  // import Inventory model after DB is ready
  const mod = await import("../models/Inventory.js");
  Inventory = mod.default;
  // create an item to read later
  await Inventory.create({ name: "Widget", sku: "W1", price: 10, quantity: 100, category: "Test", itemID: 123, itemName: "Widget" });
});

afterAll(async () => {
  await teardown(mongod);
});

describe("Inventory routes", () => {
  it("GET /api/inventory returns items", async () => {
    const res = await request.get("/api/inventory");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /api/inventory/:id returns item info", async () => {
    const res = await request.get("/api/inventory/123");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("exists", true);
    expect(res.body).toHaveProperty("name");
  });

  it("POST /api/inventory/update updates stock without error", async () => {
    const payload = { transactionItems: [{ itemID: 123, amount: 2 }], type: "Sale" };
    const res = await request.post("/api/inventory/update").send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Inventory updated");
  });
});

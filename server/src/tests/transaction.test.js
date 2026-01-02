import { describe, it, beforeAll, afterAll, expect } from "vitest";
import supertest from "supertest";
import { setup, teardown } from "./testUtils.js";

let app, request, mongod;
let Inventory, Employee, Transaction;

beforeAll(async () => {
  const s = await setup();
  app = s.app;
  mongod = s.mongod;
  request = supertest(app);

  // import models
  Inventory = (await import("../models/Inventory.js")).default;
  Employee = (await import("../models/Employee.js")).default;
  Transaction = (await import("../models/Transaction.js")).default;

  // create sample data
  await Employee.create({ name: "Bob", username: "bob", password: "pw", role: "Cashier" });
  await Inventory.create({ name: "Gadget", sku: "G1", price: 20, quantity: 50, category: "Test", itemID: 999, itemName: "Gadget" });
});

afterAll(async () => {
  await teardown(mongod);
});

describe("Transaction flow", () => {
  it("creates a transaction and finalizes it", async () => {
    const createPayload = {
      userId: null,
      type: "Sale",
      items: [{ itemID: 999, itemName: "Gadget", price: 20, amount: 2 }]
    };
    const createRes = await request.post("/api/transaction").send(createPayload);
    expect([200, 201]).toContain(createRes.status);
    const transactionId = createRes.body._id || createRes.body.id;
    expect(transactionId).toBeTruthy();

    // finalize transaction
    const endRes = await request.post(`/api/transaction/${transactionId}/end`).send();
    expect(endRes.status).toBe(200);
    expect(endRes.body).toHaveProperty("message", "Transaction finalized");
    expect(typeof endRes.body.totalPrice).toBe("number");
  });
});

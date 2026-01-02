import { describe, it, expect } from "vitest";

describe("models smoke tests", () => {
  it("can instantiate Employee model", async () => {
    const mod = await import("../../models/Employee.js");
    const Employee = mod.default;
    const e = new Employee({ username: "u", name: "N", password: "p", role: "Cashier" });
    // Mongoose model instances have toObject; basic fields should be present
    expect(e).toHaveProperty("username", "u");
    expect(e).toHaveProperty("name", "N");
  });

  it("can instantiate Transaction model", async () => {
    const mod = await import("../../models/Transaction.js");
    const Transaction = mod.default;
    const t = new Transaction({ type: "Sale", items: [{ itemID: 1, price: 5, amount: 1 }], totalPrice: 5 });
    expect(t).toHaveProperty("type", "Sale");
    expect(Array.isArray(t.items)).toBe(true);
  });
});

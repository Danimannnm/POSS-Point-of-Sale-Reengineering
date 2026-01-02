import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import supertest from "supertest";

vi.mock("../../models/Employee.js", () => ({
  default: {
    create: vi.fn(async (data) => ({ ...data, _id: "newid" })),
  },
}));

describe("employeeRoutes", () => {
  let request;
  beforeEach(async () => {
    const employeeRoutes = (await import("../../routes/employeeRoutes.js")).default;
    const app = express();
    app.use(express.json());
    app.use("/api/employees", employeeRoutes);
    request = supertest(app);
  });

  it("POST /api/employees/add -> creates employee", async () => {
    const res = await request.post("/api/employees/add").send({ name: "N", password: "p" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.employee).toHaveProperty("_id", "newid");
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import supertest from "supertest";

// mock controller before importing routes
vi.mock("../../controllers/adminController.js", () => ({
  getEmployees: vi.fn((req, res) => res.json([{ username: "m1" }])),
  addEmployee: vi.fn((req, res) => res.status(201).json({ username: req.body.username })),
  updateEmployee: vi.fn((req, res) => res.json({ updated: true })),
  removeEmployee: vi.fn((req, res) => res.json({ message: "Deleted successfully" })),
  logout: vi.fn((req, res) => res.json({ message: "Logged out" })),
}));

describe("adminRoutes", () => {
  let request;
  beforeEach(async () => {
    const adminRoutes = (await import("../../routes/adminRoutes.js")).default;
    const app = express();
    app.use(express.json());
    app.use("/api/admin", adminRoutes);
    request = supertest(app);
  });

  it("GET /api/admin/employees -> uses getEmployees", async () => {
    const res = await request.get("/api/admin/employees");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/admin/employee -> uses addEmployee", async () => {
    const res = await request.post("/api/admin/employee").send({ username: "u1" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("username", "u1");
  });

  it("PUT /api/admin/employee/:id -> uses updateEmployee", async () => {
    const res = await request.put("/api/admin/employee/1").send({ name: "X" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("updated", true);
  });

  it("DELETE /api/admin/employee/:id -> uses removeEmployee", async () => {
    const res = await request.delete("/api/admin/employee/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("POST /api/admin/logout -> uses logout", async () => {
    const res = await request.post("/api/admin/logout").send();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out");
  });
});

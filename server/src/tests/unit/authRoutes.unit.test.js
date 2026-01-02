import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import supertest from "supertest";

vi.mock("../../models/Employee.js", () => ({
  default: { findOne: vi.fn(async ({ username, password }) => ({ username, password, role: "Admin" })) },
}));

describe("authRoutes", () => {
  let request;
  beforeEach(async () => {
    const authRoutes = (await import("../../routes/auth.js")).default;
    const app = express();
    app.use(express.json());
    app.use("/api", authRoutes);
    request = supertest(app);
  });

  it("POST /api/login -> returns role", async () => {
    const res = await request.post("/api/login").send({ username: "u", password: "p" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("role", "Admin");
  });
});

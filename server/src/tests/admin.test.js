import { describe, it, beforeAll, afterAll, expect } from "vitest";
import supertest from "supertest";
import { setup, teardown } from "./testUtils.js";

let app, request, mongod;

beforeAll(async () => {
  const s = await setup();
  app = s.app;
  mongod = s.mongod;
  request = supertest(app);
});

afterAll(async () => {
  await teardown(mongod);
});

describe("Admin routes", () => {
  it("creates an employee and lists employees", async () => {
    const payload = { name: "Alice", username: "alice", password: "pass", position: "Admin" };
    const createRes = await request.post("/api/admin/employee").send(payload);
    expect([200, 201]).toContain(createRes.status);
    expect(createRes.body).toHaveProperty("username", payload.username);

    const listRes = await request.get("/api/admin/employees");
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    const found = listRes.body.find((e) => e.username === payload.username);
    expect(found).toBeTruthy();
  });
});

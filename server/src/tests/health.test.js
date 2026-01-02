import { describe, it, beforeAll, afterAll, expect } from "vitest";
import supertest from "supertest";
import { setup, teardown } from "./testUtils.js";

let app;
let mongod;
let request;

beforeAll(async () => {
  const s = await setup();
  app = s.app;
  mongod = s.mongod;
  request = supertest(app);
});

afterAll(async () => {
  await teardown(mongod);
});

describe("Health", () => {
  it("GET / should return status ok", async () => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});

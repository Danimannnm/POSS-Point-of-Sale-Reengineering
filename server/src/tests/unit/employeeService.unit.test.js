import { describe, it, expect, vi, beforeEach } from "vitest";

const MockEmployee = {
  find: vi.fn().mockResolvedValue([{ username: "u1" }]),
  findOne: vi.fn(),
  findByIdAndDelete: vi.fn(),
  findById: vi.fn(),
};
MockEmployee.create = vi.fn();

vi.mock("../../models/Employee.js", () => ({ default: MockEmployee }));

describe("employeeService (unit)", () => {
  let svc;

  beforeEach(async () => {
    MockEmployee.find.mockClear();
    MockEmployee.findOne.mockClear();
    svc = await import("../../services/employeeService.js");
  });

  it("getEmployees calls Employee.find", async () => {
    const res = await svc.getEmployees();
    expect(MockEmployee.find).toHaveBeenCalled();
    expect(Array.isArray(res)).toBe(true);
  });

  it("addEmployee generates username when missing", async () => {
    MockEmployee.findOne.mockResolvedValueOnce({ username: "1001" });
    const emp = await svc.addEmployee({ name: "New", password: "p", role: "Cashier" });
    expect(emp).toBeTruthy();
    expect(emp).toHaveProperty("username");
  });
});

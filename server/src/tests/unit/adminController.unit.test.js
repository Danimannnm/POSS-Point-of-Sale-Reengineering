import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRequire } from "module";

const MockEmployee = function (data) {
  Object.assign(this, data);
  this.save = vi.fn().mockResolvedValue(this);
};
MockEmployee.find = vi.fn().mockResolvedValue([{ username: "u1", name: "User1" }]);
MockEmployee.findById = vi.fn().mockResolvedValue({
  _id: "id1",
  name: "User1",
  username: "u1",
  password: "p",
  role: "Cashier",
  save: vi.fn().mockResolvedValue(true),
});
MockEmployee.findByIdAndDelete = vi.fn().mockResolvedValue(true);

// Mock module before importing controller
vi.mock("../../models/Employee.js", () => ({ default: MockEmployee }));

describe("adminController (unit)", () => {
  let adminController;

  beforeEach(async () => {
    adminController = await import("../../controllers/adminController.js");
  });

  it("getEmployees returns list", async () => {
    const req = {};
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await adminController.getEmployees(req, res);
    expect(res.json).toHaveBeenCalledWith([{ username: "u1", name: "User1" }]);
  });

  it("addEmployee creates and returns employee", async () => {
    const req = { body: { name: "User2", username: "u2", password: "p", position: "Cashier" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await adminController.addEmployee(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("updateEmployee updates a found employee", async () => {
    const req = { params: { id: "id1" }, body: { name: "Updated", username: "u1", password: "p", position: "Admin" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await adminController.updateEmployee(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("removeEmployee deletes employee", async () => {
    const req = { params: { id: "id1" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await adminController.removeEmployee(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "Deleted successfully" });
  });
});

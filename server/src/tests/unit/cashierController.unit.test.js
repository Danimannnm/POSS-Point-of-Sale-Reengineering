import { describe, it, expect, vi, beforeEach } from "vitest";

const MockUser = function (data) {
  Object.assign(this, data);
  this.save = vi.fn().mockResolvedValue(this);
};
MockUser.findOne = vi.fn();
MockUser.create = vi.fn().mockResolvedValue({ phone: "123", name: "Bob" });

vi.mock("../../models/User.js", () => ({ default: MockUser }));

describe("cashierController (unit)", () => {
  let cashierController;

  beforeEach(async () => {
    // reset mocks between tests
    MockUser.findOne.mockReset();
    cashierController = await import("../../controllers/cashierController.js");
  });

  it("checkCustomer returns exists false when none", async () => {
    MockUser.findOne.mockResolvedValueOnce(null);
    const req = { params: { phone: "000" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await cashierController.checkCustomer(req, res);
    expect(res.json).toHaveBeenCalledWith({ exists: false });
  });

  it("createCustomer creates when not exists", async () => {
    MockUser.findOne.mockResolvedValueOnce(null);
    const req = { body: { phone: "123", name: "Bob" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await cashierController.createCustomer(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Customer registered" }));
  });

  it("createCustomer rejects when exists", async () => {
    MockUser.findOne.mockResolvedValueOnce({ phone: "123" });
    const req = { body: { phone: "123" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await cashierController.createCustomer(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Customer already exists" });
  });
});

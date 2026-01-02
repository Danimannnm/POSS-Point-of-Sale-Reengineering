import { describe, it, expect, vi, beforeEach } from "vitest";

const TransactionMock = { create: vi.fn(), findById: vi.fn(), findOne: vi.fn() };
const InventoryMock = { updateOne: vi.fn() };
const UserMock = { findOne: vi.fn(), create: vi.fn() };
const RentalMock = { addRental: vi.fn() };
const SaleInvoiceMock = { create: vi.fn() };

vi.mock("../../models/Transaction.js", () => ({ default: TransactionMock }));
vi.mock("../../models/Inventory.js", () => ({ default: InventoryMock }));
vi.mock("../../models/User.js", () => ({ default: UserMock }));
vi.mock("../../models/Rental.js", () => ({ default: RentalMock }));
vi.mock("../../models/SaleInvoice.js", () => ({ default: SaleInvoiceMock }));

describe("transactionController (unit)", () => {
  let tc;

  beforeEach(async () => {
    TransactionMock.create.mockReset();
    TransactionMock.findOne.mockReset();
    TransactionMock.findById.mockReset();
    InventoryMock.updateOne.mockReset();
    UserMock.findOne.mockReset();
    RentalMock.addRental.mockReset();
    SaleInvoiceMock.create.mockReset();

    tc = await import("../../controllers/transactionController.js");
  });

  it("createTransaction computes totalPrice and returns transaction", async () => {
    const req = { body: { userId: null, type: "Sale", items: [{ price: 5, amount: 2 }] } };
    const fakeTx = { _id: "t1", ...req.body, totalPrice: 10 };
    TransactionMock.create.mockResolvedValueOnce(fakeTx);

    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await tc.createTransaction(req, res);

    expect(TransactionMock.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fakeTx);
  });

  it("checkTemp returns exists:false when none", async () => {
    TransactionMock.findOne.mockResolvedValueOnce(null);
    const req = { params: { userId: "u1" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await tc.checkTemp(req, res);
    expect(res.json).toHaveBeenCalledWith({ exists: false, transaction: null });
  });

  it("retrieveTransaction returns 404 when not found", async () => {
    TransactionMock.findById.mockResolvedValueOnce(null);
    const req = { params: { transactionId: "notfound" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await tc.retrieveTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Transaction not found" });
  });
});

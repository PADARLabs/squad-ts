import { Squad } from "../src/index";
import { mockFetch } from "./helpers";

let squad: Squad;

beforeEach(() => {
  squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });
});

afterEach(() => jest.restoreAllMocks());

const LINK_DATA = {
  id: "LINK_001",
  name: "Pay for services",
  hash: "payforservices",
  link_status: 1,
  description: "Payment for professional services",
  amount: 50000,
  redirect_link: "https://myapp.com/success",
  support_email: "support@myapp.com",
  is_recurring: false,
  currency_id: "NGN",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

describe("PaymentLinks", () => {
  describe("create", () => {
    it("creates a new payment link", async () => {
      mockFetch(200, { status: 200, success: true, message: "Created", data: LINK_DATA });

      const result = await squad.paymentLinks.create({
        name: "Pay for services",
        description: "Payment for professional services",
        amount: 50000,
        redirect_link: "https://myapp.com/success",
        support_email: "support@myapp.com",
      });

      expect(result.data.id).toBe("LINK_001");
      expect(result.data.hash).toBe("payforservices");
    });
  });

  describe("update", () => {
    it("updates an existing payment link", async () => {
      mockFetch(200, { status: 200, success: true, message: "Updated", data: { ...LINK_DATA, amount: 75000 } });

      const result = await squad.paymentLinks.update("LINK_001", { amount: 75000 });
      expect(result.data.amount).toBe(75000);
    });
  });

  describe("getAll", () => {
    it("returns all payment links", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: [LINK_DATA] });

      const result = await squad.paymentLinks.getAll();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe("LINK_001");
    });
  });

  describe("getOne", () => {
    it("returns a single payment link by ID", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: LINK_DATA });

      const result = await squad.paymentLinks.getOne("LINK_001");
      expect(result.data.name).toBe("Pay for services");
    });
  });

  describe("toggleStatus", () => {
    it("toggles the status of a payment link", async () => {
      mockFetch(200, { status: 200, success: true, message: "Status toggled", data: { ...LINK_DATA, link_status: 0 } });

      const result = await squad.paymentLinks.toggleStatus("LINK_001");
      expect(result.data.link_status).toBe(0);
    });
  });
});

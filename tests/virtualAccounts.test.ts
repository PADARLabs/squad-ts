import { Squad } from "../src/index";
import { mockFetch } from "./helpers";

let squad: Squad;

beforeEach(() => {
  squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });
});

afterEach(() => jest.restoreAllMocks());

const VA_DATA = {
  first_name: "John",
  last_name: "Doe",
  bank_code: "058",
  virtual_account_number: "7834927713",
  beneficiary_account: "4920299492",
  customer_identifier: "CUST001",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

describe("VirtualAccounts", () => {
  describe("create", () => {
    it("creates a customer virtual account", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: VA_DATA });

      const result = await squad.virtualAccounts.create({
        first_name: "John",
        last_name: "Doe",
        middle_name: "Middle",
        mobile_num: "08012345678",
        dob: "01/01/1990",
        email: "john@example.com",
        bvn: "22222222222",
        gender: "1",
        address: "1 Test Street, Lagos",
        customer_identifier: "CUST001",
        beneficiary_account: "4920299492",
      });

      expect(result.data.virtual_account_number).toBe("7834927713");
      expect(result.data.customer_identifier).toBe("CUST001");
    });
  });

  describe("createBusiness", () => {
    it("creates a business virtual account", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: { ...VA_DATA, first_name: "Techzilla", last_name: "Okoye" },
      });

      const result = await squad.virtualAccounts.createBusiness({
        bvn: "22222222222",
        business_name: "Techzilla Ltd",
        customer_identifier: "TECH001",
        mobile_num: "08012345678",
        beneficiary_account: "4920299492",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("getWebhookLogs", () => {
    it("returns paginated webhook log entries", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: {
          count: 1,
          rows: [{
            id: "log-uuid-001",
            transaction_ref: "TXREF001",
            payload: {
              transaction_reference: "TXREF001",
              virtual_account_number: "7834927713",
              principal_amount: "10000",
              settled_amount: "9700",
              fee_charged: "300",
              transaction_date: "2024-01-01T00:00:00.000Z",
              customer_identifier: "CUST001",
              transaction_indicator: "C",
              remarks: "Transfer",
              currency: "NGN",
              channel: "virtual-account",
              sender_name: "SENDER NAME",
              encrypted_body: "ENCRYPTED",
              meta: null,
            },
          }],
        },
      });

      const result = await squad.virtualAccounts.getWebhookLogs({ page: 1, perPage: 10 });
      expect(result.data.count).toBe(1);
      expect(result.data.rows[0].transaction_ref).toBe("TXREF001");
    });
  });

  describe("deleteWebhookLog", () => {
    it("deletes a webhook log entry", async () => {
      mockFetch(200, { status: 200, success: true, message: "Deleted", data: 1 });

      const result = await squad.virtualAccounts.deleteWebhookLog("TXREF001");
      expect(result.data).toBe(1);
    });
  });

  describe("getCustomerTransactions", () => {
    it("returns transactions for a customer identifier", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: [{
          transaction_reference: "TXREF002",
          virtual_account_number: "7834927713",
          principal_amount: "5000",
          settled_amount: "4850",
          fee_charged: "150",
          transaction_date: "2024-01-02T00:00:00.000Z",
          transaction_indicator: "C",
          remarks: "Payment",
          currency: "NGN",
          frozen_transaction: null,
          customer: { customer_identifier: "CUST001" },
        }],
      });

      const result = await squad.virtualAccounts.getCustomerTransactions("CUST001");
      expect(result.data).toHaveLength(1);
      expect(result.data[0].transaction_reference).toBe("TXREF002");
    });
  });

  describe("getMerchantAccounts", () => {
    it("returns all merchant virtual accounts", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: {
          count: 1,
          rows: [{
            bank_code: "058",
            virtual_account_number: "7834927713",
            beneficiary_account: "4920299492",
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
            customer: { first_name: "John", last_name: "Doe", customer_identifier: "CUST001" },
          }],
        },
      });

      const result = await squad.virtualAccounts.getMerchantAccounts();
      expect(result.data.count).toBe(1);
    });
  });

  describe("simulatePayment (sandbox)", () => {
    it("simulates an incoming payment to a virtual account", async () => {
      mockFetch(200, { status: 200, success: true, message: "Payment simulated", data: {} });

      const result = await squad.virtualAccounts.simulatePayment({
        virtual_account_number: "7834927713",
        amount: "10000",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Dynamic Virtual Accounts", () => {
    it("initiates a dynamic virtual account transaction", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: {
          is_blocked: false,
          account_name: "SQUAD TEST",
          account_number: "0000000001",
          expected_amount: 10000,
          expires_at: "2024-01-01T01:00:00.000Z",
          transaction_reference: "DVA_REF_001",
          bank: "Guaranty Trust Bank",
          currency: "NGN",
        },
      });

      const result = await squad.virtualAccounts.initiateDynamic({
        amount: 10000,
        duration: 3600,
        email: "user@example.com",
        transaction_ref: "DVA_REF_001",
      });

      expect(result.data.account_number).toBe("0000000001");
      expect(result.data.transaction_reference).toBe("DVA_REF_001");
    });
  });
});

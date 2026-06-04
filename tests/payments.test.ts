import { Squad } from "../src/index";
import { SquadError } from "../src/errors";
import { mockFetch } from "./helpers";

const SANDBOX_BASE = "https://sandbox-api-d.squadco.com";
const LIVE_BASE = "https://api-d.squadco.com";

function makeSquad(env: "sandbox" | "live" = "sandbox") {
  return new Squad({ secretKey: "sandbox_sk_test", environment: env });
}

afterEach(() => jest.restoreAllMocks());

describe("Payments", () => {
  describe("initiate", () => {
    it("posts to /transaction/initiate and returns checkout URL", async () => {
      const responseData = {
        status: 200,
        success: true,
        message: "Success",
        data: {
          checkout_url: "https://checkout.squadco.com/pay/abc123",
          transaction_ref: "TEST_REF_001",
          merchant_info: {
            merchant_id: "SBX_MERCHANT",
            merchant_name: "Test Merchant",
            merchant_logo: null,
            merchant_business_name: null,
          },
          currency: "NGN",
        },
      };

      mockFetch(200, responseData);

      const squad = makeSquad();
      const result = await squad.payments.initiate({
        email: "user@example.com",
        amount: 100000,
        currency: "NGN",
        initiate_type: "inline",
        transaction_ref: "TEST_REF_001",
        callback_url: "https://myapp.com/callback",
      });

      expect(result.success).toBe(true);
      expect(result.data.checkout_url).toBe("https://checkout.squadco.com/pay/abc123");
      expect(result.data.transaction_ref).toBe("TEST_REF_001");
    });

    it("throws SquadError on 401", async () => {
      mockFetch(401, { success: false, message: "Unauthorized" });

      const squad = makeSquad();
      await expect(
        squad.payments.initiate({ email: "x@x.com", amount: 1000 }),
      ).rejects.toBeInstanceOf(SquadError);
    });

    it("throws SquadError with statusCode on API error", async () => {
      mockFetch(400, { status: 400, success: false, message: "Invalid payload" });

      const squad = makeSquad();
      try {
        await squad.payments.initiate({ email: "", amount: 0 });
      } catch (err) {
        expect(err).toBeInstanceOf(SquadError);
        expect((err as SquadError).statusCode).toBe(400);
      }
    });
  });

  describe("verify", () => {
    it("gets /transaction/verify/:ref and returns transaction data", async () => {
      const responseData = {
        status: 200,
        success: true,
        message: "Success",
        data: {
          transaction_amount: 100000,
          transaction_ref: "TEST_REF_001",
          email: "user@example.com",
          transaction_status: "Success",
          transaction_currency_id: "NGN",
          created_at: "2024-01-01T00:00:00.000Z",
          transaction_type: "Card",
          merchant_name: "Test Merchant",
          merchant_business_name: null,
          gateway_transaction_ref: "GW_REF_001",
          recurring: null,
          merchant_email: "merchant@example.com",
          plan_code: null,
        },
      };

      mockFetch(200, responseData);

      const squad = makeSquad();
      const result = await squad.payments.verify("TEST_REF_001");

      expect(result.success).toBe(true);
      expect(result.data.transaction_status).toBe("Success");
      expect(result.data.transaction_amount).toBe(100000);
    });

    it("throws SquadError on invalid transaction ref", async () => {
      mockFetch(400, { status: 400, success: false, message: "Invalid transaction reference", data: null });

      const squad = makeSquad();
      await expect(squad.payments.verify("INVALID")).rejects.toBeInstanceOf(SquadError);
    });
  });

  describe("getTransaction", () => {
    it("returns transaction data directly", async () => {
      const data = {
        transaction_amount: 5000,
        transaction_ref: "REF_002",
        email: "user@example.com",
        transaction_status: "Success",
        transaction_currency_id: "NGN",
        created_at: "2024-01-01T00:00:00.000Z",
        transaction_type: "Transfer",
        merchant_name: "Merchant",
        merchant_business_name: null,
        gateway_transaction_ref: "GW002",
        recurring: null,
        merchant_email: "m@m.com",
        plan_code: null,
      };

      mockFetch(200, { status: 200, success: true, message: "Success", data });

      const squad = makeSquad();
      const result = await squad.payments.getTransaction("REF_002");

      expect(result.transaction_ref).toBe("REF_002");
      expect(result.transaction_amount).toBe(5000);
    });
  });

  describe("getAllTransactions", () => {
    it("gets /transaction/all with params", async () => {
      const responseData = {
        status: 200,
        success: true,
        message: "Success",
        data: {
          count: 1,
          rows: [
            {
              transaction_ref: "REF_001",
              gateway_ref: "GW_001",
              transaction_status: "Success",
              email: "user@example.com",
              merchant_id: "MERCHANT_001",
              currency: "NGN",
              transaction_type: "Card",
              amount: 50000,
              merchant_amount: 48500,
              created_at: "2024-01-01T00:00:00.000Z",
              meta: null,
            },
          ],
        },
      };

      const spy = mockFetch(200, responseData);

      const squad = makeSquad();
      const result = await squad.payments.getAllTransactions({ page: 1, perPage: 10, start_date: "2024-01-01", end_date: "2024-01-31" });

      expect(result.success).toBe(true);
      expect(result.data.count).toBe(1);
      expect(result.data.rows[0].transaction_ref).toBe("REF_001");
      expect((spy.mock.calls[0][0] as string)).toContain(`${SANDBOX_BASE}/transaction`);
    });
  });

  describe("environment switching", () => {
    it("uses sandbox base URL in sandbox mode", async () => {
      const spy = mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: {
          checkout_url: "https://checkout.squadco.com/pay/sandbox",
          transaction_ref: "REF_SANDBOX",
          merchant_info: { merchant_id: "SBX", merchant_name: "M", merchant_logo: null, merchant_business_name: null },
          currency: "NGN",
        },
      });

      const squad = makeSquad("sandbox");
      await squad.payments.initiate({ email: "test@test.com", amount: 1000 });
      expect((spy.mock.calls[0][0] as string)).toContain(SANDBOX_BASE);
    });

    it("uses live base URL in live mode", async () => {
      const spy = mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: {
          checkout_url: "https://checkout.squadco.com/pay/live",
          transaction_ref: "REF_LIVE",
          merchant_info: { merchant_id: "LIVE", merchant_name: "M", merchant_logo: null, merchant_business_name: null },
          currency: "NGN",
        },
      });

      const squad = makeSquad("live");
      await squad.payments.initiate({ email: "test@test.com", amount: 1000 });
      expect((spy.mock.calls[0][0] as string)).toContain(LIVE_BASE);
    });
  });

  describe("charge (Direct API)", () => {
    it("posts to process-payment endpoint", async () => {
      mockFetch(200, {
        status: 200,
        success: true,
        message: "EnterPin",
        data: { auth_model: "ValidatePin", transaction_reference: "DIRECT_001" },
      });

      const squad = makeSquad();
      const result = await squad.payments.charge({
        transaction_reference: "DIRECT_001",
        amount: 10000,
        currency: "NGN",
        payment_method: "card",
        card: { number: "5061000000000000000", cvv: "123", expiry_month: "12", expiry_year: "26" },
        customer: { name: "John Doe", email: "john@example.com" },
      });

      expect(result.data.auth_model).toBe("ValidatePin");
    });
  });
});

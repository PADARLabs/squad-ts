import { Squad } from "../src/index";
import { mockFetch } from "./helpers";

let squad: Squad;

beforeEach(() => {
  squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });
});

afterEach(() => jest.restoreAllMocks());

const VAS_RESPONSE_DATA = {
  reference: "VAS_REF_001",
  amount: 100,
  merchant_amount: 98,
  phone_number: "08012345678",
  merchant_id: "MERCHANT_001",
  wallet_batch_id: "WB_001",
  transaction_id: "TXN_VAS_001",
  type: "airtime" as const,
  action: "debit" as const,
  status: "success" as const,
  meta: null,
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("VAS (Value-Added Services)", () => {
  describe("purchaseAirtime", () => {
    it("purchases airtime for a phone number", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: VAS_RESPONSE_DATA });

      const result = await squad.vas.purchaseAirtime({ phone_number: "08012345678", amount: 100 });
      expect(result.success).toBe(true);
      expect(result.data.type).toBe("airtime");
      expect(result.data.status).toBe("success");
    });
  });

  describe("purchaseData", () => {
    it("purchases data bundle for a phone number", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: { ...VAS_RESPONSE_DATA, type: "data" } });

      const result = await squad.vas.purchaseData({ phone_number: "08012345678", plan_code: "1001", amount: 1000 });
      expect(result.data.type).toBe("data");
    });
  });

  describe("getDataBundles", () => {
    it("returns data bundles for MTN", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: [
          { plan_name: "MTN 1GB", bundle_value: "1GB", bundle_validity: "30 days", bundle_description: "1GB for 30 days", bundle_price: 1000, plan_code: "1001", network: "MTN" },
          { plan_name: "MTN 2GB", bundle_value: "2GB", bundle_validity: "30 days", bundle_description: "2GB for 30 days", bundle_price: 1500, plan_code: "1002", network: "MTN" },
        ],
      });

      const result = await squad.vas.getDataBundles("MTN");
      expect(result.data).toHaveLength(2);
      expect(result.data[0].network).toBe("MTN");
      expect(result.data[0].plan_code).toBe("1001");
    });
  });

  describe("getMobileNetworks", () => {
    it("returns the list of supported mobile networks", async () => {
      const result = await squad.vas.getMobileNetworks();
      expect(result.networks).toContain("MTN");
      expect(result.networks).toContain("GLO");
      expect(result.networks).toContain("AIRTEL");
      expect(result.networks).toContain("9MOBILE");
    });
  });

  describe("getTransactions", () => {
    it("returns VAS transactions with pagination", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: { count: 1, rows: [VAS_RESPONSE_DATA] },
      });

      const result = await squad.vas.getTransactions({ page: 1, perPage: 10, action: "debit", reference: "VAS_REF_001" });
      expect(result.data.count).toBe(1);
      expect(result.data.rows[0].reference).toBe("VAS_REF_001");
    });
  });
});

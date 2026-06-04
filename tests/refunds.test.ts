import { Squad } from "../src/index";
import { SquadError } from "../src/errors";
import { mockFetch } from "./helpers";

let squad: Squad;

beforeEach(() => {
  squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });
});

afterEach(() => jest.restoreAllMocks());

describe("Refunds", () => {
  describe("initiate", () => {
    it("initiates a full refund", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: {
          gateway_refund_status: "pending",
          refund_status: 2,
          refund_reference: "REFUND-SQOKOY1708696818297_1_1",
        },
      });

      const result = await squad.refunds.initiate({
        gateway_transaction_ref: "GW_REF_001",
        transaction_ref: "TXN_REF_001",
        refund_type: "Full",
        reason_for_refund: "Customer request",
      });

      expect(result.success).toBe(true);
      expect(result.data.gateway_refund_status).toBe("pending");
      expect(result.data.refund_reference).toMatch(/^REFUND-/);
    });

    it("initiates a partial refund with amount", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: { gateway_refund_status: "pending", refund_status: 2, refund_reference: "REFUND-PARTIAL_001" },
      });

      const result = await squad.refunds.initiate({
        gateway_transaction_ref: "GW_REF_002",
        transaction_ref: "TXN_REF_002",
        refund_type: "Partial",
        reason_for_refund: "Partial delivery",
        refund_amount: "5000",
      });

      expect(result.data.refund_reference).toBe("REFUND-PARTIAL_001");
    });

    it("throws SquadError on 401", async () => {
      mockFetch(401, { success: false, message: "Unauthorized", data: {} });

      await expect(
        squad.refunds.initiate({
          gateway_transaction_ref: "GW_REF_003",
          transaction_ref: "TXN_REF_003",
          refund_type: "Full",
          reason_for_refund: "Test",
        }),
      ).rejects.toBeInstanceOf(SquadError);
    });
  });

  describe("getAll", () => {
    it("retrieves all refunds", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: {
          count: 1,
          rows: [{
            refund_reference: "REFUND-001",
            transaction_ref: "TXN_001",
            gateway_transaction_ref: "GW_001",
            refund_type: "Full",
            reason_for_refund: "Test",
            refund_amount: null,
            refund_status: 2,
            gateway_refund_status: "pending",
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
          }],
        },
      });

      const result = await squad.refunds.getAll({ page: 1, perPage: 10 });
      expect(result.data.count).toBe(1);
      expect(result.data.rows[0].refund_reference).toBe("REFUND-001");
    });
  });
});

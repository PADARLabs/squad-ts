import { Squad } from "../src/index";
import { mockFetch } from "./helpers";

let squad: Squad;

beforeEach(() => {
  squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });
});

afterEach(() => jest.restoreAllMocks());

describe("Disputes", () => {
  describe("getAll", () => {
    it("returns all disputes", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: [{
          ticket_id: "TICKET_001",
          merchant_id: "MERCHANT_001",
          transaction_ref: "TXN_001",
          amount: 10000,
          reason: "Item not received",
          status: "open",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        }],
      });

      const result = await squad.disputes.getAll();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].ticket_id).toBe("TICKET_001");
    });
  });

  describe("getUploadUrl", () => {
    it("returns an upload URL for evidence", async () => {
      mockFetch(200, {
        status: 200, success: true, message: "Success",
        data: { upload_url: "https://s3.amazonaws.com/upload/evidence.pdf" },
      });

      const result = await squad.disputes.getUploadUrl("TICKET_001", "evidence.pdf");
      expect(result.data.upload_url).toMatch(/^https:\/\//);
    });
  });

  describe("resolve", () => {
    it("resolves a dispute by accepting it", async () => {
      mockFetch(200, { status: 200, success: true, message: "Dispute resolved", data: null });

      const result = await squad.disputes.resolve("TICKET_001", { action: "accepted", file_name: "evidence.pdf" });
      expect(result.success).toBe(true);
    });
  });
});

import { Squad } from "../src/index";
import { SquadError } from "../src/errors";
import { mockFetch } from "./helpers";

let squad: Squad;

beforeEach(() => {
  squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });
});

afterEach(() => jest.restoreAllMocks());

describe("Transfers", () => {
  describe("accountLookup", () => {
    it("resolves account name from bank code and account number", async () => {
      mockFetch(200, {
        status: 200,
        success: true,
        message: "Success",
        data: { account_name: "JOHN DOE", account_number: "0123456789" },
      });

      const result = await squad.transfers.accountLookup({
        bank_code: "058",
        account_number: "0123456789",
      });

      expect(result.data.account_name).toBe("JOHN DOE");
    });
  });

  describe("initiateTransfer", () => {
    it("posts transfer and returns NIP reference", async () => {
      mockFetch(200, {
        status: 200,
        success: true,
        message: "Success",
        data: {
          transaction_reference: "MERCHANTID_TRF001",
          response_description: "Approved or Completed Successfully",
          currency_id: "NGN",
          amount: "100000",
          nip_transaction_reference: "NIP_SESSION_0001",
          account_number: "0123456789",
          account_name: "JOHN DOE",
          destination_institution_name: "Guaranty Trust Bank",
        },
      });

      const result = await squad.transfers.initiateTransfer({
        transaction_reference: "MERCHANTID_TRF001",
        amount: "100000",
        bank_code: "058",
        account_number: "0123456789",
        account_name: "JOHN DOE",
        currency_id: "NGN",
        remark: "Payment for services",
      });

      expect(result.data.nip_transaction_reference).toBe("NIP_SESSION_0001");
      expect(result.data.destination_institution_name).toBe("Guaranty Trust Bank");
    });

    it("throws SquadError on 424 (timeout)", async () => {
      mockFetch(424, { status: 424, success: false, message: "Transaction timed out" });

      await expect(
        squad.transfers.initiateTransfer({
          transaction_reference: "MERCHANTID_TRF002",
          amount: "50000",
          bank_code: "058",
          account_number: "0123456789",
          account_name: "JOHN DOE",
          currency_id: "NGN",
          remark: "Test",
        }),
      ).rejects.toBeInstanceOf(SquadError);
    });
  });

  describe("requery", () => {
    it("returns original transfer details", async () => {
      mockFetch(200, {
        status: 200,
        success: true,
        message: "Success",
        data: {
          remark: "Payment for services",
          bank_code: "058",
          currency_id: "NGN",
          amount: "100000",
          account_number: "0123456789",
          transaction_reference: "MERCHANTID_TRF001",
          account_name: "JOHN DOE",
        },
      });

      const result = await squad.transfers.requery({ transaction_reference: "MERCHANTID_TRF001" });
      expect(result.data.transaction_reference).toBe("MERCHANTID_TRF001");
    });
  });

  describe("getAllTransfers", () => {
    it("returns paginated list of transfers", async () => {
      mockFetch(200, {
        status: 200,
        success: true,
        message: "Success",
        data: {
          count: 2,
          rows: [
            {
              account_number_credited: "0123456789",
              amount_debited: "100000",
              total_amount_debited: "105000",
              success: true,
              recipient: "JOHN DOE",
              bank_code: "058",
              transaction_reference: "MERCHANTID_TRF001",
              transaction_status: "success",
              switch_transaction: null,
            },
            {
              account_number_credited: "9876543210",
              amount_debited: "50000",
              total_amount_debited: "52500",
              success: false,
              recipient: "JANE DOE",
              bank_code: "033",
              transaction_reference: "MERCHANTID_TRF002",
              transaction_status: "pending",
              switch_transaction: null,
            },
          ],
        },
      });

      const result = await squad.transfers.getAllTransfers({ page: 1, perPage: 10, dir: "DESC" });
      expect(result.data.count).toBe(2);
      expect(result.data.rows[0].transaction_status).toBe("success");
      expect(result.data.rows[1].transaction_status).toBe("pending");
    });
  });

  describe("getBanks", () => {
    it("returns list of supported banks", async () => {
      mockFetch(200, {
        status: 200,
        success: true,
        message: "Success",
        data: [
          { bank_code: "058", bank_name: "Guaranty Trust Bank" },
          { bank_code: "033", bank_name: "United Bank for Africa" },
          { bank_code: "011", bank_name: "First Bank of Nigeria" },
        ],
      });

      const result = await squad.transfers.getBanks();
      expect(result.data).toHaveLength(3);
      expect(result.data[0].bank_code).toBe("058");
      expect(result.data[0].bank_name).toBe("Guaranty Trust Bank");
    });
  });
});

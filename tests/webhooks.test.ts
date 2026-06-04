import crypto from "crypto";
import { Squad } from "../src/index";

const squad = new Squad({ secretKey: "my_secret_key", environment: "sandbox" });

function generateSignature(body: string | object, secret: string): string {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return crypto.createHmac("sha512", secret).update(raw).digest("hex").toUpperCase();
}

describe("Webhooks", () => {
  describe("validateWebhook", () => {
    it("returns true when signature matches body hash", () => {
      const body = {
        Event: "charge_successful",
        TransactionRef: "REF001",
        Body: { amount: 10000, transaction_status: "Success" },
      };
      const secret = "my_secret_key";
      const sig = generateSignature(body, secret);

      expect(squad.webhooks.validateWebhook(body, sig, secret)).toBe(true);
    });

    it("returns false when signature does not match", () => {
      const body = { Event: "charge_successful", TransactionRef: "REF002" };
      const sig = "INVALIDSIGNATURE";

      expect(squad.webhooks.validateWebhook(body, sig, "my_secret_key")).toBe(false);
    });

    it("accepts a raw string body", () => {
      const rawBody = '{"Event":"charge_successful","TransactionRef":"REF003"}';
      const secret = "my_secret_key";
      const sig = generateSignature(rawBody, secret);

      expect(squad.webhooks.validateWebhook(rawBody, sig, secret)).toBe(true);
    });
  });

  describe("validateCheckoutWebhook", () => {
    it("uses instance secret key from Authorization header", () => {
      const body = {
        Event: "charge_successful",
        TransactionRef: "REF004",
        Body: { amount: 5000 },
      };
      // The instance uses "my_secret_key" — generate sig with that
      const sig = generateSignature(body, "my_secret_key");

      expect(squad.webhooks.validateCheckoutWebhook(body, sig)).toBe(true);
    });
  });

  describe("validateVirtualAccountWebhook", () => {
    const secret = "va_secret_key";

    it("validates v1 webhook by hashing entire payload", () => {
      const payload = {
        transaction_reference: "TXREF001",
        virtual_account_number: "7834927713",
        principal_amount: "10000",
        settled_amount: "9700",
        fee_charged: "300",
        transaction_date: "2024-01-01T00:00:00.000Z",
        transaction_indicator: "C",
        remarks: "Transfer",
        currency: "NGN",
        channel: "virtual-account" as const,
        sender_name: "SENDER NAME",
        encrypted_body: "ENC",
        customer_identifier: "CUST001",
        meta: { freeze_transaction_ref: null, reason_for_frozen_transaction: null },
      };

      const sig = generateSignature(JSON.stringify(payload), secret);

      expect(squad.webhooks.validateVirtualAccountWebhook(payload, sig, secret)).toBe(true);
    });

    it("validates v2 webhook by hashing pipe-delimited 6 fields", () => {
      const payload = {
        transaction_reference: "TXREF002",
        virtual_account_number: "7834927713",
        principal_amount: "10000",
        settled_amount: "9700",
        fee_charged: "300",
        transaction_date: "2024-01-01T00:00:00.000Z",
        transaction_indicator: "C",
        remarks: "Transfer",
        currency: "NGN",
        channel: "virtual-account" as const,
        sender_name: "SENDER",
        encrypted_body: "ENC",
        customer_identifier: "CUST002",
        meta: { freeze_transaction_ref: null, reason_for_frozen_transaction: null },
        version: "v2" as const,
      };

      const pipeInput = [
        payload.transaction_reference,
        payload.virtual_account_number,
        payload.currency,
        payload.principal_amount,
        payload.settled_amount,
        payload.customer_identifier,
      ].join("|");

      const sig = crypto
        .createHmac("sha512", secret)
        .update(pipeInput)
        .digest("hex")
        .toUpperCase();

      expect(squad.webhooks.validateVirtualAccountWebhook(payload, sig, secret)).toBe(true);
    });
  });

  describe("buildAcknowledgment", () => {
    it("builds a 200 success acknowledgment", () => {
      const ack = squad.webhooks.buildAcknowledgment("TXR001", 200);
      expect(ack).toEqual({
        response_code: 200,
        transaction_reference: "TXR001",
        response_description: "Success",
      });
    });

    it("builds a 400 validation error acknowledgment", () => {
      const ack = squad.webhooks.buildAcknowledgment("TXR002", 400);
      expect(ack.response_description).toBe("Validation Error");
    });

    it("builds a 500 system error acknowledgment", () => {
      const ack = squad.webhooks.buildAcknowledgment("TXR003", 500);
      expect(ack.response_description).toBe("System Error");
    });

    it("defaults to 200 when no status provided", () => {
      const ack = squad.webhooks.buildAcknowledgment("TXR004");
      expect(ack.response_code).toBe(200);
    });
  });
});

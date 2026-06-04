import crypto from "crypto";
import { SquadClient } from "../client.js";
import type {
  WebhookEvent,
  WebhookAcknowledgment,
  VirtualAccountWebhookPayload,
} from "../types/index.js";

export class Webhooks extends SquadClient {
  /**
   * Validates an incoming checkout/card webhook using HMAC-SHA512.
   * Compares the x-squad-encrypted-body header against a hash of the raw body.
   */
  validateCheckoutWebhook(rawBody: string | object, signature: string): boolean {
    const key = this.secretKey;
    const body = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
    const hash = crypto.createHmac("sha512", key).update(body).digest("hex").toUpperCase();
    return hash === signature.toUpperCase();
  }

  /**
   * Validates a virtual account webhook.
   * Version 1: hash entire body.
   * Version 2/3: hash pipe-delimited 6-field string.
   */
  validateVirtualAccountWebhook(
    payload: VirtualAccountWebhookPayload,
    signature: string,
    secretKey: string,
  ): boolean {
    let input: string;

    if (payload.version === "v2" || payload.version === "v3") {
      input = [
        payload.transaction_reference,
        payload.virtual_account_number,
        payload.currency,
        payload.principal_amount,
        payload.settled_amount,
        payload.customer_identifier,
      ].join("|");
    } else {
      input = JSON.stringify(payload);
    }

    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(input)
      .digest("hex")
      .toUpperCase();

    return hash === signature.toUpperCase();
  }

  /**
   * Convenience: validate any Squad webhook by secret key.
   */
  validateWebhook(rawBody: string | object, signature: string, secretKey?: string): boolean {
    const key = secretKey ?? this.secretKey;
    const body = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
    const hash = crypto.createHmac("sha512", key).update(body).digest("hex").toUpperCase();
    return hash === signature.toUpperCase();
  }

  /**
   * Build a well-formed acknowledgment response.
   */
  buildAcknowledgment(
    transaction_reference: string,
    status: 200 | 400 | 500 = 200,
  ): WebhookAcknowledgment {
    const descriptions: Record<200 | 400 | 500, WebhookAcknowledgment["response_description"]> =
      {
        200: "Success",
        400: "Validation Error",
        500: "System Error",
      };
    return {
      response_code: status,
      transaction_reference,
      response_description: descriptions[status],
    };
  }

  parseEvent(rawBody: unknown): WebhookEvent {
    return rawBody as WebhookEvent;
  }
}

export type { WebhookEvent, WebhookAcknowledgment, VirtualAccountWebhookPayload };

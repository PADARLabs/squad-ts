// ─── Webhook Event Types ──────────────────────────────────────────────────────

export type WebhookTransactionType =
  | "Card"
  | "Transfer"
  | "Bank"
  | "Ussd"
  | "MerchantUssd"
  | "VirtualAccount";

export interface WebhookPaymentInformation {
  payment_type?: string;
  pan?: string;
  card_type?: string;
  customer_ref?: string;
  customer_mobile?: string;
}

export interface WebhookBody {
  amount: number;
  transaction_ref: string;
  gateway_ref: string;
  transaction_status: "Success" | "Failed" | "Abandoned" | "Pending";
  email: string;
  merchant_id: string;
  currency: string;
  transaction_type: WebhookTransactionType;
  merchant_amount: number;
  created_at: string;
  meta: Record<string, unknown> | null;
  is_recurring: boolean;
  payment_information?: WebhookPaymentInformation;
  customer_mobile?: string;
}

export interface ChargeSuccessfulEvent {
  Event: "charge_successful";
  TransactionRef: string;
  Body: WebhookBody;
}

// ─── Virtual Account Webhook ──────────────────────────────────────────────────

export interface VirtualAccountWebhookPayload {
  transaction_reference: string;
  virtual_account_number: string;
  principal_amount: string;
  settled_amount: string;
  fee_charged: string;
  transaction_date: string;
  transaction_indicator: string;
  remarks: string;
  currency: string;
  channel: "virtual-account";
  sender_name: string;
  encrypted_body: string;
  customer_identifier: string;
  meta: {
    freeze_transaction_ref: string | null;
    reason_for_frozen_transaction: string | null;
  };
  // v2/v3 fields
  first_name?: string;
  last_name?: string;
  prefix?: string;
  session_id?: string;
  masked_sender_account_number?: string;
  transaction_uuid?: string;
  version?: "v2" | "v3";
}

// Union of all webhook events
export type WebhookEvent = ChargeSuccessfulEvent;

// ─── Webhook Acknowledgment ───────────────────────────────────────────────────

export interface WebhookAcknowledgment {
  response_code: 200 | 400 | 500;
  transaction_reference: string;
  response_description: "Success" | "Validation Error" | "System Error";
}

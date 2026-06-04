// ─── Initiate Payment ────────────────────────────────────────────────────────

export interface InitiatePaymentPayload {
  email: string;
  amount: number;
  currency?: string;
  initiate_type?: "inline" | "redirect";
  transaction_ref?: string;
  callback_url?: string;
  payment_channels?: Array<"card" | "bank" | "ussd" | "transfer">;
  metadata?: Record<string, unknown>;
  pass_charge?: boolean;
  sub_merchant_id?: string;
  is_recurring?: boolean;
  plan_code?: string;
}

export interface MerchantInfo {
  merchant_id: string;
  merchant_name: string;
  merchant_logo: string | null;
  merchant_business_name: string | null;
}

export interface InitiatePaymentData {
  auth_model?: string;
  currency: string;
  recurring?: unknown;
  payment_ref?: string;
  merchant_info: MerchantInfo;
  merchant_amount?: number;
  checkout_url?: string;
  transaction_ref: string;
}

export interface InitiatePaymentResponse {
  status: number;
  success: boolean;
  message: string;
  data: InitiatePaymentData;
}

// ─── Verify Transaction ───────────────────────────────────────────────────────

export interface VerifyTransactionData {
  transaction_amount: number;
  transaction_ref: string;
  email: string;
  transaction_status: "Success" | "Failed" | "Abandoned" | "Pending";
  transaction_currency_id: string;
  created_at: string;
  transaction_type: string;
  merchant_name: string;
  merchant_business_name: string | null;
  gateway_transaction_ref: string;
  recurring: unknown | null;
  merchant_email: string;
  plan_code: string | null;
}

export interface VerifyTransactionResponse {
  status: number;
  success: boolean;
  message: string;
  data: VerifyTransactionData;
}

// ─── Get All Transactions ─────────────────────────────────────────────────────

export interface GetAllTransactionsParams {
  page?: number;
  perPage?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  reference?: string;
}

export interface TransactionRecord {
  transaction_ref: string;
  gateway_ref: string;
  transaction_status: string;
  email: string;
  merchant_id: string;
  currency: string;
  transaction_type: string;
  amount: number;
  merchant_amount: number;
  created_at: string;
  meta: Record<string, unknown> | null;
}

export interface GetAllTransactionsData {
  count: number;
  rows: TransactionRecord[];
}

export interface GetAllTransactionsResponse {
  status: number;
  success: boolean;
  message: string;
  data: GetAllTransactionsData;
}

// ─── Tokenized Card Charge ────────────────────────────────────────────────────

export interface ChargeTokenizedCardPayload {
  amount: number;
  token_id: string;
  transaction_ref?: string;
}

export interface CancelChargeCardPayload {
  auth_code: string[];
}

export interface CancelChargeCardData {
  auth_code: string[];
}

export interface CancelChargeCardResponse {
  status: number;
  success: boolean;
  message: string;
  data: CancelChargeCardData;
}

// ─── Direct API / Card Payment ────────────────────────────────────────────────

export interface CardDetails {
  number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
}

export interface BankDetails {
  bank_code: string;
  account_or_phoneno: string;
}

export interface UssdDetails {
  bank_code: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
}

export interface ChargePaymentPayload {
  transaction_reference: string;
  amount: number;
  currency: string;
  pass_charge?: boolean;
  webhook_url?: string;
  redirect_url?: string;
  payment_method: "card" | "bank" | "ussd";
  card?: CardDetails;
  bank?: BankDetails;
  ussd?: UssdDetails;
  customer: CustomerDetails;
}

export interface AuthorizePaymentPayload {
  transaction_reference: string;
  authorization: {
    pin?: string;
    otp?: string;
    otp_token?: string;
  };
}

export interface ValidatePaymentPayload {
  transaction_reference: string;
  authorization: {
    otp_token: string;
  };
}

export interface ChargePaymentResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    auth_model?: string;
    auth_url?: string;
    ussd_details?: {
      ussd_reference: string;
      expiresAt: string;
    };
    transaction_reference: string;
    [key: string]: unknown;
  };
}

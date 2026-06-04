// ─── Create Customer Virtual Account ─────────────────────────────────────────

export interface CreateCustomerVirtualAccountPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  mobile_num: string;
  dob: string;
  email: string;
  bvn: string;
  gender: "1" | "2";
  address: string;
  customer_identifier: string;
  beneficiary_account: string;
}

export interface VirtualAccountData {
  first_name: string;
  last_name: string;
  bank_code: string;
  virtual_account_number: string;
  beneficiary_account: string | null;
  customer_identifier: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerVirtualAccountResponse {
  status: number;
  success: boolean;
  message: string;
  data: VirtualAccountData;
}

// ─── Create Business Virtual Account ─────────────────────────────────────────

export interface CreateBusinessVirtualAccountPayload {
  bvn: string;
  business_name: string;
  customer_identifier: string;
  mobile_num: string;
  beneficiary_account: string;
}

export interface CreateBusinessVirtualAccountResponse {
  status: number;
  success: boolean;
  message: string;
  data: VirtualAccountData;
}

// ─── Webhook Logs ─────────────────────────────────────────────────────────────

export interface WebhookLogParams {
  page: number;
  perPage: number;
}

export interface WebhookLogEntry {
  id: string;
  transaction_ref: string;
  payload: {
    transaction_reference: string;
    virtual_account_number: string;
    principal_amount: string;
    settled_amount: string;
    fee_charged: string;
    transaction_date: string;
    customer_identifier: string;
    transaction_indicator: string;
    remarks: string;
    currency: string;
    channel: string;
    sender_name: string;
    encrypted_body: string;
    hash?: string;
    meta: Record<string, unknown> | null;
  };
}

export interface GetWebhookLogsData {
  count: number;
  rows: WebhookLogEntry[];
}

export interface GetWebhookLogsResponse {
  status: number;
  success: boolean;
  message: string;
  data: GetWebhookLogsData;
}

export interface DeleteWebhookLogResponse {
  status: number;
  success: boolean;
  message: string;
  data: number;
}

// ─── Virtual Account Transactions ─────────────────────────────────────────────

export interface FrozenTransaction {
  freeze_transaction_ref: string | null;
  reason_for_frozen_transaction: string | null;
}

export interface VirtualAccountTransaction {
  transaction_reference: string;
  virtual_account_number: string;
  principal_amount: string;
  settled_amount: string;
  fee_charged: string;
  transaction_date: string;
  transaction_indicator: string;
  remarks: string;
  currency: string;
  frozen_transaction: FrozenTransaction | null;
  customer: {
    customer_identifier: string;
  };
  alerted_merchant?: boolean;
  merchant_settlement_date?: string;
}

export type GetCustomerTransactionsResponse = {
  status: number;
  success: boolean;
  message: string;
  data: VirtualAccountTransaction[];
};

export type GetMerchantTransactionsResponse = GetCustomerTransactionsResponse;

// ─── Filtered Merchant Transactions ──────────────────────────────────────────

export interface GetMerchantTransactionsAllParams {
  page: number;
  perPage: number;
  virtualAccount?: number;
  customerIdentifier?: string;
  startDate?: string;
  endDate?: string;
  transactionReference?: string;
  session_id?: string;
  dir?: "ASC" | "DESC";
}

export interface GetMerchantTransactionsAllResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    rows: VirtualAccountTransaction[];
  };
}

// ─── Customer Lookup ──────────────────────────────────────────────────────────

export interface CustomerByVirtualAccountData {
  first_name: string;
  last_name: string;
  mobile_num: string;
  email: string;
  customer_identifier: string;
  virtual_account_number: string;
}

export interface GetCustomerByVirtualAccountResponse {
  status: number;
  success: boolean;
  message: string;
  data: CustomerByVirtualAccountData;
}

export interface CustomerByIdentifierData {
  first_name: string;
  last_name: string;
  bank_code: string;
  virtual_account_number: string;
  customer_identifier: string;
  created_at: string;
  updated_at: string;
}

export interface GetCustomerByIdentifierResponse {
  status: number;
  success: boolean;
  message: string;
  data: CustomerByIdentifierData;
}

// ─── Merchant Accounts ────────────────────────────────────────────────────────

export interface GetMerchantAccountsParams {
  page?: string;
  perPage?: string;
  startDate?: string;
  EndDate?: string;
}

export interface MerchantAccountRecord {
  bank_code: string;
  virtual_account_number: string;
  beneficiary_account: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    first_name: string;
    last_name: string;
    customer_identifier: string;
  };
}

export interface GetMerchantAccountsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    rows: MerchantAccountRecord[];
  };
}

// ─── Simulate Payment ─────────────────────────────────────────────────────────

export interface SimulatePaymentPayload {
  virtual_account_number: string;
  amount: string;
  dva?: boolean;
}

export interface SimulatePaymentResponse {
  status: number;
  success: boolean;
  message: string;
  data: Record<string, unknown>;
}

// ─── Dynamic Virtual Accounts ─────────────────────────────────────────────────

export interface CreateDynamicVirtualAccountPayload {
  first_name?: string;
  last_name?: string;
  beneficiary_account?: number;
}

export interface InitiateDynamicVAPayload {
  amount: number;
  duration: number;
  email: string;
  transaction_ref: string;
}

export interface InitiateDynamicVAData {
  is_blocked: boolean;
  account_name: string;
  account_number: string;
  expected_amount: number;
  expires_at: string;
  transaction_reference: string;
  bank: string;
  currency: string;
}

export interface InitiateDynamicVAResponse {
  status: number;
  success: boolean;
  message: string;
  data: InitiateDynamicVAData;
}

export interface DynamicVATransactionRow {
  transaction_status: "EXPIRED" | "SUCCESS" | "MISMATCH";
  transaction_reference: string;
  created_at: string;
  refund: unknown | null;
}

export interface GetDynamicVATransactionsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    rows: DynamicVATransactionRow[];
  };
}

export interface UpdateDynamicVAPayload {
  transaction_reference: string;
  amount: number;
  duration: number;
}

export interface UpdateDynamicVAData {
  account_number: string;
  currency: string;
  amount: number;
  expires_at: string;
  transaction_reference: string;
}

export interface UpdateDynamicVAResponse {
  status: number;
  success: boolean;
  message: string;
  data: UpdateDynamicVAData;
}

// ─── Account Lookup ───────────────────────────────────────────────────────────

export interface AccountLookupPayload {
  bank_code: string;
  account_number: string;
}

export interface AccountLookupData {
  account_name: string;
  account_number: string;
}

export interface AccountLookupResponse {
  status: number;
  success: boolean;
  message: string;
  data: AccountLookupData;
}

// ─── Fund Transfer ────────────────────────────────────────────────────────────

export interface InitiateTransferPayload {
  transaction_reference: string;
  amount: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  currency_id: string;
  remark: string;
}

export interface InitiateTransferData {
  transaction_reference: string;
  response_description: string;
  currency_id: string;
  amount: string;
  nip_transaction_reference: string;
  account_number: string;
  account_name: string;
  destination_institution_name: string;
}

export interface InitiateTransferResponse {
  status: number;
  success: boolean;
  message: string;
  data: InitiateTransferData;
}

// ─── Re-query Transfer ────────────────────────────────────────────────────────

export interface RequeryTransferPayload {
  transaction_reference: string;
}

export interface RequeryTransferData {
  remark: string;
  bank_code: string;
  currency_id: string;
  amount: string;
  account_number: string;
  transaction_reference: string;
  account_name: string;
}

export interface RequeryTransferResponse {
  status: number;
  success: boolean;
  message: string;
  data: RequeryTransferData;
}

// ─── Get All Transfers ────────────────────────────────────────────────────────

export interface GetAllTransfersParams {
  page: number;
  perPage: number;
  dir: "ASC" | "DESC";
}

export interface TransferRecord {
  account_number_credited: string;
  amount_debited: string;
  total_amount_debited: string;
  success: boolean;
  recipient: string;
  bank_code: string;
  transaction_reference: string;
  transaction_status: "success" | "pending" | "failed";
  switch_transaction: string | null;
}

export interface GetAllTransfersData {
  count: number;
  rows: TransferRecord[];
}

export interface GetAllTransfersResponse {
  status: number;
  success: boolean;
  message: string;
  data: GetAllTransfersData;
}

// ─── Ledger Balance ───────────────────────────────────────────────────────────

export interface GetBalanceData {
  balance: string;
  currency_id: string;
  merchant_id: string;
}

export interface GetBalanceResponse {
  status: number;
  success: boolean;
  message: string;
  data: GetBalanceData;
}

// ─── Banks ────────────────────────────────────────────────────────────────────

export interface Bank {
  bank_code: string;
  bank_name: string;
  nip_code?: string;
  [key: string]: unknown;
}

export interface GetBanksResponse {
  status: number;
  success: boolean;
  message: string;
  data: Bank[];
}

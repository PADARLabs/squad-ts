// ─── Airtime ──────────────────────────────────────────────────────────────────

export interface PurchaseAirtimePayload {
  phone_number: string;
  amount: number;
}

export interface VasTransactionData {
  reference: string;
  amount: number;
  merchant_amount: number;
  phone_number: string;
  merchant_id: string;
  wallet_batch_id: string;
  transaction_id: string;
  type: "airtime" | "data";
  action: "debit";
  status: "success" | "pending" | "failed";
  meta: Record<string, unknown> | null;
  createdAt: string;
}

export interface PurchaseAirtimeResponse {
  status: number;
  success: boolean;
  message: string;
  data: VasTransactionData;
}

// ─── Data Bundles ─────────────────────────────────────────────────────────────

export interface PurchaseDataPayload {
  phone_number: string;
  plan_code: string;
  amount: number;
}

export interface PurchaseDataResponse {
  status: number;
  success: boolean;
  message: string;
  data: VasTransactionData;
}

export type MobileNetwork = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";

export interface DataBundle {
  plan_name: string;
  bundle_value: string;
  bundle_validity: string;
  bundle_description: string;
  bundle_price: number;
  plan_code: string;
  network: MobileNetwork;
}

export interface GetDataBundlesResponse {
  status: number;
  success: boolean;
  message: string;
  data: DataBundle[];
}

// ─── Electricity ─────────────────────────────────────────────────────────────

export interface ElectricityProvider {
  code: string;
  name: string;
  logo_url: string | null;
}

export interface GetElectricityProvidersResponse {
  status: number;
  success: boolean;
  message: string;
  data: ElectricityProvider[];
}

export interface LookupMeterPayload {
  meter_no: string;
  meter_type: "prepaid" | "postpaid";
  provider: string;
}

export interface LookupMeterData {
  reference: string;
  customer_name: string;
  minimum_vend: number;
  account_type: string;
  outstanding_debt: string;
  address: string;
  meter_type: string;
  provider: string;
}

export interface LookupMeterResponse {
  status: number;
  success: boolean;
  message: string;
  data: LookupMeterData;
}

export interface PurchaseElectricityPayload {
  reference: string;
  amount: number;
  phone_number: string;
  email: string;
}

export interface ElectricityTransactionData {
  reference: string;
  amount: string;
  merchant_amount: string;
  phone_number: string;
  email: string;
  merchant_id: string;
  wallet_batch_id: string;
  value_reference: string;
  type: "electricity";
  action: "debit";
  status: "success" | "pending" | "failed";
  meta: string;
  meta_json: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseElectricityResponse {
  status: number;
  success: boolean;
  message: string;
  data: ElectricityTransactionData;
}

// ─── VAS Transactions ─────────────────────────────────────────────────────────

export interface GetVasTransactionsParams {
  page: number;
  perPage: number;
  action?: string;
  reference?: string;
  sorted_by?: string;
  date_from?: string;
  date_to?: string;
}

export interface GetVasTransactionsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    rows: VasTransactionData[];
  };
}

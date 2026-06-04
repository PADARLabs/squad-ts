// ─── Aggregator / Sub-merchants ───────────────────────────────────────────────

export interface CreateSubMerchantPayload {
  display_name: string;
  account_name: string;
  account_number: string;
  bank_code: string;
  bank: string;
}

export interface CreateSubMerchantData {
  account_id: string;
}

export interface CreateSubMerchantResponse {
  status: number;
  success: boolean;
  message: string;
  data: CreateSubMerchantData;
}

// ─── Initiate Refund ──────────────────────────────────────────────────────────

export interface InitiateRefundPayload {
  gateway_transaction_ref: string;
  transaction_ref: string;
  refund_type: "Full" | "Partial";
  reason_for_refund: string;
  refund_amount?: string;
}

export interface InitiateRefundData {
  gateway_refund_status: string;
  refund_status: number;
  refund_reference: string;
}

export interface InitiateRefundResponse {
  status: number;
  success: boolean;
  message: string;
  data: InitiateRefundData;
}

// ─── Get All Refunds ──────────────────────────────────────────────────────────

export interface GetAllRefundsParams {
  page?: number;
  perPage?: number;
  dir?: "ASC" | "DESC";
}

export interface RefundRecord {
  refund_reference: string;
  transaction_ref: string;
  gateway_transaction_ref: string;
  refund_type: string;
  reason_for_refund: string;
  refund_amount: string | null;
  refund_status: number;
  gateway_refund_status: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllRefundsData {
  count: number;
  rows: RefundRecord[];
}

export interface GetAllRefundsResponse {
  status: number;
  success: boolean;
  message: string;
  data: GetAllRefundsData;
}

// ─── Update Refund ────────────────────────────────────────────────────────────

export interface UpdateRefundPayload {
  gateway_transaction_ref: string;
  action: "accept" | "decline";
}

export interface UpdateRefundResponse {
  status: number;
  success: boolean;
  message: string;
  data: RefundRecord;
}

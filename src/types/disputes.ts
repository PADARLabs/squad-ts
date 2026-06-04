// ─── Disputes ─────────────────────────────────────────────────────────────────

export interface DisputeRecord {
  ticket_id: string;
  merchant_id: string;
  transaction_ref: string;
  amount: number;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface GetAllDisputesResponse {
  status: number;
  success: boolean;
  message: string;
  data: DisputeRecord[];
}

// ─── Upload URL ───────────────────────────────────────────────────────────────

export interface GetUploadUrlResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    upload_url: string;
    [key: string]: unknown;
  };
}

// ─── Resolve Dispute ──────────────────────────────────────────────────────────

export interface ResolveDisputePayload {
  action: "rejected" | "accepted";
  file_name: string;
}

export interface ResolveDisputeResponse {
  status: number;
  success: boolean;
  message: string;
  data: DisputeRecord | null;
}

// ─── SMS Bucket ───────────────────────────────────────────────────────────────

export interface CreateBucketPayload {
  name: string;
  description: string;
  file_name: string;
}

export interface BucketData {
  uuid: string;
  status: string;
  name: string;
  description: string;
  merchant_id: string;
  size: number | null;
  file_url: string | null;
  estimated_cost: number | null;
  headers: unknown | null;
  meta: unknown | null;
  signed_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBucketResponse {
  status: number;
  success: boolean;
  message: string;
  data: BucketData;
}

export interface GetAllBucketsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    rows: BucketData[];
  };
}

export interface DeleteBucketResponse {
  status: number;
  success: boolean;
  message: string;
  data: BucketData;
}

// ─── SMS Template ─────────────────────────────────────────────────────────────

export interface CreateTemplatePayload {
  name: string;
  description: string;
  message: string;
}

export interface TemplateData {
  uuid: string;
  merchant_id: string;
  name: string;
  description: string;
  pages: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateResponse {
  status: number;
  success: boolean;
  message: string;
  data: TemplateData;
}

export interface GetTemplatesParams {
  page?: number;
  perPage?: number;
  sorted_by?: string;
  dir?: "ASC" | "DESC";
  date_from?: string;
  date_to?: string;
}

export interface GetAllTemplatesResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    rows: TemplateData[];
  };
}

export interface UpdateTemplatePayload {
  name?: string;
  description?: string;
  message?: string;
}

// ─── SMS Messages / Campaigns ─────────────────────────────────────────────────

export interface SmsMessage {
  phone_number: string;
  message: string;
}

export interface SendMessagePayload {
  sender_id: string;
  messages: SmsMessage[];
}

export interface SentMessageRecord {
  phone_number: string;
  status: string;
  cost: number;
  transaction_id: string;
}

export interface SendMessageData {
  batch_id: string;
  sent: SentMessageRecord[];
  errors: unknown[];
  total_cost: number;
  currency: string;
}

export interface SendMessageResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    data: SendMessageData;
  };
}

export interface CreateCampaignPayload {
  name: string;
  bucket_id: string;
  sender_id: string;
  is_scheduled: boolean;
  scheduled_for?: string;
  template_id: string;
}

export interface CampaignData {
  uuid: string;
  name: string;
  cost: string;
  scheduled_for: string;
  status: string;
  merchant_id: string;
  createdAt: string;
  updatedAt: string;
  bucket_id: string;
  sender_id: string;
  template_id: string;
}

export interface CampaignResponse {
  status: number;
  success: boolean;
  message: string;
  data: CampaignData;
}

export interface GetCampaignsParams {
  page?: number;
  perPage?: number;
  sorted_by?: string;
  status?: "pending" | "failed" | "success";
  name?: string;
  dir?: "ASC" | "DESC";
  date_from?: string;
  date_to?: string;
}

export interface GetAllCampaignsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    rows: CampaignData[];
  };
}

// ─── Payment Links ────────────────────────────────────────────────────────────

export interface CreatePaymentLinkPayload {
  name: string;
  hash?: string;
  description?: string;
  amount?: number;
  redirect_link?: string;
  support_email?: string;
  is_recurring?: boolean;
  frequency?: number;
  start_date?: string;
  end_date?: string;
  expire_by?: string;
  currency_id?: string;
  custom_fields?: Array<{
    label: string;
    is_required: boolean;
    type: "text" | "number" | "date" | "phone";
  }>;
}

export interface UpdatePaymentLinkPayload extends Partial<CreatePaymentLinkPayload> {
  link_id?: string;
}

export interface PaymentLink {
  id: string;
  name: string;
  hash: string;
  link_status: number;
  description: string | null;
  amount: number | null;
  redirect_link: string | null;
  support_email: string | null;
  is_recurring: boolean;
  currency_id: string;
  created_at: string;
  updated_at: string;
  checkout_url?: string;
}

export interface PaymentLinkResponse {
  status: number;
  success: boolean;
  message: string;
  data: PaymentLink;
}

export interface GetAllPaymentLinksResponse {
  status: number;
  success: boolean;
  message: string;
  data: PaymentLink[];
}

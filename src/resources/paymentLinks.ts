import { SquadClient } from "../client.js";
import type {
  CreatePaymentLinkPayload,
  UpdatePaymentLinkPayload,
  PaymentLinkResponse,
  GetAllPaymentLinksResponse,
} from "../types/index.js";

export class PaymentLinks extends SquadClient {
  async create(payload: CreatePaymentLinkPayload): Promise<PaymentLinkResponse> {
    return this.post<PaymentLinkResponse>("/payment_link/otp", payload);
  }

  async update(id: string, payload: UpdatePaymentLinkPayload): Promise<PaymentLinkResponse> {
    return this.patch<PaymentLinkResponse>(
      `/payment_link/${encodeURIComponent(id)}`,
      payload,
    );
  }

  async getAll(): Promise<GetAllPaymentLinksResponse> {
    return this.get<GetAllPaymentLinksResponse>("/payment_link/otp");
  }

  async getOne(id: string): Promise<PaymentLinkResponse> {
    return this.get<PaymentLinkResponse>(`/payment_link/details/${encodeURIComponent(id)}`);
  }

  async toggleStatus(id: string): Promise<PaymentLinkResponse> {
    return this.patch<PaymentLinkResponse>(
      `/payment_link/${encodeURIComponent(id)}/toggle_status`,
    );
  }
}

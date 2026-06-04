import { SquadClient } from "../client.js";
import type {
  CreateMandatePayload,
  CreateMandateResponse,
  DebitMandatePayload,
  DebitMandateResponse,
  CancelMandatePayload,
  CancelMandateResponse,
  GetMandateResponse,
  GetDirectDebitBanksResponse,
} from "../types/index.js";

export class DirectDebit extends SquadClient {
  async getBanks(): Promise<GetDirectDebitBanksResponse> {
    return this.post<GetDirectDebitBanksResponse>("/transaction/mandate/banklists");
  }

  async createMandate(payload: CreateMandatePayload): Promise<CreateMandateResponse> {
    return this.post<CreateMandateResponse>("/transaction/mandate/create", payload);
  }

  async debitMandate(payload: DebitMandatePayload): Promise<DebitMandateResponse> {
    return this.post<DebitMandateResponse>("/transaction/mandate/debit", payload);
  }

  async cancelMandate(payload: CancelMandatePayload): Promise<CancelMandateResponse> {
    return this.post<CancelMandateResponse>("/transaction/mandate/cancel", payload);
  }

  async getMandate(reference: string): Promise<GetMandateResponse> {
    return this.get<GetMandateResponse>(
      `/transaction/mandate/get-mandates/${encodeURIComponent(reference)}`,
    );
  }
}

import { SquadClient } from "../client.js";
import type {
  InitiateRefundPayload,
  InitiateRefundResponse,
  GetAllRefundsParams,
  GetAllRefundsResponse,
  UpdateRefundPayload,
  UpdateRefundResponse,
} from "../types/index.js";

export class Refunds extends SquadClient {
  async initiate(payload: InitiateRefundPayload): Promise<InitiateRefundResponse> {
    return this.post<InitiateRefundResponse>("/transaction/refund", payload);
  }

  async getAll(params?: GetAllRefundsParams): Promise<GetAllRefundsResponse> {
    return this.get<GetAllRefundsResponse>("/transaction/refund", { params });
  }

  async update(payload: UpdateRefundPayload): Promise<UpdateRefundResponse> {
    return this.patch<UpdateRefundResponse>("/transaction/refund", payload);
  }
}

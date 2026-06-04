import { SquadClient } from "../client.js";
import type {
  GetAllDisputesResponse,
  GetUploadUrlResponse,
  ResolveDisputePayload,
  ResolveDisputeResponse,
} from "../types/index.js";

export class Disputes extends SquadClient {
  async getAll(): Promise<GetAllDisputesResponse> {
    return this.get<GetAllDisputesResponse>("/dispute");
  }

  async getUploadUrl(ticket_id: string, file_name: string): Promise<GetUploadUrlResponse> {
    return this.get<GetUploadUrlResponse>(
      `/dispute/upload-url/${encodeURIComponent(ticket_id)}/${encodeURIComponent(file_name)}`,
    );
  }

  async resolve(ticket_id: string, payload: ResolveDisputePayload): Promise<ResolveDisputeResponse> {
    return this.get<ResolveDisputeResponse>(
      `/dispute/${encodeURIComponent(ticket_id)}/resolve`,
      { params: payload },
    );
  }
}

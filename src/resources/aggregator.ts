import { SquadClient } from "../client.js";
import type {
  CreateSubMerchantPayload,
  CreateSubMerchantResponse,
} from "../types/index.js";

export class Aggregator extends SquadClient {
  async createSubMerchant(payload: CreateSubMerchantPayload): Promise<CreateSubMerchantResponse> {
    return this.post<CreateSubMerchantResponse>("/merchant/create-sub-users", payload);
  }
}

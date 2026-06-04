import { SquadClient } from "../client.js";
import type {
  CreateBucketPayload,
  CreateBucketResponse,
  GetAllBucketsResponse,
  DeleteBucketResponse,
  CreateTemplatePayload,
  TemplateResponse,
  GetTemplatesParams,
  GetAllTemplatesResponse,
  UpdateTemplatePayload,
  SendMessagePayload,
  SendMessageResponse,
  CreateCampaignPayload,
  CampaignResponse,
  GetCampaignsParams,
  GetAllCampaignsResponse,
} from "../types/index.js";

export class Sms extends SquadClient {
  // ─── Buckets ──────────────────────────────────────────────────────────────

  async createBucket(payload: CreateBucketPayload): Promise<CreateBucketResponse> {
    return this.post<CreateBucketResponse>("/sms/bucket", payload);
  }

  async getAllBuckets(): Promise<GetAllBucketsResponse> {
    return this.get<GetAllBucketsResponse>("/sms/bucket");
  }

  async deleteBucket(uuid: string): Promise<DeleteBucketResponse> {
    return this.post<DeleteBucketResponse>(`/sms/bucket/${encodeURIComponent(uuid)}`);
  }

  // ─── Templates ────────────────────────────────────────────────────────────

  async createTemplate(payload: CreateTemplatePayload): Promise<TemplateResponse> {
    return this.post<TemplateResponse>("/sms/template", payload);
  }

  async getAllTemplates(params?: GetTemplatesParams): Promise<GetAllTemplatesResponse> {
    return this.get<GetAllTemplatesResponse>("/sms/template", { params });
  }

  async updateTemplate(id: string, payload: UpdateTemplatePayload): Promise<TemplateResponse> {
    return this.patch<TemplateResponse>(`/sms/template/${encodeURIComponent(id)}`, payload);
  }

  async deleteTemplate(id: string): Promise<{ message: string }> {
    return this.post<{ message: string }>(`/sms/template/${encodeURIComponent(id)}`);
  }

  // ─── Messages ─────────────────────────────────────────────────────────────

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    return this.post<SendMessageResponse>("/sms/send/instant", payload);
  }

  // ─── Campaigns ────────────────────────────────────────────────────────────

  async createCampaign(payload: CreateCampaignPayload): Promise<CampaignResponse> {
    return this.post<CampaignResponse>("/sms/campaign", payload);
  }

  async getAllCampaigns(params?: GetCampaignsParams): Promise<GetAllCampaignsResponse> {
    return this.get<GetAllCampaignsResponse>("/sms/campaign", { params });
  }

  async deleteCampaign(id: string): Promise<{ message: string }> {
    return this.post<{ message: string }>(`/sms/campaign/${encodeURIComponent(id)}`);
  }
}

import { SquadClient } from "../client.js";
import type {
  CreateSubscriptionPlanPayload,
  UpdateSubscriptionPlanPayload,
  SubscriptionPlanResponse,
  GetAllSubscriptionPlansResponse,
  CustomerSubscriptionPayload,
  CancelSubscriptionPayload,
  SubscriptionResponse,
  GetAllSubscriptionsResponse,
} from "../types/index.js";

export class Recurring extends SquadClient {
  async createSubscriptionPlan(
    payload: CreateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlanResponse> {
    return this.post<SubscriptionPlanResponse>("/subscription-plan", payload);
  }

  async updateSubscriptionPlan(
    payload: UpdateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlanResponse> {
    return this.patch<SubscriptionPlanResponse>("/subscription-plan", payload);
  }

  async getAllSubscriptionPlans(): Promise<GetAllSubscriptionPlansResponse> {
    return this.get<GetAllSubscriptionPlansResponse>("/subscription-plan");
  }

  async getSubscriptionPlan(plan_code: string): Promise<SubscriptionPlanResponse> {
    return this.get<SubscriptionPlanResponse>(
      `/subscription-plan/${encodeURIComponent(plan_code)}`,
    );
  }

  async customerSubscription(
    payload: CustomerSubscriptionPayload,
  ): Promise<SubscriptionResponse> {
    return this.post<SubscriptionResponse>("/subscription", payload);
  }

  async cancelSubscription(payload: CancelSubscriptionPayload): Promise<SubscriptionResponse> {
    return this.post<SubscriptionResponse>("/subscription/cancel", payload);
  }

  async getAllSubscriptions(): Promise<GetAllSubscriptionsResponse> {
    return this.get<GetAllSubscriptionsResponse>("/subscription");
  }

  async getSubscription(subscription_code: string): Promise<SubscriptionResponse> {
    return this.get<SubscriptionResponse>(
      `/subscription/${encodeURIComponent(subscription_code)}`,
    );
  }
}

// ─── Subscription Plans ───────────────────────────────────────────────────────

export interface CreateSubscriptionPlanPayload {
  name: string;
  amount: number;
  interval: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  description?: string;
  currency?: string;
}

export interface UpdateSubscriptionPlanPayload {
  plan_code: string;
  name?: string;
  amount?: number;
  interval?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  description?: string;
}

export interface SubscriptionPlan {
  plan_code: string;
  name: string;
  amount: number;
  interval: string;
  description: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanResponse {
  status: number;
  success: boolean;
  message: string;
  data: SubscriptionPlan;
}

export interface GetAllSubscriptionPlansResponse {
  status: number;
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
}

// ─── Customer Subscriptions ───────────────────────────────────────────────────

export interface CustomerSubscriptionPayload {
  plan_code: string;
  email: string;
  token_id: string;
}

export interface CancelSubscriptionPayload {
  subscription_code: string;
  email: string;
  token_id: string;
}

export interface Subscription {
  subscription_code: string;
  plan_code: string;
  email: string;
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface SubscriptionResponse {
  status: number;
  success: boolean;
  message: string;
  data: Subscription;
}

export interface GetAllSubscriptionsResponse {
  status: number;
  success: boolean;
  message: string;
  data: Subscription[];
}

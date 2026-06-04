import { Squad } from "../src/index";
import { mockFetch } from "./helpers";

let squad: Squad;

beforeEach(() => {
  squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });
});

afterEach(() => jest.restoreAllMocks());

const PLAN_DATA = {
  plan_code: "PLAN_001",
  name: "Monthly Premium",
  amount: 5000,
  interval: "monthly",
  description: "Monthly premium plan",
  currency: "NGN",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

const SUB_DATA = {
  subscription_code: "SUB_001",
  plan_code: "PLAN_001",
  email: "user@example.com",
  status: "active",
  amount: 5000,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

describe("Recurring Payments", () => {
  describe("createSubscriptionPlan", () => {
    it("creates a new subscription plan", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: PLAN_DATA });

      const result = await squad.recurring.createSubscriptionPlan({
        name: "Monthly Premium",
        amount: 5000,
        interval: "monthly",
        description: "Monthly premium plan",
      });

      expect(result.data.plan_code).toBe("PLAN_001");
      expect(result.data.interval).toBe("monthly");
    });
  });

  describe("updateSubscriptionPlan", () => {
    it("updates an existing subscription plan", async () => {
      mockFetch(200, { status: 200, success: true, message: "Updated", data: { ...PLAN_DATA, name: "Monthly Premium Plus" } });

      const result = await squad.recurring.updateSubscriptionPlan({ plan_code: "PLAN_001", name: "Monthly Premium Plus" });
      expect(result.data.name).toBe("Monthly Premium Plus");
    });
  });

  describe("getAllSubscriptionPlans", () => {
    it("returns all subscription plans", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: [PLAN_DATA] });

      const result = await squad.recurring.getAllSubscriptionPlans();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].plan_code).toBe("PLAN_001");
    });
  });

  describe("getSubscriptionPlan", () => {
    it("returns a single plan by plan_code", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: PLAN_DATA });

      const result = await squad.recurring.getSubscriptionPlan("PLAN_001");
      expect(result.data.plan_code).toBe("PLAN_001");
    });
  });

  describe("customerSubscription", () => {
    it("subscribes a customer to a plan", async () => {
      mockFetch(200, { status: 200, success: true, message: "Subscribed", data: SUB_DATA });

      const result = await squad.recurring.customerSubscription({
        plan_code: "PLAN_001",
        email: "user@example.com",
        token_id: "TOKEN_001",
      });

      expect(result.data.subscription_code).toBe("SUB_001");
    });
  });

  describe("cancelSubscription", () => {
    it("cancels an active subscription", async () => {
      mockFetch(200, { status: 200, success: true, message: "Cancelled", data: { ...SUB_DATA, status: "cancelled" } });

      const result = await squad.recurring.cancelSubscription({
        subscription_code: "SUB_001",
        email: "user@example.com",
        token_id: "TOKEN_001",
      });

      expect(result.data.status).toBe("cancelled");
    });
  });

  describe("getAllSubscriptions", () => {
    it("returns all subscriptions", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: [SUB_DATA] });

      const result = await squad.recurring.getAllSubscriptions();
      expect(result.data).toHaveLength(1);
    });
  });

  describe("getSubscription", () => {
    it("returns a single subscription by code", async () => {
      mockFetch(200, { status: 200, success: true, message: "Success", data: SUB_DATA });

      const result = await squad.recurring.getSubscription("SUB_001");
      expect(result.data.subscription_code).toBe("SUB_001");
    });
  });
});

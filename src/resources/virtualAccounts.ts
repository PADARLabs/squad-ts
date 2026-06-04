import { SquadClient } from "../client.js";
import type {
  CreateCustomerVirtualAccountPayload,
  CreateCustomerVirtualAccountResponse,
  CreateBusinessVirtualAccountPayload,
  CreateBusinessVirtualAccountResponse,
  WebhookLogParams,
  GetWebhookLogsResponse,
  DeleteWebhookLogResponse,
  GetCustomerTransactionsResponse,
  GetMerchantTransactionsResponse,
  GetMerchantTransactionsAllParams,
  GetMerchantTransactionsAllResponse,
  GetCustomerByVirtualAccountResponse,
  GetCustomerByIdentifierResponse,
  GetMerchantAccountsParams,
  GetMerchantAccountsResponse,
  SimulatePaymentPayload,
  SimulatePaymentResponse,
  CreateDynamicVirtualAccountPayload,
  InitiateDynamicVAPayload,
  InitiateDynamicVAResponse,
  GetDynamicVATransactionsResponse,
  UpdateDynamicVAPayload,
  UpdateDynamicVAResponse,
} from "../types/index.js";

export class VirtualAccounts extends SquadClient {
  async create(
    payload: CreateCustomerVirtualAccountPayload,
  ): Promise<CreateCustomerVirtualAccountResponse> {
    return this.post<CreateCustomerVirtualAccountResponse>("/virtual-account", payload);
  }

  async createBusiness(
    payload: CreateBusinessVirtualAccountPayload,
  ): Promise<CreateBusinessVirtualAccountResponse> {
    return this.post<CreateBusinessVirtualAccountResponse>(
      "/virtual-account/business",
      payload,
    );
  }

  async getWebhookLogs(params: WebhookLogParams): Promise<GetWebhookLogsResponse> {
    return this.get<GetWebhookLogsResponse>("/virtual-account/webhook/logs", { params });
  }

  async deleteWebhookLog(transaction_ref: string): Promise<DeleteWebhookLogResponse> {
    return this.delete<DeleteWebhookLogResponse>(
      `/virtual-account/webhook/logs/${encodeURIComponent(transaction_ref)}`,
    );
  }

  async getCustomerTransactions(
    customer_identifier: string,
  ): Promise<GetCustomerTransactionsResponse> {
    return this.get<GetCustomerTransactionsResponse>(
      `/virtual-account/customer/transactions/${encodeURIComponent(customer_identifier)}`,
    );
  }

  async getMerchantTransactions(): Promise<GetMerchantTransactionsResponse> {
    return this.get<GetMerchantTransactionsResponse>("/virtual-account/merchant/transactions");
  }

  async getMerchantTransactionsFiltered(
    params: GetMerchantTransactionsAllParams,
  ): Promise<GetMerchantTransactionsAllResponse> {
    return this.get<GetMerchantTransactionsAllResponse>(
      "/virtual-account/merchant/transactions/all",
      { params },
    );
  }

  async getCustomerByVirtualAccount(
    virtual_account_number: string,
  ): Promise<GetCustomerByVirtualAccountResponse> {
    return this.get<GetCustomerByVirtualAccountResponse>(
      `/virtual-account/customer/${encodeURIComponent(virtual_account_number)}`,
    );
  }

  async getCustomerByIdentifier(
    customer_identifier: string,
  ): Promise<GetCustomerByIdentifierResponse> {
    return this.get<GetCustomerByIdentifierResponse>(
      `/virtual-account/${encodeURIComponent(customer_identifier)}`,
    );
  }

  async getMerchantAccounts(
    params?: GetMerchantAccountsParams,
  ): Promise<GetMerchantAccountsResponse> {
    return this.get<GetMerchantAccountsResponse>("/virtual-account/merchant/accounts", {
      params,
    });
  }

  async simulatePayment(payload: SimulatePaymentPayload): Promise<SimulatePaymentResponse> {
    return this.post<SimulatePaymentResponse>("/virtual-account/simulate/payment", payload);
  }

  // ─── Dynamic Virtual Accounts ─────────────────────────────────────────────

  async createDynamic(
    payload: CreateDynamicVirtualAccountPayload,
  ): Promise<CreateCustomerVirtualAccountResponse> {
    return this.post<CreateCustomerVirtualAccountResponse>(
      "/virtual-account/create-dynamic-virtual-account",
      payload,
    );
  }

  async initiateDynamic(
    payload: InitiateDynamicVAPayload,
  ): Promise<InitiateDynamicVAResponse> {
    return this.post<InitiateDynamicVAResponse>(
      "/virtual-account/initiate-dynamic-virtual-account",
      payload,
    );
  }

  async getDynamicTransactions(
    transaction_reference: string,
  ): Promise<GetDynamicVATransactionsResponse> {
    return this.get<GetDynamicVATransactionsResponse>(
      `/virtual-account/get-dynamic-virtual-account-transactions/${encodeURIComponent(transaction_reference)}`,
    );
  }

  async updateDynamic(payload: UpdateDynamicVAPayload): Promise<UpdateDynamicVAResponse> {
    return this.patch<UpdateDynamicVAResponse>(
      "/virtual-account/update-dynamic-virtual-account-time-and-amount",
      payload,
    );
  }
}

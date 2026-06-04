import { SquadClient } from "../client.js";
import type {
  PurchaseAirtimePayload,
  PurchaseAirtimeResponse,
  PurchaseDataPayload,
  PurchaseDataResponse,
  MobileNetwork,
  GetDataBundlesResponse,
  GetVasTransactionsParams,
  GetVasTransactionsResponse,
  GetElectricityProvidersResponse,
  LookupMeterPayload,
  LookupMeterResponse,
  PurchaseElectricityPayload,
  PurchaseElectricityResponse,
} from "../types/index.js";

export class Vas extends SquadClient {
  async purchaseAirtime(payload: PurchaseAirtimePayload): Promise<PurchaseAirtimeResponse> {
    return this.post<PurchaseAirtimeResponse>("/vending/purchase/airtime", payload);
  }

  async purchaseData(payload: PurchaseDataPayload): Promise<PurchaseDataResponse> {
    return this.post<PurchaseDataResponse>("/vending/purchase/data", payload);
  }

  async getDataBundles(network: MobileNetwork): Promise<GetDataBundlesResponse> {
    return this.get<GetDataBundlesResponse>("/vending/data-bundles", {
      params: { network },
    });
  }

  async getMobileNetworks(): Promise<{ networks: MobileNetwork[] }> {
    return { networks: ["MTN", "GLO", "AIRTEL", "9MOBILE"] };
  }

  async getTransactions(params: GetVasTransactionsParams): Promise<GetVasTransactionsResponse> {
    return this.get<GetVasTransactionsResponse>("/vending/transactions", { params });
  }

  async getElectricityProviders(): Promise<GetElectricityProvidersResponse> {
    return this.get<GetElectricityProvidersResponse>(
      "/vending/utilities/electricity/service-providers",
    );
  }

  async lookupMeter(payload: LookupMeterPayload): Promise<LookupMeterResponse> {
    return this.post<LookupMeterResponse>("/vending/utilities/electricity/lookup", payload);
  }

  async purchaseElectricity(
    payload: PurchaseElectricityPayload,
  ): Promise<PurchaseElectricityResponse> {
    return this.post<PurchaseElectricityResponse>("/vending/utilities/electricity", payload);
  }
}

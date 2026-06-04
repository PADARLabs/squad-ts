import { SquadError } from "./errors.js";

export type Environment = "live" | "sandbox";

export interface SquadClientConfig {
  secretKey: string;
  environment?: Environment;
  timeout?: number;
}

const BASE_URLS: Record<Environment, string> = {
  live: "https://api-d.squadco.com",
  sandbox: "https://sandbox-api-d.squadco.com",
};

export interface RequestConfig {
  params?: object;
}

export class SquadClient {
  private readonly baseURL: string;
  private readonly headers: Record<string, string>;
  private readonly timeout: number;
  public readonly environment: Environment;
  protected readonly secretKey: string;

  constructor(config: SquadClientConfig) {
    const { secretKey, environment = "live", timeout = 30000 } = config;

    if (!secretKey || typeof secretKey !== "string") {
      throw new Error("A valid secretKey is required");
    }

    this.secretKey = secretKey;
    this.environment = environment;
    this.timeout = timeout;
    this.baseURL = BASE_URLS[environment];
    this.headers = {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private buildURL(path: string, params?: object): string {
    const url = new URL(path, this.baseURL + "/");
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(method: string, path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildURL(path, config?.params);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: this.headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        throw new SquadError("Request timed out", 408);
      }
      throw new SquadError(
        err instanceof Error ? err.message : "Network error — check your connection",
        0,
      );
    }
    clearTimeout(timer);

    const data = (await response.json().catch(() => null)) as import("./errors.js").SquadErrorData | null;

    if (!response.ok) {
      const message = data?.message ?? `Squad API error: ${response.status}`;
      throw new SquadError(message, response.status, data);
    }

    return data as T;
  }

  protected get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("GET", path, undefined, config);
  }

  protected post<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>("POST", path, data, config);
  }

  protected patch<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>("PATCH", path, data, config);
  }

  protected delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("DELETE", path, undefined, config);
  }
}

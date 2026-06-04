import { Squad, SquadError } from "../src/index";
import { mockFetch, mockFetchNetworkError, mockFetchAbort } from "./helpers";

describe("SquadError", () => {
  it("is an instance of Error", () => {
    const err = new SquadError("Test error", 400);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(SquadError);
  });

  it("has name = SquadError", () => {
    const err = new SquadError("Test", 500);
    expect(err.name).toBe("SquadError");
  });

  it("stores statusCode and data", () => {
    const data = { code: "ERR_01", detail: "Something went wrong" };
    const err = new SquadError("Something went wrong", 422, data);
    expect(err.statusCode).toBe(422);
    expect(err.data).toEqual(data);
  });

  it("data defaults to null when not provided", () => {
    const err = new SquadError("Timeout", 408);
    expect(err.data).toBeNull();
  });
});

describe("SquadClient constructor", () => {
  it("throws when secretKey is missing", () => {
    expect(() => new Squad({ secretKey: "" })).toThrow("A valid secretKey is required");
  });
});

describe("SquadError from HTTP errors", () => {
  afterEach(() => jest.restoreAllMocks());

  it("wraps a 403 API error with statusCode and message", async () => {
    mockFetch(403, {
      status: 403,
      success: false,
      message: "API key is invalid. Key must start with sandbox_sk_",
    });

    const squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });

    try {
      await squad.payments.verify("BAD_REF");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(SquadError);
      expect((err as SquadError).statusCode).toBe(403);
      expect((err as SquadError).message).toContain("API key is invalid");
    }
  });

  it("wraps a network error", async () => {
    mockFetchNetworkError();

    const squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox" });

    try {
      await squad.payments.verify("NET_ERR");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(SquadError);
    }
  });

  it("wraps a timeout (abort) error", async () => {
    mockFetchAbort();

    const squad = new Squad({ secretKey: "sandbox_sk_test", environment: "sandbox", timeout: 100 });

    try {
      await squad.payments.verify("TIMEOUT");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(SquadError);
      expect((err as SquadError).statusCode).toBe(408);
    }
  });
});

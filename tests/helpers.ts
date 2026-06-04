export function mockFetch(status: number, body: unknown): jest.SpyInstance {
  return jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

export function mockFetchNetworkError(message = "fetch failed"): jest.SpyInstance {
  return jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error(message));
}

export function mockFetchAbort(): jest.SpyInstance {
  const err = new Error("The operation was aborted");
  err.name = "AbortError";
  return jest.spyOn(global, "fetch").mockRejectedValueOnce(err);
}

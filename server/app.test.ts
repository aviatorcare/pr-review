import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("health endpoint", () => {
  it("reports that the API is available", async () => {
    const server = app.listen(0);
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Expected a TCP server address");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    server.close();
  });
});

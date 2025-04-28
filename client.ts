import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

(async () => {
  const baseUrl = new URL("http://localhost:3000/mcp");
  let client: Client;

  try {
    // Try modern Streamable HTTP transport first
    const httpTransport = new StreamableHTTPClientTransport(baseUrl);
    client = new Client({ name: "streamable-client", version: "1.0.0" });
    await client.connect(httpTransport);
    console.log("Connected via Streamable HTTP");
  } catch {
    // Fallback to the older SSE transport if needed
    const sseTransport = new SSEClientTransport(baseUrl);
    client = new Client({ name: "sse-client", version: "1.0.0" });
    await client.connect(sseTransport);
    console.log("Connected via legacy SSE");
  }

  // Example: call the same 'add' tool
  const result = await client.callTool({
    name: "echo",
    arguments: { message:"hello this is message" },
  });
  console.log("Result:", result.content);
})();
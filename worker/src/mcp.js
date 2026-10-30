// Minimal stateless MCP (Streamable HTTP, JSON responses): free token basics + paid-route info.
import { CHAIN_NAMES, isAddr } from "./core.js";
import { basic } from "./basic.js";
const TOOLS = [
  { name: "token_basics", description: "Free, read-only: ERC-20 name, symbol, decimals, total supply, proxy/owner presence and number of DEX pools found for a token on " + CHAIN_NAMES.join(", ") + ". Live on-chain reads.",
    inputSchema: { type: "object", properties: { token: { type: "string", description: "ERC-20 contract address (0x)" }, chain: { type: "string", enum: CHAIN_NAMES, description: "default base" } }, required: ["token"] }, annotations: { readOnlyHint: true, openWorldHint: true } },
  { name: "token_snapshot_info", description: "How to buy the full snapshot (USD price, liquidity, top DEX pools, holder-concentration hints, risk flags) via x402 for 0.003 USDC on Base. Does not pay.", inputSchema: { type: "object", properties: {} }, annotations: { readOnlyHint: true } },
];
const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
const err = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });
async function handle(m, origin) {
  const { id, method, params } = m || {};
  if (id === undefined || id === null) return null;
  if (method === "initialize") return ok(id, { protocolVersion: (params && params.protocolVersion) || "2025-06-18", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "devx-token-snapshot", version: "1.0.0" }, instructions: "ERC-20 token snapshot on 7 EVM chains from on-chain DEX pools. Read-only; never asks for keys." });
  if (method === "ping") return ok(id, {});
  if (method === "tools/list") return ok(id, { tools: TOOLS });
  if (method === "tools/call") {
    const name = params && params.name, a = (params && params.arguments) || {};
    if (name === "token_snapshot_info") return ok(id, { content: [{ type: "text", text: `GET ${origin}/v1/snapshot?token=0x...&chain=base answers HTTP 402 (x402 v1 body + v2 PAYMENT-REQUIRED header): exact, Base USDC, 3000 units = 0.003 USDC. Settled only after a result is produced. Chains: ${CHAIN_NAMES.join(",")}. Docs ${origin}/openapi.json` }] });
    if (name === "token_basics") {
      const token = String(a.token || "").trim(), chain = String(a.chain || "base").toLowerCase();
      if (!isAddr(token) || !CHAIN_NAMES.includes(chain)) return ok(id, { isError: true, content: [{ type: "text", text: "token must be a 0x address and chain one of " + CHAIN_NAMES.join(",") }] });
      const r = await basic(chain, token, origin);
      return ok(id, { content: [{ type: "text", text: JSON.stringify(r) }], structuredContent: r, isError: !r.ok || undefined });
    }
    return err(id, -32602, "unknown tool");
  }
  return err(id, -32601, "method not found");
}
export async function mcp(req, origin) {
  const H = { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-expose-headers": "mcp-session-id" };
  if (req.method === "GET") return new Response(JSON.stringify({ name: "devx-token-snapshot", transport: "streamable-http (POST JSON-RPC)", tools: TOOLS.map((t) => t.name) }), { status: 200, headers: H });
  if (req.method !== "POST") return new Response(null, { status: 405, headers: H });
  let body; try { body = await req.json(); } catch { return new Response(JSON.stringify(err(null, -32700, "parse error")), { status: 400, headers: H }); }
  if (Array.isArray(body)) { const out = (await Promise.all(body.map((m) => handle(m, origin)))).filter(Boolean); return out.length ? new Response(JSON.stringify(out), { headers: H }) : new Response(null, { status: 202, headers: H }); }
  const r = await handle(body, origin);
  return r ? new Response(JSON.stringify(r), { headers: H }) : new Response(null, { status: 202, headers: H });
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { tokenBasics, tokenSnapshot, paidCallInfo, CHAIN_NAMES } from "./index.js";
const out = (r) => ({ content: [{ type: "text", text: JSON.stringify(r) }] });
const err = (e) => ({ isError: true, content: [{ type: "text", text: String(e.message || e) }] });
export function createServer() {
  const server = new McpServer({ name: "devx-token-snapshot", version: "1.0.0" }, { instructions: "ERC-20 token data on 7 EVM chains from on-chain reads. Read-only; never asks for keys." });
  const args = { token: z.string().regex(/^0x[0-9a-fA-F]{40}$/).describe("ERC-20 contract address"), chain: z.enum(CHAIN_NAMES).optional().describe("default: base") };
  server.tool("token_basics", "Free, read-only: name, symbol, decimals, total supply, owner and EIP-1967 proxy flags of an ERC-20 on " + CHAIN_NAMES.join(", ") + ", live from public RPCs.", args,
    async ({ token, chain }) => { try { return out(await tokenBasics(token, chain)); } catch (e) { return err(e); } });
  server.tool("token_snapshot", "Free, read-only, computed locally from public RPCs: USD price, FDV, DEX liquidity across Uniswap/Aerodrome/Velodrome/PancakeSwap/Sushi/QuickSwap/Trader Joe pools, top pools, holder-concentration hints and bytecode risk flags. Can be slow or rate-limited on public RPCs.", { ...args, pools: z.number().int().min(1).max(10).optional().describe("top pools to return, default 5") },
    async ({ token, chain, pools }) => { try { return out(await tokenSnapshot(token, chain, { pools })); } catch (e) { return err(e); } });
  server.tool("token_snapshot_info", "How to buy the same snapshot from the hosted, cached endpoint via x402 for 0.003 USDC on Base. Does not pay.", {}, async () => out(paidCallInfo()));
  return server;
}

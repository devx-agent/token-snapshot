import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { tokenBasics, tokenSnapshot, paidCallInfo, CHAIN_NAMES } from "./index.js";
const out = (r) => ({ content: [{ type: "text", text: JSON.stringify(r) }] });
const err = (e) => ({ isError: true, content: [{ type: "text", text: String(e.message || e) }] });
export function createServer() {
  const server = new McpServer({ name: "devx-token-snapshot", version: "2.0.0" }, { instructions: "ERC-20 token data on 7 EVM chains via the hosted DevX API. token_basics is free. token_snapshot costs 0.003 USDC per call via x402 on Base and pays only if X402_PRIVATE_KEY is set in this server's environment (cap 0.01 USDC); otherwise it returns the price quote." });
  const args = { token: z.string().regex(/^0x[0-9a-fA-F]{40}$/).describe("ERC-20 contract address"), chain: z.enum(CHAIN_NAMES).optional().describe("default: base") };
  server.tool("token_basics", "Free: name, symbol, decimals, total supply, owner and EIP-1967 proxy flags of an ERC-20 on " + CHAIN_NAMES.join(", ") + ".", args,
    async ({ token, chain }) => { try { return out(await tokenBasics(token, chain)); } catch (e) { return err(e); } });
  server.tool("token_snapshot", "Paid, 0.003 USDC (x402 on Base, from the wallet in X402_PRIVATE_KEY): USD price, FDV, DEX liquidity across Uniswap/Aerodrome/Velodrome/PancakeSwap/Sushi/QuickSwap/Trader Joe pools, top pools, holder-concentration hints and bytecode risk flags (mint, blacklist, fees, pause, proxy, owner). Without a key it returns the quote and does not pay.", { ...args, pools: z.number().int().min(1).max(10).optional().describe("top pools to return, default 5") },
    async ({ token, chain, pools }) => { try { return out(await tokenSnapshot(token, chain, { pools })); } catch (e) { return err(e); } });
  server.tool("token_snapshot_info", "Price, URL and payment details of the paid hosted call. Does not pay.", {}, async () => out(paidCallInfo()));
  return server;
}

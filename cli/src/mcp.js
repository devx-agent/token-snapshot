import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { tokenBasics, tokenSnapshot, paidCallInfo, CHAIN_NAMES, DEFAULT_BASE } from "./index.js";
export const VERSION = "2.1.0";
const out = (r) => ({ structuredContent: r, content: [{ type: "text", text: JSON.stringify(r) }] });
const err = (e) => ({ isError: true, content: [{ type: "text", text: String(e.message || e) }] });

export function createServer() {
  const server = new McpServer({ name: "devx-token-snapshot", version: VERSION }, {
    instructions: "ERC-20 token data on " + CHAIN_NAMES.join(", ") + " through the hosted DevX API (" + DEFAULT_BASE + "), which reads on-chain data only (DEX pool contracts and token contracts via public RPC). Use token_basics (free) to identify a token. Use token_snapshot (paid, 0.003 USDC per call via x402 on Base) for price, liquidity, pools and risk flags. token_snapshot pays only when X402_PRIVATE_KEY (or EVM_PRIVATE_KEY) is set in this server's environment, and never above 0.01 USDC per call; without a key it returns the price quote and pays nothing. token_snapshot_info returns payment details without paying.",
  });
  const args = {
    token: z.string().regex(/^0x[0-9a-fA-F]{40}$/).describe("ERC-20 contract address: 0x followed by 40 hex characters (not a symbol or name)."),
    chain: z.enum(CHAIN_NAMES).optional().describe("Chain the contract is deployed on. Default: base."),
  };

  server.registerTool("token_basics", {
    title: "Free ERC-20 token basics",
    description: [
      "Free: identifies an ERC-20 contract by returning its name, symbol, decimals and total supply, whether it has an owner() and whether it is an EIP-1967 proxy.",
      "Use it to confirm which token a contract address really is (for example before trading or listing it) or to get decimals for amount math. For price, liquidity and risk flags use token_snapshot.",
      "Read-only. The address is sent to the hosted DevX API, which reads the contract over public RPC at the latest block. No key, no payment.",
      "Returns: ok, chain, chain_id, block, token {address, name, symbol, decimals, total_supply as a decimal string}, has_owner, is_eip1967_proxy and full (URL of the paid snapshot). Errors if the address is not an ERC-20 on that chain.",
    ].join(" "),
    inputSchema: args,
    outputSchema: z.object({ ok: z.boolean().optional(), free_tier: z.string().optional(), chain: z.string(), chain_id: z.number(), block: z.number().optional(), token: z.object({ address: z.string(), name: z.string().nullable(), symbol: z.string().nullable(), decimals: z.number().nullable(), total_supply: z.string().nullable() }).passthrough(), has_owner: z.boolean().optional(), is_eip1967_proxy: z.boolean().optional(), full: z.string().optional() }).passthrough(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ token, chain }) => { try { return out(await tokenBasics(token, chain)); } catch (e) { return err(e); } });

  server.registerTool("token_snapshot", {
    title: "Token price, liquidity and risk snapshot (paid, 0.003 USDC)",
    description: [
      "Returns an on-chain market and risk snapshot of an ERC-20: USD price from its deepest DEX pool against wrapped native or stablecoins, FDV, total DEX liquidity, the top pools across Uniswap V2/V3, Aerodrome, Velodrome, PancakeSwap, Sushi, Camelot, QuickSwap, Trader Joe and Pangolin, holder-concentration hints (supply held in pools, burn address, the contract and the owner), and risk flags (proxy, owner, mint, blacklist, fee, pause or trading-switch functions in the bytecode, thin liquidity, price divergence between pools).",
      "Use it before buying, accepting or listing an unfamiliar token, or when an agent needs a price without a market-data API key. Data comes from contract reads only, so tokens with no DEX pool on the chosen chain have no price.",
      "Cost and side effects: this calls the hosted paid endpoint and costs 0.003 USDC per call via x402 on Base. It pays only if X402_PRIVATE_KEY (or EVM_PRIVATE_KEY) is set in this server's environment. It checks that the quote is USDC on Base, goes to the DevX wallet and is at most 0.01 USDC before signing. Without a key it pays nothing and returns {payment_required: true, url, quote, how_to_pay}.",
      "Risk flags are bytecode and liquidity heuristics, not an audit.",
    ].join(" "),
    inputSchema: { ...args, pools: z.number().int().min(1).max(10).optional().describe("How many top pools to include, 1-10. Default 5.") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ token, chain, pools }) => { try { return out(await tokenSnapshot(token, chain, { pools })); } catch (e) { return err(e); } });

  server.registerTool("token_snapshot_info", {
    title: "Price and payment details of the paid call",
    description: "Returns the URL template, HTTP methods, price (0.003 USDC), protocol (x402 exact, USDC on Base), supported chains, payee address and docs link of the paid token_snapshot endpoint, so an agent with its own x402 client can call it directly. Makes no network request and does not pay. Returns: url, method, price_usdc, protocol, chains, payTo, docs, pay_with_this_package.",
    inputSchema: {},
    outputSchema: { url: z.string(), method: z.string(), price_usdc: z.number(), protocol: z.string(), chains: z.array(z.string()), payTo: z.string(), docs: z.string(), pay_with_this_package: z.string() },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => out(paidCallInfo()));
  return server;
}

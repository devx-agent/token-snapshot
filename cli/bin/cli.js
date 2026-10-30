#!/usr/bin/env node
import { tokenBasics, tokenSnapshot, paidCallInfo, CHAIN_NAMES } from "../src/index.js";
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
if (args[0] === "mcp") {
  const { createServer } = await import("../src/mcp.js");
  const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
  await createServer().connect(new StdioServerTransport());
} else if (!args.length || args[0] === "-h" || args[0] === "--help") {
  process.stdout.write(`Usage:
  devx-token-snapshot <token> [--chain base]              free: name, symbol, decimals, supply, owner/proxy flags
  devx-token-snapshot full <token> [--chain base] [--pools 5]  price, FDV, liquidity, top pools, holder hints, risk flags (local, public RPCs)
  devx-token-snapshot paid-info                           URL/price of the hosted x402 call (does not pay)
  devx-token-snapshot mcp                                 run as an MCP server (stdio)
Chains: ${CHAIN_NAMES.join(",")}. Read-only, never asks for keys.
`);
} else if (args[0] === "paid-info") {
  process.stdout.write(JSON.stringify(paidCallInfo(), null, 2) + "\n");
} else {
  try {
    const r = args[0] === "full" ? await tokenSnapshot(args[1], opt("--chain"), { pools: opt("--pools") ? Number(opt("--pools")) : undefined }) : await tokenBasics(args[0], opt("--chain"));
    process.stdout.write(JSON.stringify(r, null, 2) + "\n");
  } catch (e) { process.stderr.write(e.message + "\n"); process.exitCode = 1; }
}

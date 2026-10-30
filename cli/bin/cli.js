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
  devx-token-snapshot <token> [--chain base]                 FREE: name, symbol, decimals, supply, owner/proxy flags
  devx-token-snapshot full <token> [--chain base] [--pools 5] [--max-usd 0.01]
                                                             PAID 0.003 USDC (x402, Base): USD price, FDV, DEX liquidity,
                                                             top pools, holder hints, risk flags
  devx-token-snapshot paid-info                              URL/price of the hosted paid call
  devx-token-snapshot mcp                                    run as an MCP server (stdio)
Paid calls use the key in X402_PRIVATE_KEY (or EVM_PRIVATE_KEY) of a Base wallet holding USDC.
Without a key, 'full' prints the price quote and does not pay. It never pays more than --max-usd (default 0.01).
Chains: ${CHAIN_NAMES.join(",")}. Data comes from the hosted API at token-snapshot.nextill-pos.workers.dev.
`);
} else if (args[0] === "paid-info") {
  process.stdout.write(JSON.stringify(paidCallInfo(), null, 2) + "\n");
} else {
  try {
    const r = args[0] === "full"
      ? await tokenSnapshot(args[1], opt("--chain"), { pools: opt("--pools") ? Number(opt("--pools")) : undefined, maxUsd: opt("--max-usd") ? Number(opt("--max-usd")) : 0.01 })
      : await tokenBasics(args[0], opt("--chain"));
    process.stdout.write(JSON.stringify(r, null, 2) + "\n");
    if (r && r.payment_required) process.exitCode = 2;
  } catch (e) { process.stderr.write(e.message + "\n"); process.exitCode = 1; }
}

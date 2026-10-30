# DevX Token Snapshot

**One call: what is this token, what is it worth, and is it risky?** For any ERC-20 on **Base, Ethereum, Arbitrum, Optimism, Polygon, Avalanche and BNB Chain** you get the USD price, FDV, DEX liquidity, top pools, holder-concentration hints and bytecode risk flags. It is built for AI agents and apps that need a quick token check without an API key or their own indexer.

Everything comes from on-chain reads (DEX factory lookups, pool state, contract bytecode and storage) through public RPCs. No third-party market API. It is read-only, never asks for keys and never moves funds.

| | What | Cost |
|---|---|---|
| **CLI / stdio MCP** `devx-token-snapshot` | Token basics, or the full snapshot (`full`), computed on your own machine from free public RPCs | free |
| **Remote MCP** `https://token-snapshot.nextill-pos.workers.dev/mcp` | `token_basics` (free) + `token_snapshot_info` | free |
| **HTTP API** `GET /v1/snapshot` | Full snapshot from the hosted endpoint: fallback RPCs, Multicall3, 20 s cache | 0.003 USDC via [x402](https://x402.org) on Base |

Live: https://token-snapshot.nextill-pos.workers.dev · DEX list: [/dexes.json](https://token-snapshot.nextill-pos.workers.dev/dexes.json) · OpenAPI: [/openapi.json](https://token-snapshot.nextill-pos.workers.dev/openapi.json)

## What a snapshot contains

- **token**: name, symbol, decimals, total supply, block number
- **price_usd** with its source pool, native coin USD price, **fdv_usd**
- **liquidity**: total USD across pools found, the number of pools found, and the DEXes and quote assets checked (25 factory/chain pairs, see /dexes.json: Uniswap v2/v3, Aerodrome + Slipstream, Velodrome v2 + Slipstream, PancakeSwap v2/v3, SushiSwap, QuickSwap, Camelot, Trader Joe, Pangolin; quotes are wrapped native and the major stablecoins)
- **top_pools**: dex, pool address, quote asset, depth in USD, price
- **holder_hints**: share of supply in DEX pools, burned, held by the token contract and held by the owner, and whether the owner is a contract
- **contract / risk**: owner, EIP-1967 proxy implementation and admin, and flags from a bytecode selector scan (mint, pause, blacklist, fee setters, max-tx limits, trading switch, upgradeable), plus a low/medium/high level

The risk flags are heuristics from bytecode and storage. They are not an audit, and a clean result does not mean a token is safe.

## CLI

```sh
npx devx-token-snapshot 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed                       # DEGEN basics on Base
npx devx-token-snapshot full 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed --pools 3          # full snapshot, local
npx devx-token-snapshot full 0x6982508145454Ce325dDbE47a25d4ec3d2311933 --chain ethereum  # PEPE on Ethereum
npx devx-token-snapshot paid-info
```

## MCP

Claude Desktop / Cursor (stdio):

```json
{ "mcpServers": { "token-snapshot": { "command": "npx", "args": ["-y", "devx-token-snapshot", "mcp"] } } }
```

Or remote (streamable HTTP): `https://token-snapshot.nextill-pos.workers.dev/mcp`

Tools: `token_basics` (free), `token_snapshot` (free, local, stdio only), `token_snapshot_info` (how to buy the hosted call; does not pay).

## Paid hosted call (x402)

```
GET https://token-snapshot.nextill-pos.workers.dev/v1/snapshot?token=0x...&chain=base[&pools=5]
POST https://token-snapshot.nextill-pos.workers.dev/v1/snapshot   {"token":"0x...","chain":"base","pools":5}
```

Unpaid requests get HTTP 402 with both an x402 v1 body (`network: base`, `maxAmountRequired: 3000`) and a v2 `PAYMENT-REQUIRED` header (`eip155:8453`). Pay with any x402 client, for example `@x402/fetch`, using your own wallet. Settlement goes through the Coinbase CDP facilitator and only happens after the snapshot has been produced. Input is checked before you are asked to pay. Free basics: `GET https://token-snapshot.nextill-pos.workers.dev/api/basic?token=0x...&chain=base`.

## Layout

- `cli/` npm package `devx-token-snapshot` (CLI + stdio MCP), `npm test`
- `worker/` the Cloudflare Worker behind the hosted endpoint (`npm run build`, `npm test`)

MIT. Made by DevX.

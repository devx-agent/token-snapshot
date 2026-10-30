import { facilitate, facilitatorConfig } from "../shared/facilitator.js";
import { CHAINS, CHAIN_NAMES, isAddr, snapshot } from "./core.js";
import { basic } from "./basic.js";
import PAGE from "./page.html";
import { mcp } from "./mcp.js";

const VERSION = "1.0.0";
const SERVICE = "DevX Token Snapshot";
const PAY_TO = "0xB3cDDccEe6B150c8efFD55B961afc0Ecefe7f247";
const FACILITATOR = "Coinbase CDP facilitator (api.cdp.coinbase.com/platform/v2/x402)";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const PRICE = "3000"; // 0.003 USDC per call
const ROUTE = "/v1/snapshot";
const SITE = "https://token-snapshot.nextill-pos.workers.dev";
const CACHE_TTL_MS = 20000;
const INDEX402 = "e911e865e95bfe897fd104e9da0ef761ebe72e865bccb07b1eb39f1b43901bb4";
const DESC = "ERC-20 token snapshot in one call on Base, Ethereum, Arbitrum, Optimism, Polygon, Avalanche, BNB Chain: USD price, FDV, total DEX liquidity, top pools (Uniswap V2/V3, Aerodrome, Velodrome, PancakeSwap, Sushi, QuickSwap, Trader Joe...), supply-in-pools/burn/owner holder hints, proxy/owner/mint/blacklist/fee risk flags. Live on-chain reads. 0.003 USDC.";
const TAGS = ["token", "price", "liquidity", "dex", "pools", "onchain-data", "erc20", "risk", "base", "multichain", "agents", "x402"];
const enc = new TextEncoder();
const b64 = (o) => btoa(String.fromCharCode(...enc.encode(JSON.stringify(o))));
const unb64 = (s) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0))));
const EXAMPLE = { ok: true, chain: "base", chain_id: 8453, block: 53300018, token: { address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", name: "Degen", symbol: "DEGEN", decimals: 18, total_supply: "35926644031.72809252" },
  price_usd: 0.000861418, price_source: { dex: "Uniswap V3", pool: "0xc9034c3e7f58003e6ae0c8438e7c8f4598d5acaa", pair: "DEGEN/WETH" }, native_usd: 2225.35, fdv_usd: 30947857.85,
  liquidity: { total_usd: 488574.5, pools_found: 26 }, top_pools: [{ dex: "Uniswap V3", pool: "0xc9034c3e7f58003e6ae0c8438e7c8f4598d5acaa", pair: "DEGEN/WETH", fee_bps: 30, price_usd: 0.000861418, liquidity_usd: 245630.73 }],
  holder_hints: { pct_supply_in_dex_pools: 0.8177, pct_burned_zero_dead: 0.0006, pct_held_by_token_contract: 0.0267, owner: "0x704ec5c12ca20a293c2c0b72b22619a4231f3c0d", owner_is_contract: true, pct_held_by_owner: 0.53 },
  risk: { level: "medium", flags: [{ id: "owner_active", level: "info", detail: "owner 0x704e... (contract, e.g. multisig/timelock)" }] } };
const QP = { token: "ERC-20 contract address (0x)", chain: CHAIN_NAMES.join(",") + " (default base)", pools: "number of top pools to return, 1-10 (default 5)" };

function requirements() { return { scheme: "exact", network: "eip155:8453", amount: PRICE, asset: USDC_BASE, payTo: PAY_TO, maxTimeoutSeconds: 120, extra: { name: "USD Coin", version: "2" } }; }
function advertised(resUrl) { return { ...requirements(), maxAmountRequired: PRICE, resource: resUrl, description: DESC, mimeType: "application/json" }; }
function paymentRequired(origin, error) {
  const resUrl = origin + ROUTE;
  return { x402Version: 2, error: error || "PAYMENT-SIGNATURE header is required",
    resource: { url: resUrl, description: DESC, mimeType: "application/json", serviceName: SERVICE, tags: TAGS },
    accepts: [advertised(resUrl)],
    extensions: { bazaar: { info: { input: { type: "http", method: "GET", discoverable: true, queryParams: { token: EXAMPLE.token.address, chain: "base" } }, output: { type: "json", example: EXAMPLE } },
      schema: { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object", properties: { input: { type: "object", properties: { type: { type: "string", const: "http" }, method: { type: "string", enum: ["GET"] }, discoverable: { type: "boolean" },
        queryParams: { type: "object", properties: { token: { type: "string", description: QP.token }, chain: { type: "string", description: QP.chain }, pools: { type: "string", description: QP.pools } }, required: ["token"] } }, required: ["type", "method"] }, output: { type: "object" } }, required: ["input"] } } } };
}
// X402_COMPAT_V1: serve x402 v1 body (network "base") + v2 PAYMENT-REQUIRED header; accept v1 X-PAYMENT and v2 PAYMENT-SIGNATURE; accept POST JSON.
function v1Requirements(resUrl) { return { scheme: "exact", network: "base", maxAmountRequired: PRICE, resource: resUrl, description: DESC, mimeType: "application/json", payTo: PAY_TO, maxTimeoutSeconds: 120, asset: USDC_BASE,
  outputSchema: { input: { type: "http", method: "GET", discoverable: true, queryParams: { token: { type: "string", required: true, description: QP.token }, chain: { type: "string", required: false, description: QP.chain }, pools: { type: "string", required: false, description: QP.pools } } }, output: { type: "object" } }, extra: { name: "USD Coin", version: "2" } }; }
function v1Body(pr) { return { x402Version: 1, error: (pr.error && pr.error !== "PAYMENT-SIGNATURE header is required") ? pr.error : "X-PAYMENT header is required (x402 v1) or PAYMENT-SIGNATURE (x402 v2, see PAYMENT-REQUIRED header)", accepts: [v1Requirements(pr.resource.url)], resource: pr.resource, extensions: pr.extensions }; }
function uaFamily(ua) { ua = (ua || "").toLowerCase(); for (const [k, re] of [["x402_sdk", /x402|coinbase|cdp|agentcash|payai/], ["monitor", /monitor|uptime|bot|crawl|spider|scan|probe|check/], ["python", /python|httpx|aiohttp/], ["curl", /curl|wget/], ["node", /node|undici|axios/], ["browser", /mozilla/]]) if (re.test(ua)) return k; return ua ? "other" : "none"; }
async function postToParams(req, url) {
  if (req.method !== "POST") return null;
  let b; try { b = await req.json(); } catch { return { error: "POST body must be JSON, e.g. {\"token\": \"0x..\", \"chain\": \"base\"}" }; }
  for (const [k, alts] of [["token", ["token", "tokenAddress", "address", "contract"]], ["chain", ["chain", "network"]], ["pools", ["pools"]]]) { for (const a of alts) if (b && b[a] != null) { url.searchParams.set(k, String(b[a])); break; } }
  return null;
}
const H = { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-expose-headers": "PAYMENT-REQUIRED, PAYMENT-RESPONSE, X-PAYMENT-RESPONSE" };
const J = (o, status = 200, h = {}) => new Response(JSON.stringify(o, null, 2), { status, headers: { ...H, ...h } });
let ENV = {};
async function facil(op, body) { const r = await facilitate(ENV, op, body); r._st = r._status; delete r._status; if (!r.isValid && !r.success) console.log(JSON.stringify({ ev: "facil_" + op, st: r._st, r: JSON.stringify(r).slice(0, 300) })); return r; }
const ALIAS = { eth: "ethereum", mainnet: "ethereum", "eip155:1": "ethereum", "eip155:8453": "base", arb: "arbitrum", "arbitrum-one": "arbitrum", op: "optimism", matic: "polygon", pol: "polygon", avax: "avalanche", bnb: "bsc", binance: "bsc", "bnb-chain": "bsc" };
function parseQ(url) {
  const token = (url.searchParams.get("token") || url.searchParams.get("address") || url.searchParams.get("tokenAddress") || "").trim();
  if (!token) return { error: "token query parameter required (ERC-20 0x address)" };
  if (!isAddr(token)) return { error: "token must be a 0x + 40 hex ERC-20 address" };
  let chain = (url.searchParams.get("chain") || url.searchParams.get("network") || "base").toLowerCase().trim(); chain = ALIAS[chain] || chain;
  if (!CHAINS[chain]) return { error: "unsupported chain: " + chain.slice(0, 30) + " (use " + CHAIN_NAMES.join(",") + ")" };
  let pools = parseInt(url.searchParams.get("pools") || "5", 10); if (!(pools >= 1 && pools <= 10)) pools = 5;
  return { token, chain, pools };
}
const CACHE = new Map();
async function cachedSnapshot(chain, token, pools) {
  const k = chain + ":" + token.toLowerCase() + ":" + pools, c = CACHE.get(k);
  if (c && Date.now() - c.t < CACHE_TTL_MS) return { ...c.v, cache: { hit: true, age_s: Math.round((Date.now() - c.t) / 1000) } };
  const v = await snapshot(chain, token, { pools }); if (v.ok) { CACHE.set(k, { t: Date.now(), v }); if (CACHE.size > 500) CACHE.delete(CACHE.keys().next().value); }
  return { ...v, cache: { hit: false } };
}
const TERMS = `${SERVICE} - Terms of Service (v${VERSION}, effective 2026-10-30)
Operator: DevX / Made by DevX (madebydevx.com), contact madebydevx@gmail.com.
1. Service. Read-only lookup of public blockchain state. GET ${ROUTE}?token=0x..&chain=base (paid) returns token metadata, a USD price derived from the deepest DEX pool against the chain's wrapped native coin or major stablecoins, pool liquidity, the top pools, holder-concentration hints (share of supply in the pools found, at burn addresses, in the token contract, at the owner) and heuristic risk flags (proxy, owner, mint/blacklist/fee/pause functions found in bytecode, thin liquidity). Data comes only from public JSON-RPC nodes (publicnode.com with fallbacks) reading DEX factory and pool contracts directly; no third-party market-data API is used. Pools on DEXes or quote assets we do not check are not counted. Results may be cached up to ${CACHE_TTL_MS / 1000} s (marked cache.hit). GET /api/basic?token=..&chain=base (free) returns token basics only.
2. Price. 0.003 USDC per paid call, x402 "exact" on Base, paid to ${PAY_TO}, settled through ${FACILITATOR}.
3. Not charged on error. Payment is settled only after a result is produced; invalid input or RPC failure returns an error without settlement.
4. Refunds. If you were charged but got no result, email madebydevx@gmail.com with the Base tx hash within 30 days; verified cases are refunded in USDC on Base.
5. Not financial advice. Prices are spot pool prices, liquidity is an estimate, risk flags are heuristics, not an audit. No flags does not mean safe.
6. Data. We do not store queried tokens beyond Cloudflare's standard request logs.
7. Changes. Material changes bump the version; the price in the live 402 response is authoritative.`;
function docs(origin) {
  return { openapi: "3.1.0", info: { title: SERVICE, version: VERSION, description: DESC, termsOfService: origin + "/terms", contact: { name: "DevX", email: "madebydevx@gmail.com", url: "https://madebydevx.com" } },
    servers: [{ url: origin }],
    paths: {
      "/api/basic": { get: { summary: "Free: ERC-20 basics (name, symbol, decimals, supply, owner/proxy presence)", parameters: [{ name: "token", in: "query", required: true, schema: { type: "string" } }, { name: "chain", in: "query", required: false, schema: { type: "string", enum: CHAIN_NAMES, default: "base" } }], responses: { 200: { description: "result" } } } },
      [ROUTE]: { get: { summary: "Paid (0.003 USDC, x402): token price, liquidity, top DEX pools, holder hints, risk flags", parameters: [{ name: "token", in: "query", required: true, schema: { type: "string" }, description: QP.token }, { name: "chain", in: "query", required: false, schema: { type: "string", enum: CHAIN_NAMES, default: "base" } }, { name: "pools", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 10, default: 5 } }],
        "x-payment-info": { protocol: "x402", x402Version: 2, scheme: "exact", network: "eip155:8453", asset: USDC_BASE, amount: PRICE, price_usd: 0.003, payTo: PAY_TO, facilitator: FACILITATOR },
        responses: { 200: { description: "snapshot" }, 402: { description: "Payment required (x402 v1 body + v2 PAYMENT-REQUIRED header)" } } } } } };
}
const DEXLIST = () => Object.fromEntries(Object.entries(CHAINS).map(([c, C]) => [c, { chain_id: C.id, dexes: C.dexes.map(([n, t, f]) => ({ name: n, type: t, factory: f })), quote_assets: [C.wnative, ...C.stables, ...(C.extraQuotes || [])].map(([s, a]) => ({ symbol: s, address: a })) }]));

export default {
  async fetch(req, env) {
    ENV = env || {};
    const url = new URL(req.url), origin = url.origin, p = url.pathname;
    if (req.method === "OPTIONS") return new Response(null, { headers: { ...H, "access-control-allow-headers": "*", "access-control-allow-methods": "GET, HEAD, POST, OPTIONS" } });
    if (p === "/") return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
    if (p === "/index.json") return J({ service: SERVICE, version: VERSION, by: "Made by DevX (madebydevx.com)", free: origin + "/api/basic?token=0x...&chain=base", paid: origin + ROUTE + "?token=0x...&chain=base[&pools=5]", price_usdc: 0.003, chains: CHAIN_NAMES, cache_ttl_s: CACHE_TTL_MS / 1000, protocol: "x402 (v1 X-PAYMENT and v2 PAYMENT-SIGNATURE), USDC on Base", payTo: PAY_TO, docs: origin + "/openapi.json", dexes: origin + "/dexes.json", mcp: origin + "/mcp", terms: origin + "/terms", description: DESC });
    if (p === "/robots.txt") return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { "content-type": "text/plain" } });
    if (p === "/sitemap.xml") return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}/</loc><lastmod>2026-10-30</lastmod></url></urlset>`, { headers: { "content-type": "application/xml" } });
    if (p === "/llms.txt") return new Response(`# ${SERVICE}
> One call = ERC-20 token USD price, FDV, total DEX liquidity, top pools, holder-concentration hints and basic risk flags on Base, Ethereum, Arbitrum, Optimism, Polygon, Avalanche, BNB Chain. Read directly from DEX factory/pool contracts via public RPC (no third-party market API). 0.003 USDC via x402 on Base.
- Paid API (x402): GET /v1/snapshot?token=0x...&chain=base[&pools=5]  (POST JSON {"token","chain"} also accepted)
- Free API: GET /api/basic?token=0x...&chain=base (name, symbol, decimals, supply, owner/proxy presence)
- DEXes + quote assets checked: /dexes.json  - OpenAPI: /openapi.json  - MCP: ${SITE}/mcp  - Terms: /terms
- Related: https://wallet-balances.nextill-pos.workers.dev (multichain wallet balances), https://address-poisoning-check.nextill-pos.workers.dev
`, { headers: { "content-type": "text/plain; charset=utf-8" } });
    if (p === "/.well-known/402index-verify.txt" && INDEX402) return new Response(INDEX402, { headers: { "content-type": "text/plain" } });
    if (p === "/terms") return new Response(TERMS, { headers: { "content-type": "text/plain; charset=utf-8", "access-control-allow-origin": "*" } });
    if (p === "/openapi.json") return J(docs(origin));
    if (p === "/dexes.json") return J(DEXLIST());
    if (p === "/.well-known/x402") return J({ version: 1, resources: [origin + ROUTE], description: SERVICE });
    if (p === "/.well-known/x402.json") return J({ x402Version: 2, name: SERVICE, provider: "Made by DevX (madebydevx.com)", resources: [{ url: origin + ROUTE, method: "GET", description: DESC, accepts: [requirements()] }] });
    if (p === "/mcp") return mcp(req, origin);
    if (p === "/.well-known/mcp.json" || p === "/.well-known/mcp/server-card.json") return J({ name: "devx-token-snapshot", description: "ERC-20 token price, liquidity, top pools, holder hints, risk flags on 7 EVM chains", url: origin + "/mcp", transport: "streamable-http", tools: ["token_basics", "token_snapshot_info"], provider: "Made by DevX" });
    if (p === "/health") return J({ ok: true, version: VERSION, facilitator: facilitatorConfig(ENV).name });
    if (p === "/api/basic") {
      const q = parseQ(url); if (q.error) return J({ error: q.error }, 400);
      const r = await basic(q.chain, q.token, origin); return J(r, r.ok ? 200 : /RPC/.test(r.error) ? 503 : 400);
    }
    if (p === "/api/diag") { // free liveness check: snapshot of the chain's own wrapped native token only (fixed input)
      let c = (url.searchParams.get("chain") || "base").toLowerCase(); c = ALIAS[c] || c; if (!CHAINS[c]) return J({ error: "chain must be one of " + CHAIN_NAMES.join(",") }, 400);
      try { const r = await cachedSnapshot(c, CHAINS[c].wnative[1], 3); return J({ chain: c, ok: r.ok, token: r.token && r.token.symbol, price_usd: r.price_usd, pools_found: r.liquidity && r.liquidity.pools_found, elapsed_ms: r.elapsed_ms, error: r.error }); } catch (e) { return J({ chain: c, ok: false, error: String(e.message || e).slice(0, 300) }, 503); }
    }
    if (p !== ROUTE) return J({ error: "not found", see: origin + "/index.json" }, 404);
    if (!["GET", "HEAD", "POST"].includes(req.method)) return J({ error: "use GET (or POST JSON)" }, 405);
    { const pe = await postToParams(req, url); if (pe && pe.error) return J({ error: pe.error }, 400); }
    const pr = paymentRequired(origin);
    const parsed = parseQ(url);
    const sig = req.headers.get("PAYMENT-SIGNATURE") || req.headers.get("X-PAYMENT");
    console.log(JSON.stringify({ ev: "paid_route", m: req.method, pay: sig ? (req.headers.get("X-PAYMENT") ? "x-payment" : "payment-signature") : null, ua: uaFamily(req.headers.get("user-agent")) }));
    if (!sig) return J(v1Body(pr), 402, { "PAYMENT-REQUIRED": b64(pr) });
    if (parsed.error) return J({ error: parsed.error + " (you were not charged)" }, 400);
    let payload; try { payload = unb64(sig); } catch { return J({ ...pr, error: "malformed PAYMENT-SIGNATURE" }, 400, { "PAYMENT-REQUIRED": b64(pr) }); }
    const reqs = requirements(), isV1 = payload.x402Version === 1 || (!payload.accepted && !!payload.network);
    const acc = isV1 ? { network: (payload.network === "base" || payload.network === "eip155:8453") ? reqs.network : payload.network, payTo: payload.payload?.authorization?.to, amount: String(payload.payload?.authorization?.value ?? ""), asset: USDC_BASE } : (payload.accepted || {});
    const fReq = isV1 ? v1Requirements(pr.resource.url) : reqs, fPay = isV1 ? { ...payload, x402Version: 1, scheme: "exact", network: "base" } : payload, fv = isV1 ? 1 : 2;
    console.log(JSON.stringify({ ev: "pay_attempt", v: fv, ua: uaFamily(req.headers.get("user-agent")) }));
    if ((!isV1 && payload.x402Version !== 2) || acc.network !== reqs.network || acc.payTo?.toLowerCase() !== PAY_TO.toLowerCase() || acc.amount !== reqs.amount || acc.asset?.toLowerCase() !== USDC_BASE.toLowerCase())
      return J({ ...(isV1 ? v1Body(pr) : pr), error: "payment does not match requirements (exact, Base USDC " + PRICE + " atomic to " + PAY_TO + ")" }, 402, { "PAYMENT-REQUIRED": b64(pr) });
    const v = await facil("verify", { x402Version: fv, paymentPayload: fPay, paymentRequirements: fReq });
    if (!v.isValid) { console.log(JSON.stringify({ ev: "pay_invalid", v: fv, r: v.invalidReason || "unknown" })); return J({ ...(isV1 ? v1Body(pr) : pr), error: "payment invalid: " + (v.invalidReason || v.errorMessage || v.message || v.error || ("facilitator status " + (v._st || "?"))) }, 402, { "PAYMENT-REQUIRED": b64(pr) }); }
    let report; try { report = await cachedSnapshot(parsed.chain, parsed.token, parsed.pools); } catch (e) { return J({ error: "RPC error, you were not charged: " + String(e.message || e).slice(0, 120) }, 503); }
    if (!report.ok) return J({ error: report.error + " (you were not charged)" }, 400);
    const s = await facil("settle", { x402Version: fv, paymentPayload: fPay, paymentRequirements: fReq });
    const PRH = b64(isV1 ? { success: !!s.success, transaction: s.transaction || "", network: "base", payer: s.payer || payload.payload?.authorization?.from || "" } : s);
    console.log(JSON.stringify({ ev: s.success ? "paid" : "settle_fail", v: fv }));
    if (!s.success) return J({ ...pr, error: "settlement failed: " + (s.errorReason || "unknown") + " (result withheld, not charged)" }, 402, { "PAYMENT-REQUIRED": b64(pr), "PAYMENT-RESPONSE": PRH, "X-PAYMENT-RESPONSE": PRH });
    return J({ service: SERVICE, version: VERSION, ...report, payment: { tx: s.transaction || null, network: s.network || "eip155:8453", x402Version: fv } }, 200, { "PAYMENT-RESPONSE": PRH, "X-PAYMENT-RESPONSE": PRH });
  },
};

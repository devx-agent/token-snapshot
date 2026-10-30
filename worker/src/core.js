// DevX Token Snapshot - core. 100% on-chain: DEX factory lookups + pool state + token contract reads via public JSON-RPC.
// No third-party price/market APIs are used.
export const CHAINS = {
  base: { id: 8453, native: "ETH", rpcs: ["https://base-rpc.publicnode.com", "https://mainnet.base.org", "https://base.drpc.org", "https://base.gateway.tenderly.co", "https://1rpc.io/base"],
    wnative: ["WETH", "0x4200000000000000000000000000000000000006", 18],
    stables: [["USDC", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", 6], ["USDbC", "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", 6], ["USDT", "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", 6]],
    dexes: [["Uniswap V3", "v3", "0x33128a8fC17869897dcE68Ed026d694621f6FDfD"], ["Uniswap V2", "v2", "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6"],
      ["Aerodrome", "solidly", "0x420DD381b31aEf6683db6B902084cB0FFECe40Da"], ["Aerodrome Slipstream", "cl", "0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A"], ["PancakeSwap V3", "v3p", "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865"]] },
  ethereum: { id: 1, native: "ETH", rpcs: ["https://eth.drpc.org", "https://ethereum-rpc.publicnode.com", "https://gateway.tenderly.co/public/mainnet", "https://eth-mainnet.public.blastapi.io", "https://eth.llamarpc.com"],
    wnative: ["WETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 18],
    stables: [["USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 6], ["USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7", 6], ["DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F", 18]],
    dexes: [["Uniswap V3", "v3", "0x1F98431c8aD98523631AE4a59f267346ea31F984"], ["Uniswap V2", "v2", "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"], ["SushiSwap V2", "v2", "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"]] },
  arbitrum: { id: 42161, native: "ETH", rpcs: ["https://arb1.arbitrum.io/rpc", "https://arbitrum-one-rpc.publicnode.com", "https://arbitrum.drpc.org", "https://arbitrum.gateway.tenderly.co"],
    wnative: ["WETH", "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", 18],
    stables: [["USDC", "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", 6], ["USDC.e", "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", 6], ["USDT", "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", 6]],
    dexes: [["Uniswap V3", "v3", "0x1F98431c8aD98523631AE4a59f267346ea31F984"], ["Uniswap V2", "v2", "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9"], ["SushiSwap V2", "v2", "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"], ["Camelot V2", "v2", "0x6EcCab422D763aC031210895C81787E87B43A652"]] },
  optimism: { id: 10, native: "ETH", rpcs: ["https://optimism-rpc.publicnode.com", "https://mainnet.optimism.io", "https://optimism.drpc.org", "https://optimism.gateway.tenderly.co"],
    wnative: ["WETH", "0x4200000000000000000000000000000000000006", 18],
    stables: [["USDC", "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", 6], ["USDC.e", "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", 6], ["USDT", "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", 6]],
    dexes: [["Uniswap V3", "v3", "0x1F98431c8aD98523631AE4a59f267346ea31F984"], ["Velodrome V2", "solidly", "0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a"], ["Velodrome Slipstream", "cl", "0xCc0bDDB707055e04e497aB22a59c2aF4391cd12F"], ["Uniswap V2", "v2", "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf"]] },
  polygon: { id: 137, native: "POL", rpcs: ["https://polygon.drpc.org", "https://polygon-bor-rpc.publicnode.com", "https://polygon.gateway.tenderly.co", "https://polygon-rpc.com"],
    wnative: ["WPOL", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", 18],
    stables: [["USDC", "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", 6], ["USDC.e", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", 6], ["USDT", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", 6]],
    extraQuotes: [["WETH", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", 18]],
    dexes: [["Uniswap V3", "v3", "0x1F98431c8aD98523631AE4a59f267346ea31F984"], ["QuickSwap V2", "v2", "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"], ["SushiSwap V2", "v2", "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"]] },
  avalanche: { id: 43114, native: "AVAX", rpcs: ["https://avalanche-c-chain-rpc.publicnode.com/ext/bc/C/rpc", "https://api.avax.network/ext/bc/C/rpc", "https://avalanche.drpc.org"],
    wnative: ["WAVAX", "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", 18],
    stables: [["USDC", "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", 6], ["USDT", "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", 6], ["USDC.e", "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", 6]],
    dexes: [["Uniswap V3", "v3", "0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD"], ["Trader Joe V1", "v2", "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10"], ["Pangolin", "v2", "0xefa94DE7a4656D787667C749f7E1223D71E9FD88"]] },
  bsc: { id: 56, native: "BNB", rpcs: ["https://bsc-rpc.publicnode.com", "https://bsc-dataseed.bnbchain.org", "https://bsc.drpc.org"],
    wnative: ["WBNB", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", 18],
    stables: [["USDT", "0x55d398326f99059fF775485246999027B3197955", 18], ["USDC", "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", 18]],
    dexes: [["PancakeSwap V3", "v3p", "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865"], ["PancakeSwap V2", "v2", "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"], ["Uniswap V3", "v3", "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7"]] },
};
export const CHAIN_NAMES = Object.keys(CHAINS);
export const isAddr = (a) => /^0x[0-9a-fA-F]{40}$/.test(a || "");
const FEES = { v3: [100, 500, 3000, 10000], v3p: [100, 500, 2500, 10000] }, TICKS = [1, 50, 100, 200, 2000];
const ZERO = "0x0000000000000000000000000000000000000000", DEAD = "0x000000000000000000000000000000000000dEaD";
const IMPL_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc", ADMIN_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
const pad = (a) => a.toLowerCase().replace(/^0x/, "").padStart(64, "0");
const u = (n) => BigInt(n).toString(16).padStart(64, "0");
const i24 = (n) => (n < 0 ? (1n << 256n) + BigInt(n) : BigInt(n)).toString(16).padStart(64, "0");
const word = (hex, i) => { const h = (hex || "0x").slice(2 + i * 64, 2 + (i + 1) * 64); return h.length === 64 ? BigInt("0x" + h) : null; };
const addrOf = (hex) => { const w = word(hex, 0); return w == null ? null : "0x" + w.toString(16).padStart(40, "0").slice(-40); };
export function fmt(raw, dec) { const s = raw.toString().padStart(dec + 1, "0"); const i = s.slice(0, s.length - dec), f = s.slice(s.length - dec).replace(/0+$/, ""); return f ? i + "." + f.slice(0, 8) : i; }
const num = (raw, dec) => Number(raw) / 10 ** dec;
const r6 = (x) => (x == null || !isFinite(x) ? null : Number(x.toPrecision(6)));
const usd = (x) => (x == null || !isFinite(x) ? null : Math.round(x * 100) / 100);
function decStr(hex) {
  const h = (hex || "0x").slice(2); if (!h) return null;
  try { if (h.length === 64) return new TextDecoder().decode(Uint8Array.from(h.match(/../g).map((b) => parseInt(b, 16))).filter((b) => b)).replace(/[^\x20-\x7e]/g, "").trim() || null;
    const off = parseInt(h.slice(0, 64), 16) * 2, len = parseInt(h.slice(off, off + 64), 16), d = h.slice(off + 64, off + 64 + len * 2);
    return new TextDecoder().decode(Uint8Array.from((d.match(/../g) || []).map((b) => parseInt(b, 16)))).replace(/[^\x20-\x7e]/g, "").slice(0, 48) || null; } catch { return null; } }

export async function rpcBatch(chain, calls, ms = 4000) {
  const body = JSON.stringify(calls.map((c, i) => ({ jsonrpc: "2.0", id: i, method: c[0], params: c[1] })));
  let lastErr;
  for (const url of CHAINS[chain].rpcs) {
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), ms);
    try { const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body, signal: ctl.signal });
      const j = await r.json(); if (!Array.isArray(j)) throw new Error("non-batch reply");
      const out = []; for (const x of j) out[x.id] = x;
      if (out.some((x) => x && x.error && /rate|limit|capacity|too many|batch|free plan|not allowed/i.test(x.error.message || ""))) throw new Error("rate limited");
      if (out.length < calls.length || out.filter(Boolean).length < calls.length) throw new Error("incomplete batch");
      return { res: out, rpc: new URL(url).host };
    } catch (e) { lastErr = new Error(new URL(url).host + ": " + String(e.message || e).slice(0, 60) + (lastErr ? "; " + lastErr.message : "")); } finally { clearTimeout(tm); }
  }
  throw lastErr || new Error("rpc failed");
}
// Multicall3 aggregate3 (same address on all supported chains): many eth_calls in ONE eth_call, so RPC batch limits do not matter.
const MC3 = "0xcA11bde05977b3631167028862bE2a173976CA11";
function encAggregate3(calls) { // calls: [to, data]
  const n = calls.length, heads = [], tails = []; let off = n * 32;
  for (const [to, data] of calls) { const d = data.slice(2), len = d.length / 2, padded = d.padEnd(Math.ceil(len / 32) * 64, "0");
    const t = pad(to) + u(1) + u(96) + u(len) + padded; heads.push(u(off)); tails.push(t); off += t.length / 2; }
  return "0x82ad56cb" + u(32) + u(n) + heads.join("") + tails.join("");
}
function decAggregate3(hex) {
  const h = hex.slice(2), W = (i) => BigInt("0x" + h.slice(i * 2, i * 2 + 64));
  const base = Number(W(0)), n = Number(W(base)), out = [];
  for (let i = 0; i < n; i++) { const e = base + 32 + Number(W(base + 32 + i * 32)); const okb = W(e) === 1n; const bo = e + Number(W(e + 32)); const len = Number(W(bo));
    out.push(okb ? { result: "0x" + h.slice((bo + 32) * 2, (bo + 32 + len) * 2) } : { error: { message: "reverted" } }); }
  return out;
}
async function batched(chain, calls, size = 120) { // calls: ["eth_call", [{to,data},"latest"]]
  const parts = []; for (let i = 0; i < calls.length; i += size) parts.push(calls.slice(i, i + size));
  const rs = await Promise.all(parts.map(async (p) => { const { res, rpc } = await rpcBatch(chain, [["eth_call", [{ to: MC3, data: encAggregate3(p.map((c) => [c[1][0].to, c[1][0].data])) }, "latest"]]], 6000);
    if (!res[0] || res[0].error || !res[0].result || res[0].result === "0x") throw new Error("multicall failed: " + String(res[0]?.error?.message || "empty").slice(0, 60));
    return { res: decAggregate3(res[0].result), rpc }; }));
  return { res: rs.flatMap((r) => r.res), rpc: rs[0]?.rpc };
}
const call = (to, data) => ["eth_call", [{ to, data }, "latest"]];
const ok = (r) => r && !r.error && r.result && r.result !== "0x";

function quotesFor(C) { return [{ sym: C.wnative[0], address: C.wnative[1], dec: C.wnative[2], kind: "native" }, ...C.stables.map(([s, a, d]) => ({ sym: s, address: a, dec: d, kind: "stable" })), ...(C.extraQuotes || []).map(([s, a, d]) => ({ sym: s, address: a, dec: d, kind: "extra" }))]; }
function lookups(C, token, quotes) {
  const out = [];
  for (const [dex, type, f] of C.dexes) for (const q of quotes) {
    if (q.address.toLowerCase() === token.toLowerCase()) continue;
    const ab = pad(token) + pad(q.address);
    if (type === "v3" || type === "v3p") for (const fee of FEES[type]) out.push({ dex, type: "v3", q, fee, c: call(f, "0x1698ee82" + ab + u(fee)) });
    else if (type === "v2") out.push({ dex, type: "v2", q, c: call(f, "0xe6a43905" + ab) });
    else if (type === "solidly") for (const st of [false, true]) out.push({ dex, type: "v2", q, stable: st, c: call(f, "0x79bc57d5" + ab + u(st ? 1 : 0)) });
    else if (type === "cl") for (const t of TICKS) out.push({ dex, type: "v3", q, tick: t, c: call(f, "0x28af8d0b" + ab + i24(t)) });
  }
  return out;
}
// read state of discovered pools: token0, price source, balances of both sides
async function readPools(chain, token, found) {
  const calls = [];
  for (const p of found) { calls.push(call(p.pool, "0x0dfe1681")); calls.push(call(p.pool, p.type === "v3" ? "0x3850c7bd" : "0x0902f1ac"));
    calls.push(call(token, "0x70a08231" + pad(p.pool))); calls.push(call(p.q.address, "0x70a08231" + pad(p.pool))); }
  if (!calls.length) return [];
  const { res } = await batched(chain, calls);
  return found.map((p, i) => {
    const [t0, st, bt, bq] = res.slice(i * 4, i * 4 + 4);
    if (!ok(t0) || !ok(st)) return null;
    const tokenIs0 = addrOf(t0.result).toLowerCase() === token.toLowerCase();
    return { ...p, tokenIs0, state: st.result, balToken: ok(bt) ? word(bt.result, 0) : 0n, balQuote: ok(bq) ? word(bq.result, 0) : 0n };
  }).filter(Boolean);
}
// price of token in quote units (human), from pool state
function poolPrice(p, dec, qdec) {
  if (p.type === "v3") { const sp = word(p.state, 0); if (!sp) return null; const r = (Number(sp) / 2 ** 96) ** 2; // token1 per token0 (raw)
    const p01 = r * 10 ** ((p.tokenIs0 ? dec : qdec) - (p.tokenIs0 ? qdec : dec)); return p.tokenIs0 ? p01 : 1 / p01; }
  const r0 = word(p.state, 0), r1 = word(p.state, 1); if (!r0 || !r1) return null;
  const rt = p.tokenIs0 ? r0 : r1, rq = p.tokenIs0 ? r1 : r0;
  if (p.stable) return null; // stableswap curve: reserves ratio is not the price
  return num(rq, qdec) / num(rt, dec);
}
async function discover(chain, token) {
  const C = CHAINS[chain], quotes = quotesFor(C), L = lookups(C, token, quotes);
  const { res } = await batched(chain, L.map((x) => x.c));
  return L.map((x, i) => ({ ...x, pool: ok(res[i]) ? addrOf(res[i].result) : null })).filter((x) => x.pool && x.pool !== ZERO).map(({ c, ...x }) => x);
}
// native (wrapped) USD price from its deepest stablecoin pool on the chain
async function nativeUsd(chain) {
  const C = CHAINS[chain], w = C.wnative[1];
  const found = (await discover(chain, w)).filter((p) => p.q.kind === "stable");
  const pools = await readPools(chain, w, found);
  let best = null;
  for (const p of pools) { const px = poolPrice(p, C.wnative[2], p.q.dec), depth = num(p.balQuote, p.q.dec); if (px && depth > 1000 && (!best || depth > best.depth)) best = { px, depth, pool: p.pool, dex: p.dex }; }
  return best;
}
const NAT = new Map();
async function nativeUsdCached(chain) { const c = NAT.get(chain); if (c && Date.now() - c.t < 30000) return c.v; const v = await nativeUsd(chain); NAT.set(chain, { t: Date.now(), v }); return v; }

const SELECTORS = { mint: ["40c10f19", "a0712d68"], pause: ["8456cb59"], blacklist: ["f9f92be4", "44337ea1", "fe575a87", "0ecb93c0", "153b0d1e", "455a4396"],
  fee_setter: ["69fe0e2d", "0b78f9c0", "c647b20e", "0cc835a3", "8b4cee08", "437823ec"], max_tx_limits: ["ec28438a", "ea1644d5"], trading_switch: ["c2e5ec04", "8a8c523c", "c9567bf9"], upgrade: ["3659cfe6", "4f1ef286"] };
function codeHas(code, sel) { return code.includes("63" + sel); } // PUSH4 <selector> in the function dispatcher

export async function meta(chain, token) {
  const [mc, raw] = await Promise.all([
    batched(chain, [call(token, "0x06fdde03"), call(token, "0x95d89b41"), call(token, "0x313ce567"), call(token, "0x18160ddd"), call(token, "0x8da5cb5b"), call(token, "0x893d20e8"),
      call(token, "0x70a08231" + pad(ZERO)), call(token, "0x70a08231" + pad(DEAD)), call(token, "0x70a08231" + pad(token))]),
    rpcBatch(chain, [["eth_getCode", [token, "latest"]], ["eth_getStorageAt", [token, IMPL_SLOT, "latest"]], ["eth_getStorageAt", [token, ADMIN_SLOT, "latest"]]])]);
  const r = mc.res, q = raw.res;
  if (q[0]?.error) throw new Error("rpc error: " + String(q[0].error.message).slice(0, 80));
  const code = q[0]?.result || "0x";
  if (code === "0x") return { error: "no contract at " + token + " on " + chain };
  if (!ok(r[2]) || !ok(r[3])) return { error: "not an ERC-20 (decimals/totalSupply failed) at " + token + " on " + chain };
  const decimals = Number(word(r[2].result, 0)); if (!(decimals >= 0 && decimals <= 36)) return { error: "unsupported decimals" };
  const owner = ok(r[4]) && r[4].result.length >= 66 ? addrOf(r[4].result) : ok(r[5]) && r[5].result.length >= 66 ? addrOf(r[5].result) : null;
  const impl = q[1]?.result ? addrOf(q[1].result) : null, admin = q[2]?.result ? addrOf(q[2].result) : null;
  let block = null; try { const b = await rpcBatch(chain, [["eth_blockNumber", []]]); block = parseInt(b.res[0].result, 16); } catch {}
  return { name: decStr(r[0]?.result), symbol: decStr(r[1]?.result), decimals, totalSupply: word(r[3].result, 0), owner, code, rpc: raw.rpc,
    impl: impl && impl !== ZERO ? impl : null, admin: admin && admin !== ZERO ? admin : null, block,
    burned: (ok(r[6]) ? word(r[6].result, 0) : 0n) + (ok(r[7]) ? word(r[7].result, 0) : 0n), selfHeld: ok(r[8]) ? word(r[8].result, 0) : 0n };
}

export async function snapshot(chain, token, opts = {}) {
  const t0 = Date.now(), C = CHAINS[chain];
  const [m, found, nat] = await Promise.all([meta(chain, token), discover(chain, token), nativeUsdCached(chain)]);
  if (m.error) return { ok: false, error: m.error };
  const pools = await readPools(chain, token, found);
  const nativePx = nat ? nat.px : null;
  const isWrappedNative = token.toLowerCase() === C.wnative[1].toLowerCase();
  const quoteUsd = (q) => (q.kind === "stable" ? 1 : q.kind === "native" ? nativePx : null);
  // extra quotes (e.g. WETH on Polygon): price them from their own USD-quoted pools found later; keep null if unknown
  const rows = [];
  for (const p of pools) {
    const pxQ = poolPrice(p, m.decimals, p.q.dec), qu = quoteUsd(p.q);
    const tokAmt = num(p.balToken, m.decimals), qAmt = num(p.balQuote, p.q.dec);
    const priceUsd = pxQ != null && qu != null ? pxQ * qu : null;
    rows.push({ dex: p.dex, pool: p.pool, pair: (m.symbol || "TOKEN") + "/" + p.q.sym, quote_token: p.q.address, fee_bps: p.fee != null ? p.fee / 100 : undefined, tick_spacing: p.tick, stable_pool: p.stable || undefined,
      price_in_quote: r6(pxQ), price_usd: r6(priceUsd), token_reserve: r6(tokAmt), quote_reserve: r6(qAmt), quote_side_usd: qu != null ? usd(qAmt * qu) : null, _tokRaw: p.balToken });
  }
  // reference price = deepest pool by quote-side USD; liquidity = token side * ref price + quote side
  const ranked = rows.filter((r) => r.quote_side_usd != null).sort((a, b) => b.quote_side_usd - a.quote_side_usd);
  const ref = ranked.find((r) => r.price_usd != null && r.quote_side_usd > 50) || null;
  let priceUsd = ref ? ref.price_usd : isWrappedNative ? r6(nativePx) : null;
  for (const r of rows) r.liquidity_usd = r.quote_side_usd != null && priceUsd != null ? usd(r.quote_side_usd + r.token_reserve * priceUsd) : null;
  rows.sort((a, b) => (b.liquidity_usd ?? -1) - (a.liquidity_usd ?? -1));
  const supply = num(m.totalSupply, m.decimals);
  const inPoolsRaw = rows.reduce((s, r) => s + r._tokRaw, 0n);
  const pct = (raw) => (m.totalSupply > 0n ? Math.round(Number((raw * 1000000n) / m.totalSupply)) / 10000 : null);
  const totalLiq = usd(rows.reduce((s, r) => s + (r.liquidity_usd || 0), 0));
  // owner holdings
  let ownerPct = null, ownerIsContract = null;
  if (m.owner && m.owner !== ZERO) {
    try { const { res } = await rpcBatch(chain, [call(token, "0x70a08231" + pad(m.owner)), ["eth_getCode", [m.owner, "latest"]]]); // 2 calls: fine for batch-limited RPCs
      ownerPct = ok(res[0]) ? pct(word(res[0].result, 0)) : null; ownerIsContract = !!(res[1]?.result && res[1].result !== "0x"); } catch {}
  }
  let implCode = null; if (m.impl) { try { const { res } = await rpcBatch(chain, [["eth_getCode", [m.impl, "latest"]]]); implCode = res[0]?.result || null; } catch {} }
  const codes = [m.code, implCode].filter(Boolean).join("");
  const caps = Object.fromEntries(Object.entries(SELECTORS).map(([k, sels]) => [k, sels.some((s) => codeHas(codes, s))]));
  const fdv = priceUsd != null ? usd(priceUsd * supply) : null;
  const flags = [];
  const F = (id, level, detail) => flags.push({ id, level, detail });
  if (!rows.length) F("no_dex_pool_found", "high", "no pool vs wrapped native/major stablecoins on " + C.dexes.map((d) => d[0]).join(", "));
  else if (totalLiq != null && totalLiq < 10000) F("low_liquidity", "high", "total pool liquidity about $" + totalLiq);
  else if (totalLiq != null && totalLiq < 100000) F("thin_liquidity", "medium", "total pool liquidity about $" + totalLiq);
  if (rows.length && priceUsd == null) F("no_usd_price", "medium", "pools found but none deep enough vs wrapped native/stablecoins to price the token");
  if (fdv && totalLiq && fdv / totalLiq > 200) F("fdv_far_above_liquidity", "medium", "FDV is " + Math.round(fdv / totalLiq) + "x pool liquidity");
  const topLiq = rows[0]?.liquidity_usd || 0, priced = rows.filter((r) => r.price_usd != null && r.liquidity_usd > Math.max(5000, topLiq * 0.1));
  if (priced.length > 1 && priceUsd) { const dev = Math.max(...priced.map((r) => Math.abs(r.price_usd / priceUsd - 1))); if (dev > 0.05) F("price_divergence_between_pools", "medium", "deep pools disagree by up to " + Math.round(dev * 100) + "%"); }
  if (m.impl || caps.upgrade) F("upgradeable", "medium", m.impl ? "EIP-1967 proxy, implementation " + m.impl : "upgrade function in bytecode");
  if (m.owner && m.owner !== ZERO) F("owner_active", ownerIsContract ? "info" : "medium", "owner " + m.owner + (ownerIsContract ? " (contract, e.g. multisig/timelock)" : " (EOA)"));
  if (caps.mint && m.owner && m.owner !== ZERO) F("mintable", "medium", "mint function present and contract has an owner");
  else if (caps.mint) F("mint_function", "info", "mint function present (check who may call it)");
  if (caps.blacklist) F("blacklist_function", "medium", "blacklist-style function in bytecode");
  if (caps.pause) F("pausable", "info", "pause function in bytecode");
  if (caps.fee_setter) F("fee_setter", "medium", "transfer fee/tax setter in bytecode (possible buy/sell tax)");
  if (caps.max_tx_limits) F("max_tx_limits", "info", "max transaction/wallet limit setters in bytecode");
  if (caps.trading_switch) F("trading_switch", "medium", "owner-controlled trading enable switch in bytecode");
  if (ownerPct != null && ownerPct > 5) F("owner_holds_large_share", "high", "owner holds " + ownerPct + "% of supply");
  const selfPct = pct(m.selfHeld); if (selfPct > 5) F("contract_holds_large_share", "medium", "token contract holds " + selfPct + "% of its own supply");
  const poolPct = pct(inPoolsRaw);
  const level = flags.some((f) => f.level === "high") ? "high" : flags.some((f) => f.level === "medium") ? "medium" : "low";
  return { ok: true, chain, chain_id: C.id, block: m.block, rpc: m.rpc,
    token: { address: token, name: m.name, symbol: m.symbol, decimals: m.decimals, total_supply: fmt(m.totalSupply, m.decimals) },
    price_usd: priceUsd, price_source: ref ? { dex: ref.dex, pool: ref.pool, pair: ref.pair } : isWrappedNative && nat ? { dex: nat.dex, pool: nat.pool, pair: C.wnative[0] + "/stable" } : null,
    native_usd: r6(nativePx), fdv_usd: fdv,
    liquidity: { total_usd: totalLiq, pools_found: rows.length, dexes_checked: C.dexes.map((d) => d[0]), quote_assets_checked: quotesFor(C).map((q) => q.sym) },
    top_pools: rows.slice(0, opts.pools || 5).map(({ _tokRaw, ...r }) => r),
    holder_hints: { pct_supply_in_dex_pools: poolPct, pct_burned_zero_dead: pct(m.burned), pct_held_by_token_contract: selfPct, owner: m.owner && m.owner !== ZERO ? m.owner : null, owner_is_contract: ownerIsContract, pct_held_by_owner: ownerPct,
      note: "Hints from direct balanceOf reads (pools, burn addresses, token contract, owner). Not a full top-holder list." },
    contract: { proxy_implementation: m.impl, proxy_admin: m.admin, bytecode_bytes: (m.code.length - 2) / 2, capabilities_in_bytecode: caps },
    risk: { level, flags, note: "Heuristic flags from on-chain reads and bytecode selector scan. Not financial advice, not an audit; absence of flags is not proof of safety." },
    elapsed_ms: Date.now() - t0 };
}

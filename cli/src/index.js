// devx-token-snapshot: client for the hosted DevX Token Snapshot API.
// Free: token basics (name, symbol, decimals, supply, owner/proxy flags) via hosted /api/basic, no payment.
// Paid: the full snapshot (/v1/snapshot) for 0.003 USDC via x402 on Base, paid from your own wallet key.
import { paidFetch } from "./pay.js";
export { paidFetch, parseQuote, PAY_TO } from "./pay.js";
export const DEFAULT_BASE = process.env.DEVX_SNAPSHOT_URL || "https://token-snapshot.nextill-pos.workers.dev";
export const CHAIN_NAMES = ["base", "ethereum", "arbitrum", "optimism", "polygon", "avalanche", "bsc"];
export const isAddr = (a) => /^0x[0-9a-fA-F]{40}$/.test(a || "");
const UA = "devx-token-snapshot-cli/2.1.0";
function check(token, chain) {
  token = String(token || "").trim(); chain = String(chain || "base").toLowerCase();
  if (!isAddr(token)) throw new Error("token must be an ERC-20 contract address (0x + 40 hex)");
  if (!CHAIN_NAMES.includes(chain)) throw new Error("chain must be one of " + CHAIN_NAMES.join(","));
  return [token, chain];
}
/** Free: name, symbol, decimals, total supply, owner/proxy flags of one token, from the hosted free endpoint. */
export async function tokenBasics(token, chain, base = DEFAULT_BASE) {
  [token, chain] = check(token, chain);
  const u = base + "/api/basic?token=" + token + "&chain=" + chain;
  for (let i = 0; ; i++) {
    const r = await fetch(u, { headers: { "user-agent": UA } });
    const j = await r.json().catch(() => null);
    if (r.ok) return j;
    if (r.status < 500 || i >= 1) throw new Error((j && j.error) || "HTTP " + r.status);
    await new Promise((s) => setTimeout(s, 1500));
  }
}
/** Paid (0.003 USDC, x402 on Base): USD price, FDV, DEX liquidity, top pools, holder hints, risk flags. Without a key it returns the quote and does not pay. */
export async function tokenSnapshot(token, chain, { pools, maxUsd = 0.01, privateKey, base = DEFAULT_BASE } = {}) {
  [token, chain] = check(token, chain);
  const q = new URLSearchParams({ token, chain }); if (pools) q.set("pools", String(pools));
  return paidFetch(base + "/v1/snapshot?" + q, { maxUsd, privateKey, userAgent: UA });
}
export function paidCallInfo(base = DEFAULT_BASE) {
  return { url: base + "/v1/snapshot?token=<0x>&chain=<" + CHAIN_NAMES.join("|") + ">[&pools=5]", method: "GET or POST JSON {token, chain, pools}", price_usdc: 0.003, protocol: "x402 exact, USDC on Base (v1 X-PAYMENT or v2 PAYMENT-SIGNATURE)", chains: CHAIN_NAMES, payTo: "0xB3cDDccEe6B150c8efFD55B961afc0Ecefe7f247", docs: base + "/openapi.json", pay_with_this_package: "set X402_PRIVATE_KEY (Base wallet with USDC) and run `devx-token-snapshot full <token> --chain <chain>`" };
}

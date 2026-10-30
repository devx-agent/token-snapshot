// devx-token-snapshot: free local ERC-20 token reads over public RPCs, and info for the hosted x402 call.
export { snapshot, meta, CHAINS, CHAIN_NAMES, isAddr } from "./core.js";
import { snapshot, meta, fmt, CHAINS, CHAIN_NAMES, isAddr } from "./core.js";
export const DEFAULT_BASE = "https://token-snapshot.nextill-pos.workers.dev";
function check(token, chain) {
  token = String(token || "").trim(); chain = String(chain || "base").toLowerCase();
  if (!isAddr(token)) throw new Error("token must be an ERC-20 contract address (0x + 40 hex)");
  if (!CHAINS[chain]) throw new Error("chain must be one of " + CHAIN_NAMES.join(","));
  return [token, chain];
}
/** Free: name, symbol, decimals, total supply, owner/proxy flags of one token, read from public RPCs on your machine. */
export async function tokenBasics(token, chain) {
  [token, chain] = check(token, chain);
  const m = await meta(chain, token); if (m.error) throw new Error(m.error);
  return { chain, chain_id: CHAINS[chain].id, block: m.block, token: { address: token, name: m.name, symbol: m.symbol, decimals: m.decimals, total_supply: fmt(m.totalSupply, m.decimals) }, has_owner: !!(m.owner && !/^0x0{40}$/.test(m.owner)), is_eip1967_proxy: !!m.impl };
}
/** Full snapshot (price, liquidity, pools, holder hints, risk flags) computed locally from public RPCs. Slower and rate-limit prone; the hosted call is cached and uses fallback RPCs. */
export async function tokenSnapshot(token, chain, opts = {}) { [token, chain] = check(token, chain); return snapshot(chain, token, opts); }
export function paidCallInfo(base = DEFAULT_BASE) {
  return { url: base + "/v1/snapshot?token=<0x>&chain=<" + CHAIN_NAMES.join("|") + ">[&pools=5]", method: "GET or POST JSON {token, chain, pools}", price_usdc: 0.003, protocol: "x402 exact, USDC on Base (v1 X-PAYMENT or v2 PAYMENT-SIGNATURE)", chains: CHAIN_NAMES, payTo: "0xB3cDDccEe6B150c8efFD55B961afc0Ecefe7f247", docs: base + "/openapi.json", note: "This package does not pay. Use any x402 client (e.g. @x402/fetch) with your own wallet." };
}

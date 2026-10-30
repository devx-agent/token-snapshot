import { meta, fmt, CHAINS } from "./core.js";
export async function basic(chain, token, origin) {
  let m; try { m = await meta(chain, token); } catch (e) { return { ok: false, error: "RPC error: " + String(e.message || e).slice(0, 100) }; }
  if (m.error) return { ok: false, error: m.error };
  return { ok: true, free_tier: "token basics only", chain, chain_id: CHAINS[chain].id, block: m.block,
    token: { address: token, name: m.name, symbol: m.symbol, decimals: m.decimals, total_supply: fmt(m.totalSupply, m.decimals) },
    has_owner: !!(m.owner && !/^0x0{40}$/.test(m.owner)), is_eip1967_proxy: !!m.impl,
    full: origin + "/v1/snapshot?token=" + token + "&chain=" + chain + " (USD price, liquidity, top DEX pools, holder hints, risk flags; 0.003 USDC x402)" };
}

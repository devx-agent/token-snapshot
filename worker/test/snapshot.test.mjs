import test from "node:test"; import assert from "node:assert/strict";
import w from "../dist/index.js";
import { snapshot, CHAINS } from "../src/core.js";
const DEGEN = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", PAYTO = "0xB3cDDccEe6B150c8efFD55B961afc0Ecefe7f247";
const go = async (p, init) => { const r = await w.fetch(new Request("https://token-snapshot.nextill-pos.workers.dev" + p, init), {}); return [r.status, r.headers, await r.json().catch(() => null)]; };
const bogus = { headers: { "X-PAYMENT": "e30=" } };
test("unpaid paid route -> 402 with v1 body + v2 header, price/payTo", async () => {
  for (const q of ["/v1/snapshot", "/v1/snapshot?token=" + DEGEN, "/v1/snapshot?token=" + DEGEN + "&chain=ethereum"]) {
    const [st, h, b] = await go(q); assert.equal(st, 402); assert.equal(b.x402Version, 1); assert.equal(b.accepts[0].maxAmountRequired, "3000"); assert.equal(b.accepts[0].network, "base"); assert.equal(b.accepts[0].payTo, PAYTO);
    assert.equal(b.accepts[0].resource, "https://token-snapshot.nextill-pos.workers.dev/v1/snapshot"); assert.ok(b.accepts[0].outputSchema.input.queryParams.token);
    const pr = JSON.parse(Buffer.from(h.get("PAYMENT-REQUIRED"), "base64").toString()); assert.equal(pr.x402Version, 2); assert.equal(pr.accepts[0].network, "eip155:8453"); assert.equal(pr.accepts[0].amount, "3000"); assert.equal(pr.accepts[0].payTo, PAYTO);
    assert.ok(pr.extensions.bazaar.info.input.discoverable); assert.ok(pr.resource.description.length < 500);
  }
  const [st] = await go("/v1/snapshot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: DEGEN }) }); assert.equal(st, 402);
});
test("input validation before payment", async () => {
  for (const [q, re] of [["?token=nope", /0x \+ 40 hex/], ["?token=" + DEGEN + "&chain=solana", /unsupported chain/], ["", /token query parameter required/]]) { const [st, , b] = await go("/v1/snapshot" + q, bogus); assert.equal(st, 400, q); assert.match(b.error, re); }
  const [st, , b] = await go("/v1/snapshot?token=" + DEGEN, { headers: { "X-PAYMENT": "e30=" } }); assert.equal(st, 402); assert.match(b.error, /does not match/);
});
test("discovery docs", async () => {
  const [s1, , o] = await go("/openapi.json"); assert.equal(s1, 200); assert.equal(o.paths["/v1/snapshot"].get["x-payment-info"].amount, "3000");
  const [s2, , d] = await go("/dexes.json"); assert.equal(s2, 200); assert.equal(Object.keys(d).length, 7);
  const [s3, , m] = await go("/mcp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }) }); assert.equal(s3, 200); assert.equal(m.result.tools.length, 2);
});
test("free basic (live RPC)", async () => {
  const [st, , b] = await go("/api/basic?token=" + DEGEN); assert.equal(st, 200); assert.equal(b.token.symbol, "DEGEN"); assert.equal(b.token.decimals, 18);
  const [s2, , b2] = await go("/api/basic?token=0x000000000000000000000000000000000000dEaD"); assert.equal(s2, 400); assert.match(b2.error, /no contract/);
});
test("live snapshot on every chain finds priced pools", async () => {
  const T = { base: DEGEN, ethereum: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", arbitrum: "0x912CE59144191C1204E64559FE8253a0e49E6548", optimism: "0x4200000000000000000000000000000000000042",
    polygon: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", avalanche: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd", bsc: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8" };
  assert.deepEqual(Object.keys(T).sort(), Object.keys(CHAINS).sort());
  const rs = await Promise.all(Object.entries(T).map(([c, a]) => snapshot(c, a)));
  for (const r of rs) { assert.ok(r.ok, r.error); assert.ok(r.price_usd > 0, r.chain); assert.ok(r.liquidity.total_usd > 10000, r.chain); assert.ok(r.top_pools.length >= 1); assert.ok(["low", "medium", "high"].includes(r.risk.level)); assert.ok(r.holder_hints.pct_supply_in_dex_pools >= 0); }
  // every configured DEX factory resolves at least one pool somewhere for WETH-like pairs
  const weth = await snapshot("base", "0x4200000000000000000000000000000000000006"); assert.ok(Math.abs(weth.price_usd / rs[0].native_usd - 1) < 0.02);
});

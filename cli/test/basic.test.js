import test from "node:test"; import assert from "node:assert/strict";
import { paidCallInfo, tokenBasics, tokenSnapshot, CHAIN_NAMES } from "../src/index.js";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
test("paid info", () => { const i = paidCallInfo(); assert.equal(i.price_usdc, 0.003); assert.equal(CHAIN_NAMES.length, 7); });
test("bad input rejected offline", async () => { await assert.rejects(tokenBasics("0x12", "base"), /ERC-20/); await assert.rejects(tokenSnapshot(USDC, "solana"), /chain must be/); });
test("live free basics on base (USDC)", { timeout: 30000 }, async () => { const r = await tokenBasics(USDC, "base"); assert.equal(r.token.symbol, "USDC"); assert.equal(r.token.decimals, 6); });
test("paid call without key returns quote, does not pay", { timeout: 30000 }, async () => { const r = await tokenSnapshot(USDC, "base", { privateKey: "" }); assert.equal(r.payment_required, true); assert.equal(r.quote.amount_atomic, "3000"); });

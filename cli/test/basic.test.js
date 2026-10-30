import test from "node:test"; import assert from "node:assert/strict";
import { paidCallInfo, tokenBasics, tokenSnapshot, CHAIN_NAMES } from "../src/index.js";
test("paid info", () => { const i = paidCallInfo(); assert.equal(i.price_usdc, 0.003); assert.equal(CHAIN_NAMES.length, 7); });
test("bad input rejected offline", async () => { await assert.rejects(tokenBasics("0x12", "base"), /ERC-20/); await assert.rejects(tokenSnapshot("0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", "solana"), /chain must be/); });
test("live basics on base (USDC)", { timeout: 30000 }, async () => { const r = await tokenBasics("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "base"); assert.equal(r.token.symbol, "USDC"); assert.equal(r.token.decimals, 6); });

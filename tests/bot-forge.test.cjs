const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const cache = new Map();
// Network-independent harness: use the real builder, preset and request code.
// Only market metadata and the symbol catalogue are supplied locally.
function load(file) {
  const full = path.resolve(file);
  if (cache.has(full)) return cache.get(full);
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(full, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, require(name) {
    if (name.endsWith("botMeta")) return { formShapeFor: (id) => ({ duration: true, sideLabels: ["Up", "Down"], digit: id === "matches_differs", barrierDigit: id === "over_under" }) };
    if (name === "@/services/deriv/derivSymbols") return { toDerivSymbol: (s) => s };
    const resolved = name.startsWith("@/") ? path.join("src", name.slice(2)) : path.join(path.dirname(full), name);
    return load(`${resolved}.ts`);
  } });
  cache.set(full, module.exports);
  return module.exports;
}
const conditions = load("src/components/bot/builder/conditions.ts");
const draft = load("src/components/bot/builder/draft.ts");
const templates = load("src/components/bot/builder/templates.ts");
const strategies = ["even_odd", "matches_differs", "rise_fall", "over_under"].map((strategy_id) => ({ strategy_id, supported_contract_types: [strategy_id], parameters: { properties: { entry_conditions: {}, entry_rule: { enum: ["always", "flip_after_loss", "copy_last_tick", "streak_fade"] } } } }));
function configured() {
  const d = draft.newDraft();
  return { ...d, name: "My rules", form: { ...d.form, symbols: ["R_10"] }, entryConditions: { match: "all", rules: [{ ...conditions.newCondition(), operator: "even", count: 4 }], cooldown_seconds: 5 } };
}
test("saved and exported configuration retains every custom condition on reopen", () => {
  const d = configured();
  const body = draft.toPresetRequest(d, "even_odd");
  const restored = draft.draftFromPreset(JSON.parse(JSON.stringify({ ...body, id: "preset" })));
  assert.equal(JSON.stringify(restored.entryConditions), JSON.stringify(d.entryConditions));
  const run = draft.buildDraftRunRequest(restored, strategies, false);
  assert.ok(run.request, JSON.stringify(run.errors));
  assert.equal(JSON.stringify(run.request.strategy_parameters.entry_conditions), JSON.stringify(d.entryConditions));
  assert.equal(run.request.risk_acknowledged, false);
  assert.equal(run.request.risk_limits.session_stop_loss, "10");
});
test("older saved bots keep their original unconditional behaviour", () => {
  const d = configured(); delete d.entryConditions;
  const saved = draft.toPresetRequest(d, "even_odd");
  const run = draft.buildDraftRunRequest(draft.draftFromPreset(saved), strategies, false);
  assert.ok(run.request);
  assert.equal(run.request.strategy_parameters.entry_conditions, undefined);
});
test("invalid custom configurations never silently become unconditional bots", () => {
  const d = configured(); d.entryConditions.rules[0].count = 0;
  const saved = draft.toPresetRequest(d, "even_odd");
  assert.equal(draft.draftFromPreset(saved), undefined);
  assert.equal(draft.buildDraftRunRequest(d, strategies, false).request, undefined);
  assert.ok(conditions.conditionProblems({ ...configured().entryConditions, cooldown_seconds: 3601 }).length);
});
test("a stale engine cannot accept a bot whose conditions it cannot execute", () => {
  const old = [{ ...strategies[0], parameters: { properties: {} } }];
  const result = draft.buildDraftRunRequest(configured(), old, false);
  assert.equal(result.request, undefined);
  assert.match(result.errors.join(" "), /does not support custom/);
});
test("result rules cannot deadlock the first trade", () => {
  const r = conditions.newCondition("result_streak");
  assert.ok(conditions.conditionProblems({ match: "all", rules: [r], cooldown_seconds: 0 }).length);
  assert.ok(conditions.conditionProblems({ match: "any", rules: [r], cooldown_seconds: 0 }).length);
  assert.equal(conditions.conditionProblems({ match: "any", rules: [r, conditions.newCondition()], cooldown_seconds: 0 }).length, 0);
});
test("indicator direction and a side-changing rule are rejected together", () => {
  const d = { ...configured(), entryRule: "flip_after_loss", indicators: [{ kind: "rsi", period: 14 }], method: "rise_fall" };
  d.form.direction = "auto";
  assert.equal(draft.buildDraftRunRequest(d, strategies, false).request, undefined);
  assert.match(draft.draftProblems(d, strategies).join(" "), /Indicators decide/);
});
test("new custom templates produce valid executable requests", () => {
  const custom = templates.BOT_TEMPLATES.filter((t) => t.id.startsWith("custom-"));
  assert.equal(custom.length, 3);
  for (const t of custom) {
    const result = draft.buildDraftRunRequest(t.build(), strategies, false);
    assert.ok(result.request, `${t.id}: ${result.errors.join(", ")}`);
    assert.ok(result.request.strategy_parameters.entry_conditions);
  }
});

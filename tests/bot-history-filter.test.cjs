const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("balance/history menu cannot mutate the trading account or connection", () => {
  const menu = fs.readFileSync("src/components/deriv/DerivHistoryFilter.tsx", "utf8");
  assert.doesNotMatch(menu, /useDerivSelectAccount|useDerivDisconnect|mutateAsync|is_selected/);
  assert.match(menu, /onChange\(account\.deriv_account_id\)/);
  assert.match(menu, /AccountBalance account=\{account\} compact showUpdatedAt=\{false\}/);
});
test("history requests scope the server query by exact account before paging", () => {
  const page = fs.readFileSync("src/app/(dashboard)/dbot/page.tsx", "utf8");
  assert.match(page, /useListBotRuns\(\{[^\n]*deriv_account_id: historyAccountId/);
  assert.match(page, /finishedParams = \{[^\n]*deriv_account_id: historyAccountId/);
  assert.match(page, /getListBotRunsQueryKey\(finishedParams\)/);
  assert.match(page, /setAccountFilter\(value\); setHistoryAccountId\(null\)/);
});
test("builder and saved bots demand a fresh account choice for every start", () => {
  const panel = fs.readFileSync("src/components/bot/builder/RunPanel.tsx", "utf8");
  assert.match(panel, /choosing && <RunSavedBotDialog/);
  const dialog = fs.readFileSync("src/components/bot/RunSavedBotDialog.tsx", "utf8");
  assert.match(dialog, /useState<string \| null>\(null\)/);
  assert.match(dialog, /Boolean\(chosen\)/);
  const builder = fs.readFileSync("src/app/(dashboard)/dbot/build/page.tsx", "utf8");
  assert.match(builder, /await selectRunAccount\.mutateAsync\(\{ data: \{ deriv_account_id: account\.deriv_account_id \}/);
  assert.ok(builder.indexOf("await selectRunAccount.mutateAsync") < builder.indexOf("const res = await startRun.mutateAsync"));
});

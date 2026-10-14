const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
let user = "user-one";
const queries = [];
const requests = [];
const moduleUnderTest = { exports: {} };
const code = ts.transpileModule(fs.readFileSync("src/services/brokerAffiliates.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
vm.runInNewContext(code, { exports: moduleUnderTest.exports, module: moduleUnderTest, require(name) {
  if (name === "@tanstack/react-query") return { useQuery: (options) => { queries.push(options); return options; }, useMutation: (options) => options, useQueryClient: () => ({ invalidateQueries: () => {} }) };
  if (name === "@/stores/authStore") return { useAuthStore: (select) => select({ user: { id: user } }) };
  if (name === "@/services/api/mutator/custom-instance") return { customInstance: (options) => { requests.push(options); return Promise.resolve({ url: "https://t.deriv.link?t=SERVER_CHOSEN", source: "partner" }); } };
  throw new Error(name);
} });
const api = moduleUnderTest.exports;
test("signup link caches are isolated by authenticated user and broker", async () => {
  const first = api.useBrokerSignup("deriv");
  user = "user-two";
  const second = api.useBrokerSignup("deriv");
  assert.notEqual(JSON.stringify(first.queryKey), JSON.stringify(second.queryKey));
  const data = await second.queryFn();
  assert.equal(data.source, "partner");
  assert.equal(requests.at(-1).url, "/api/v1/referrals/broker-signup/deriv");
  assert.equal(requests.at(-1).data, undefined); // No browser-supplied partner/referrer override.
});
test("partner link writes send only the selected broker and URL", async () => {
  await api.useSaveBrokerLink().mutationFn({ broker: "deriv", url: "https://t.deriv.link?t=OWN" });
  assert.equal(requests.at(-1).url, "/api/v1/referrals/broker-links/deriv");
  assert.deepEqual(JSON.parse(JSON.stringify(requests.at(-1).data)), { url: "https://t.deriv.link?t=OWN" });
});
test("connect and signup are separate actions and signup only uses the server URL", () => {
  const source = fs.readFileSync("src/components/deriv/DerivConnectPrompt.tsx", "utf8");
  assert.match(source, /onClick=\{start\}/);
  assert.match(source, /href=\{url\}/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|URLSearchParams|JU3JEQAAVJMN/);
  assert.match(source, /Creating an account does not start a bot/);
  const page = fs.readFileSync("src/app/(dashboard)/autohub/bots/[botId]/page.tsx", "utf8");
  assert.ok(page.indexOf("<DerivConnectPrompt />") < page.indexOf('lg:grid-cols-[minmax(0,1fr)_22rem]'));
  assert.match(page, /deriv.linked && access.message/);
});

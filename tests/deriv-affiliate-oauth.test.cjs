const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const { webcrypto } = require("node:crypto");

function load(file, mocks = {}) {
  const moduleUnderTest = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, {
    exports: moduleUnderTest.exports,
    module: moduleUnderTest,
    require(name) {
      if (name in mocks) return mocks[name];
      throw new Error(`Unexpected import: ${name}`);
    },
    URL,
    URLSearchParams,
    crypto: webcrypto,
    TextEncoder,
    btoa,
    sessionStorage: { setItem() {} },
  });
  return moduleUnderTest.exports;
}

const referral = load("src/lib/derivReferral.ts");

test("Deriv OAuth keeps the user's server-selected tracking alias and campaign", () => {
  const params = referral.derivReferralParams("https://t.deriv.link/?affiliate_token=PARTNER123&utm_source=partner&utm_campaign=launch");
  assert.equal(params.get("affiliate_token"), "PARTNER123");
  assert.equal(params.get("t"), null);
  assert.equal(params.get("utm_source"), "partner");
  assert.equal(params.get("utm_campaign"), "launch");
});

test("known Deriv referral formats map to one OAuth tracking token", () => {
  assert.equal(referral.derivReferralParams("https://t.deriv.link?t=FXNOD123").get("t"), "FXNOD123");
  assert.equal(referral.derivReferralParams("https://deriv.com/signup?sidc=PARTNER123").get("t"), "PARTNER123");
  assert.equal(referral.derivReferralParams("https://track.deriv.com/_PARTNER123_/1/").get("t"), "PARTNER123");
});

test("untrusted hosts and non-HTTPS links cannot add OAuth parameters", () => {
  for (const url of ["https://deriv.com.evil.test/?t=BAD", "http://deriv.com/?t=BAD", "https://user@deriv.com/?t=BAD"]) {
    assert.equal(referral.derivReferralParams(url).toString(), "");
  }
});

test("OAuth URL includes the partner token while keeping PKCE and state", async () => {
  const trading = load("src/services/tradingApi.ts", {
    "./api": { api: { get: async () => ({ data: { client_id: "staging-app" } }) } },
    "@/lib/derivReferral": referral,
  });
  const { authorize_url, state } = await trading.derivApi.authorize(
    "https://fxnod.example/deriv/callback", undefined,
    "https://t.deriv.link?t=PARTNER123&utm_medium=affiliate",
  );
  const url = new URL(authorize_url);
  assert.equal(url.origin, "https://auth.deriv.com");
  assert.equal(url.searchParams.get("t"), "PARTNER123");
  assert.equal(url.searchParams.get("utm_medium"), "affiliate");
  assert.equal(url.searchParams.get("client_id"), "staging-app");
  assert.equal(url.searchParams.get("redirect_uri"), "https://fxnod.example/deriv/callback");
  assert.equal(url.searchParams.get("state"), state);
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.ok(url.searchParams.get("code_challenge"));
  assert.equal(url.searchParams.get("prompt"), null);
});

test("Every Deriv login flow asks the authenticated API for attribution before OAuth", () => {
  const hook = fs.readFileSync("src/hooks/useStartDerivOAuth.ts", "utf8");
  assert.match(hook, /await getBrokerSignup\("deriv"\)/);
  assert.match(hook, /if \(!signup\?\.url\) throw/);
  assert.match(hook, /signup\.url,/);
  assert.doesNotMatch(hook, /app \? null : await getBrokerSignup/);
});

test("Auto Hub distinguishes existing login from attributed signup before leaving FXNOD", () => {
  const prompt = fs.readFileSync("src/components/deriv/DerivConnectPrompt.tsx", "utf8");
  assert.match(prompt, /setConfirmExisting\(true\)/);
  assert.match(prompt, /login-page Sign up link may omit your partner referral/);
  assert.match(prompt, /Yes, continue to Deriv login/);
  assert.match(prompt, /For a new account, use “Create a Deriv account” alongside/);
  assert.match(prompt, /href=\{url\}/);
});

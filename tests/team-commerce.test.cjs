const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

test("team requests use authenticated ownership and distinguish clearing access from removal", async () => {
  const calls = [];
  const api = Object.fromEntries(
    ["get", "post", "patch", "delete"].map((method) => [
      method,
      async (...args) => {
        calls.push([method, ...args]);
        return { data: { owned: [], memberships: [] } };
      },
    ]),
  );
  const module = { exports: {} };
  const code = ts.transpileModule(
    fs.readFileSync("src/services/commerce.ts", "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText;
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    require(name) {
      if (name === "./api") return { api };
      if (name === "./api/endpoints/users/users")
        return {
          getActiveTools: () => {
            throw new Error("unneeded");
          },
        };
      throw new Error(name);
    },
  });
  const service = module.exports.commerce;
  await service.teams();
  await service.addMember(
    "grant",
    "member@example.com",
    "366af5e7-1adb-4e0d-b7b8-787bba55aa5e",
  );
  await service.updateMember("grant", "member", null);
  await service.removeMember("grant", "member");
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["get", "/api/v1/wallet/commerce/teams"],
    [
      "post",
      "/api/v1/wallet/commerce/teams/grant/members",
      {
        email: "member@example.com",
        deriv_client_id: "366af5e7-1adb-4e0d-b7b8-787bba55aa5e",
      },
    ],
    [
      "patch",
      "/api/v1/wallet/commerce/teams/grant/members/member",
      { deriv_client_id: null },
    ],
    ["delete", "/api/v1/wallet/commerce/teams/grant/members/member"],
  ]);
});

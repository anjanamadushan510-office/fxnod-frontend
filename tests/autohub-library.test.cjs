const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(path, dependencies = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    require: (name) => {
      assert.ok(name in dependencies, name);
      return dependencies[name];
    },
  });
  return module.exports;
}
const { filterBots } = load("src/components/autohub/catalogue.ts");
const defaults = {
  search: "",
  contract: "",
  markets: "",
  favouritesOnly: false,
  sort: "catalogue",
};
const bots = Array.from({ length: 55 }, (_, i) => ({
  bot_id: `bot-${i}`,
  name: `Strategy ${i}`,
  tagline: "Synthetic markets",
  description: "Entry analysis",
  contract_type: i % 2 ? "DIGITDIFF" : "CALL",
  max_markets: i % 2 ? 3 : 1,
  min_stake: String(55 - i),
  suggested_symbols: ["1HZ100V"],
}));
test("large catalogues combine search, contract and market filters", () => {
  assert.equal(filterBots(bots, new Set(), defaults).length, 55);
  const result = filterBots(bots, new Set(), {
    ...defaults,
    search: "digit differs 1HZ100V",
    contract: "DIGITDIFF",
    markets: "multi",
  });
  assert.equal(result.length, 27);
  assert.equal(
    filterBots(bots, new Set(), { ...defaults, search: "not a bot" }).length,
    0,
  );
});
test("favourites filter ignores retired ids and preserves original catalogue order", () => {
  const result = filterBots(bots, new Set(["bot-20", "bot-1", "retired"]), {
    ...defaults,
    favouritesOnly: true,
  });
  assert.equal(result.map((b) => b.bot_id).join(","), "bot-1,bot-20");
  assert.equal(
    filterBots(bots, new Set(), { ...defaults, favouritesOnly: true }).length,
    0,
  );
});
test("numeric stake sorting and filters do not mutate the catalogue", () => {
  const result = filterBots(bots, new Set(), { ...defaults, sort: "stake" });
  assert.equal(result[0].min_stake, "1");
  assert.equal(bots[0].bot_id, "bot-0");
});
test("favourites query is isolated by account and failed saves roll back", async () => {
  let state = { user: { id: "user-a" } };
  let queryOptions;
  let mutationOptions;
  let data = { bot_ids: ["bot-1"] };
  let key;
  const store = (select) => select(state);
  store.getState = () => state;
  const hook = load("src/hooks/useBotFavourites.ts", {
    "@/stores/authStore": { useAuthStore: store },
    "@/services/api": {
      api: {
        get: async () => ({ data }),
        put: async () => {
          throw new Error("Offline");
        },
      },
    },
    "@/lib/apiError": { parseApiError: (_, message) => ({ message }) },
    sonner: { toast: { error: () => {} } },
    "@tanstack/react-query": {
      useQuery: (options) => {
        queryOptions = options;
        return { data, isSuccess: true };
      },
      useQueryClient: () => ({
        cancelQueries: async () => {},
        getQueryData: () => data,
        setQueryData: (k, value) => {
          key = k;
          data = value;
        },
        invalidateQueries: async () => {},
      }),
      useMutation: (options) => {
        mutationOptions = options;
        return { isPending: false, mutate: () => {} };
      },
    },
  });
  hook.useBotFavourites();
  assert.equal(queryOptions.queryKey[1], "user-a");
  const previous = await mutationOptions.onMutate({
    botId: "bot-2",
    favourite: true,
  });
  assert.equal(data.bot_ids.join(","), "bot-1,bot-2");
  mutationOptions.onError(new Error(), {}, previous);
  assert.equal(data.bot_ids.join(","), "bot-1");
  state = { user: { id: "user-b" } };
  await assert.rejects(
    mutationOptions.mutationFn({ botId: "bot-2", favourite: true }),
    /Session changed/,
  );
  hook.useBotFavourites();
  assert.equal(queryOptions.queryKey[1], "user-b");
  state = { user: null };
  const guest = hook.useBotFavourites();
  assert.equal(queryOptions.enabled, false);
  assert.equal(guest.ids.size, 0);
});

test("held positions never display a zero-tick duration", () => {
  const { durationLabel, contractLabel } = load(
    "src/components/autohub/catalogue.ts",
  );
  assert.equal(
    durationLabel({ duration: 0, duration_unit: "" }),
    "Held position",
  );
  assert.equal(
    durationLabel({ duration: 5, duration_unit: "t" }),
    "5 ticks / trade",
  );
  assert.equal(contractLabel("rise_fall"), "Rise / Fall");
  assert.equal(
    durationLabel({ duration: 1, duration_unit: "t" }),
    "1 tick / trade",
  );
});

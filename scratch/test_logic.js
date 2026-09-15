const WebSocket = require("ws");

function symbolMatchesStrategy(symbolMarket, symbolSubmarket, strategyId) {
  const config = {
    accumulator: {
      label: "Accumulators",
      allowedMarkets: [
        { market: "synthetic_index", submarket: "random_index" },
      ],
    }
  }[strategyId];
  if (!config) return true;

  return config.allowedMarkets.some((f) => {
    if (f.market !== symbolMarket) return false;
    if (f.submarket === undefined) return true;
    return f.submarket === symbolSubmarket;
  });
}

const ws = new WebSocket("wss://api.derivws.com/trading/v1/options/ws/public");

ws.on('open', () => {
  ws.send(JSON.stringify({ active_symbols: "brief" }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.active_symbols) {
    const symbols = msg.active_symbols.map(s => ({
      symbol: s.underlying_symbol || s.symbol,
      market: s.market,
      submarket: s.submarket
    }));
    
    const matched = symbols.filter(sym => symbolMatchesStrategy(sym.market, sym.submarket, "accumulator"));
    
    const hasJump = matched.some(s => s.symbol.startsWith("JUMP"));
    console.log("Matched markets:", matched.length);
    console.log("Has Jump?", hasJump);
    
    ws.close();
  }
});

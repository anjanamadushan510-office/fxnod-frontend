const WebSocket = require("ws");

const ws = new WebSocket("wss://api.derivws.com/trading/v1/options/ws/public");

ws.on('open', () => {
  ws.send(JSON.stringify({ active_symbols: "brief" }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.active_symbols) {
    const synthetics = msg.active_symbols.filter(s => s.market === "synthetic_index");
    const submarkets = new Set(synthetics.map(s => s.submarket));
    console.log("Synthetic Submarkets:", Array.from(submarkets));
    
    console.log("Sample symbols for each submarket:");
    for (const sub of submarkets) {
       const syms = synthetics.filter(s => s.submarket === sub).slice(0, 3).map(s => s.symbol || s.underlying_symbol);
       console.log(`- ${sub}:`, syms);
    }
    
    ws.close();
  }
});

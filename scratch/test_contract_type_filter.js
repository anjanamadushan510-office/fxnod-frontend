const WebSocket = require("ws");

const ws = new WebSocket("wss://api.derivws.com/trading/v1/options/ws/public");

ws.on('open', () => {
  ws.send(JSON.stringify({ 
    active_symbols: "brief",
    contract_type: ["ACCU"]
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.active_symbols) {
    const markets = new Set(msg.active_symbols.map(s => s.market));
    const submarkets = new Set(msg.active_symbols.map(s => s.submarket));
    
    console.log("ACCU Markets:", Array.from(markets));
    console.log("ACCU Submarkets:", Array.from(submarkets));
    
    const jump = msg.active_symbols.find(s => s.symbol.startsWith("JUMP") || (s.underlying_symbol && s.underlying_symbol.startsWith("JUMP")));
    console.log("Has Jump?", !!jump);
    ws.close();
  } else if (msg.error) {
    console.error("API Error:", msg.error);
    ws.close();
  }
});

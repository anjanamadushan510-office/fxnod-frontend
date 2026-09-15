const WebSocket = require("ws");

const WS_URL = "wss://api.derivws.com/trading/v1/options/ws/public";

// Test multiple markets to see if multiplier_range differs
const symbols = [
  { id: "1HZ100V", name: "Volatility 100 (1s)" },
  { id: "1HZ75V",  name: "Volatility 75 (1s)" },
  { id: "1HZ50V",  name: "Volatility 50 (1s)" },
  { id: "1HZ25V",  name: "Volatility 25 (1s)" },
  { id: "1HZ10V",  name: "Volatility 10 (1s)" },
  { id: "R_100",   name: "Volatility 100 Index" },
  { id: "R_75",    name: "Volatility 75 Index" },
  { id: "R_50",    name: "Volatility 50 Index" },
  { id: "R_25",    name: "Volatility 25 Index" },
  { id: "R_10",    name: "Volatility 10 Index" },
  { id: "BOOM1000", name: "Boom 1000" },
  { id: "CRASH1000", name: "Crash 1000" },
  { id: "cryBTCUSD", name: "BTC/USD" },
  { id: "frxEURUSD", name: "EUR/USD" },
  { id: "frxXAUUSD", name: "Gold/USD" },
];

let pending = symbols.length;

for (const sym of symbols) {
  const ws = new WebSocket(WS_URL);
  ws.on("open", () => {
    ws.send(JSON.stringify({ contracts_for: sym.id, req_id: 1 }));
  });
  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.contracts_for) {
      const available = msg.contracts_for.available || [];
      const multup = available.find(c => c.contract_type === "MULTUP");
      const multdown = available.find(c => c.contract_type === "MULTDOWN");
      const accu = available.find(c => c.contract_type === "ACCU");
      
      console.log(`\n=== ${sym.name} (${sym.id}) ===`);
      if (multup) {
        console.log(`  MULTUP multiplier_range: [${multup.multiplier_range}]`);
        console.log(`  cancellation_range: [${multup.cancellation_range || 'N/A'}]`);
        console.log(`  default_stake: ${multup.default_stake}`);
      } else {
        console.log(`  MULTUP: NOT AVAILABLE`);
      }
      if (accu) {
        console.log(`  ACCU growth_rate_range: [${accu.growth_rate_range}]`);
      }
      
      ws.close();
      pending--;
      if (pending === 0) process.exit(0);
    }
  });
  ws.on("error", () => { pending--; });
}

// Timeout safety
setTimeout(() => process.exit(0), 15000);

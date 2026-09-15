const WebSocket = require("ws");

const WS_URL = "wss://api.derivws.com/trading/v1/options/ws/public";

const ws = new WebSocket(WS_URL);

ws.on("open", () => {
  // Test with Volatility 100 (1s) Index
  ws.send(JSON.stringify({ contracts_for: "1HZ100V", req_id: 1 }));
});

ws.on("message", (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.contracts_for) {
    const available = msg.contracts_for.available ?? [];

    // Print what's available for MULTUP
    const multup = available.find(c => c.contract_type === "MULTUP");
    console.log("=== MULTUP contracts_for ===");
    console.log(JSON.stringify(multup, null, 2));

    // Also print ACCU for reference
    const accu = available.find(c => c.contract_type === "ACCU");
    console.log("\n=== ACCU contracts_for ===");
    console.log(JSON.stringify(accu, null, 2));

    // Print CALL for reference
    const call = available.find(c => c.contract_type === "CALL");
    console.log("\n=== CALL contracts_for ===");
    console.log(JSON.stringify(call, null, 2));

    ws.close();
  } else if (msg.error) {
    console.error("Error:", msg.error);
    ws.close();
  }
});

ws.on("error", (e) => console.error("WS Error:", e.message));

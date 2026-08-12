const WebSocket = require('ws');
const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
ws.on('open', () => {
  ws.send(JSON.stringify({ contracts_for: '1HZ100V' }));
});
ws.on('message', (data) => {
  const resp = JSON.parse(data);
  if (resp.contracts_for) {
     const accus = resp.contracts_for.available.filter(c => c.contract_category === 'accumulator');
     console.log(JSON.stringify(accus, null, 2));
  } else {
     console.log(resp);
  }
  process.exit(0);
});

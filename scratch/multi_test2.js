const WebSocket = require('ws');

const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

ws.on('open', () => {
  ws.send(JSON.stringify({
    proposal: 1,
    amount: 10,
    basis: 'stake',
    contract_type: 'MULTUP',
    currency: 'USD',
    multiplier: 100,
    symbol: '1HZ100V'
  }));
});

ws.on('message', (data) => {
  console.log(data.toString());
  ws.close();
});

const WebSocket = require('ws');
const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
ws.on('open', () => {
  ws.send(JSON.stringify({ contracts_for: 'RDBULL', req_id: 1 }));
});
ws.on('message', (data) => {
  console.log(JSON.stringify(JSON.parse(data.toString()), null, 2));
  ws.close();
});

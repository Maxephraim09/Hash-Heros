const express = require('express');
const app = express();
app.use(express.json());

let micropay = {};    // address -> millis balance
let receipts = [];

app.post('/transfer', (req, res) => {
  const { from, to, tokenId } = req.body;
  const receipt = { id: Date.now().toString(), from, to, tokenId, confirmedAt: new Date().toISOString() };
  setTimeout(() => receipts.push(receipt), 50);
  return res.json({ success: true, receipt });
});

app.post('/micropay', (req, res) => {
  const { address, amount } = req.body;
  micropay[address] = (micropay[address] || 0) + amount;
  res.json({ success: true, balance: micropay[address] });
});

app.get('/micropay/:address', (req, res) => {
  res.json({ balance: micropay[req.params.address] || 0 });
});

app.get('/receipts', (req, res) => res.json({ receipts }));

const PORT = 4001;
app.listen(PORT, () => console.log('BlockDAG-sim running on', PORT));

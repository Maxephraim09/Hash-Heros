const express = require('express');
const app = express();
app.use(express.json());

let store = { 1: { id:1, xp:0, level:1, owner:"0x0" } };

app.get('/nft/:id', (req,res) => res.json(store[req.params.id] || null));

app.post('/nft/:id/update', (req,res) => {
  const id = req.params.id;
  const { addXp, traits } = req.body;
  if(!store[id]) store[id] = { id: +id, xp:0, level:1, owner:"0x0" };
  store[id].xp += addXp || 0;
  store[id].level = Math.floor(store[id].xp / 200) + 1;
  if(traits) store[id].traits = traits;
  res.json({ success:true, nft:store[id] });
});

const PORT=4002;
app.listen(PORT, ()=> console.log('Mock API running', PORT));

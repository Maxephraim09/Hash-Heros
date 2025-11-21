import axios from 'axios';
const BASE = 'http://localhost:4001';
export async function instantTransfer(from,to,tokenId){
  const r = await axios.post(`${BASE}/transfer`, { from, to, tokenId });
  return r.data;
}
export async function micropay(address, amount){
  const r = await axios.post(`${BASE}/micropay`, { address, amount });
  return r.data;
}
export async function getMicro(address){
  const r = await axios.get(`${BASE}/micropay/${address}`);
  return r.data;
}

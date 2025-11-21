import { debounce, SimpleCache } from '../utils/optimizations';

const BASE = 'http://localhost:4001';
const apiCache = new SimpleCache(10 * 60 * 1000); // 10 minutes for BlockDAG data

export async function instantTransfer(from, to, tokenId) {
  const response = await fetch(`${BASE}/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, tokenId })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function micropay(address, amount) {
  const response = await fetch(`${BASE}/micropay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, amount })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function getMicro(address) {
  const cacheKey = `micropay:${address}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;
  
  const response = await fetch(`${BASE}/micropay/${address}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  apiCache.set(cacheKey, data);
  return data;
}

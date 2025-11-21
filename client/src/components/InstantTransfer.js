import React, { useState } from 'react';
import { instantTransfer, micropay, getMicro } from '../services/blockdagService';

export default function InstantTransfer({ account }){
  const [status, setStatus] = useState('');
  const [balance, setBalance] = useState(0);

  async function send(){
    try {
      setStatus('Sending...');
      const resp = await instantTransfer(account || '0xSender', '0xReceiver', 1);
      setStatus('Confirmed: ' + resp.receipt.id);
    } catch(error) {
      setStatus('Error: BlockDAG API unavailable. ' + error.message);
      console.warn('BlockDAG transfer failed:', error.message);
    }
  }

  async function addMicro(){
    try {
      await micropay(account || '0xSender', 100);
      const r = await getMicro(account || '0xSender');
      setBalance(r.balance);
    } catch(error) {
      setStatus('Error: Could not add micropayment. ' + error.message);
      console.warn('Micropay failed:', error.message);
    }
  }

  return (
    <div className="card sci">
      <h4>Instant Transfer (BlockDAG-sim)</h4>
      <button onClick={send}>Send NFT Instantly</button>
      <p>{status}</p>
      <button onClick={addMicro}>Add 100 millis</button>
      <p>Micro balance: {balance}</p>
    </div>
  );
}

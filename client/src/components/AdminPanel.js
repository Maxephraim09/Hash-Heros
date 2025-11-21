import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPanel({ contracts, account }) {
  const [status, setStatus] = useState('');

  if (!contracts) return <div className="card sci"><h4>Admin Panel</h4><p>Contracts not loaded</p></div>;

  async function updateMetadata() {
    try {
      setStatus('Sending updateMetadata...');
      // call DynamicNFT.updateMetadata(tokenId, addXp, traits)
      await contracts.DynamicNFT.methods.updateMetadata(1, 100, "DemoTrait").send({ from: account });
      setStatus('updateMetadata tx sent (check Ganache)');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }

  async function addReputation() {
    try {
      setStatus('Adding reputation...');
      await contracts.Reputation.methods.addReputation(account, 10).send({ from: account });
      setStatus('Reputation added');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }

  async function issueTicket() {
    try {
      setStatus('Issuing ticket...');
      await contracts.Utility.methods.issueTicket(account, 7, "DemoTicket").send({ from: account });
      setStatus('Ticket issued');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }

  async function instantAck() {
    try {
      setStatus('Calling instantAcknowledge...');
      await contracts.FastTransfer.methods.instantAcknowledge(account, "0x0000000000000000000000000000000000000001", 1).send({ from: account });
      setStatus('Instant acknowledge emitted');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }

  return (
    <div className="card sci">
      <h4>Admin / Demo Controls</h4>
      <p>Demo mode active: <strong>{process.env.REACT_APP_DEMO_MODE === 'true' ? 'YES' : 'NO'}</strong></p>
      <button onClick={updateMetadata}>Update NFT Metadata (add 100 XP)</button>
      <button onClick={addReputation}>Add Reputation (+10)</button>
      <button onClick={issueTicket}>Issue Ticket (7 days)</button>
      <button onClick={instantAck}>Instant Acknowledge (FastTransfer)</button>
      <p style={{marginTop:10}}>Status: {status}</p>
    </div>
  );
}

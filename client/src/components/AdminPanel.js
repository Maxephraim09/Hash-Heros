import React, { useState, useCallback } from 'react';

const AdminPanel = ({ contracts, account }) => {
  const [status, setStatus] = useState('');

  if (!contracts) return <div className="card sci"><h4>Admin Panel</h4><p>Contracts not loaded</p></div>;

  const updateMetadata = useCallback(async () => {
    try {
      setStatus('Sending updateMetadata...');
      await contracts.DynamicNFT.methods.updateMetadata(1, 100, "DemoTrait").send({ from: account });
      setStatus('updateMetadata tx sent (check Ganache)');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }, [contracts, account]);

  const addReputation = useCallback(async () => {
    try {
      setStatus('Adding reputation...');
      await contracts.Reputation.methods.addReputation(account, 10).send({ from: account });
      setStatus('Reputation added');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }, [contracts, account]);

  const issueTicket = useCallback(async () => {
    try {
      setStatus('Issuing ticket...');
      await contracts.Utility.methods.issueTicket(account, 7, "DemoTicket").send({ from: account });
      setStatus('Ticket issued');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }, [contracts, account]);

  const instantAck = useCallback(async () => {
    try {
      setStatus('Calling instantAcknowledge...');
      await contracts.FastTransfer.methods.instantAcknowledge(account, "0x0000000000000000000000000000000000000001", 1).send({ from: account });
      setStatus('Instant acknowledge emitted');
    } catch (e) {
      setStatus('Error: ' + (e.message || e));
    }
  }, [contracts, account]);

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
};

export default React.memo(AdminPanel);

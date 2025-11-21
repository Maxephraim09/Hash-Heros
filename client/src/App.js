import React, { useEffect, useState } from 'react';
import { initWeb3, loadContracts } from './services/web3Service';
import { GameProvider } from './context/GameState';
import TapToEarn from './components/TapToEarn';
import NFT_Evolution from './components/NFT_Evolution';
import ReputationBadge from './components/ReputationBadge';
import AIGenerator from './components/AIGenerator';
import InstantTransfer from './components/InstantTransfer';
import AdminPanel from './components/AdminPanel';
import Missions from './components/Missions';
import './styles.css';

function App(){
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const web3 = await initWeb3();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const cs = await loadContracts();
        setContracts(cs);
      } catch(e) {
        console.warn('Web3 init failed', e);
      }
    })();
  }, []);

  return (
    <GameProvider>
      <div className="app sci-bg">
        <header className="sci-header">
          <h1>Hashing Heros — BlockDAG Demo (Sci-Fi)</h1>
          <p>Account: {account}</p>
        </header>
        <main className="grid">
          <TapToEarn />
          <NFT_Evolution />
          <ReputationBadge />
          <AIGenerator />
          <InstantTransfer account={account} />
          <AdminPanel contracts={contracts} account={account} />
          <Missions />
        </main>
      </div>
    </GameProvider>
  );
}

export default App;

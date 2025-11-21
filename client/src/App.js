import React, { useEffect, useState, Suspense } from 'react';
import { initWeb3, loadContracts } from './services/web3Service';
import { GameProvider } from './context/GameState';
import { registerServiceWorker, onOnlineStatusChange } from './utils/serviceWorkerManager';
import { offlineStorage } from './utils/offlineStorage';
import { prefetchCommonResources } from './utils/imageOptimization';
import { performanceMonitor } from './utils/performanceMonitoring';
import Preloader from './components/Preloader';

// Code splitting: Load components lazily on demand
const TapToEarn = React.lazy(() => import('./components/TapToEarn'));
const NFT_Evolution = React.lazy(() => import('./components/NFT_Evolution'));
const ReputationBadge = React.lazy(() => import('./components/ReputationBadge'));
const AIGenerator = React.lazy(() => import('./components/AIGenerator'));
const InstantTransfer = React.lazy(() => import('./components/InstantTransfer'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const Missions = React.lazy(() => import('./components/Missions'));

import './styles.css';

function App(){
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register Service Worker for offline support and caching
    registerServiceWorker();

    // Initialize offline storage (IndexedDB)
    offlineStorage.init().catch(err => console.warn('IndexedDB init failed:', err));

    // Prefetch common resources when browser is idle
    prefetchCommonResources();

    // Get Core Web Vitals
    performanceMonitor.getCoreWebVitals();

    // Monitor online/offline status
    const unsubscribe = onOnlineStatusChange(setIsOnline);
    return unsubscribe;
  }, []);

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
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <GameProvider>
      <div className="app sci-bg">
        <header className="sci-header">
          <h1>Hashing Heros — Dynamic NFT Network</h1>
          <p>Account: {account}</p>
          <p style={{ fontSize: '12px', marginTop: '5px' }}>
            Status: {isOnline ? '🟢 Online' : '🔴 Offline'}
          </p>
        </header>
        <main className="grid">
          <Suspense fallback={<div className="card sci"><p>Loading...</p></div>}>
            <TapToEarn />
          </Suspense>
          <Suspense fallback={<div className="card sci"><p>Loading...</p></div>}>
            <NFT_Evolution />
          </Suspense>
          <Suspense fallback={<div className="card sci"><p>Loading...</p></div>}>
            <ReputationBadge />
          </Suspense>
          <Suspense fallback={<div className="card sci"><p>Loading...</p></div>}>
            <AIGenerator />
          </Suspense>
          <Suspense fallback={<div className="card sci"><p>Loading...</p></div>}>
            <InstantTransfer account={account} />
          </Suspense>
          <Suspense fallback={<div className="card sci"><p>Loading...</p></div>}>
            <AdminPanel contracts={contracts} account={account} />
          </Suspense>
          <Suspense fallback={<div className="card sci"><p>Loading...</p></div>}>
            <Missions />
          </Suspense>
        </main>
      </div>
    </GameProvider>
  );
}

export default App;

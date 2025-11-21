import React, { useEffect, useState, Suspense, useContext } from 'react';
import { initWeb3, loadContracts } from './services/web3Service';
import { GameProvider, GameContext } from './context/GameState';
import { registerServiceWorker, onOnlineStatusChange } from './utils/serviceWorkerManager';
import { offlineStorage } from './utils/offlineStorage';
import { prefetchCommonResources } from './utils/imageOptimization';
import * as performanceMonitor from './utils/performanceMonitor';
import Preloader from './components/Preloader';
import WalletConnect from './components/WalletConnect';
import TokenDashboard from './components/TokenDashboard';

// Code splitting: Load components lazily on demand
const TapToEarn = React.lazy(() => import('./components/TapToEarn'));
const NFT_Evolution = React.lazy(() => import('./components/NFT_Evolution'));
const ReputationBadge = React.lazy(() => import('./components/ReputationBadge'));
const AIGenerator = React.lazy(() => import('./components/AIGenerator'));
const InstantTransfer = React.lazy(() => import('./components/InstantTransfer'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const Missions = React.lazy(() => import('./components/Missions'));

import './styles.css';

function AppContent(){
  const { state, dispatch } = useContext(GameContext);
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBlockDAG, setIsBlockDAG] = useState(false);

  useEffect(() => {
    // Register Service Worker for offline support and caching
    registerServiceWorker();

    // Initialize offline storage (IndexedDB)
    offlineStorage.init().catch(err => console.warn('IndexedDB init failed:', err));

    // Prefetch common resources when browser is idle
    prefetchCommonResources();

    // Measure page load performance
    performanceMonitor.measurePageLoad();

    // Get Core Web Vitals (LCP, FID, CLS)
    performanceMonitor.measureWebVitals((vitals) => {
      console.log('Core Web Vitals:', vitals);
      // You can send this to analytics service here
    });

    // Assess overall Web Vitals health
    const assessment = performanceMonitor.assessWebVitals();
    if (assessment.status !== 'good') {
      console.warn(`⚠️ Web Vitals Assessment: ${assessment.status}`, assessment.details);
    }

    // Monitor online/offline status
    const unsubscribe = onOnlineStatusChange(setIsOnline);
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Measure web3 initialization time
        const web3StartTime = performance.now();
        
        const web3 = await initWeb3();
        const accounts = await web3.eth.getAccounts();
        
        const web3InitTime = performance.now() - web3StartTime;
        performanceMonitor.measureApiCall('web3_initialization', web3InitTime);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          dispatch({ type: 'SET_USER_ADDRESS', payload: accounts[0] });
        }
        
        const cs = await loadContracts();
        setContracts(cs);
        setIsBlockDAG(cs?.isBlockDAG || false);
      } catch(e) {
        console.warn('Web3 init failed', e);
      } finally {
        setIsLoading(false);
        // Log final metrics when ready
        setTimeout(() => {
          const allMetrics = performanceMonitor.getMetrics();
          console.log('📊 Performance Metrics:', allMetrics);
        }, 1000);
      }
    })();
  }, [dispatch]);

  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
    if (newAccount) {
      dispatch({ type: 'SET_USER_ADDRESS', payload: newAccount });
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="app sci-bg">
      <header className="sci-header">
        <div className="header-top">
          <h1>⛓️ Hashing Heros — BlockDAG Dynamic NFT Network</h1>
          <p className="tagline">Instant. Scalable. Decentralized.</p>
        </div>
        <div className="header-status">
          <p>
            <span className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
            {isBlockDAG && <span className="blockdag-badge">⚡ BlockDAG Awakening</span>}
          </p>
        </div>
      </header>

      <div className="app-container">
        {/* Wallet Connection Widget */}
        <section className="wallet-section">
          <WalletConnect account={account} onAccountChange={handleAccountChange} />
        </section>

        {/* Token Dashboard */}
        {account && (
          <section className="token-section">
            <TokenDashboard account={account} />
          </section>
        )}

        {/* Main Game Grid */}
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
    </div>
  );
}

function App(){
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;

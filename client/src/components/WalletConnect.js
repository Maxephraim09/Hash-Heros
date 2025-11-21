import React, { useState, useEffect, useCallback } from 'react';
import { connectMetaMask, getCurrentAccount, getBalance, isBlockDAGNetwork } from '../services/web3Service';

const WalletConnect = ({ onAccountChange }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBlockDAG, setIsBlockDAG] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setConnectionStatus('connected');
            onAccountChange && onAccountChange(accounts[0]);
            fetchBalance(accounts[0]);
          }
        }
      } catch (err) {
        console.warn('Could not check wallet connection:', err);
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnectionStatus('connected');
          onAccountChange && onAccountChange(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
          setAccount(null);
          setConnectionStatus('disconnected');
          onAccountChange && onAccountChange(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [onAccountChange]);

  const fetchBalance = useCallback(async (addr) => {
    try {
      const bal = await getBalance(addr);
      setBalance(parseFloat(bal).toFixed(4));
    } catch (err) {
      console.warn('Could not fetch balance:', err);
      setBalance('N/A');
    }
  }, []);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const { account: connectedAccount, isBlockDAG: isDAG } = await connectMetaMask();
      setAccount(connectedAccount);
      setIsBlockDAG(isDAG);
      setConnectionStatus('connected');
      onAccountChange && onAccountChange(connectedAccount);
      fetchBalance(connectedAccount);
    } catch (err) {
      setError(err.message);
      setConnectionStatus('error');
      console.error('MetaMask connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [onAccountChange, fetchBalance]);

  const handleGetTestBDAG = useCallback(() => {
    const faucetUrl = process.env.REACT_APP_FAUCET_URL || 'https://awakening.bdagscan.com/faucet';
    window.open(faucetUrl, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="wallet-connect-card">
      <h3>💳 Wallet Connection</h3>
      
      {connectionStatus === 'disconnected' ? (
        <div className="wallet-section">
          <p className="wallet-status">No wallet connected</p>
          <button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="wallet-btn connect-btn"
          >
            {isConnecting ? '🔄 Connecting...' : '🦊 Connect MetaMask'}
          </button>
          {!window.ethereum && (
            <p className="wallet-warning">
              ⚠️ MetaMask not detected. <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Install MetaMask</a>
            </p>
          )}
        </div>
      ) : (
        <div className="wallet-section">
          <div className="wallet-info">
            <p className="wallet-status connected">✅ Connected to {isBlockDAG ? 'BlockDAG Awakening' : 'Network'}</p>
            <p className="wallet-address">
              <strong>Account:</strong>
              <code>{account?.substring(0, 6)}...{account?.substring(account.length - 4)}</code>
            </p>
            <p className="wallet-balance">
              <strong>Balance:</strong>
              <span className="balance-value">{balance} BDAG</span>
            </p>
          </div>
          <button 
            onClick={handleDisconnect}
            className="wallet-btn disconnect-btn"
          >
            🔌 Disconnect
          </button>
          {isBlockDAG && account && (
            <button 
              onClick={handleGetTestBDAG}
              className="wallet-btn faucet-btn"
              title="Get test BDAG tokens from faucet"
            >
              💧 Get Test BDAG
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="wallet-error">
          <p>❌ {error}</p>
        </div>
      )}

      <style jsx>{`
        .wallet-connect-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #0f3460;
          border-radius: 12px;
          padding: 20px;
          margin: 10px 0;
          font-family: 'Courier New', monospace;
          color: #00d4ff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .wallet-connect-card h3 {
          margin: 0 0 15px 0;
          font-size: 1.2rem;
          color: #00d4ff;
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .wallet-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wallet-status {
          margin: 0;
          padding: 8px 12px;
          background: rgba(0, 212, 255, 0.1);
          border-left: 3px solid #00d4ff;
          font-size: 0.9rem;
        }

        .wallet-status.connected {
          border-left-color: #00ff00;
          color: #00ff00;
        }

        .wallet-info {
          background: rgba(15, 52, 96, 0.5);
          border-radius: 8px;
          padding: 12px;
          border: 1px solid #0f3460;
        }

        .wallet-address,
        .wallet-balance {
          margin: 8px 0;
          font-size: 0.85rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .wallet-address strong,
        .wallet-balance strong {
          color: #00d4ff;
          margin-right: 8px;
        }

        .wallet-address code {
          background: rgba(0, 0, 0, 0.3);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        .balance-value {
          color: #00ff00;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .wallet-btn {
          padding: 10px 16px;
          border: 2px solid #00d4ff;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.05));
          color: #00d4ff;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          font-family: 'Courier New', monospace;
        }

        .wallet-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.1));
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
          transform: translateY(-2px);
        }

        .wallet-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .disconnect-btn {
          border-color: #ff6b6b;
          color: #ff6b6b;
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05));
        }

        .disconnect-btn:hover {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1));
          box-shadow: 0 0 15px rgba(255, 107, 107, 0.4);
        }

        .faucet-btn {
          border-color: #00ff88;
          color: #00ff88;
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05));
        }

        .faucet-btn:hover {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1));
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
        }

        .wallet-error {
          background: rgba(255, 107, 107, 0.15);
          border: 1px solid #ff6b6b;
          border-radius: 6px;
          padding: 10px;
          margin-top: 10px;
        }

        .wallet-error p {
          margin: 0;
          color: #ff6b6b;
          font-size: 0.9rem;
        }

        .wallet-warning {
          background: rgba(255, 193, 7, 0.15);
          border: 1px solid #ffc107;
          border-radius: 6px;
          padding: 10px;
          margin: 0;
          color: #ffc107;
          font-size: 0.85rem;
        }

        .wallet-warning a {
          color: #ffc107;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .wallet-connect-card {
            padding: 15px;
          }

          .wallet-connect-card h3 {
            font-size: 1rem;
          }

          .wallet-address,
          .wallet-balance {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(WalletConnect);

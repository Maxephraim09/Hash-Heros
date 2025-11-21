import React, { useState, useEffect, useCallback, useContext } from 'react';
import { GameContext } from '../context/GameState';
import {
  getPendingTokens,
  getClaimedTokens,
  getTotalTokens,
  claimPendingTokens,
  getEarningsHistory,
  calculateDailyEarningPotential,
  tokenToUSD
} from '../services/tokenEarnings';

const TokenDashboard = ({ account }) => {
  const { state } = useContext(GameContext);
  const [pendingTokens, setPendingTokens] = useState(0);
  const [claimedTokens, setClaimedTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [claimStatus, setClaimStatus] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [dailyPotential, setDailyPotential] = useState(null);

  useEffect(() => {
    if (account) {
      updateTokenBalances();
      updateEarningsHistory();
      calculatePotential();
    }
  }, [account, state.xp, state.reputation]);

  const updateTokenBalances = useCallback(() => {
    if (!account) return;
    setPendingTokens(getPendingTokens(account));
    setClaimedTokens(getClaimedTokens(account));
    setTotalTokens(getTotalTokens(account));
  }, [account]);

  const updateEarningsHistory = useCallback(() => {
    if (!account) return;
    const history = getEarningsHistory(account, 10);
    setEarningsHistory(history);
  }, [account]);

  const calculatePotential = useCallback(() => {
    const potential = calculateDailyEarningPotential({
      level: state.level,
      reputation: state.reputation,
      nftCount: 1,
      avgNFTLevel: 1
    });
    setDailyPotential(potential);
  }, [state.level, state.reputation]);

  const handleClaimTokens = useCallback(async () => {
    if (pendingTokens <= 0) {
      setClaimStatus('No tokens to claim');
      return;
    }

    setIsClaiming(true);
    setClaimStatus('Processing claim...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate tx
      const claim = claimPendingTokens(account);
      setClaimStatus(`✅ Claimed ${pendingTokens.toFixed(4)} BDAG! TxHash: ${claim.txHash.substring(0, 10)}...`);
      updateTokenBalances();
      updateEarningsHistory();
    } catch (error) {
      setClaimStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsClaiming(false);
    }
  }, [account, pendingTokens, updateTokenBalances, updateEarningsHistory]);

  return (
    <div className="token-dashboard">
      <h3>💰 BDAG Token Economy</h3>

      {/* Token Balance Cards */}
      <div className="token-cards-row">
        <div className="token-card pending">
          <div className="token-card-header">🔮 Pending Rewards</div>
          <div className="token-amount">{pendingTokens.toFixed(4)}</div>
          <div className="token-currency">BDAG</div>
          <div className="token-usd">${tokenToUSD(pendingTokens)}</div>
          {pendingTokens > 0 && (
            <button
              onClick={handleClaimTokens}
              disabled={isClaiming}
              className="claim-btn"
            >
              {isClaiming ? '⏳ Claiming...' : '🎯 Claim Now'}
            </button>
          )}
        </div>

        <div className="token-card claimed">
          <div className="token-card-header">✅ Claimed Balance</div>
          <div className="token-amount">{claimedTokens.toFixed(4)}</div>
          <div className="token-currency">BDAG</div>
          <div className="token-usd">${tokenToUSD(claimedTokens)}</div>
          <div className="token-info">In Wallet</div>
        </div>

        <div className="token-card total">
          <div className="token-card-header">📊 All-Time Total</div>
          <div className="token-amount">{totalTokens.toFixed(4)}</div>
          <div className="token-currency">BDAG</div>
          <div className="token-usd">${tokenToUSD(totalTokens)}</div>
          <div className="token-info">Earned</div>
        </div>
      </div>

      {/* Claim Status */}
      {claimStatus && (
        <div className={`claim-status ${isClaiming ? 'processing' : ''}`}>
          {claimStatus}
        </div>
      )}

      {/* Daily Earning Potential */}
      {dailyPotential && (
        <div className="earning-potential">
          <h4>📈 Daily Earning Potential</h4>
          <div className="earning-sources">
            <div className="earning-item">
              <span>🖱️ From Tapping:</span>
              <strong>{dailyPotential.tapEarnings.toFixed(4)} BDAG</strong>
            </div>
            <div className="earning-item">
              <span>🎮 From NFT Evolution:</span>
              <strong>{dailyPotential.evolutionEarnings.toFixed(4)} BDAG</strong>
            </div>
            <div className="earning-item">
              <span>⭐ From Reputation:</span>
              <strong>{dailyPotential.reputationEarnings.toFixed(4)} BDAG</strong>
            </div>
            <div className="earning-item">
              <span>🏆 From Missions:</span>
              <strong>{dailyPotential.missionEarnings.toFixed(4)} BDAG</strong>
            </div>
            <div className="earning-item">
              <span>📅 Login Bonus:</span>
              <strong>{dailyPotential.loginEarnings.toFixed(4)} BDAG</strong>
            </div>
            <div className="earning-total">
              <span>📊 Estimated Daily:</span>
              <strong>{dailyPotential.totalDaily.toFixed(4)} BDAG</strong>
            </div>
            <div className="earning-total monthly">
              <span>📆 Estimated Monthly:</span>
              <strong>{dailyPotential.totalMonthly.toFixed(4)} BDAG</strong>
            </div>
          </div>
        </div>
      )}

      {/* Recent Earnings */}
      {earningsHistory.length > 0 && (
        <div className="earnings-history">
          <h4>📜 Recent Earnings</h4>
          <div className="earnings-list">
            {earningsHistory.map((earning) => (
              <div key={earning.id} className={`earning-entry ${earning.status}`}>
                <div className="earning-source">{earning.source}</div>
                <div className="earning-details">
                  <span className="earning-amount">+{earning.amount.toFixed(4)} BDAG</span>
                  <span className="earning-time">
                    {new Date(earning.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {earning.description && (
                  <div className="earning-desc">{earning.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .token-dashboard {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #00d4ff;
          border-radius: 12px;
          padding: 20px;
          margin: 15px 0;
          color: #00d4ff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .token-dashboard h3 {
          margin: 0 0 20px 0;
          font-size: 1.3rem;
          text-align: center;
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .token-cards-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .token-card {
          background: rgba(15, 52, 96, 0.6);
          border: 2px solid #0f3460;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .token-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .token-card:hover::before {
          left: 100%;
        }

        .token-card:hover {
          border-color: #00d4ff;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
          transform: translateY(-3px);
        }

        .token-card.pending {
          border-color: #ffc107;
        }

        .token-card.pending:hover {
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.4);
        }

        .token-card.claimed {
          border-color: #00ff00;
        }

        .token-card.claimed:hover {
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.4);
        }

        .token-card.total {
          border-color: #00d4ff;
        }

        .token-card-header {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .token-amount {
          font-size: 1.8rem;
          font-weight: bold;
          color: #fff;
          margin: 8px 0;
        }

        .token-card.pending .token-amount {
          color: #ffc107;
        }

        .token-card.claimed .token-amount {
          color: #00ff00;
        }

        .token-currency {
          font-size: 0.9rem;
          color: #00d4ff;
          margin-bottom: 4px;
        }

        .token-usd {
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 12px;
        }

        .token-info {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 10px;
        }

        .claim-btn {
          width: 100%;
          padding: 8px;
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1));
          border: 1px solid #ffc107;
          color: #ffc107;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .claim-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(255, 193, 7, 0.2));
          box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
        }

        .claim-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .claim-status {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid #00d4ff;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 15px;
          text-align: center;
          font-size: 0.9rem;
          color: #00d4ff;
        }

        .claim-status.processing {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
          color: #ffc107;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .earning-potential {
          background: rgba(0, 255, 0, 0.05);
          border-left: 3px solid #00ff00;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .earning-potential h4 {
          margin: 0 0 12px 0;
          color: #00ff00;
        }

        .earning-sources {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }

        .earning-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .earning-item span {
          color: #888;
        }

        .earning-item strong {
          color: #00ff00;
          margin-left: 8px;
        }

        .earning-total {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff00;
          border-radius: 4px;
          font-weight: bold;
        }

        .earning-total.monthly {
          background: rgba(0, 212, 255, 0.1);
          border-color: #00d4ff;
        }

        .earning-total span {
          color: #00ff00;
        }

        .earning-total.monthly span {
          color: #00d4ff;
        }

        .earning-total strong {
          color: #00ff00;
        }

        .earning-total.monthly strong {
          color: #00d4ff;
        }

        .earnings-history {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid #0f3460;
          border-radius: 8px;
          padding: 15px;
        }

        .earnings-history h4 {
          margin: 0 0 12px 0;
          color: #00d4ff;
        }

        .earnings-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .earnings-list::-webkit-scrollbar {
          width: 6px;
        }

        .earnings-list::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }

        .earnings-list::-webkit-scrollbar-thumb {
          background: #00d4ff;
          border-radius: 3px;
        }

        .earning-entry {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #0f3460;
          font-size: 0.85rem;
          transition: background 0.2s ease;
        }

        .earning-entry:last-child {
          border-bottom: none;
        }

        .earning-entry:hover {
          background: rgba(0, 212, 255, 0.05);
        }

        .earning-entry.pending {
          opacity: 0.7;
        }

        .earning-source {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-width: 100px;
        }

        .earning-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          margin: 0 10px;
        }

        .earning-amount {
          color: #00ff00;
          font-weight: bold;
        }

        .earning-time {
          color: #666;
          font-size: 0.75rem;
        }

        .earning-desc {
          color: #888;
          font-size: 0.75rem;
          margin-top: 4px;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .token-cards-row {
            grid-template-columns: 1fr;
          }

          .earning-sources {
            grid-template-columns: 1fr;
          }

          .earning-total {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(TokenDashboard);

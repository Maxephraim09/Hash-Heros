import React, { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameState';
import { earnFromReputation } from '../services/tokenEarnings';

const ReputationBadge = () => {
  const { state, addReputation } = useContext(GameContext);

  // Calculate reputation tier and badges
  const reputationStats = useMemo(() => {
    const rep = state.reputation;
    
    let tier = 'Bronze';
    let tierColor = '#CD7F32';
    let nextTierRep = 10;
    
    if (rep >= 100) {
      tier = 'Legendary';
      tierColor = '#FFD700';
      nextTierRep = 150;
    } else if (rep >= 50) {
      tier = 'Platinum';
      tierColor = '#E5E4E2';
      nextTierRep = 100;
    } else if (rep >= 30) {
      tier = 'Gold';
      tierColor = '#FFD700';
      nextTierRep = 50;
    } else if (rep >= 15) {
      tier = 'Silver';
      tierColor = '#C0C0C0';
      nextTierRep = 30;
    } else if (rep >= 5) {
      tier = 'Bronze';
      tierColor = '#CD7F32';
      nextTierRep = 15;
    }

    const progressToNextTier = nextTierRep - rep;
    const progressPercent = Math.max(0, (rep - (nextTierRep - 15)) / 15 * 100);

    return { tier, tierColor, nextTierRep, progressToNextTier, progressPercent };
  }, [state.reputation]);

  const badges = useMemo(() => {
    const earned = [];
    const rep = state.reputation;

    if (rep >= 5) earned.push({ name: 'Newcomer', icon: '🌟' });
    if (rep >= 10) earned.push({ name: 'Trusted', icon: '✅' });
    if (rep >= 15) earned.push({ name: 'Community Helper', icon: '🤝' });
    if (rep >= 30) earned.push({ name: 'Silver Member', icon: '🥈' });
    if (rep >= 50) earned.push({ name: 'Gold Member', icon: '🥇' });
    if (rep >= 100) earned.push({ name: 'Legendary', icon: '👑' });
    if (state.level >= 10) earned.push({ name: 'High Level', icon: '📈' });
    if (state.xp >= 1000) earned.push({ name: 'XP Master', icon: '⚡' });

    return earned;
  }, [state.reputation, state.level, state.xp]);

  const handleAddReputation = () => {
    addReputation(5);
    earnFromReputation(state.userAddress, 5);
  };

  return (
    <div className="card sci reputation-card">
      <h4>⭐ On-Chain Reputation</h4>
      
      {/* Reputation Score Display */}
      <div className="reputation-header">
        <div className="reputation-score">
          <div className="score-number">{state.reputation}</div>
          <div className="score-label">Points</div>
        </div>
        <div className="reputation-tier" style={{ borderColor: reputationStats.tierColor }}>
          <div className="tier-badge" style={{ backgroundColor: reputationStats.tierColor }}>
            {reputationStats.tier}
          </div>
        </div>
      </div>

      {/* Progress Bar to Next Tier */}
      <div className="reputation-progress">
        <div className="progress-label">
          <span>To {reputationStats.tier === 'Legendary' ? 'Max' : 'Next Tier'}:</span>
          <span>{reputationStats.progressToNextTier} pts</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min(reputationStats.progressPercent, 100)}%`,
              backgroundColor: reputationStats.tierColor
            }}
          />
        </div>
      </div>

      {/* Badges */}
      <div className="badges-section">
        <h5>🏆 Earned Badges</h5>
        <div className="badges-grid">
          {badges.length > 0 ? (
            badges.map((badge, idx) => (
              <div key={idx} className="badge" title={badge.name}>
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-name">{badge.name}</span>
              </div>
            ))
          ) : (
            <p className="no-badges">Earn reputation to unlock badges</p>
          )}
        </div>
      </div>

      {/* Reputation Information */}
      <div className="reputation-info">
        <p>📊 <strong>How It Works:</strong></p>
        <ul>
          <li>Earn rep from activities (evolution, transfers, missions)</li>
          <li>Rep determines your on-chain identity NFT level</li>
          <li>Higher rep = better rewards and platform features</li>
          <li>Rep score is immutable on BlockDAG</li>
        </ul>
      </div>

      {/* Test Button (Demo) */}
      <button onClick={handleAddReputation} className="test-rep-btn">
        + Add 5 Rep (Demo)
      </button>

      <style jsx>{`
        .reputation-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
          border: 2px solid #00d4ff;
        }

        .reputation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
        }

        .reputation-score {
          text-align: center;
        }

        .score-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #00d4ff;
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .score-label {
          font-size: 0.8rem;
          color: #888;
          margin-top: 4px;
        }

        .reputation-tier {
          border: 3px solid;
          border-radius: 8px;
          padding: 10px 20px;
          background: rgba(0, 0, 0, 0.5);
        }

        .tier-badge {
          color: white;
          font-weight: bold;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.9rem;
          text-align: center;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .reputation-progress {
          margin-bottom: 20px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 6px;
        }

        .progress-bar {
          height: 8px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #0f3460;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease, background-color 0.3s ease;
          box-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
        }

        .badges-section {
          margin-bottom: 15px;
        }

        .badges-section h5 {
          margin: 0 0 10px 0;
          font-size: 0.9rem;
          color: #00d4ff;
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 8px;
        }

        .badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid #00d4ff;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .badge:hover {
          background: rgba(0, 212, 255, 0.2);
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
          transform: translateY(-2px);
        }

        .badge-icon {
          font-size: 1.5rem;
        }

        .badge-name {
          font-size: 0.65rem;
          color: #00d4ff;
          text-align: center;
          line-height: 1.2;
        }

        .no-badges {
          text-align: center;
          color: #666;
          font-size: 0.8rem;
          margin: 0;
          padding: 20px 0;
        }

        .reputation-info {
          background: rgba(0, 212, 255, 0.05);
          border-left: 3px solid #00d4ff;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 15px;
          font-size: 0.8rem;
        }

        .reputation-info p {
          margin: 0 0 8px 0;
          color: #00d4ff;
          font-weight: bold;
        }

        .reputation-info ul {
          margin: 0;
          padding-left: 20px;
          color: #888;
        }

        .reputation-info li {
          margin: 4px 0;
          line-height: 1.4;
        }

        .test-rep-btn {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.1));
          border: 1px solid #00d4ff;
          color: #00d4ff;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .test-rep-btn:hover {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.2));
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }

        @media (max-width: 768px) {
          .reputation-header {
            flex-direction: column;
            gap: 15px;
          }

          .score-number {
            font-size: 2rem;
          }

          .badges-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(ReputationBadge);

import React, { useContext } from 'react';
import { GameContext } from '../context/GameState';

const ReputationBadge = () => {
  const { state } = useContext(GameContext);
  const rank = state.reputation >= 50 ? 'Legend' : state.reputation >=20 ? 'Gold' : state.reputation >=10 ? 'Silver' : 'Bronze';
  return (
    <div className="card sci">
      <h4>Reputation</h4>
      <p>Score: {state.reputation} | Rank: {rank}</p>
    </div>
  );
};

export default React.memo(ReputationBadge);

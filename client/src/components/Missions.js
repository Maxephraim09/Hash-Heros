import React, { useContext } from 'react';
import { GameContext } from '../context/GameState';

export default function Missions(){
  const { state, dispatch } = useContext(GameContext);

  function completeDaily(){
    dispatch({ type:'ADD_XP', payload: 50 });
    dispatch({ type:'ADD_REP', payload: 2 });
    dispatch({ type:'ADD_BADGE', payload: 'Daily' });
    alert('Daily mission completed! +50 XP');
  }

  return (
    <div className="card sci">
      <h4>Missions</h4>
      <button onClick={completeDaily}>Complete Daily (50 XP)</button>
      <p>Badges: {state.badges.join(', ') || '—'}</p>
    </div>
  );
}

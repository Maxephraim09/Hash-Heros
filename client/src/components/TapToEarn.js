import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameState';

export default function TapToEarn(){
  const { state, dispatch } = useContext(GameContext);
  const [taps, setTaps] = useState(0);

  function tap(){
    if(state.energy <= 0) return alert('Energy empty. Use refill.');
    dispatch({ type:'ADD_XP', payload: 5 });
    dispatch({ type:'DECREASE_ENERGY', payload: 1 });
    setTaps(t => t+1);
  }

  return (
    <div className="card sci">
      <h4>Tap-to-Earn (XEN)</h4>
      <p>Energy: {state.energy} | XP: {state.xp} | Level: {state.level}</p>
      <button onClick={tap}>Tap</button>
    </div>
  );
}

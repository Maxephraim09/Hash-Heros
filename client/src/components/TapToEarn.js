import React, { useState, useContext, useCallback, useMemo } from 'react';
import { GameContext } from '../context/GameState';
import { throttle } from '../utils/optimizations';

const TapToEarn = () => {
  const { state, dispatch } = useContext(GameContext);
  const [taps, setTaps] = useState(0);

  // Throttle tap events to prevent state update spam (max 1 tap per 100ms)
  const throttledTap = useMemo(() => {
    const tapImpl = () => {
      if(state.energy <= 0) return alert('Energy empty. Use refill.');
      dispatch({ type:'ADD_XP', payload: 5 });
      dispatch({ type:'DECREASE_ENERGY', payload: 1 });
      setTaps(t => t+1);
    };
    return throttle(tapImpl, 100); // Max 1 tap per 100ms
  }, [state.energy, dispatch]);

  const tap = useCallback(() => {
    throttledTap();
  }, [throttledTap]);

  return (
    <div className="card sci">
      <h4>Tap-to-Earn (XEN)</h4>
      <p>Energy: {state.energy} | XP: {state.xp} | Level: {state.level}</p>
      <button onClick={tap}>Tap</button>
    </div>
  );
};

export default React.memo(TapToEarn);

import React, { createContext, useReducer } from 'react';

const initial = { xp:0, level:1, energy:50, reputation:0, badges:[] };

function reducer(state, action){
  switch(action.type){
    case 'ADD_XP': {
      const xp = state.xp + action.payload;
      const level = Math.floor(xp / 200) + 1;
      return { ...state, xp, level };
    }
    case 'DECREASE_ENERGY': return { ...state, energy: Math.max(0, state.energy - action.payload) };
    case 'REFILL_ENERGY': return { ...state, energy: Math.min(100, state.energy + action.payload) };
    case 'ADD_REP': return { ...state, reputation: state.reputation + action.payload };
    case 'ADD_BADGE': return { ...state, badges: [...state.badges, action.payload] };
    default: return state;
  }
}

export const GameContext = createContext();

export function GameProvider({ children }){
  const [state, dispatch] = useReducer(reducer, initial);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

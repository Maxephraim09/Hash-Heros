import React, { createContext, useReducer, useMemo, useCallback } from 'react';
import {
  earnFromTapping,
  earnFromNFTEvolution,
  earnFromTransfer,
  earnFromReputation,
  getPendingTokens,
  getClaimedTokens,
  getTotalTokens,
  claimPendingTokens
} from '../services/tokenEarnings';

const initialState = {
  // Game stats
  xp: 0,
  level: 1,
  energy: 50,
  reputation: 0,
  badges: [],
  
  // Token economy
  pendingBDAG: 0,
  claimedBDAG: 0,
  totalBDAG: 0,
  
  // NFT stats
  ownedNFTs: [],
  dynamicNFT: { id: 1, xp: 0, level: 1, traits: '' },
  
  // User address (from wallet)
  userAddress: null,
  
  // Activity log
  activities: [],
  
  // Transactions
  transactions: []
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_ADDRESS':
      return { ...state, userAddress: action.payload };
    
    case 'ADD_XP': {
      const xp = state.xp + action.payload;
      const level = Math.floor(xp / 200) + 1;
      
      // Earn tokens from XP gain
      if (action.payload > 0 && action.source === 'tap') {
        earnFromTapping(state.userAddress, level, 1);
      }
      
      return { ...state, xp, level };
    }
    
    case 'DECREASE_ENERGY':
      return { ...state, energy: Math.max(0, state.energy - action.payload) };
    
    case 'REFILL_ENERGY':
      return { ...state, energy: Math.min(100, state.energy + action.payload) };
    
    case 'ADD_REP': {
      const newRep = state.reputation + action.payload;
      
      // Earn tokens from reputation
      if (action.payload > 0) {
        earnFromReputation(state.userAddress, action.payload);
      }
      
      return { ...state, reputation: newRep };
    }
    
    case 'ADD_BADGE':
      return { ...state, badges: [...state.badges, action.payload] };
    
    case 'UPDATE_DYNAMIC_NFT': {
      const nft = action.payload;
      const newLevel = Math.floor(nft.xp / 200) + 1;
      
      // Earn tokens from NFT evolution
      if (newLevel > state.dynamicNFT.level) {
        earnFromNFTEvolution(state.userAddress, newLevel);
      }
      
      return { ...state, dynamicNFT: nft };
    }
    
    case 'UPDATE_TOKEN_BALANCE':
      return {
        ...state,
        pendingBDAG: action.payload.pending || state.pendingBDAG,
        claimedBDAG: action.payload.claimed || state.claimedBDAG,
        totalBDAG: action.payload.total || state.totalBDAG
      };
    
    case 'CLAIM_TOKENS': {
      const claimed = action.payload;
      return {
        ...state,
        pendingBDAG: Math.max(0, state.pendingBDAG - claimed),
        claimedBDAG: state.claimedBDAG + claimed,
        totalBDAG: state.totalBDAG + claimed
      };
    }
    
    case 'ADD_NFT':
      return {
        ...state,
        ownedNFTs: [...state.ownedNFTs, action.payload]
      };
    
    case 'RECORD_ACTIVITY':
      return {
        ...state,
        activities: [action.payload, ...state.activities].slice(0, 100) // Keep last 100
      };
    
    case 'RECORD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions].slice(0, 100) // Keep last 100
      };
    
    case 'TRANSFER_NFT': {
      earnFromTransfer(state.userAddress, action.payload.nftId);
      return { ...state };
    }
    
    case 'RESET_GAME':
      return { ...initialState, userAddress: state.userAddress };
    
    default:
      return state;
  }
}

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Memoized dispatch helpers
  const gameActions = useMemo(() => ({
    setUserAddress: (address) => dispatch({ type: 'SET_USER_ADDRESS', payload: address }),
    addXP: (amount, source = 'activity') => dispatch({ type: 'ADD_XP', payload: amount, source }),
    decreaseEnergy: (amount) => dispatch({ type: 'DECREASE_ENERGY', payload: amount }),
    refillEnergy: (amount) => dispatch({ type: 'REFILL_ENERGY', payload: amount }),
    addReputation: (amount) => dispatch({ type: 'ADD_REP', payload: amount }),
    addBadge: (badge) => dispatch({ type: 'ADD_BADGE', payload: badge }),
    updateDynamicNFT: (nft) => dispatch({ type: 'UPDATE_DYNAMIC_NFT', payload: nft }),
    updateTokenBalance: (balances) => dispatch({ type: 'UPDATE_TOKEN_BALANCE', payload: balances }),
    claimTokens: (amount) => dispatch({ type: 'CLAIM_TOKENS', payload: amount }),
    addNFT: (nft) => dispatch({ type: 'ADD_NFT', payload: nft }),
    recordActivity: (activity) => dispatch({ type: 'RECORD_ACTIVITY', payload: activity }),
    recordTransaction: (tx) => dispatch({ type: 'RECORD_TRANSACTION', payload: tx }),
    transferNFT: (nftId) => dispatch({ type: 'TRANSFER_NFT', payload: { nftId } }),
    resetGame: () => dispatch({ type: 'RESET_GAME' })
  }), []);

  // Utility functions
  const utilities = useMemo(() => ({
    getTokenBalance: () => ({
      pending: state.pendingBDAG,
      claimed: state.claimedBDAG,
      total: state.totalBDAG
    }),
    
    canClaim: () => state.pendingBDAG > 0,
    
    getStats: () => ({
      xp: state.xp,
      level: state.level,
      energy: state.energy,
      reputation: state.reputation,
      nftCount: state.ownedNFTs.length,
      badgeCount: state.badges.length
    }),
    
    getNFTStats: () => state.dynamicNFT,
    
    getActivities: (limit = 10) => state.activities.slice(0, limit),
    
    getTransactions: (limit = 10) => state.transactions.slice(0, limit),
    
    getUserProgress: () => ({
      level: state.level,
      xpForNextLevel: ((state.level) * 200) - state.xp,
      reputation: state.reputation,
      reputationTier: Math.floor(state.reputation / 100),
      nftCount: state.ownedNFTs.length
    })
  }), [state]);

  const value = useMemo(() => ({
    state,
    dispatch,
    ...gameActions,
    ...utilities
  }), [state, dispatch, gameActions, utilities]);
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook to use game context
 */
export function useGame() {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

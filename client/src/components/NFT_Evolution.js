import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { GameContext } from '../context/GameState';
import { SimpleCache, debounce } from '../utils/optimizations';

const API_URL = 'http://localhost:4002';
const nftCache = new SimpleCache(10 * 60 * 1000); // 10 minutes for NFT data

const NFT_Evolution = () => {
  const { state, dispatch } = useContext(GameContext);
  const [nft, setNft] = useState({id:1, xp:0, level:1, traits:''});
  const [apiError, setApiError] = useState(null);

  const fetchNft = useCallback(async () => {
    try {
      const cacheKey = 'nft:1';
      const cached = nftCache.get(cacheKey);
      if (cached) {
        setNft(cached);
        setApiError(null);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${API_URL}/nft/1`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      nftCache.set(cacheKey, data);
      setNft(data);
      setApiError(null);
    } catch(error) {
      console.warn('Mock API not available. Using local state only.', error.message);
      setApiError('Mock API unavailable');
    }
  }, []);

  // Debounce the evolve function to prevent rapid API calls
  const debouncedEvolve = useMemo(() => {
    const evolveImpl = async () => {
      if(state.xp < 200) return alert('Need 200 XP to evolve');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${API_URL}/nft/1/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addXp: 200, traits: `LevelUp-${Date.now()}` }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        // Invalidate cache after update
        nftCache.delete('nft:1');
      } catch(error) {
        console.warn('Could not update NFT on API:', error.message);
      }
      dispatch({ type:'ADD_XP', payload: -200 });
      dispatch({ type:'ADD_REP', payload: 2 });
      await fetchNft();
    };
    
    return debounce(evolveImpl, 300); // Prevent rapid evolve calls
  }, [state.xp, dispatch, fetchNft]);

  const evolve = useCallback(() => {
    debouncedEvolve();
  }, [debouncedEvolve]);

  useEffect(()=> {
    fetchNft();
  }, [fetchNft]);

  return (
    <div className="card sci">
      <h4>Dynamic NFT</h4>
      <img src={`/images/nft-level${nft.level}.png`} width="160" alt="nft" loading="lazy" decoding="async" />
      <p>Level {nft.level} | XP {nft.xp}</p>
      <button onClick={evolve}>Evolve (200 XP)</button>
    </div>
  );
};

export default React.memo(NFT_Evolution);

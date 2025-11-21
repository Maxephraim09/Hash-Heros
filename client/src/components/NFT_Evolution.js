import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GameContext } from '../context/GameState';

const API_URL = 'http://localhost:4002';

export default function NFT_Evolution(){
  const { state, dispatch } = useContext(GameContext);
  const [nft, setNft] = useState({id:1, xp:0, level:1, traits:''});
  const [apiError, setApiError] = useState(null);

  useEffect(()=> fetchNft(), []);

  async function fetchNft(){
    try {
      const r = await axios.get(`${API_URL}/nft/1`, { timeout: 5000 });
      setNft(r.data);
      setApiError(null);
    } catch(error) {
      console.warn('Mock API not available. Using local state only.', error.message);
      setApiError('Mock API unavailable');
      // Use local state - don't crash the app
    }
  }

  async function evolve(){
    if(state.xp < 200) return alert('Need 200 XP to evolve');
    try {
      await axios.post(`${API_URL}/nft/1/update`, { addXp: 200, traits: `LevelUp-${Date.now()}` }, { timeout: 5000 });
    } catch(error) {
      console.warn('Could not update NFT on API:', error.message);
    }
    dispatch({ type:'ADD_XP', payload: -200 });
    dispatch({ type:'ADD_REP', payload: 2 });
    fetchNft();
  }

  return (
    <div className="card sci">
      <h4>Dynamic NFT</h4>
      <img src={`/images/nft-level${nft.level}.png`} width="160" alt="nft"/>
      <p>Level {nft.level} | XP {nft.xp}</p>
      <button onClick={evolve}>Evolve (200 XP)</button>
    </div>
  );
}

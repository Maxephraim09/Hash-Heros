import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GameContext } from '../context/GameState';

export default function NFT_Evolution(){
  const { state, dispatch } = useContext(GameContext);
  const [nft, setNft] = useState({id:1, xp:0, level:1, traits:''});

  useEffect(()=> fetchNft(), []);

  async function fetchNft(){
    const r = await axios.get('http://localhost:4002/nft/1');
    setNft(r.data);
  }

  async function evolve(){
    if(state.xp < 200) return alert('Need 200 XP to evolve');
    await axios.post('http://localhost:4002/nft/1/update', { addXp: 200, traits: `LevelUp-${Date.now()}` });
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

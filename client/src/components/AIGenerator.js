import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameState';

export default function AIGenerator({ onGenerated }){
  const [meta, setMeta] = useState(null);
  const { dispatch } = useContext(GameContext);

  function generate(){
    const rarity = ["Void","Nova","Quantum","Legendary"][Math.floor(Math.random()*4)];
    const aura = Math.floor(Math.random()*100);
    const payload = { rarity, aura, createdAt: new Date().toISOString() };
    setMeta(payload);
    dispatch({ type:'ADD_REP', payload:1 });
    if(onGenerated) onGenerated(payload);
  }

  return (
    <div className="card sci">
      <h4>AI Metadata Generator</h4>
      <button onClick={generate}>Generate Trait</button>
      <pre>{meta ? JSON.stringify(meta, null, 2) : 'No trait'}</pre>
    </div>
  );
}

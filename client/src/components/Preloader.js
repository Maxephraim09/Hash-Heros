import React from 'react';
import '../styles/preloader.css';

export default function Preloader() {
  return (
    <div className="preloader-container">
      <div className="preloader-content">
        {/* Rotating Cube Circle */}
        <div className="cube-circle">
          <div className="cube-wrapper">
            <img src="/images/cube.webp" alt="Hash Heros Cube" className="rotating-cube" />
          </div>
        </div>

        {/* Glass Ripple Text */}
        <div className="ripple-text-wrapper">
          <h1 className="ripple-text">
            <span className="ripple-char">H</span>
            <span className="ripple-char">a</span>
            <span className="ripple-char">s</span>
            <span className="ripple-char">h</span>
            <span className="ripple-char"> </span>
            <span className="ripple-char">H</span>
            <span className="ripple-char">e</span>
            <span className="ripple-char">r</span>
            <span className="ripple-char">o</span>
            <span className="ripple-char">s</span>
          </h1>
        </div>

        {/* Loading Text */}
        <p className="loading-text">Loading Game...</p>
      </div>
    </div>
  );
}

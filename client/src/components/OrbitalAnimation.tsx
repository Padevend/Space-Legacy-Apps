import React from 'react';
import './OrbitalAnimation.css';

/**
 * Simple orbital animation: a planet with a satellite orbiting it.
 * Pure visual effect using CSS keyframes; fits the NASA retro‑futurist palette.
 */
export const OrbitalAnimation: React.FC = () => (
  <div className="orbital-animation-container" aria-label="Orbital animation preview">
    <div className="planet" />
    <div className="satellite" />
  </div>
);

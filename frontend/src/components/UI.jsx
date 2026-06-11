import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ScoreRing — Animated SVG circular progress ring.
 * @param {number} score   — value from 0-10 (or 0-100 if you pass raw percentage)
 * @param {number} size    — pixel diameter (default 90)
 * @param {boolean} outOf10 — if true, treats score as 0-10 and converts to %
 */
export function ScoreRing({ score = 0, size = 90, outOf10 = true }) {
  const [animatedOffset, setAnimatedOffset] = useState(0);

  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = outOf10 ? (score / 10) * 100 : score;
  const targetOffset = circumference - (circumference * Math.min(percentage, 100)) / 100;

  useEffect(() => {
    // Start from full offset, then animate to target
    setAnimatedOffset(circumference);
    const timeout = setTimeout(() => setAnimatedOffset(targetOffset), 100);
    return () => clearTimeout(timeout);
  }, [score, circumference, targetOffset]);

  // Color based on score
  const getColor = () => {
    if (percentage >= 80) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' }; // emerald
    if (percentage >= 60) return { stroke: '#d4af37', glow: 'rgba(212, 175, 55, 0.3)' };  // gold
    if (percentage >= 40) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' };  // amber
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };  // red
  };

  const color = getColor();

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${color.glow})`,
          }}
        />
      </svg>
      {/* Center number */}
      <span
        className="absolute font-black"
        style={{
          fontSize: size * 0.28,
          color: color.stroke,
        }}
      >
        {outOf10 ? score : `${Math.round(score)}%`}
      </span>
    </div>
  );
}

/**
 * Badge — Small colored pill label.
 * @param {'gold'|'violet'|'blue'|'pink'|'emerald'|'amber'} color
 */
export function Badge({ children, color = 'gold' }) {
  const palettes = {
    gold:    'bg-gold-500/10 text-gold-400 border-gold-500/20',
    violet:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pink:    'bg-pink-500/10 text-pink-400 border-pink-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${palettes[color] || palettes.gold}`}>
      {children}
    </span>
  );
}

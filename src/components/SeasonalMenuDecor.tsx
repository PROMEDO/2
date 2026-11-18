/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MenuThemeShape } from '../types';

interface SeasonalMenuDecorProps {
  shape: MenuThemeShape;
  isLight?: boolean;
}

const RamadanLanternSvg: React.FC<{ color?: string; glow?: string; size?: number }> = ({
  color = '#F59E0B',
  glow = '#FDE047',
  size = 44,
}) => (
  <svg width={size} height={size * 1.45} viewBox="0 0 48 70" fill="none" aria-hidden="true">
    <line x1="24" y1="0" x2="24" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="13" r="2.6" fill={glow} />
    <path d="M16 18 L32 18 L28 13 L20 13 Z" fill={color} />
    <path
      d="M14 20 C11 28 11 40 16 49 L32 49 C37 40 37 28 34 20 Z"
      fill="rgba(245,158,11,0.18)"
      stroke={color}
      strokeWidth="2.2"
    />
    <ellipse cx="24" cy="34" rx="5.5" ry="9" fill={glow} opacity="0.88" />
    <path d="M24 23 L24 46" stroke={color} strokeWidth="1.4" opacity="0.8" />
    <path d="M15 34 L33 34" stroke={color} strokeWidth="1.4" opacity="0.8" />
    <path d="M16 49 L32 49 L29 56 L19 56 Z" fill={color} />
    <path d="M24 56 L24 64" stroke={glow} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="24" cy="65.5" r="2.2" fill={glow} />
  </svg>
);

const CrescentStarSvg: React.FC<{ color?: string; size?: number }> = ({
  color = '#FDE047',
  size = 34,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path
      d="M24.5 7.5C17.6 8.2 12.2 14 12.2 21C12.2 28.5 18.2 34.5 25.7 34.5C28.9 34.5 31.8 33.4 34.1 31.5C32.2 32.1 30.2 32.2 28.2 31.6C22.2 29.8 18.8 23.5 20.6 17.5C21.7 13.7 24.4 10.7 27.8 9.2C26.7 8 25.7 7.4 24.5 7.5Z"
      fill={color}
    />
    <path
      d="M31 12L32.2 15.1L35.4 15.6L33 17.8L33.6 21L30.8 19.4L28 21L28.6 17.8L26.2 15.6L29.4 15.1L31 12Z"
      fill={color}
    />
  </svg>
);

const BalloonSvg: React.FC<{ color: string; shine?: string; size?: number }> = ({
  color,
  shine = '#FFFFFF',
  size = 34,
}) => (
  <svg width={size} height={size * 1.65} viewBox="0 0 40 66" fill="none" aria-hidden="true">
    <ellipse cx="20" cy="20" rx="14" ry="17.5" fill={color} />
    <ellipse cx="14.5" cy="14" rx="3.4" ry="6.2" transform="rotate(-20 14.5 14)" fill={shine} opacity="0.45" />
    <path d="M17.5 37 L22.5 37 L20 40.5 Z" fill={color} />
    <path
      d="M20 40.5 Q24 47 18 53 T21 65"
      stroke="rgba(255,255,255,0.62)"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const FireworkBurstSvg: React.FC<{ color1: string; color2: string; size?: number }> = ({
  color1,
  color2,
  size = 58,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 32 + Math.cos(angle) * 7;
      const y1 = 32 + Math.sin(angle) * 7;
      const x2 = 32 + Math.cos(angle) * 26;
      const y2 = 32 + Math.sin(angle) * 26;
      const cx = 32 + Math.cos(angle) * 29;
      const cy = 32 + Math.sin(angle) * 29;
      const col = i % 2 === 0 ? color1 : color2;
      return (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="2.1" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="2.2" fill={col} />
        </g>
      );
    })}
    <circle cx="32" cy="32" r="4" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

export const SeasonalMenuOverlay: React.FC<SeasonalMenuDecorProps> = ({ shape }) => {
  const prefersReducedMotion = useReducedMotion();

  if (shape !== 'ramadan' && shape !== 'eid' && shape !== 'newyear') {
    return null;
  }

  if (shape === 'ramadan') {
    const stars = [
      { top: '9%', left: '12%', size: 14, delay: 0 },
      { top: '16%', right: '16%', size: 11, delay: 0.8 },
      { top: '34%', left: '7%', size: 12, delay: 1.5 },
      { top: '48%', right: '6%', size: 14, delay: 0.4 },
      { top: '68%', left: '10%', size: 10, delay: 1.2 },
      { top: '80%', right: '11%', size: 13, delay: 1.9 },
    ];

    return (
      <div className="pm-seasonal-overlay is-ramadan" aria-hidden="true">
        {/* Hanging Corner Lanterns */}
        <motion.div
          className="pm-season-corner is-right"
          style={{ transformOrigin: 'top center' }}
          animate={prefersReducedMotion ? undefined : { rotate: [-4.5, 4.5, -4.5] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <RamadanLanternSvg size={42} color="#F59E0B" glow="#FDE047" />
        </motion.div>

        <motion.div
          className="pm-season-corner is-left"
          style={{ transformOrigin: 'top center' }}
          animate={prefersReducedMotion ? undefined : { rotate: [4, -4, 4] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          <RamadanLanternSvg size={38} color="#FBBF24" glow="#FEF08A" />
        </motion.div>

        {/* Glowing Crescent */}
        <motion.div
          className="pm-season-float-moon"
          animate={prefersReducedMotion ? undefined : { y: [0, -7, 0], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CrescentStarSvg size={36} color="#FDE047" />
        </motion.div>

        {/* Twinkling Stars */}
        {stars.map((st, idx) => (
          <motion.span
            key={idx}
            className="pm-season-star"
            style={{ top: st.top, left: st.left, right: st.right, fontSize: `${st.size}px` }}
            animate={prefersReducedMotion ? undefined : { scale: [0.85, 1.35, 0.85], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 3.2 + (idx % 3) * 0.7, repeat: Infinity, ease: 'easeInOut', delay: st.delay }}
          >
            ✦
          </motion.span>
        ))}
      </div>
    );
  }

  if (shape === 'eid') {
    const confettiDots = [
      { top: '12%', left: '14%', color: '#FBBF24', symbol: '★', delay: 0 },
      { top: '20%', right: '15%', color: '#34D399', symbol: '✦', delay: 0.6 },
      { top: '38%', left: '8%', color: '#F472B6', symbol: '●', delay: 1.1 },
      { top: '52%', right: '7%', color: '#FBBF24', symbol: '◆', delay: 0.3 },
      { top: '70%', left: '12%', color: '#38BDF8', symbol: '★', delay: 1.4 },
      { top: '82%', right: '12%', color: '#EC4899', symbol: '✦', delay: 0.9 },
    ];

    return (
      <div className="pm-seasonal-overlay is-eid" aria-hidden="true">
        {/* Festive Bunting Flags Top String */}
        <svg className="pm-eid-bunting" viewBox="0 0 400 36" preserveAspectRatio="none">
          <path d="M0 4 Q200 22 400 4" stroke="#FBBF24" strokeWidth="1.8" fill="none" opacity="0.7" />
          {[
            { x: 24, c: '#10B981' },
            { x: 64, c: '#F59E0B' },
            { x: 104, c: '#EC4899' },
            { x: 144, c: '#38BDF8' },
            { x: 184, c: '#FBBF24' },
            { x: 224, c: '#10B981' },
            { x: 264, c: '#EC4899' },
            { x: 304, c: '#F59E0B' },
            { x: 344, c: '#38BDF8' },
          ].map((flag, idx) => (
            <polygon
              key={idx}
              points={`${flag.x},10 ${flag.x + 26},10 ${flag.x + 13},29`}
              fill={flag.c}
              opacity="0.88"
            />
          ))}
        </svg>

        {/* Swaying Eid Balloons */}
        <motion.div
          className="pm-season-corner is-right"
          animate={prefersReducedMotion ? undefined : { y: [0, -9, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BalloonSvg color="#10B981" size={32} />
        </motion.div>

        <motion.div
          className="pm-season-corner is-left"
          animate={prefersReducedMotion ? undefined : { y: [0, -11, 0], rotate: [3, -3, 3] }}
          transition={{ duration: 4.9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <BalloonSvg color="#F59E0B" size={30} />
        </motion.div>

        {confettiDots.map((c, idx) => (
          <motion.span
            key={idx}
            className="pm-season-star"
            style={{ top: c.top, left: c.left, right: c.right, color: c.color, fontSize: '13px' }}
            animate={prefersReducedMotion ? undefined : { y: [-4, 5, -4], rotate: [0, 20, -20, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.4 + (idx % 3) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
          >
            {c.symbol}
          </motion.span>
        ))}
      </div>
    );
  }

  // newyear
  const snowParticles = [
    { left: '8%', delay: 0, dur: 7.5, char: '❄', color: '#BAE6FD' },
    { left: '22%', delay: 1.8, dur: 8.6, char: '✦', color: '#FDE047' },
    { left: '38%', delay: 0.6, dur: 9.2, char: '❄', color: '#E0F2FE' },
    { left: '54%', delay: 2.4, dur: 7.8, char: '✨', color: '#FBBF24' },
    { left: '72%', delay: 1.1, dur: 8.4, char: '❄', color: '#BAE6FD' },
    { left: '88%', delay: 3.0, dur: 7.9, char: '✦', color: '#F472B6' },
  ];

  return (
    <div className="pm-seasonal-overlay is-newyear" aria-hidden="true">
      {/* Animated Fireworks Bursts */}
      <motion.div
        className="pm-season-firework is-right"
        animate={prefersReducedMotion ? undefined : { scale: [0.7, 1.12, 0.78], opacity: [0.5, 1, 0.5], rotate: [0, 12, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FireworkBurstSvg color1="#FBBF24" color2="#38BDF8" size={62} />
      </motion.div>

      <motion.div
        className="pm-season-firework is-left"
        animate={prefersReducedMotion ? undefined : { scale: [0.75, 1.15, 0.75], opacity: [0.45, 0.95, 0.45], rotate: [0, -14, 0] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        <FireworkBurstSvg color1="#F472B6" color2="#FDE047" size={54} />
      </motion.div>

      {/* Falling Snowflakes & Golden Confetti */}
      {snowParticles.map((p, idx) => (
        <motion.span
          key={idx}
          className="pm-newyear-flake"
          style={{ left: p.left, color: p.color }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: ['-6vh', '104vh'],
                  x: [0, idx % 2 === 0 ? 14 : -14, 0],
                  opacity: [0, 0.9, 0.85, 0],
                }
          }
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
};

export const SeasonalHeroRibbon: React.FC<{ shape: MenuThemeShape }> = ({ shape }) => {
  const prefersReducedMotion = useReducedMotion();
  if (shape !== 'ramadan' && shape !== 'eid' && shape !== 'newyear') return null;

  const meta =
    shape === 'ramadan'
      ? {
          iconRight: '🌙',
          iconLeft: '🏮',
          text: 'رمضان كريم • عروض وأجواء رمضانية مميزة',
          cls: 'is-ramadan',
        }
      : shape === 'eid'
      ? {
          iconRight: '🎉',
          iconLeft: '🎈',
          text: 'عيد سعيد • كل عام وأنتم بخير',
          cls: 'is-eid',
        }
      : {
          iconRight: '🎆',
          iconLeft: '❄️',
          text: 'سنة جديدة سعيدة • أجواء وعروض العام الجديد',
          cls: 'is-newyear',
        };

  return (
    <motion.div
      className={`pm-seasonal-ribbon ${meta.cls}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="pm-seasonal-ribbon-icon" aria-hidden="true">{meta.iconRight}</span>
      <span className="pm-seasonal-ribbon-text">{meta.text}</span>
      <span className="pm-seasonal-ribbon-icon" aria-hidden="true">{meta.iconLeft}</span>
    </motion.div>
  );
};

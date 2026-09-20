import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowLeft, GraduationCap } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { markSessionEntered } from '../../utils/session';


interface LuxuryEntranceProps {
  onEnter: () => void;
  onStartExit?: () => void;
}

export const LuxuryEntrance: React.FC<LuxuryEntranceProps> = ({ onEnter, onStartExit }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mouse interactive tilt coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 140 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  // Subtle parallax shift for ambient layers
  const bgShiftX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const bgShiftY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  // Floating particles data (deterministic to avoid hydration/render differences)
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: `${(i * 19) % 94 + 3}%`,
      y: `${(i * 29) % 90 + 5}%`,
      size: (i % 3) + 2,
      duration: 4 + (i % 4) * 1.5,
      delay: (i % 5) * 0.7,
      amplitude: 15 + (i % 3) * 10,
    }));
  }, []);

  // Ensure sound effects are always enabled
  useEffect(() => {
    soundFx.isMuted = false;
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isExiting) return;
    const { innerWidth, innerHeight } = window;
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleEnter = () => {
    if (isExiting) return;
    setIsClicked(true);
    setIsExiting(true);
    onStartExit?.();

    // Play luxury harmonic startup chime
    soundFx.playStartupChime();

    // Mark current session as entered
    markSessionEntered();

    // Allow cinematic exit animation to complete smoothly
    setTimeout(() => {
      onEnter();
    }, 750);
  };

  // Keyboard shortcut (Enter or Space) to enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.06 : 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(16px)' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#070706] text-[#F3EFE7] overflow-hidden select-none ${
        isExiting ? 'pointer-events-none' : ''
      }`}
      style={{
        backdropFilter: isExiting ? 'blur(16px)' : 'none',
        perspective: '1200px',
      }}
    >
      {/* Dynamic Background Atmosphere */}
      <motion.div
        style={{ x: bgShiftX, y: bgShiftY }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Radial Ambient Gold Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-[radial-gradient(circle_at_center,#D8BC88_0%,rgba(181,145,84,0.12)_35%,transparent_70%)] opacity-40 blur-3xl pointer-events-none" />

        {/* Secondary Indigo Ambient Glow */}
        <div className="absolute -top-32 -left-32 w-125 h-125 rounded-full bg-[radial-gradient(circle_at_center,#7B3FE4_0%,rgba(87,0,255,0.08)_40%,transparent_70%)] opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-125 h-125 rounded-full bg-[radial-gradient(circle_at_center,#D4AF37_0%,rgba(212,175,55,0.06)_40%,transparent_70%)] opacity-25 blur-3xl pointer-events-none" />

        {/* Micro-dot subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(#DFCA9F 1px, transparent 1px), radial-gradient(#DFCA9F 1px, #070706 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />

        {/* Animated Stardust Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{
              opacity: [0.1, 0.7, 0.1],
              y: [-p.amplitude, p.amplitude, -p.amplitude],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
            className="absolute rounded-full bg-[#DFCA9F] shadow-[0_0_8px_rgba(223,202,159,0.8)]"
            style={{
              left: p.x,
              top: p.y,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </motion.div>

      {/* Main Luxury Monolith / Glass Card with 3D Tilt */}

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -20 : 0,
          scale: isExiting ? 1.04 : 1,
        }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl mx-4 p-8 sm:p-12 rounded-3xl bg-[#121110]/80 backdrop-blur-2xl border border-[#DFCA9F]/20 shadow-[0_30px_100px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-[0_35px_110px_rgba(216,188,136,0.15),0_30px_100px_rgba(0,0,0,0.9)]"
      >
        {/* Subtle Luxury Top Accent Light */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-48 h-[1.5px] bg-linear-to-r from-transparent via-[#DFCA9F]/80 to-transparent" />

        {/* Emblem with Astrolabe Animated Celestial Rings */}
        <div className="relative mb-6 flex items-center justify-center w-52 h-52">
          {/* Animated Celestial Rings (Astrolabe Illustration) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 208 208"
            fill="none"
          >
            {/* Outer dotted orbital ring rotating clockwise */}
            <motion.circle
              cx="104"
              cy="104"
              r="96"
              stroke="#DFCA9F"
              strokeOpacity="0.22"
              strokeWidth="1.2"
              strokeDasharray="4 7"
              animate={{ rotate: 360 }}
              transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '104px 104px' }}
            />

            {/* Middle harmonic ring with orbit nodes rotating counter-clockwise */}
            <motion.circle
              cx="104"
              cy="104"
              r="76"
              stroke="#DFCA9F"
              strokeOpacity="0.32"
              strokeWidth="1"
              strokeDasharray="130 30"
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '104px 104px' }}
            />

            {/* Orbiting Satellite Node 1 */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '104px 104px' }}
            >
              <circle cx="180" cy="104" r="3" fill="#FFE5B4" />
              <circle cx="180" cy="104" r="6" fill="#DFCA9F" fillOpacity="0.3" />
            </motion.g>

            {/* Orbiting Satellite Node 2 */}
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '104px 104px' }}
            >
              <circle cx="28" cy="104" r="2.5" fill="#C4A5FF" />
              <circle cx="28" cy="104" r="5" fill="#7B3FE4" fillOpacity="0.3" />
            </motion.g>

            {/* Inner dashed ring */}
            <motion.circle
              cx="104"
              cy="104"
              r="58"
              stroke="#DFCA9F"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="2 5"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '104px 104px' }}
            />
          </svg>

          {/* Pulsing Breathing Aura */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-10 rounded-3xl bg-linear-to-tr from-[#D8BC88]/30 via-[#FFE5B4]/25 to-[#7B3FE4]/15 blur-xl pointer-events-none"
          />

          {/* Central Golden Insignia Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-20 h-20 rounded-2xl bg-linear-to-br from-[#F6E8CE] via-[#D8BC88] to-[#9C793C] p-[1.5px] shadow-[0_12px_36px_rgba(216,188,136,0.3)] cursor-pointer"
          >
            <div className="w-full h-full rounded-[14px] bg-linear-to-b from-[#1E1C18] to-[#12110F] flex items-center justify-center group">
              <GraduationCap className="w-10 h-10 text-[#F5E5C9] stroke-[1.8] transition-transform duration-300 group-hover:scale-110" />
            </div>
          </motion.div>
        </div>

        {/* Eyebrow with Pulsing Sparkles */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.25, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFCA9F]" />
          </motion.div>
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#DFCA9F] uppercase">
            نـظـام الـتـشـغـيـل الـتـعـلـيـمـي • الدفعة السادسة
          </span>
          <motion.div
            animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.25, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFCA9F]" />
          </motion.div>
        </div>

        {/* Title with Metallic Animated Light Wave */}
        <motion.h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-8">
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="bg-[linear-gradient(90deg,#D4AF37_0%,#FFF2D1_25%,#E6C875_50%,#FFF6DE_75%,#D4AF37_100%)] bg-size-[200%_auto] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
          >
            بـوابـة المـدرسـة
          </motion.span>

        </motion.h1>

        {/* CTA Enter Button with Interactive Ripple & Magnetism */}
        <div className="relative flex flex-col items-center w-full sm:w-auto">
          {/* Shockwave Ripple on Click */}
          {isClicked && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 rounded-2xl border-2 border-[#DFCA9F] pointer-events-none"
            />
          )}

          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96, y: 1 }}
            onClick={handleEnter}
            className="group relative w-full sm:w-64 px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#DFCA9F] via-[#F4E3BE] to-[#D0AC6E] text-[#141310] font-bold text-base shadow-[0_8px_30px_rgba(223,202,159,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] hover:shadow-[0_14px_45px_rgba(223,202,159,0.55)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer overflow-hidden border border-[#FFF5DD]/50"
          >
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

            <span className="relative z-10 text-[15px] tracking-wide">دخول البوابة</span>
            <ArrowLeft className="relative z-10 w-4.5 h-4.5 transition-transform duration-300 group-hover:-translate-x-1 text-[#141310] stroke-[2.2]" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

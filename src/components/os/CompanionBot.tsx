import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/audio';
import { useOS } from '../../context/OSContext';

interface CompanionBotProps {
  mode?: 'corner' | 'dock' | 'window';
  onOpenChat?: () => void;
}

export const CompanionBot: React.FC<CompanionBotProps> = ({ mode = 'corner', onOpenChat }) => {
  const { residentModalOpen, setResidentModalOpen, windows } = useOS();
  const [isWaving, setIsWaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAnyMaximized = Object.values(windows).some(
    (w) => w.isOpen && !w.isMinimized && w.isMaximized
  );

  // Periodic subtle wave to make the assistant feel alive
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 900);
    }, 22000);

    return () => {
      clearInterval(waveInterval);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playPop();
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 800);

    if (onOpenChat) {
      onOpenChat();
    } else {
      setResidentModalOpen(!residentModalOpen);
    }
  };

  // Backwards compatibility for dock/window perched modes if ever requested
  if (mode === 'dock' || mode === 'window') {
    const isDock = mode === 'dock';
    return (
      <div
        onClick={handleClick}
        className={`z-40 flex flex-col items-center cursor-pointer group select-none ${
          isDock
            ? 'absolute -top-8 left-1/2 -translate-x-1/2'
            : 'absolute -top-18 left-1/2 -translate-x-1/2'
        }`}
        title="انقر للتحدث مع المساعد الذكي المقيم!"
        aria-label="روبوت المساعد الذكي المرافق"
        role="button"
        tabIndex={0}
      >
        <div
          className={`${
            isDock ? 'w-7 h-7' : 'w-8 h-8'
          } transition-transform duration-300 relative ${
            isWaving ? 'scale-110 -rotate-6' : 'group-hover:-translate-y-0.5'
          }`}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="24" y="24" width="52" height="40" rx="12" fill="#EAE6DE" stroke="#2B2925" strokeWidth="3.5" />
            <rect x="18" y="38" width="6" height="12" rx="3" fill="#D4CFC5" stroke="#2B2925" strokeWidth="2.5" />
            <rect x="76" y="38" width="6" height="12" rx="3" fill="#D4CFC5" stroke="#2B2925" strokeWidth="2.5" />
            <line x1="50" y1="24" x2="50" y2="12" stroke="#2B2925" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="10" r="4.5" fill="#2F6FCE" stroke="#2B2925" strokeWidth="2.5" />
            <rect x="32" y="34" width="36" height="16" rx="6" fill="#1B1A18" />
            <circle cx="41" cy="42" r="3.5" fill="#9FA994" />
            <circle cx="59" cy="42" r="3.5" fill="#9FA994" />
            <path
              d="M 30 68 L 70 68 L 73 90 Q 73 94 69 94 L 31 94 Q 27 94 27 90 Z"
              fill="#DCD7CE"
              stroke="#2B2925"
              strokeWidth="3.5"
            />
            <rect x="40" y="72" width="20" height="14" rx="4" fill="#C5B79E" />
            <rect
              x="18"
              y="68"
              width="8"
              height="18"
              rx="4"
              fill="#D4CFC5"
              stroke="#2B2925"
              strokeWidth="2.5"
              transform={isWaving ? 'rotate(-35 22 68)' : ''}
            />
            <rect x="74" y="68" width="8" height="18" rx="4" fill="#D4CFC5" stroke="#2B2925" strokeWidth="2.5" />
            <rect x="34" y="93" width="12" height="5" rx="2" fill="#2B2925" />
            <rect x="54" y="93" width="12" height="5" rx="2" fill="#2B2925" />
          </svg>
        </div>
      </div>
    );
  }

  // Primary mode: 'corner' - Bottom Right Corner directly rendered without outer cover or hint badge
  return (
    <motion.aside
      initial={false}
      animate={{
        y: isAnyMaximized ? 100 : 0,
        opacity: isAnyMaximized ? 0 : 1,
      }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        pointerEvents: isAnyMaximized ? 'none' : 'auto',
      }}
      className={`fixed bottom-4 right-4 md:right-6 select-none ${
        isAnyMaximized ? 'z-0' : 'z-40'
      }`}
      aria-label="المساعد الذكي"
    >
      <div
        className="relative flex flex-col items-center group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Tooltip */}
        {isHovered && (
          <div
            className="absolute -top-9 px-2.5 py-1 rounded-lg bg-[#1B1A18]/95 border border-white/10 text-[11px] font-medium text-[#F3EFE7] shadow-xl whitespace-nowrap pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-150"
            role="tooltip"
          >
            المساعد الذكي
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1B1A18] border-r border-b border-white/10 rotate-45" />
          </div>
        )}

        {/* Icon Button */}
        <button
          type="button"
          onClick={handleClick}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xl border ${
            residentModalOpen
              ? 'bg-linear-to-br from-[#2D2A24] to-[#1E1C19] border-[#C5B79E]/60 ring-1 ring-[#C5B79E]/40 shadow-[0_0_20px_rgba(197,183,158,0.25)] scale-105'
              : 'bg-[#201F1D] text-[#F8F4EC] border-white/14 hover:border-white/30 hover:bg-[#2B2926] hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-95'
          } focus:outline-none focus:ring-2 focus:ring-[#2F6FCE] focus:ring-offset-2 focus:ring-offset-[#0B0B0A] cursor-pointer`}
          aria-label="المساعد الذكي"
          title="المساعد الذكي"
        >
          {/* Robot Mascot SVG inside icon tile */}
          <div
            className={`w-8 h-8 transition-transform duration-300 relative ${
              isWaving ? 'scale-110 -rotate-6' : 'group-hover:scale-105'
            }`}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head */}
              <rect x="24" y="24" width="52" height="40" rx="12" fill="#EAE6DE" stroke="#2B2925" strokeWidth="3.5" />

              {/* Side Ears / Head Nubs */}
              <rect x="18" y="38" width="6" height="12" rx="3" fill="#D4CFC5" stroke="#2B2925" strokeWidth="2.5" />
              <rect x="76" y="38" width="6" height="12" rx="3" fill="#D4CFC5" stroke="#2B2925" strokeWidth="2.5" />

              {/* Antenna */}
              <line x1="50" y1="24" x2="50" y2="12" stroke="#2B2925" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="50" cy="10" r="4.5" fill="#2F6FCE" stroke="#2B2925" strokeWidth="2.5" />

              {/* Visor & Eyes */}
              <rect x="32" y="34" width="36" height="16" rx="6" fill="#1B1A18" />
              <circle cx="41" cy="42" r="3.5" fill="#9FA994" />
              <circle cx="59" cy="42" r="3.5" fill="#9FA994" />

              {/* Body */}
              <path
                d="M 30 68 L 70 68 L 73 90 Q 73 94 69 94 L 31 94 Q 27 94 27 90 Z"
                fill="#DCD7CE"
                stroke="#2B2925"
                strokeWidth="3.5"
              />

              {/* Tummy Plate */}
              <rect x="40" y="72" width="20" height="14" rx="4" fill="#C5B79E" />

              {/* Arms */}
              <rect
                x="18"
                y="68"
                width="8"
                height="18"
                rx="4"
                fill="#D4CFC5"
                stroke="#2B2925"
                strokeWidth="2.5"
                transform={isWaving ? 'rotate(-35 22 68)' : ''}
              />
              <rect x="74" y="68" width="8" height="18" rx="4" fill="#D4CFC5" stroke="#2B2925" strokeWidth="2.5" />

              {/* Feet */}
              <rect x="34" y="93" width="12" height="5" rx="2" fill="#2B2925" />
              <rect x="54" y="93" width="12" height="5" rx="2" fill="#2B2925" />
            </svg>
          </div>
        </button>

        {/* Active Pip Dot matching taskbar dock icons */}
        <div className="h-1.5 flex items-center justify-center mt-1">
          {residentModalOpen && (
            <span className="w-1 h-1 rounded-full bg-[#F8F4EC] animate-pulse" />
          )}
        </div>
      </div>
    </motion.aside>
  );
};

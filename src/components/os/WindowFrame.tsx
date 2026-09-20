import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { WindowState } from '../../types/os';
import { useOS } from '../../context/OSContext';
import { soundFx } from '../../utils/audio';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

interface WindowFrameProps {
  windowState: WindowState;
  children: React.ReactNode;
  theme?: 'ivory' | 'noir';
  onClose?: () => void;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  windowState,
  children,
  theme = 'ivory',
  onClose,
}) => {
  const { containerRef } = useSmoothScroll();
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    bringToFront,
    updatePosition,
    activeWindowId,
  } = useOS();

  const { id, title, isMaximized, zIndex, position, size } = windowState;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const isActive = activeWindowId === id;

  const handleMouseDown = () => {
    bringToFront(id);
  };

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
    bringToFront(id);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.mouseX;
    const deltaY = e.clientY - dragStartRef.current.mouseY;

    // Constrain position within viewport boundaries
    const newX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.startX + deltaX));
    const newY = Math.max(45, Math.min(window.innerHeight - 200, dragStartRef.current.startY + deltaY));

    updatePosition(id, { x: newX, y: newY });
  }, [isDragging, id, updatePosition]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const isIvoryTheme = theme === 'ivory';

  return (
    <motion.div
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.93,
        y: 12,
        transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
      }}
      transition={{
        type: 'spring',
        damping: 28,
        stiffness: 350,
        mass: 0.8,
      }}
      style={{
        zIndex: isMaximized ? Math.max(zIndex, 35) : zIndex,
        left: isMaximized ? '2.5vw' : position.x,
        top: isMaximized ? '2.5vh' : position.y,
        width: isMaximized ? '95vw' : `${size.width}px`,
        height: isMaximized ? '95vh' : `${size.height}px`,
        maxWidth: isMaximized ? '95vw' : '95vw',
        maxHeight: isMaximized ? '95vh' : '85vh',
        transition: isDragging ? 'none' : 'left 0.2s cubic-bezier(0.22, 1, 0.36, 1), top 0.2s cubic-bezier(0.22, 1, 0.36, 1), width 0.2s ease, height 0.2s ease',
      }}
      className={`fixed flex flex-col rounded-[20px] overflow-visible shadow-[0_48px_128px_0_rgba(11,11,10,0.65),0_12px_36px_0_rgba(0,0,0,0.4)] border ${
        isIvoryTheme
          ? 'bg-[#F8F6F1] text-[#191816] border-[#D4CFC5]/80'
          : 'bg-[#141311]/95 text-[#F3EFE7] border-white/12 backdrop-blur-2xl'
      } ${isActive ? 'ring-1 ring-white/20' : 'opacity-95'}`}
      role="region"
      aria-label={`${title} Window`}
    >
      {/* Window Title Bar (Windows 11 styled with draggable header) */}
      <div
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={() => toggleMaximizeWindow(id)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        className={`h-10 flex items-center justify-between select-none border-b shrink-0 rounded-t-[20px] ${
          isIvoryTheme
            ? 'bg-[#F1EEE8] border-[#E5E0D6]'
            : 'bg-[#1B1A18] border-white/8'
        }`}
      >
        {/* Right Corner (First child in RTL): Windows Caption Controls */}
        <div className="flex items-center gap-1 px-3 h-full shrink-0" dir="ltr">
          {/* Windows Minimize button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick(420, 0.03);
              minimizeWindow(id);
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer ${
              isIvoryTheme
                ? 'text-[#5C564C] hover:bg-[#E2DCCE] hover:text-[#191816]'
                : 'text-[#A69F93] hover:bg-white/12 hover:text-[#F3EFE7]'
            }`}
            aria-label={`تصغير ${title}`}
            title="تصغير"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="2.5" y1="7" x2="11.5" y2="7" />
            </svg>
          </button>

          {/* Windows Maximize / Restore button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick(540, 0.03);
              toggleMaximizeWindow(id);
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer ${
              isIvoryTheme
                ? 'text-[#5C564C] hover:bg-[#E2DCCE] hover:text-[#191816]'
                : 'text-[#A69F93] hover:bg-white/12 hover:text-[#F3EFE7]'
            }`}
            aria-label={isMaximized ? `استعادة ${title}` : `تكبير ${title}`}
            title={isMaximized ? 'استعادة' : 'تكبير'}
          >
            {isMaximized ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
                <rect x="2" y="4.5" width="7" height="7" rx="1.2" />
                <path d="M4.5 4.5V2.8a1 1 0 0 1 1-1h5.5a1 1 0 0 1 1 1V9.3a1 1 0 0 1-1 1H9" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                <rect x="2.5" y="2.5" width="9" height="9" rx="1.6" />
              </svg>
            )}
          </button>

          {/* Windows Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick(320, 0.04);
              if (onClose) {
                onClose();
              } else {
                closeWindow(id);
              }
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer ${
              isIvoryTheme
                ? 'text-[#5C564C] hover:bg-[#E83845] hover:text-white active:bg-[#C92A37]'
                : 'text-[#A69F93] hover:bg-[#E83845] hover:text-white active:bg-[#C92A37]'
            }`}
            aria-label={`إغلاق ${title}`}
            title="إغلاق"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="3.5" y1="3.5" x2="10.5" y2="10.5" />
              <line x1="10.5" y1="3.5" x2="3.5" y2="10.5" />
            </svg>
          </button>
        </div>

        {/* Center / Left: Title */}
        <div className="flex items-center px-4 pointer-events-none select-none">
          <span className={`text-[12px] font-medium tracking-wide ${isIvoryTheme ? 'text-[#191816]' : 'text-[#F3EFE7]'}`}>
            {title}
          </span>
        </div>
      </div>

      {/* Window Body */}
      <div ref={containerRef} className="flex-1 overflow-y-auto rounded-b-[20px]">
        {children}
      </div>
    </motion.div>
  );
};

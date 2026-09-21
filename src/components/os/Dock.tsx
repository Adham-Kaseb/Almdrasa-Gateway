import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  GraduationCap,
  CalendarDays,
  FileText,
  Video,
  Check,
  GripHorizontal,
  ShieldAlert,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { soundFx } from '../../utils/audio';
import { WindowId } from '../../types/os';
import { resolveDockThemeStyle } from '../../data/dockThemes';

export interface DockApp {
  id: string;
  name: string;
  renderIcon?: (color: string) => React.ReactNode;
  icon?: React.ReactNode;
  bgClass?: string;
  onClick?: () => void;
}

export const DOCK_ORDER_STORAGE_KEY = 'almdrasa_gateway_dock_order';

export const DEFAULT_APPS: DockApp[] = [
  {
    id: 'scholarship',
    name: 'تفاصيل منحة المدرسة',
    renderIcon: (color: string) => <GraduationCap className="w-5.5 h-5.5 stroke-[2.2]" style={{ color }} />,
  },
  {
    id: 'schedule',
    name: 'جدول الدفعة السادسة',
    renderIcon: (color: string) => <CalendarDays className="w-5.5 h-5.5 stroke-[2.2]" style={{ color }} />,
  },
  {
    id: 'curriculum',
    name: 'منهج دبلومة المدرسة - (المنحة)',
    renderIcon: (color: string) => <FileText className="w-5.5 h-5.5 stroke-[2.2]" style={{ color }} />,
  },
  {
    id: 'meetings',
    name: 'الاجتماعات الأسبوعية',
    renderIcon: (color: string) => <Video className="w-5.5 h-5.5 stroke-[2.2]" style={{ color }} />,
  },
  {
    id: 'elimination',
    name: 'نظام الإقصاء',
    renderIcon: (color: string) => <ShieldAlert className="w-5.5 h-5.5 stroke-[2.2]" style={{ color }} />,
  },
  {
    id: 'faqs',
    name: 'الأسئلة الشائعة',
    renderIcon: (color: string) => <HelpCircle className="w-5.5 h-5.5 stroke-[2.2]" style={{ color }} />,
  },
];

export const loadSavedAppOrder = (defaultApps: DockApp[]): DockApp[] => {
  if (typeof window === 'undefined') return defaultApps;
  try {
    const raw = localStorage.getItem(DOCK_ORDER_STORAGE_KEY);
    if (!raw) return defaultApps;
    const savedIds: string[] = JSON.parse(raw);
    if (!Array.isArray(savedIds)) return defaultApps;

    const appMap = new Map(defaultApps.map((a) => [a.id, a]));
    const ordered: DockApp[] = [];

    savedIds.forEach((id) => {
      const found = appMap.get(id);
      if (found) {
        ordered.push(found);
        appMap.delete(id);
      }
    });

    appMap.forEach((app) => ordered.push(app));
    return ordered.length > 0 ? ordered : defaultApps;
  } catch {
    return defaultApps;
  }
};

export const saveAppOrder = (apps: DockApp[]): void => {
  if (typeof window === 'undefined') return;
  try {
    const ids = apps.map((a) => a.id);
    localStorage.setItem(DOCK_ORDER_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Graceful fallback for storage quotas or restrictions
  }
};

export const Dock: React.FC = () => {
  const {
    windows,
    openWindow,
    restoreWindow,
    minimizeWindow,
    setCompanionMessage,
    isSettingsOpen,
    setIsSettingsOpen,
    appSettings,
  } = useOS();

  const [apps, setApps] = useState<DockApp[]>(() => loadSavedAppOrder(DEFAULT_APPS));
  const [isReordering, setIsReordering] = useState(false);
  const [holdingAppId, setHoldingAppId] = useState<string | null>(null);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const dockRef = useRef<HTMLElement>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartPos = useRef<{ x: number; y: number } | null>(null);
  const didLongPressFire = useRef(false);

  const themeStyle = resolveDockThemeStyle(appSettings?.dock?.theme);

  const iconSizeClass =
    appSettings?.dock?.size === 'compact'
      ? 'w-9.5 h-9.5'
      : appSettings?.dock?.size === 'large'
      ? 'w-12 h-12'
      : 'w-11 h-11';

  // Click outside or Escape to exit reordering mode
  useEffect(() => {
    if (!isReordering) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsReordering(false);
        soundFx.playClick(450, 0.02);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsReordering(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReordering]);

  // Handle standard app window toggle
  const handleAppClick = (appId: string) => {
    soundFx.playDock();

    if (appId === 'files') {
      openWindow('projects');
      setCompanionMessage('تم فتح مستودع ملفات النظام بنجاح.');
      return;
    }

    const winId = appId as WindowId;
    const targetWin = windows[winId];

    if (!targetWin) return;

    if (targetWin.isOpen && !targetWin.isMinimized) {
      minimizeWindow(winId);
    } else if (targetWin.isMinimized) {
      restoreWindow(winId);
    } else {
      openWindow(winId);
    }
  };

  // Pointer event handlers for 1.5s long-press detection
  const handlePointerDown = (appId: string, e: React.PointerEvent) => {
    if (isReordering) return;

    didLongPressFire.current = false;
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    setHoldingAppId(appId);

    holdTimeoutRef.current = setTimeout(() => {
      didLongPressFire.current = true;
      setHoldingAppId(null);
      setIsReordering(true);
      soundFx.playPop();
      setCompanionMessage('تم تفعيل نمط إعادة الترتيب! اسحب الأيقونات لتغيير ترتيبها ثم اضغط تم.');
    }, 1500);
  };

  const handlePointerUp = (appId: string) => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setHoldingAppId(null);

    // If long press did not trigger and not currently in reorder mode, trigger normal click
    if (!didLongPressFire.current && !isReordering) {
      handleAppClick(appId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartPos.current || isReordering) return;
    const dx = Math.abs(e.clientX - pointerStartPos.current.x);
    const dy = Math.abs(e.clientY - pointerStartPos.current.y);

    // Cancel timer if pointer drifted more than 8px
    if (dx > 8 || dy > 8) {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      setHoldingAppId(null);
    }
  };

  const handlePointerLeave = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setHoldingAppId(null);
  };

  const handleReorder = (newOrder: DockApp[]) => {
    setApps(newOrder);
    saveAppOrder(newOrder);
    soundFx.playClick(620, 0.02);
  };

  const isAnyMaximized =
    isSettingsOpen ||
    Object.values(windows).some((w) => w.isOpen && !w.isMinimized && w.isMaximized);

  return (
    <motion.nav
      ref={dockRef}
      initial={false}
      animate={{
        y: isAnyMaximized ? 120 : 0,
        opacity: isAnyMaximized ? 0 : 1,
      }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        pointerEvents: isAnyMaximized ? 'none' : 'auto',
      }}
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 select-none ${
        isAnyMaximized ? 'z-0 pointer-events-none' : 'z-40'
      }`}
      aria-label="Application Dock"
    >
      {/* Floating Reorder Mode Banner */}
      <AnimatePresence>
        {isReordering && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-[#181715]/95 border border-[#DFCA9F]/40 backdrop-blur-xl shadow-2xl whitespace-nowrap text-xs text-[#F3EFE7] z-50 pointer-events-auto"
          >
            <GripHorizontal className="w-3.5 h-3.5 text-[#DFCA9F]" />
            <span className="text-[11.5px] font-medium">اسحب الأيقونات لتغيير ترتيبها</span>
            <button
              type="button"
              onClick={() => {
                setIsReordering(false);
                soundFx.playClick(500, 0.02);
              }}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] font-bold text-[10.5px] hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-xs mr-1"
            >
              <Check className="w-3 h-3 stroke-[2.8]" />
              <span>تم</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outer Dock Bar with dir="ltr" so Settings is at the most left corner */}
      <div
        dir="ltr"
        className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-3xl bg-[#141311]/85 backdrop-blur-2xl border border-white/13 shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
      >
        {/* Most Left Corner: App Settings Icon Button */}
        <div
          className="relative flex flex-col items-center group list-none touch-none"
          onMouseEnter={() => !isReordering && setHoveredApp('settings')}
          onMouseLeave={() => setHoveredApp(null)}
        >
          {/* Tooltip */}
          {!isReordering && hoveredApp === 'settings' && (
            <div
              className="absolute -top-9 px-2.5 py-1 rounded-lg bg-[#1B1A18]/95 border border-white/10 text-[11px] font-medium text-[#F3EFE7] shadow-xl whitespace-nowrap pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-150 z-30"
              role="tooltip"
              dir="rtl"
            >
              إعدادات التطبيق
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1B1A18] border-r border-b border-white/10 rotate-45" />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              soundFx.playDock();
              setIsSettingsOpen(true);
            }}
            style={{
              borderColor: themeStyle.borderColor,
              backgroundColor: themeStyle.customBg,
            }}
            className={`${iconSizeClass} rounded-[14px] flex items-center justify-center transition-all duration-200 shadow-md border ${
              themeStyle.bgClass
            } hover:scale-110 hover:-translate-y-2 active:scale-95 cursor-pointer focus:outline-none`}
            aria-label="App Settings"
          >
            <Settings
              className="w-5.5 h-5.5 stroke-[2.2] transition-transform duration-300 group-hover:rotate-45"
              style={{ color: themeStyle.iconColor }}
            />
          </button>

          {/* Active Pip / Indicator Dot underneath */}
          <div className="h-1.5 flex items-center justify-center mt-1">
            {isSettingsOpen && appSettings?.dock?.showIndicators !== false && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: themeStyle.indicatorColor,
                  boxShadow: `0 0 8px ${themeStyle.indicatorColor}`,
                }}
              />
            )}
          </div>
        </div>

        {/* Separator Divider between Settings and Draggable Apps */}
        <div className="w-px h-7 bg-white/15 my-auto shrink-0 mx-0.5" />

        {/* Dock Reorder Group */}
        <Reorder.Group
          as="div"
          axis="x"
          values={apps}
          onReorder={handleReorder}
          className="flex items-end gap-2.5"
        >
          {apps.map((app, index) => {
            const isWindowTarget = app.id in windows;
            const winState = isWindowTarget ? windows[app.id as WindowId] : null;
            const isOpen = winState?.isOpen;
            const isMinimized = winState?.isMinimized;
            const isHolding = holdingAppId === app.id;

            return (
              <Reorder.Item
                key={app.id}
                value={app}
                dragListener={isReordering}
                whileDrag={{
                  scale: 1.15,
                  zIndex: 60,
                  cursor: 'grabbing',
                }}
                className="relative flex flex-col items-center group list-none touch-none"
                onMouseEnter={() => !isReordering && setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
              >
                {/* Floating Tooltip (hidden during reordering) */}
                {!isReordering && hoveredApp === app.id && (
                  <div
                    className="absolute -top-9 px-2.5 py-1 rounded-lg bg-[#1B1A18]/95 border border-white/10 text-[11px] font-medium text-[#F3EFE7] shadow-xl whitespace-nowrap pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-150 z-30"
                    role="tooltip"
                  >
                    {app.name}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1B1A18] border-r border-b border-white/10 rotate-45" />
                  </div>
                )}

                {/* Jiggle & Motion Container */}
                <motion.div
                  animate={
                    isReordering
                      ? {
                          rotate: index % 2 === 0 ? [-1.6, 1.6] : [1.6, -1.6],
                          y: [-1, 1],
                        }
                      : isHolding
                      ? { scale: 0.93 }
                      : { rotate: 0, y: 0, scale: 1 }
                  }
                  transition={
                    isReordering
                      ? {
                          repeat: Infinity,
                          repeatType: 'reverse',
                          duration: 0.22,
                          ease: 'easeInOut',
                        }
                      : { duration: 0.15 }
                  }
                  className="relative"
                >
                  {/* Visual Hold Progress Halo (active during 1.5s press) */}
                  {isHolding && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1.15, opacity: 1 }}
                      transition={{ duration: 1.5, ease: 'linear' }}
                      style={{ borderColor: themeStyle.borderHoverColor }}
                      className="absolute inset-0 rounded-2xl border-2 pointer-events-none shadow-[0_0_15px_rgba(223,202,159,0.5)]"
                    />
                  )}

                  {/* Dock Icon Button */}
                  <button
                    type="button"
                    onPointerDown={(e) => handlePointerDown(app.id, e)}
                    onPointerUp={() => handlePointerUp(app.id)}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    style={{
                      borderColor: themeStyle.borderColor,
                      backgroundColor: themeStyle.customBg,
                    }}
                    className={`${iconSizeClass} rounded-[14px] flex items-center justify-center transition-all duration-200 shadow-md border ${
                      themeStyle.bgClass
                    } ${
                      isReordering
                        ? 'cursor-grab hover:scale-105'
                        : 'hover:-translate-y-2 hover:scale-110 active:translate-y-0 active:scale-95 cursor-pointer'
                    } focus:outline-none`}
                    aria-label={`Launch or reorder ${app.name}`}
                  >
                    {app.renderIcon ? app.renderIcon(themeStyle.iconColor) : (app.icon || null)}
                  </button>
                </motion.div>

                {/* Active Pip / Indicator Dot underneath */}
                <div className="h-1.5 flex items-center justify-center mt-1">
                  {isOpen && appSettings?.dock?.showIndicators !== false && (
                    <span
                      className={`w-1 h-1 rounded-full transition-all ${
                        isMinimized ? 'bg-[#756F66]' : ''
                      }`}
                      style={{
                        backgroundColor: isMinimized ? undefined : themeStyle.indicatorColor,
                        boxShadow: isMinimized ? undefined : `0 0 8px ${themeStyle.indicatorColor}`,
                      }}
                    />
                  )}
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
    </motion.nav>
  );
};

export default Dock;

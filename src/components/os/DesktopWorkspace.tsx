import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { useOS } from '../../context/OSContext';
import { DesktopCanvas } from './DesktopCanvas';
import { Dock } from './Dock';
import { CommandPalette } from './CommandPalette';
import { CompanionBot } from './CompanionBot';
import { AppSettingsPage } from './settings/AppSettingsPage';

interface DesktopWorkspaceProps {
  isReady: boolean;
}

export const DesktopWorkspace: React.FC<DesktopWorkspaceProps> = ({ isReady }) => {
  const { appSettings } = useOS();
  const bg = appSettings.background;
  const [isBgActive, setIsBgActive] = useState<boolean>(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const onEnter = () => setIsBgActive(true);
    const onLeave = () => setIsBgActive(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={desktopRef}
      className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${
        isReady ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none invisible'
      }`}
    >
      {/* Dynamic Desktop Wallpaper Layer */}
      {bg.mode === 'static' ? (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
          <img
            src={bg.staticImage}
            alt="Desktop Wallpaper"
            className="w-full h-full object-cover transition-opacity duration-700 animate-in fade-in"
          />
          <div
            className="absolute inset-0 bg-black transition-opacity duration-300"
            style={{ opacity: (bg.overlayDim ?? 30) / 100 }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0B0B0A]/40 via-transparent to-[#0B0B0A]/60 pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
          <MeshGradient
            className="absolute inset-0 w-full h-full"
            colors={
              bg.interactiveColors && bg.interactiveColors.length > 0
                ? bg.interactiveColors
                : ['#000000', '#1a1a1a', '#2e2e2e', '#ffffff']
            }
            speed={
              isBgActive
                ? (bg.interactiveSpeed ?? 0.3) * 1.6
                : bg.interactiveSpeed ?? 0.3
            }
            distortion={bg.interactiveDistortion ?? 0.8}
            swirl={bg.interactiveSwirl ?? 0.15}
          />
          <MeshGradient
            className="absolute inset-0 w-full h-full opacity-35"
            colors={
              bg.interactiveColors && bg.interactiveColors.length >= 3
                ? bg.interactiveColors.slice(0, 3)
                : ['#000000', '#ffffff', '#2e2e2e']
            }
            speed={
              isBgActive
                ? (bg.interactiveSpeed ?? 0.3) * 1.1
                : (bg.interactiveSpeed ?? 0.3) * 0.6
            }
            distortion={(bg.interactiveDistortion ?? 0.8) * 1.2}
            swirl={(bg.interactiveSwirl ?? 0.15) * 1.3}
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0B0B0A]/40 via-transparent to-[#0B0B0A]/60 pointer-events-none" />
        </div>
      )}

      {/* Focus Mode Dimmer */}
      {appSettings.focus.focusModeEnabled && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-5 transition-opacity duration-500" />
      )}

      {/* Main Desktop Surface */}
      <main className="flex-1 flex px-4 md:px-8 pt-6 pb-24 relative z-10 w-full h-screen overflow-hidden">
        <DesktopCanvas />
      </main>

      {/* Floating Application Dock */}
      <Dock />

      {/* Companion Bot */}
      {appSettings.companion.botVisible && <CompanionBot />}

      {/* Spotlight Command Palette */}
      <CommandPalette />

      {/* Settings Modal */}
      <AnimatePresence>
        <AppSettingsPage />
      </AnimatePresence>
    </div>
  );
};

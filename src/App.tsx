import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import { useOS } from "./context/OSContext";
import { useAuth } from "./context/AuthContext";
import { DesktopCanvas } from "./components/os/DesktopCanvas";
import { Dock } from "./components/os/Dock";
import { CommandPalette } from "./components/os/CommandPalette";
import { CompanionBot } from "./components/os/CompanionBot";
import { LuxuryEntrance } from "./components/os/LuxuryEntrance";
import { AppSettingsPage } from "./components/os/settings/AppSettingsPage";
import { AuthPage } from "./components/auth/AuthPage";
import { hasEnteredInCurrentSession } from "./utils/session";

export const App: React.FC = () => {
  const { appSettings } = useOS();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const bg = appSettings.background;

  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    return hasEnteredInCurrentSession();
  });
  const [isEntranceExiting, setIsEntranceExiting] = useState<boolean>(false);
  const [isBgActive, setIsBgActive] = useState<boolean>(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const onEnter = () => setIsBgActive(true);
    const onLeave = () => setIsBgActive(false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#0B0B0A] text-[#F3EFE7] flex flex-col select-none relative overflow-hidden font-sans">
      {/* Auth Portal Layer: Shown when student is not authenticated */}
      {!isAuthLoading && !isAuthenticated && (
        <AuthPage onSuccess={() => setHasEntered(true)} />
      )}

      {/* Luxury First-Time-In-Session Entrance (when authenticated) */}
      <AnimatePresence initial={false}>
        {isAuthenticated && !hasEntered && (
          <LuxuryEntrance
            onStartExit={() => setIsEntranceExiting(true)}
            onEnter={() => setHasEntered(true)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Workspace */}
      <div
        ref={desktopRef}
        className={`absolute inset-0 flex flex-col transition-opacity duration-700 ${
          !isAuthenticated || (!hasEntered && !isEntranceExiting)
            ? "opacity-0 pointer-events-none invisible"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        {/* Dynamic Desktop Wallpaper Layer (Static or Interactive) */}
        {bg.mode === "static" ? (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            <img
              src={bg.staticImage}
              alt="Desktop Wallpaper"
              className="w-full h-full object-cover transition-opacity duration-700 animate-in fade-in"
            />
            {/* Custom Vignette & Dim Overlay */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-300"
              style={{ opacity: (bg.overlayDim ?? 30) / 100 }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-[#0B0B0A]/40 via-transparent to-[#0B0B0A]/60 pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            {/* Primary gradient layer */}
            <MeshGradient
              className="absolute inset-0 w-full h-full"
              colors={
                bg.interactiveColors && bg.interactiveColors.length > 0
                  ? bg.interactiveColors
                  : ["#000000", "#1a1a1a", "#2e2e2e", "#ffffff"]
              }
              speed={
                isBgActive
                  ? (bg.interactiveSpeed ?? 0.3) * 1.6
                  : bg.interactiveSpeed ?? 0.3
              }
              distortion={bg.interactiveDistortion ?? 0.8}
              swirl={bg.interactiveSwirl ?? 0.15}
            />
            {/* Secondary shimmer layer */}
            <MeshGradient
              className="absolute inset-0 w-full h-full opacity-35"
              colors={
                bg.interactiveColors && bg.interactiveColors.length >= 3
                  ? bg.interactiveColors.slice(0, 3)
                  : ["#000000", "#ffffff", "#2e2e2e"]
              }
              speed={
                isBgActive
                  ? (bg.interactiveSpeed ?? 0.3) * 1.1
                  : (bg.interactiveSpeed ?? 0.3) * 0.6
              }
              distortion={(bg.interactiveDistortion ?? 0.8) * 1.2}
              swirl={(bg.interactiveSwirl ?? 0.15) * 1.3}
            />
            {/* Vignette for depth */}
            <div className="absolute inset-0 bg-linear-to-b from-[#0B0B0A]/40 via-transparent to-[#0B0B0A]/60 pointer-events-none" />
          </div>
        )}

        {/* Focus Mode Ambient Dimmer */}
        {appSettings.focus.focusModeEnabled && (
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-5 transition-opacity duration-500" />
        )}

        {/* Main Desktop Work Area (Full Screen without top menu bar or right sidebar) */}
        <main className="flex-1 flex px-4 md:px-8 pt-6 pb-24 relative z-10 w-full h-screen overflow-hidden">
          {/* Desktop Surface & Windows System */}
          <DesktopCanvas />
        </main>

        {/* Floating Application Dock */}
        <Dock />

        {/* Resident AI Assistant Chatbot in the Bottom Right Corner */}
        {appSettings.companion.botVisible && <CompanionBot />}

        {/* Spotlight Command Palette (⌘K) */}
        <CommandPalette />

        {/* App Settings Full Page */}
        <AnimatePresence>
          <AppSettingsPage />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;


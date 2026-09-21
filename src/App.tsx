import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { LuxuryEntrance } from './components/os/LuxuryEntrance';
import { AuthPage } from './components/auth/AuthPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DesktopWorkspace } from './components/os/DesktopWorkspace';
import { hasEnteredInCurrentSession } from './utils/session';

export const App: React.FC = () => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    isAdmin,
    isStudentPreview,
    setIsStudentPreview,
  } = useAuth();

  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    return hasEnteredInCurrentSession();
  });
  const [isEntranceExiting, setIsEntranceExiting] = useState<boolean>(false);

  const showWorkspace = !isAdmin || isStudentPreview;
  const isWorkspaceReady = isAuthenticated && (hasEntered || isEntranceExiting || isStudentPreview);

  return (
    <div className="min-h-screen w-screen bg-[#0B0B0A] text-[#F3EFE7] flex flex-col select-none relative overflow-hidden font-sans">
      {/* Loading overlay during initial authentication check for non-admin */}
      {isAuthLoading && !isAdmin && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0A] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#DFCA9F] border-t-transparent animate-spin" />
            <span className="text-xs text-[#DFCA9F]/70 font-medium">جاري التحقق...</span>
          </div>
        </div>
      )}

      {/* Auth Portal Layer: Shown when student is not authenticated and not loading */}
      {!isAuthLoading && !isAuthenticated && !isAdmin && (
        <AuthPage onSuccess={() => setHasEntered(true)} />
      )}

      {/* Exclusive Admin Dashboard Layer for Administrator */}
      {isAdmin && !isStudentPreview && (
        <AdminDashboard onEnterStudentPreview={() => setIsStudentPreview(true)} />
      )}

      {/* Floating Return Pill for Admin in Student Preview Mode */}
      {isAdmin && isStudentPreview && (
        <div className="fixed bottom-6 left-6 z-60 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            type="button"
            onClick={() => setIsStudentPreview(false)}
            className="px-4 py-2.5 rounded-2xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] font-extrabold text-xs flex items-center gap-2 shadow-2xl shadow-black/80 hover:brightness-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <ShieldCheck className="w-4 h-4 stroke-2" />
            <span>أنت في وضع معاينة الطالب • العودة للوحة الإدارة</span>
          </button>
        </div>
      )}

      {/* Luxury First-Time-In-Session Entrance (when authenticated student) */}
      <AnimatePresence initial={false}>
        {!isAuthLoading && isAuthenticated && !isAdmin && !hasEntered && (
          <LuxuryEntrance
            onStartExit={() => setIsEntranceExiting(true)}
            onEnter={() => setHasEntered(true)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Workspace: Only mounted & displayed when NOT admin, OR when admin is in student preview */}
      {showWorkspace && <DesktopWorkspace isReady={isWorkspaceReady} />}
    </div>
  );
};

export default App;

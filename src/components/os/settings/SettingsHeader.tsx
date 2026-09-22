import React from 'react';
import {
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth, isMasterAdminEmail } from '../../../context/AuthContext';

interface SettingsHeaderProps {
  onClose: () => void;
  onResetAll: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onClose,
  onResetAll,
}) => {
  const { student, user, isGuest, signOut } = useAuth();

  const isAdminUser = isMasterAdminEmail(student?.email || user?.email) || student?.role === 'admin';
  const displayName = student?.full_name || user?.user_metadata?.full_name || (isGuest ? 'طالب زائر' : 'طالب المنحة');
  const displayEmail = student?.email || user?.email || (isGuest ? 'وضع الاستعراض' : '');
  const avatarUrl = student?.avatar_url || user?.user_metadata?.avatar_url;

  const handleSignOut = async () => {
    if (window.confirm('هل ترغب في تسجيل الخروج والعودة لصفحة الدخول؟')) {
      await signOut();
      onClose();
    }
  };

  return (
    <header className="relative h-18 px-4 sm:px-6 border-b border-white/10 flex items-center justify-between bg-[#11100E]/95 backdrop-blur-2xl shrink-0 z-20 shadow-lg shadow-black/40">
      {/* Golden ambient top accent glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-linear-to-r from-transparent via-[#DFCA9F]/40 to-transparent pointer-events-none" />

      {/* Right Navigation & Title Area */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 hover:border-[#DFCA9F]/40 text-xs font-bold text-[#F8F4EC] hover:text-[#DFCA9F] transition-all cursor-pointer group shadow-xs"
          title="العودة إلى سطح المكتب (Esc)"
          aria-label="العودة إلى سطح المكتب"
        >
          <ArrowRight className="w-4 h-4 text-[#DFCA9F] transition-transform duration-200 group-hover:translate-x-0.5" />
          <span className="hidden xs:inline">العودة إلى سطح المكتب</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-black/40 border border-white/15 text-[10px] text-[#A69F93] font-mono shadow-inner">
            Esc
          </kbd>
        </button>

        <div className="h-5 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />

        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-[#DFCA9F]/30 to-[#9C7A38]/30 blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-[#DFCA9F]/25 via-[#CCA868]/15 to-[#141311] border border-[#DFCA9F]/40 flex items-center justify-center text-[#DFCA9F] shadow-sm">
              <SlidersHorizontal className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-[15px] font-black bg-linear-to-r from-[#FFF9EE] via-[#F3EFE7] to-[#DFCA9F] bg-clip-text text-transparent tracking-tight leading-tight">
                إعدادات النظام والتخصيص
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#DFCA9F]/10 text-[#DFCA9F] border border-[#DFCA9F]/25">
                <Sparkles className="w-2.5 h-2.5" />
                <span>لوحة التحكم</span>
              </span>
            </div>
            <span className="text-[10px] text-[#8E877C] font-medium hidden sm:inline leading-tight mt-0.5">
              تخصيص الثيم، الصوتيات، المساعد الذكي وبيئة التركيز
            </span>
          </div>
        </div>
      </div>

      {/* Left User Actions Area */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Profile Card */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-linear-to-b from-white/8 to-white/3 border border-white/10 hover:border-white/20 transition-all shadow-sm">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#24221C] border border-[#DFCA9F]/40 flex items-center justify-center font-black text-[#DFCA9F] text-xs shadow-xs">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0)
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#11100E] shadow-[0_0_8px_#34d399]" />
          </div>

          <div className="flex flex-col text-right leading-tight max-w-35 sm:max-w-45">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#F8F4EC] truncate">
                {displayName}
              </span>
              {isAdminUser ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#DFCA9F]/15 text-[#DFCA9F] border border-[#DFCA9F]/30 shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>مدير</span>
                </span>
              ) : (
                <span className="inline-flex items-center text-[9px] font-semibold px-1.5 py-0.2 rounded bg-white/10 text-[#C8C2B7] shrink-0">
                  {isGuest ? 'زائر' : 'طالب'}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#A69F93] font-mono truncate mt-0.5 text-right" dir="ltr">
              {displayEmail}
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-5 w-px bg-linear-to-b from-transparent via-white/15 to-transparent" />

        {/* Reset Settings Button */}
        <button
          type="button"
          onClick={onResetAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#C8C2B7] hover:text-[#DFCA9F] bg-white/4 hover:bg-white/9 active:scale-95 border border-white/10 hover:border-[#DFCA9F]/35 transition-all cursor-pointer shadow-xs group"
          title="استعادة الإعدادات الافتراضية"
          aria-label="استعادة ضبط الإعدادات الافتراضية"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#DFCA9F]/80 group-hover:text-[#DFCA9F] transition-transform duration-500 group-hover:-rotate-90" />
          <span className="hidden md:inline">استعادة الضبط</span>
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-100 bg-linear-to-r from-rose-500/10 to-red-500/15 hover:from-rose-500/20 hover:to-red-500/25 active:scale-95 border border-rose-500/25 hover:border-rose-500/40 transition-all cursor-pointer shadow-xs shadow-rose-950/20 group"
          title="تسجيل الخروج"
          aria-label="تسجيل الخروج من المنصة"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden xs:inline">تسجيل الخروج</span>
        </button>
      </div>
    </header>
  );
};

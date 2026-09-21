import React from "react";
import { ShieldCheck, Eye, LogOut, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AdminProfileBadge } from "./AdminProfileBadge";

interface AdminHeaderProps {
  onEnterPreview: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onEnterPreview,
  onRefresh,
  isLoading,
}) => {
  const { user, student, signOut } = useAuth();
  const displayName =
    student?.full_name || user?.user_metadata?.full_name || "مدير المنصة";
  const avatarUrl = student?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <header className="h-17.5 border-b border-white/10 bg-[#11100E]/95 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 relative shadow-lg shadow-black/40">
      {/* Top golden ambient glow accent */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-linear-to-r from-transparent via-[#DFCA9F]/40 to-transparent pointer-events-none" />

      {/* Brand & Identity Area */}
      <div className="flex items-center gap-3.5">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-[#DFCA9F]/30 to-[#9C7A38]/30 blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
          <div className="relative w-10 h-10 rounded-2xl bg-linear-to-br from-[#E2D2A7] via-[#CCA868] to-[#9C7A38] p-[1.5px] shadow-md shadow-[#CCA868]/20 shrink-0">
            <div className="w-full h-full bg-[#141311] rounded-[14px] flex items-center justify-center text-[#DFCA9F]">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-[15px] font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[#FFF9EE] via-[#F3EFE7] to-[#DFCA9F] tracking-tight">
              لوحة الإدارة والتحكم الشاملة
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-linear-to-r from-[#DFCA9F]/20 to-[#CCA868]/10 text-[#DFCA9F] border border-[#DFCA9F]/30 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>الدفعة 6</span>
            </span>
          </div>
          <div className="text-[11px] text-[#8C857B] flex items-center gap-1.5 font-medium mt-0.5"></div>
        </div>
      </div>

      {/* Controls & Executive Profile Bar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="تحديث البيانات"
          title="تحديث البيانات فورياً"
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 hover:border-white/20 text-[#C8C2B7] hover:text-[#DFCA9F] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 transition-transform duration-500 ${isLoading ? "animate-spin text-[#DFCA9F]" : "hover:rotate-90"}`}
          />
        </button>

        <button
          type="button"
          onClick={onEnterPreview}
          className="px-3.5 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F]/15 via-[#CCA868]/20 to-[#DFCA9F]/15 hover:from-[#DFCA9F]/25 hover:to-[#CCA868]/30 border border-[#DFCA9F]/35 hover:border-[#DFCA9F]/50 text-[#F5EFE6] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-98 shadow-sm shadow-[#DFCA9F]/5"
        >
          <Eye className="w-3.5 h-3.5 text-[#DFCA9F]" />
          <span className="hidden sm:inline">معاينة واجهة الطالب</span>
        </button>

        <AdminProfileBadge displayName={displayName} avatarUrl={avatarUrl} />

        <button
          type="button"
          onClick={() => signOut()}
          aria-label="تسجيل الخروج من لوحة الإدارة"
          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 hover:border-red-500/40 text-red-300 hover:text-red-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
};

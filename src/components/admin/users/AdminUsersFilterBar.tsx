import React from 'react';
import { Search, UserPlus, FileSpreadsheet, RotateCw } from 'lucide-react';

interface AdminUsersFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddUser: () => void;
  onExportExcel: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AdminUsersFilterBar: React.FC<AdminUsersFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  onAddUser,
  onExportExcel,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-[#141311]/90 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="البحث في حسابات الطلاب بالاسم أو البريد الإلكتروني..."
            className="admin-input pr-10! py-2.5 placeholder:text-[#7A746B]"
          />
          <Search className="w-4 h-4 text-[#8C857B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="تحديث البيانات مباشرة من Supabase"
              aria-label="تحديث الحسابات من Supabase"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C8C2B7] hover:text-[#DFCA9F] transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            type="button"
            onClick={onAddUser}
            className="px-3.5 py-2.5 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold flex items-center gap-1.5 hover:brightness-105 active:scale-98 transition-all cursor-pointer shadow-sm shadow-[#DFCA9F]/15"
          >
            <UserPlus className="w-4 h-4 stroke-2" />
            <span>إضافة طالب</span>
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>إكسيل</span>
          </button>
        </div>
      </div>
    </div>
  );
};

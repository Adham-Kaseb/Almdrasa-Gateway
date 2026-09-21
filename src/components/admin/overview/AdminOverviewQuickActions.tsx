import React from 'react';
import { UserPlus, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface AdminOverviewQuickActionsProps {
  onOpenAddUser: () => void;
  onExportExcel: () => void;
  onRunEliminationCheck: () => void;
}

export const AdminOverviewQuickActions: React.FC<AdminOverviewQuickActionsProps> = ({
  onOpenAddUser,
  onExportExcel,
  onRunEliminationCheck,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-b from-[#181714] to-[#12110F] border border-white/8">
      <h2 className="text-xs font-bold text-[#A8A196] uppercase tracking-wider mb-3.5 flex items-center justify-between">
        <span>إجراءات الإدارة السريعة</span>
        <span className="text-[10px] text-[#7A746B] font-normal">اختصارات فورية</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onOpenAddUser}
          className="p-3.5 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-extrabold flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all cursor-pointer shadow-md shadow-[#CCA868]/15"
        >
          <UserPlus className="w-4 h-4 stroke-[2.2]" />
          <span>إضافة طالب جديد</span>
        </button>

        <button
          type="button"
          onClick={onRunEliminationCheck}
          className="p-3.5 rounded-xl bg-white/4 hover:bg-white/8 border border-[#DFCA9F]/20 hover:border-[#DFCA9F]/40 text-[#F8F4EC] hover:text-[#DFCA9F] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-xs"
        >
          <AlertTriangle className="w-4 h-4 text-[#DFCA9F]" />
          <span>فحص معايير الإقصاء</span>
        </button>

        <button
          type="button"
          onClick={onExportExcel}
          className="p-3.5 rounded-xl bg-white/4 hover:bg-white/8 border border-[#DFCA9F]/20 hover:border-[#DFCA9F]/40 text-[#F8F4EC] hover:text-[#DFCA9F] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#DFCA9F]" />
          <span>تصدير ملف Excel</span>
        </button>
      </div>
    </div>
  );
};

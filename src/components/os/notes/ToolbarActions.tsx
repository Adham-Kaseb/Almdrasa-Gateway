import React from 'react';
import { Copy, Download, Check, RotateCcw } from 'lucide-react';

interface ToolbarActionsProps {
  onCopyAll: () => void;
  onExport: () => void;
  onReset: () => void;
  isCopied: boolean;
}

export const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  onCopyAll,
  onExport,
  onReset,
  isCopied,
}) => {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCopyAll}
        className="p-2 rounded-xl bg-white/70 hover:bg-white border border-[#E5E0D6] text-[#3C3831] hover:text-[#191816] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        title="نسخ محتوى الملاحظة"
      >
        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isCopied ? 'تم النسخ!' : 'نسخ'}</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onExport}
        className="p-2 rounded-xl bg-white/70 hover:bg-white border border-[#E5E0D6] text-[#3C3831] hover:text-[#191816] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        title="تصدير كملف نصي"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">تصدير</span>
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onReset}
        className="p-2 rounded-xl bg-white/70 hover:bg-red-50 hover:text-red-700 border border-[#E5E0D6] text-[#756F66] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
        title="بدء صفحة بيضاء جديدة فارغة"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">صفحة بيضاء</span>
      </button>
    </div>
  );
};

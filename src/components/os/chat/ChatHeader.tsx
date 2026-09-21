import React from 'react';
import { X, GraduationCap } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  studentName?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#1B1A18]/90 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#DFCA9F] via-[#CCA868] to-[#9C7A38] p-0.5 shadow-md shadow-[#CCA868]/20 shrink-0">
          <div className="w-full h-full bg-[#141311] rounded-[10px] flex items-center justify-center text-[#DFCA9F]">
            <GraduationCap className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-bold text-[#F8F4EC] flex items-center gap-1.5">
            <span>مساعد منصة المدرسة الأكاديمي</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-7 h-7 rounded-lg text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="إغلاق المساعد الذكي"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

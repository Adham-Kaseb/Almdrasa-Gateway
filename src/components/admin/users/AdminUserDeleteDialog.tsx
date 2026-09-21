import React from 'react';
import { AlertTriangle, Trash2, X, UserX } from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminUserDeleteDialogProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, hardDelete: boolean) => Promise<{ success: boolean; error?: string }>;
}

export const AdminUserDeleteDialog: React.FC<AdminUserDeleteDialogProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none" dir="rtl">
      <div className="w-full max-w-md rounded-3xl bg-[#141311] border border-red-500/30 p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-[#F8F4EC]">إدارة حذف أو إيقاف الحساب</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="p-1 rounded-lg text-[#8C857B] hover:text-[#F8F4EC] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#C8C2B7] mb-2">
          أنت على وشك اتخاذ إجراء بحق حساب الطالب: <strong className="text-[#F8F4EC]">{user.full_name}</strong> ({user.email}).
        </p>
        <p className="text-[11px] text-[#8C857B] mb-5">
          يمكنك تجميد الحساب مؤقتاً بحيث لا يستطيع الطالب الدخول للمنصة، أو حذفه نهائياً من قاعدة البيانات.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              await onConfirm(user.id, false);
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <UserX className="w-4 h-4" />
            <span>تجميد الحساب (تعطيل مؤقت)</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              await onConfirm(user.id, true);
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف نهائي من النظام</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <button type="button" onClick={onClose} className="text-xs text-[#8C857B] hover:text-[#C8C2B7] cursor-pointer">
            تراجع وإلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

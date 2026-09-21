import React from 'react';
import { X, Shield, Calendar, MapPin, Phone, Award, Clock, Flame, Database, Edit } from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminUserDetailsModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: AdminUser) => void;
}

export const AdminUserDetailsModal: React.FC<AdminUserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none" dir="rtl">
      <div className="w-full max-w-xl rounded-3xl bg-[#141311] border border-white/12 p-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 shrink-0 flex items-center justify-center font-bold text-[#DFCA9F] text-lg">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                user.full_name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#F8F4EC]">{user.full_name}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Database className="w-2.5 h-2.5" />
                  <span>حساب Supabase موثق</span>
                </span>
              </div>
              <div className="text-xs text-[#8C857B]">{user.email}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="إغلاق تفاصيل المستخدم" className="p-1.5 rounded-lg text-[#8C857B] hover:text-[#F8F4EC] hover:bg-white/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Details Grid */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[#8C857B] flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#DFCA9F]" /> الصلاحية والمسار</span>
              <div className="font-semibold text-[#F8F4EC]">{user.role === 'admin' ? 'مدير المنصة' : 'طالب منحة'} • {user.track}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[#8C857B] flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400" /> الدفعة والمرحلة</span>
              <div className="font-semibold text-[#F8F4EC]">الدفعة {user.cohort_year} • المرحلة {user.scholarship_phase}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[#8C857B] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> الموقع الجغرافي</span>
              <div className="font-semibold text-[#F8F4EC]">{user.country || 'مصر'}{user.village ? ` - ${user.village}` : ''}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[#8C857B] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> رقم الهاتف</span>
              <div className="font-semibold text-[#F8F4EC]">{user.phone || 'غير مسجل'}</div>
            </div>
          </div>

          {/* Academic Stats */}
          <div className="p-3 rounded-xl bg-linear-to-r from-white/5 to-transparent border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[#8C857B]">
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#DFCA9F]" /> نسبة الإنجاز العام</span>
              <span className="font-bold text-[#DFCA9F]">{user.overall_progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-[#DFCA9F] to-[#CCA868]" style={{ width: `${user.overall_progress}%` }} />
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#8C857B]">
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-amber-400" /> {user.study_streak_days} يوم متتالي</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-400" /> {user.total_hours_learned} ساعة تدريب</span>
            </div>
          </div>

          {/* Supabase Technical Meta */}
          <div className="p-3 rounded-xl bg-[#0D0C0B] border border-white/5 space-y-1 text-[11px]">
            <div className="text-[#8C857B]">معرف الحساب في Supabase (UUID):</div>
            <div className="font-mono text-[#DFCA9F] break-all select-all">{user.id}</div>
            {user.created_at && (
              <div className="text-[#7A746B] text-[10px] pt-1">
                تاريخ التسجيل: {new Date(user.created_at).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10 mt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(user);
            }}
            className="px-4 py-2 rounded-xl bg-[#DFCA9F] text-[#141310] font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>تعديل الحساب</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C8C2B7] text-xs font-semibold transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

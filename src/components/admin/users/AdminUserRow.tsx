import React from 'react';
import { Edit, Trash2, Shield, UserX, UserCheck, Eye } from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminUserRowProps {
  user: AdminUser;
  onViewUser: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (user: AdminUser) => void;
}

export const AdminUserRow: React.FC<AdminUserRowProps> = ({
  user,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
}) => {
  const getStatusBadge = (status: AdminUser['status']) => {
    switch (status) {
      case 'excelling':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">متفوق</span>;
      case 'at_risk':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30 animate-pulse">معرض للإقصاء</span>;
      case 'suspended':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-500/20 text-zinc-400 border border-zinc-500/30">موقوف</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">نشط</span>;
    }
  };

  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/10 flex items-center justify-center font-bold text-[#DFCA9F] text-xs">
            {user.avatar_url ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" /> : user.full_name.charAt(0)}
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-bold text-[#F8F4EC] flex items-center gap-1.5 mb-1.5 leading-snug">
              <span>{user.full_name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" title="حساب موثق في Supabase" />
            </div>
            <div className="text-[11px] text-[#8C857B] leading-none">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="font-semibold text-[#DFCA9F]">{user.track}</div>
        <div className="text-[10px] text-[#8C857B]">المرحلة {user.scholarship_phase} • {user.cohort_year}</div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-[#DFCA9F] to-[#CCA868]" style={{ width: `${user.overall_progress}%` }} />
          </div>
          <span className="text-[11px] font-bold text-[#F8F4EC]">{user.overall_progress}%</span>
        </div>
        <div className="text-[10px] text-[#8C857B] mt-0.5">{user.study_streak_days} يوم • {user.total_hours_learned} س</div>
      </td>
      <td className="py-3 px-3">{getStatusBadge(user.status)}</td>
      <td className="py-3 px-3">
        {user.role === 'admin' ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#DFCA9F] bg-[#DFCA9F]/15 px-2 py-0.5 rounded-md border border-[#DFCA9F]/30">
            <Shield className="w-2.5 h-2.5" />
            <span>مدير</span>
          </span>
        ) : (
          <span className="text-[11px] text-[#9E988F]">طالب</span>
        )}
      </td>
      <td className="py-3 px-4 text-left">
        <div className="flex items-center justify-end gap-1.5">
          <button type="button" onClick={() => onViewUser(user)} aria-label={`معاينة ${user.full_name}`} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] hover:text-[#DFCA9F] transition-colors cursor-pointer" title="معاينة تفاصيل الحساب">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => onEditUser(user)} aria-label={`تعديل ${user.full_name}`} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] hover:text-[#DFCA9F] transition-colors cursor-pointer" title="تعديل الحساب">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => onToggleStatus(user)} aria-label={`تبديل حالة ${user.full_name}`} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${user.status === 'suspended' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-300'}`} title={user.status === 'suspended' ? 'إلغاء التجميد' : 'تجميد الحساب'}>
            {user.status === 'suspended' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
          </button>
          {user.email !== 'admin@almdrasa.com' && (
            <button type="button" onClick={() => onDeleteUser(user.id)} aria-label={`حذف ${user.full_name}`} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer" title="حذف المستخدم">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

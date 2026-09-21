import React from 'react';
import { ArrowLeft, Database, Flame, Clock } from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminRecentStudentsCardProps {
  users: AdminUser[];
  onViewAll: () => void;
}

export const AdminRecentStudentsCard: React.FC<AdminRecentStudentsCardProps> = ({
  users,
  onViewAll,
}) => {
  const previewUsers = users.slice(0, 4);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-b from-[#181714] to-[#12110F] border border-white/8 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#F8F4EC] tracking-tight">
              أحدث حسابات الطلاب المسجلة في Supabase
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DFCA9F]/10 text-[#DFCA9F] font-bold border border-[#DFCA9F]/20 flex items-center gap-1">
              <Database className="w-2.5 h-2.5" />
              <span>حي ومباشر</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs text-[#DFCA9F] hover:text-[#F8F4EC] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <span>إدارة كافة الطلاب</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {previewUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8C857B]">
            لا توجد حسابات طلاب مسجلة بعد.
          </div>
        ) : (
          <div className="space-y-2.5">
            {previewUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 rounded-xl bg-white/4 hover:bg-white/7 border border-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#24221C] border border-white/10 shrink-0 flex items-center justify-center font-bold text-[#DFCA9F] text-xs">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      user.full_name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#F8F4EC]">{user.full_name}</div>
                    <div className="text-[11px] text-[#8C857B]">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="font-semibold text-[#DFCA9F] text-[11px]">{user.track}</span>
                    <div className="text-[10px] text-[#8C857B]">المرحلة {user.scholarship_phase}</div>
                  </div>

                  <div className="w-24">
                    <div className="flex items-center justify-between text-[10px] text-[#8C857B] mb-1">
                      <span>إنجاز</span>
                      <span className="font-bold text-[#F8F4EC]">{user.overall_progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#DFCA9F] to-[#CCA868]"
                        style={{ width: `${user.overall_progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[#8C857B] shrink-0">
                    <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-[#DFCA9F]" /> {user.study_streak_days}د</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-[#DFCA9F]" /> {user.total_hours_learned}س</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

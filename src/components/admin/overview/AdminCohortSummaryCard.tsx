import React from 'react';
import { GraduationCap, Users, ShieldAlert, Award } from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminCohortSummaryCardProps {
  users: AdminUser[];
}

export const AdminCohortSummaryCard: React.FC<AdminCohortSummaryCardProps> = ({ users }) => {
  const students = users.filter((u) => u.role !== 'admin');
  const activeCount = students.filter((s) => s.status === 'active' || s.status === 'excelling').length;
  const excellingCount = students.filter((s) => s.status === 'excelling').length;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-b from-[#181714] to-[#12110F] border border-white/8 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#DFCA9F]" />
            <h2 className="text-xs font-bold text-[#F8F4EC] tracking-tight">
              بيانات الدفعة السادسة
            </h2>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#DFCA9F]/10 text-[#DFCA9F] font-bold border border-[#DFCA9F]/25">
            Cohort 6
          </span>
        </div>

        {/* Milestone status */}
        <div className="p-3.5 rounded-xl bg-white/3 border border-white/8 mb-3.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#A8A196] font-medium text-[11px]">المرحلة التدريبية الحالية</span>
            <span className="text-[#DFCA9F] font-bold text-[11px]">المرحلة 2 (مشاريع عملية)</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-[#DFCA9F]/60 to-[#DFCA9F] rounded-full w-[45%]" />
          </div>
          <div className="flex justify-between text-[10px] text-[#7A746B] mt-2">
            <span>البداية: 04 يوليو 2026</span>
            <span>تقييم الإقصاء: 04 أبريل 2027</span>
          </div>
        </div>

        {/* Cohort Guidelines & Criteria */}
        <div className="space-y-2 mb-3">
          <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#8C857B] text-[11px] flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              ضوابط الحضور والغياب
            </span>
            <span className="font-bold text-xs text-[#F8F4EC]">تجاوز غيابين يعرض للإقصاء</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#8C857B] text-[11px] flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#DFCA9F]" />
              الحد الأدنى لدرجة التقييم
            </span>
            <span className="font-bold text-xs text-[#DFCA9F]">80% بالتقييم الدوري</span>
          </div>
        </div>
      </div>

      {/* Cohort Stats Footer */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8C857B]">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#DFCA9F]" />
          <span>الطلاب المستمرون</span>
        </span>
        <span className="font-bold text-[#F8F4EC]">
          {activeCount} نشط ({excellingCount} متفوق)
        </span>
      </div>
    </div>
  );
};

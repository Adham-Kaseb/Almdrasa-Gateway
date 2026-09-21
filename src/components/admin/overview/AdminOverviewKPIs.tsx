import React from 'react';
import { Users, Award, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminOverviewKPIsProps {
  users: AdminUser[];
}

export const AdminOverviewKPIs: React.FC<AdminOverviewKPIsProps> = ({ users }) => {
  const totalStudents = users.filter((u) => u.role !== 'admin').length;
  const excellingStudents = users.filter((u) => u.status === 'excelling').length;
  const atRiskStudents = users.filter((u) => u.status === 'at_risk').length;
  const totalHours = users.reduce((acc, u) => acc + (u.total_hours_learned || 0), 0);
  const avgProgress = totalStudents > 0
    ? Math.round(users.reduce((acc, u) => acc + (u.overall_progress || 0), 0) / users.length)
    : 0;

  const kpis = [
    {
      label: 'الطلاب المسجلين',
      value: totalStudents,
      sub: 'حسابات موثقة في Supabase',
      icon: Users,
    },
    {
      label: 'الطلاب المتفوقين',
      value: excellingStudents,
      sub: 'إنجاز ممتاز',
      icon: Award,
    },
    {
      label: 'المهددين بالإقصاء',
      value: atRiskStudents,
      sub: 'متابعة المعايير',
      icon: AlertTriangle,
    },
    {
      label: 'ساعات التعلم',
      value: `${totalHours} س`,
      sub: 'إجمالي تدريب الدفعة',
      icon: Clock,
    },
    {
      label: 'متوسط الإنجاز',
      value: `${avgProgress}%`,
      sub: 'المرحلة الحالية',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-linear-to-b from-[#181714] to-[#12110F] border border-white/8 hover:border-[#DFCA9F]/25 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-[#DFCA9F]/5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#8C857B] font-medium">{kpi.label}</span>
              <div className="p-2 rounded-xl bg-[#DFCA9F]/10 border border-[#DFCA9F]/20 text-[#DFCA9F]">
                <Icon className="w-4 h-4 text-[#DFCA9F]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F8F4EC] tracking-tight mb-1">
              {kpi.value}
            </div>
            <div className="text-[10px] text-[#7A746B]">{kpi.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

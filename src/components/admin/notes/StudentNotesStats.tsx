import React from 'react';
import { BookOpen, Users, Globe2, Clock } from 'lucide-react';
import { AdminNotesStats } from '../../../hooks/useAdminStudentNotes';

interface StudentNotesStatsProps {
  stats: AdminNotesStats;
}

export const StudentNotesStats: React.FC<StudentNotesStatsProps> = ({ stats }) => {
  const formatArabicTime = (isoString: string | null): string => {
    if (!isoString) return 'لا يوجد';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'الآن';
    }
  };

  const statItems = [
    {
      label: 'إجمالي ملاحظات الطلاب',
      value: stats.totalNotes,
      sub: 'محفوظة في Supabase',
      icon: BookOpen,
      iconColor: 'text-[#DFCA9F]',
      bgGrad: 'from-[#DFCA9F]/10 to-transparent',
    },
    {
      label: 'الطلاب المدوّنون',
      value: stats.uniqueStudents,
      sub: 'طالب قام بالتدوين',
      icon: Users,
      iconColor: 'text-[#DFCA9F]',
      bgGrad: 'from-[#DFCA9F]/10 to-transparent',
    },
    {
      label: 'اللغات والاتجاه',
      value: `${stats.rtlCount} عربي / ${stats.ltrCount} إنجليزي`,
      sub: 'توزيع RTL و LTR',
      icon: Globe2,
      iconColor: 'text-[#DFCA9F]',
      bgGrad: 'from-[#DFCA9F]/10 to-transparent',
    },
    {
      label: 'آخر نشاط تدوين',
      value: formatArabicTime(stats.latestUpdatedAt),
      sub: 'محدث تلقائياً',
      icon: Clock,
      iconColor: 'text-[#DFCA9F]',
      bgGrad: 'from-[#DFCA9F]/10 to-transparent',
    },
  ];

  return (
    <section aria-label="إحصائيات ملاحظات الطلاب" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-linear-to-b ${item.bgGrad} bg-[#141311]/90 border border-white/10 shadow-xs flex items-center justify-between`}
          >
            <div>
              <div className="text-[11px] font-medium text-[#8C857B]">{item.label}</div>
              <div className="text-lg font-bold text-[#F8F4EC] mt-0.5 tracking-tight">{item.value}</div>
              <div className="text-[10px] text-[#A69F94] mt-0.5">{item.sub}</div>
            </div>
            <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${item.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </section>
  );
};

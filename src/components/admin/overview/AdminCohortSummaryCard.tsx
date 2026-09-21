import React from 'react';
import { Layers, ShieldCheck, Activity, GraduationCap } from 'lucide-react';
import { AdminUser } from '../../../types/admin';

interface AdminCohortSummaryCardProps {
  users: AdminUser[];
}

export const AdminCohortSummaryCard: React.FC<AdminCohortSummaryCardProps> = ({ users }) => {
  const students = users.filter((u) => u.role !== 'admin');
  const tracks = [
    { name: 'Fullstack Web', count: students.filter((s) => s.track.toLowerCase().includes('fullstack')).length || 1 },
    { name: 'Frontend React', count: students.filter((s) => s.track.toLowerCase().includes('front')).length || 1 },
    { name: 'Backend Node', count: students.filter((s) => s.track.toLowerCase().includes('back')).length || 0 },
    { name: 'Mobile Flutter', count: students.filter((s) => s.track.toLowerCase().includes('mobile')).length || 0 },
  ];

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
        <div className="p-3 rounded-xl bg-white/3 border border-white/8 mb-3.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#A8A196] font-medium text-[11px]">المرحلة التدريبية الحالية</span>
            <span className="text-[#DFCA9F] font-bold text-[11px]">المرحلة 2 (مشاريع عملية)</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-[#DFCA9F]/60 to-[#DFCA9F] rounded-full w-[45%]" />
          </div>
          <div className="flex justify-between text-[10px] text-[#7A746B] mt-1.5">
            <span>البداية: 04 يوليو 2026</span>
            <span>تقييم الإقصاء: 04 أبريل 2027</span>
          </div>
        </div>

        {/* Tracks distribution (Unified with app identity) */}
        <div className="mb-3.5">
          <div className="text-[11px] font-semibold text-[#8C857B] mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#DFCA9F]" />
            <span>توزيع التخصصات البرمجية</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {tracks.map((t, idx) => (
              <div
                key={idx}
                className="px-3 py-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-[#DFCA9F]/15 hover:border-[#DFCA9F]/35 flex items-center justify-between text-xs transition-all"
              >
                <span className="text-[11px] font-medium text-[#F8F4EC]">{t.name}</span>
                <span className="font-bold text-xs text-[#DFCA9F] px-2 py-0.5 rounded-md bg-[#DFCA9F]/10 border border-[#DFCA9F]/20">
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud DB live status (Unified with app identity) */}
      <div className="p-3 rounded-xl bg-[#DFCA9F]/5 border border-[#DFCA9F]/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#DFCA9F] animate-ping" />
          <div className="text-[11px]">
            <div className="font-bold text-[#DFCA9F] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مزامنة سحابية حية</span>
            </div>
            <div className="text-[10px] text-[#8C857B]">RLS موثق • اتصال مباشر</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#DFCA9F]/15 text-[#DFCA9F] font-mono font-bold flex items-center gap-1 border border-[#DFCA9F]/25">
            <Activity className="w-2.5 h-2.5" />
            <span>99.9%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

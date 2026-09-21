import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, RefreshCw, UserX } from 'lucide-react';
import { AdminUser, AdminPlatformConfig } from '../../../types/admin';

interface AdminEliminationTabProps {
  users: AdminUser[];
  platformConfig: AdminPlatformConfig;
  onUpdateConfig: (updates: Partial<AdminPlatformConfig>) => void;
  onRunEliminationCheck: () => number;
  onUpdateUserStatus: (userId: string, status: AdminUser['status']) => void;
}

export const AdminEliminationTab: React.FC<AdminEliminationTabProps> = ({
  users,
  platformConfig,
  onUpdateConfig,
  onRunEliminationCheck,
  onUpdateUserStatus,
}) => {
  const [maxAbsences, setMaxAbsences] = useState(platformConfig.elimination_max_absences);
  const [minScore, setMinScore] = useState(platformConfig.elimination_min_score);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const atRiskStudents = users.filter((u) => u.status === 'at_risk');

  const handleRunScan = () => {
    const count = onRunEliminationCheck();
    setScanResult(`اكتمل الفحص الآلي: تم رصد ${count} طالباً تجاوزوا معايير الالتزام وتم تصنيفهم كـ معرضين للإقصاء.`);
  };

  const handleSaveThresholds = () => {
    onUpdateConfig({
      elimination_max_absences: Number(maxAbsences),
      elimination_min_score: Number(minScore),
    });
  };

  return (
    <div className="space-y-6">
      {/* Criteria Controls */}
      <div className="p-6 rounded-3xl bg-[#141311]/90 border border-red-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F8F4EC]">محرك ضوابط الاستمرار والإقصاء للمنحة</h2>
            <p className="text-xs text-[#8C857B]">تحديد الحدود الصارمة للغياب والاختبارات الأكاديمية للدفعة السادسة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#C8C2B7] mb-1 font-semibold">الحد الأقصى للغيابات المسموحة</label>
            <input type="number" min={1} max={10} value={maxAbsences} onChange={(e) => setMaxAbsences(Number(e.target.value))} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]" />
          </div>
          <div>
            <label className="block text-[#C8C2B7] mb-1 font-semibold">أدنى نسبة نجاح في الاختبارات (%)</label>
            <input type="number" min={50} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button type="button" onClick={handleSaveThresholds} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#F8F4EC] text-xs font-semibold cursor-pointer">
            حفظ معايير الضوابط
          </button>
          <button type="button" onClick={handleRunScan} className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            <span>تشغيل الفحص الآلي الآن</span>
          </button>
        </div>

        {scanResult && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{scanResult}</span>
          </div>
        )}
      </div>

      {/* At Risk Students List */}
      <div className="p-6 rounded-3xl bg-[#141311]/90 border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>قائمة الطلاب المهددين بالإقصاء حالياً ({atRiskStudents.length})</span>
        </h3>

        {atRiskStudents.length === 0 ? (
          <p className="text-xs text-emerald-400 py-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>ممتاز! لا يوجد أي طلاب مهددين بالإقصاء في الوقت الحالي.</span>
          </p>
        ) : (
          <div className="space-y-2">
            {atRiskStudents.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-[#1C1B17] border border-red-500/20 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#F8F4EC]">{s.full_name} ({s.email})</div>
                  <div className="text-[10.5px] text-[#8C857B]">المسار: {s.track} • الإنجاز: {s.overall_progress}% • الالتزام: {s.study_streak_days} أيام</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onUpdateUserStatus(s.id, 'active')} className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-semibold hover:bg-emerald-500/25 cursor-pointer">
                    منح فرصة (إعادة تنشيط)
                  </button>
                  <button type="button" onClick={() => onUpdateUserStatus(s.id, 'suspended')} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 font-semibold hover:bg-red-500/30 cursor-pointer flex items-center gap-1">
                    <UserX className="w-3.5 h-3.5" />
                    <span>إقصاء فوري</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

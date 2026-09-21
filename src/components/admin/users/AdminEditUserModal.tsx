import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { AdminUser, AdminUserUpdate, AdminUserUpdateSchema } from '../../../types/admin';

interface AdminEditUserModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: Partial<AdminUserUpdate>) => Promise<{ success: boolean; error?: string }>;
}

export const AdminEditUserModal: React.FC<AdminEditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !user) return null;

  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [country, setCountry] = useState(user.country || 'مصر');
  const [track, setTrack] = useState(user.track);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [scholarshipPhase, setScholarshipPhase] = useState(user.scholarship_phase);
  const [streakDays, setStreakDays] = useState(user.study_streak_days);
  const [hoursLearned, setHoursLearned] = useState(user.total_hours_learned);
  const [progress, setProgress] = useState(user.overall_progress);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: AdminUserUpdate = {
      id: user.id,
      full_name: fullName,
      email,
      phone: phone || null,
      country,
      village: user.village || null,
      track,
      role,
      status,
      cohort_year: user.cohort_year,
      scholarship_phase: Number(scholarshipPhase),
      study_streak_days: Number(streakDays),
      total_hours_learned: Number(hoursLearned),
      overall_progress: Number(progress),
    };

    const validation = AdminUserUpdateSchema.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'بيانات النموذج غير صالحة');
      return;
    }

    setIsSubmitting(true);
    const res = await onSave(user.id, payload);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'حدث خطأ أثناء حفظ التعديلات');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none" dir="rtl">
      <div className="w-full max-w-xl rounded-3xl bg-[#141311] border border-white/12 p-6 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h2 className="text-base font-bold text-[#F8F4EC]">تعديل حساب وبيانات الطالب</h2>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="p-1 rounded-lg text-[#8C857B] hover:text-[#F8F4EC] hover:bg-white/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#C8C2B7] mb-1">الاسم الكامل</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">الهاتف</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">الدولة</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">المسار الأكاديمي</label>
              <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]">
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Mobile">Mobile</option>
                <option value="General">General</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">الحالة الأكاديمية</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]">
                <option value="active">نشط (Active)</option>
                <option value="excelling">متفوق (Excelling)</option>
                <option value="at_risk">معرض للإقصاء (At Risk)</option>
                <option value="suspended">موقوف (Suspended)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">الصلاحية</label>
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]">
                <option value="student">طالب (Student)</option>
                <option value="admin">مدير (Admin)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">المرحلة الأكاديمية</label>
              <input type="number" min={1} max={5} value={scholarshipPhase} onChange={(e) => setScholarshipPhase(Number(e.target.value))} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">ساعات الدراسة</label>
              <input type="number" min={0} value={hoursLearned} onChange={(e) => setHoursLearned(Number(e.target.value))} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">أيام الالتزام المتتالية</label>
              <input type="number" min={0} value={streakDays} onChange={(e) => setStreakDays(Number(e.target.value))} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#C8C2B7]">نسبة الإنجاز في المنحة:</span>
              <span className="font-bold text-[#DFCA9F]">{progress}%</span>
            </div>
            <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full accent-[#DFCA9F]" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C8C2B7] text-xs font-semibold cursor-pointer">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer disabled:opacity-50">
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { AdminNewUser, AdminNewUserSchema } from '../../../types/admin';

interface AdminAddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AdminNewUser) => Promise<{ success: boolean; error?: string }>;
}

export const AdminAddUserModal: React.FC<AdminAddUserModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Almdrasa2026!');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('مصر');
  const [track, setTrack] = useState('Frontend');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [status, setStatus] = useState<'active' | 'excelling' | 'at_risk' | 'suspended'>('active');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: AdminNewUser = {
      full_name: fullName,
      email,
      password,
      phone: phone || undefined,
      country,
      track,
      role,
      status,
      cohort_year: 2026,
      scholarship_phase: 1,
    };

    const validation = AdminNewUserSchema.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'بيانات النموذج غير مكتملة');
      return;
    }

    setIsSubmitting(true);
    const res = await onAdd(payload);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'تعذر إضافة المستخدم');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none" dir="rtl">
      <div className="w-full max-w-lg rounded-3xl bg-[#141311] border border-white/12 p-6 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#DFCA9F]" />
            <h2 className="text-base font-bold text-[#F8F4EC]">إضافة حساب طالب / مستخدم جديد</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="p-1 rounded-lg text-[#8C857B] hover:text-[#F8F4EC] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#C8C2B7] mb-1">الاسم الكامل للطالب</label>
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: يوسف إبراهيم" className="admin-input" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#C8C2B7] mb-1">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@almdrasa.community" className="admin-input" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">كلمة المرور المؤقتة</label>
              <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">الهاتف</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 100 ..." className="admin-input" />
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
              </select>
            </div>
            <div>
              <label className="block text-[#C8C2B7] mb-1">نوع الحساب والصلاحية</label>
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]">
                <option value="student">طالب (Student)</option>
                <option value="admin">مدير (Admin)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#C8C2B7] mb-1">الحالة الأكاديمية المبدئية</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]">
                <option value="active">نشط (Active)</option>
                <option value="excelling">متفوق (Excelling)</option>
                <option value="at_risk">معرض للإقصاء (At Risk)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C8C2B7] text-xs font-semibold cursor-pointer">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer disabled:opacity-50">
              <UserPlus className="w-4 h-4 stroke-2" />
              <span>{isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الحساب الآن'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

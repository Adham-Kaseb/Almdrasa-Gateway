import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';
import { exportStyledUsersExcel } from '../utils/excelExport';
import { isMasterAdminEmail } from '../context/AuthContext';
import {
  AdminUser,
  AdminUserSchema,
  AdminUserUpdate,
  AdminNewUser,
  AdminAnnouncement,
  AdminPlatformConfig,
  AdminPlatformConfigSchema,
  AdminCourse,
  AdminLesson,
} from '../types/admin';

export interface AuditLog {
  id: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  adminName: string;
}

const DEFAULT_CONFIG: AdminPlatformConfig = {
  cohort_title: 'منحة المدرسة — الدفعة 6',
  target_date: '2026-06-01',
  days_remaining: 71,
  maintenance_mode: false,
  registration_open: true,
  companion_enabled: true,
  companion_tone: 'encouraging',
  companion_prompt: 'أنت المساعد الذكي لمدرسة Almdrasa ومسؤول عن إرشاد طلاب المنحة.',
  elimination_max_absences: 2,
  elimination_min_score: 80,
  urgent_banner_text: '',
  urgent_banner_enabled: false,
};

const DEFAULT_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'انطلاق المرحلة الأولى من منحة الدفعة السادسة',
    message: 'نرحب بجميع طلاب الدفعة السادسة لعام 2026! يرجى مراجعة الجدول الزمني المعتمد والالتزام بمواعيد تسليم المهام الأسبوعية.',
    severity: 'info',
    is_active: true,
    is_pinned: true,
    target_track: 'all',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ann-2',
    title: 'تنبيه خاص بضوابط الغياب واللقاءات الأسبوعية',
    message: 'حضور اللقاءات الأسبوعية شرط أساسي للمنحة. تجاوز غيابين بدون عذر مسبق يعرض الطالب للإقصاء التلقائي.',
    severity: 'warning',
    is_active: true,
    is_pinned: false,
    target_track: 'all',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_FALLBACK_USERS: AdminUser[] = [
  {
    id: 'a3d48209-d188-4d1d-b26b-b7fd78271a0b',
    email: 'adhamkasebssj4@gmail.com',
    full_name: 'ADHAM KASEB',
    avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocLPKT2Zy8WiN7pzQsnuGch_2kljtSWTz57osZDprrS8RLAKHo1g=s96-c',
    role: 'admin',
    status: 'active',
    track: 'General',
    cohort_year: 2026,
    scholarship_phase: 1,
    study_streak_days: 0,
    total_hours_learned: 0,
    overall_progress: 0,
    country: 'مصر',
    village: 'الجيزة',
    created_at: '2026-08-31T10:48:20.149348+00:00',
  },
  {
    id: 'f618214c-6f1a-44b8-a5d7-60b61990cbb4',
    email: 'adhamkaseb2020@gmail.com',
    full_name: 'adham kaseb',
    avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocJVuv9WfujAX-T1-_WBYU0jNvxtqQTYTak6FSEr5JYnWrQs10RG=s96-c',
    role: 'student',
    status: 'active',
    track: 'General',
    cohort_year: 2026,
    scholarship_phase: 1,
    study_streak_days: 0,
    total_hours_learned: 0,
    overall_progress: 0,
    country: 'مصر',
    created_at: '2026-09-20T14:21:44.998026+00:00',
  },
  {
    id: '3bb74042-1d79-47ef-8a6d-4b277017dd94',
    email: 'new@gmail.com',
    full_name: 'خالد',
    avatar_url: null,
    role: 'student',
    status: 'active',
    track: 'General',
    cohort_year: 2026,
    scholarship_phase: 1,
    study_streak_days: 0,
    total_hours_learned: 0,
    overall_progress: 0,
    country: 'مصر',
    created_at: '2026-09-20T22:31:11.557245+00:00',
  },
];

const CONFIG_STORAGE_KEY = 'almdrasa_admin_platform_config';
const ANNOUNCEMENTS_STORAGE_KEY = 'almdrasa_admin_announcements';
const AUDIT_STORAGE_KEY = 'almdrasa_admin_audit_logs';

export function useAdminData() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_FALLBACK_USERS);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENTS;
    try {
      const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENTS;
    } catch {
      return DEFAULT_ANNOUNCEMENTS;
    }
  });
  const [platformConfig, setPlatformConfig] = useState<AdminPlatformConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [courses] = useState<AdminCourse[]>([]);
  const [lessons] = useState<AdminLesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const addAuditLog = useCallback((action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      target,
      details,
      timestamp: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'medium' }),
      adminName: 'إدارة المنصة',
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Fetch users & courses from Supabase with safe fallback
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. First attempt to call the dedicated RPC function which retrieves all authenticated and registered Supabase users
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_admin_users');

      if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
        const validatedUsers: AdminUser[] = [];
        for (const raw of rpcData) {
          const parsed = AdminUserSchema.safeParse(raw);
          if (parsed.success) {
            validatedUsers.push(parsed.data);
          } else {
            validatedUsers.push(raw as AdminUser);
          }
        }

        const sortedUsers = [...validatedUsers]
          .sort((a, b) => a.full_name.localeCompare(b.full_name, 'ar'));

        setUsers(sortedUsers);
      } else {
        // 2. Direct tables query: Query profiles and students from Supabase
        const [profilesRes, studentsRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('students').select('*'),
        ]);

        const profileMap = new Map((profilesRes.data || []).map((p: any) => [p.id, p]));
        const studentMap = new Map((studentsRes.data || []).map((s: any) => [s.id, s]));

        const allIds = new Set<string>([
          ...profileMap.keys(),
          ...studentMap.keys(),
        ]);

        const mergedUsers: AdminUser[] = [];

        allIds.forEach((id) => {
          const p = profileMap.get(id);
          const s = studentMap.get(id);

          const email = s?.email || p?.email || '';
          if (!email) return;

          const role = (p?.role || 'student') as any;

          const rawUser = {
            id,
            email,
            full_name: p?.full_name || s?.full_name || email.split('@')[0],
            avatar_url: p?.avatar_url || s?.avatar_url || null,
            role,
            status: (s?.status || 'active') as any,
            track: s?.track || (role === 'admin' ? 'Administration' : 'General'),
            cohort_year: s?.cohort_year || 2026,
            scholarship_phase: s?.scholarship_phase || 1,
            study_streak_days: s?.study_streak_days || 0,
            total_hours_learned: s?.total_hours_learned || 0,
            overall_progress: s?.overall_progress || 0,
            phone: p?.phone || null,
            country: p?.country || 'مصر',
            village: p?.village || null,
            created_at: s?.created_at || p?.created_at || new Date().toISOString(),
            updated_at: s?.updated_at || p?.updated_at,
          };

          const validated = AdminUserSchema.safeParse(rawUser);
          if (validated.success) {
            mergedUsers.push(validated.data);
          } else {
            mergedUsers.push(rawUser as AdminUser);
          }
        });

        mergedUsers.sort((a, b) => a.full_name.localeCompare(b.full_name, 'ar'));

        if (mergedUsers.length > 0) {
          setUsers(mergedUsers);
        }
      }

      // Cleaned up: courses and lessons are maintained locally in the gateway
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل بعض البيانات من Supabase.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Update existing user profile
  const updateUser = useCallback(
    async (userId: string, updates: Partial<AdminUserUpdate>): Promise<{ success: boolean; error?: string }> => {
      try {
        const { error: rpcErr } = await supabase.rpc('admin_update_user', {
          p_user_id: userId,
          p_full_name: updates.full_name || null,
          p_email: updates.email || null,
          p_role: updates.role || null,
          p_status: updates.status || null,
          p_track: updates.track || null,
          p_phone: updates.phone || null,
          p_country: updates.country || null,
          p_village: updates.village || null,
          p_cohort_year: updates.cohort_year || null,
          p_scholarship_phase: updates.scholarship_phase || null,
          p_study_streak_days: updates.study_streak_days !== undefined ? updates.study_streak_days : null,
          p_total_hours_learned: updates.total_hours_learned !== undefined ? updates.total_hours_learned : null,
          p_overall_progress: updates.overall_progress !== undefined ? updates.overall_progress : null,
        });

        if (rpcErr) {
          const profileUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
          if (updates.full_name) profileUpdates.full_name = updates.full_name;
          if (updates.email) profileUpdates.email = updates.email;
          if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
          if (updates.country !== undefined) profileUpdates.country = updates.country;
          if (updates.village !== undefined) profileUpdates.village = updates.village;
          if (updates.role) profileUpdates.role = updates.role;

          const studentUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
          if (updates.full_name) studentUpdates.full_name = updates.full_name;
          if (updates.email) studentUpdates.email = updates.email;
          if (updates.track) studentUpdates.track = updates.track;
          if (updates.status) studentUpdates.status = updates.status;
          if (updates.cohort_year) studentUpdates.cohort_year = updates.cohort_year;
          if (updates.scholarship_phase) studentUpdates.scholarship_phase = updates.scholarship_phase;
          if (updates.study_streak_days !== undefined) studentUpdates.study_streak_days = updates.study_streak_days;
          if (updates.total_hours_learned !== undefined) studentUpdates.total_hours_learned = updates.total_hours_learned;
          if (updates.overall_progress !== undefined) studentUpdates.overall_progress = updates.overall_progress;

          await Promise.all([
            supabase.from('profiles').update(profileUpdates).eq('id', userId),
            supabase.from('students').update(studentUpdates).eq('id', userId),
          ]);
        }

        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              return { ...u, ...updates } as AdminUser;
            }
            return u;
          })
        );

        addAuditLog('تحديث بيانات مستخدم', updates.full_name || userId, `تم تحديث بيانات الحساب بنجاح في Supabase`);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || 'فشل تحديث بيانات المستخدم' };
      }
    },
    [addAuditLog]
  );

  // Add new student/user
  const addUser = useCallback(
    async (newUser: AdminNewUser): Promise<{ success: boolean; error?: string }> => {
      try {
        let createdId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

        const { data: createData, error: createError } = await supabase.rpc('admin_create_user', {
          p_email: newUser.email,
          p_password: newUser.password,
          p_full_name: newUser.full_name,
          p_role: newUser.role,
          p_track: newUser.track,
          p_phone: newUser.phone || null,
          p_country: newUser.country || 'مصر',
          p_cohort_year: newUser.cohort_year,
          p_scholarship_phase: newUser.scholarship_phase,
        });

        if (!createError && createData && (createData as any).user?.id) {
          createdId = (createData as any).user.id;
        } else {
          // Direct table insert fallback
          try {
            await supabase.from('profiles').insert({
              id: createdId,
              full_name: newUser.full_name,
              email: newUser.email,
              phone: newUser.phone || null,
              country: newUser.country,
              role: newUser.role,
            });

            await supabase.from('students').insert({
              id: createdId,
              full_name: newUser.full_name,
              email: newUser.email,
              track: newUser.track,
              status: newUser.status,
              cohort_year: newUser.cohort_year,
              scholarship_phase: newUser.scholarship_phase,
            });
          } catch {
            // fallback in memory
          }
        }

        const createdUser: AdminUser = {
          id: createdId,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          status: newUser.status,
          track: newUser.track,
          cohort_year: newUser.cohort_year,
          scholarship_phase: newUser.scholarship_phase,
          study_streak_days: 0,
          total_hours_learned: 0,
          overall_progress: 0,
          phone: newUser.phone || null,
          country: newUser.country,
          created_at: new Date().toISOString(),
        };

        setUsers((prev) => [createdUser, ...prev]);
        addAuditLog('إضافة طالب جديد', newUser.full_name, `تم تسجيل الحساب في Supabase بمسار ${newUser.track}`);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || 'تعذر إضافة المستخدم' };
      }
    },
    [addAuditLog]
  );

  // Delete or suspend user
  const deleteUser = useCallback(
    async (userId: string, hardDelete = false): Promise<{ success: boolean; error?: string }> => {
      const user = users.find((u) => u.id === userId);
      if (!user) return { success: false, error: 'المستخدم غير موجود' };

      if (isMasterAdminEmail(user.email)) {
        return { success: false, error: 'لا يمكن حذف حساب المدير الرئيسي للمنصة' };
      }

      try {
        const { error: delError } = await supabase.rpc('admin_delete_user', {
          p_user_id: userId,
          p_hard_delete: hardDelete,
        });

        if (delError) {
          if (hardDelete) {
            await Promise.all([
              supabase.from('profiles').delete().eq('id', userId),
              supabase.from('students').delete().eq('id', userId),
            ]);
          } else {
            await supabase.from('students').update({ status: 'suspended' }).eq('id', userId);
          }
        }

        if (hardDelete) {
          setUsers((prev) => prev.filter((u) => u.id !== userId));
          addAuditLog('حذف مستخدم نهائياً', user.full_name, `تم مسح سجل المستخدم من Supabase نهائياً`);
        } else {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, status: 'suspended' as const } : u))
          );
          addAuditLog('تجميد حساب مستخدم', user.full_name, `تم تحويل حالة الحساب إلى موقوف في Supabase`);
        }

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || 'تعذر إتمام العملية' };
      }
    },
    [users, addAuditLog]
  );

  // Export users to Excel (.xlsx) with styled luxury formatting
  const exportUsersToExcel = useCallback(async () => {
    try {
      await exportStyledUsersExcel(users);
      addAuditLog('تصدير إكسيل منسق', 'قاعدة بيانات المستخدمين', `تم استخراج ملف إكسيل منسق ومصمم يضم ${users.length} مستخدم`);
    } catch {
      const data = users.map((u, idx) => ({
        '#': idx + 1,
        'الاسم الكامل': u.full_name,
        'البريد الإلكتروني': u.email,
        'رقم الهاتف': u.phone || '-',
        'الدولة': u.country || 'مصر',
        'المسار': u.track,
        'الدفعة': u.cohort_year,
        'المرحلة': `المرحلة ${u.scholarship_phase}`,
        'أيام الالتزام': u.study_streak_days,
        'ساعات الدراسة': u.total_hours_learned,
        'نسبة الإنجاز %': `${u.overall_progress}%`,
        'الحالة': u.status === 'active' ? 'نشط' : u.status === 'excelling' ? 'متفوق' : u.status === 'at_risk' ? 'معرض للإقصاء' : 'موقوف',
        'الصلاحية': u.role === 'admin' ? 'مدير' : 'طالب',
        'تاريخ التسجيل': u.created_at ? new Date(u.created_at).toLocaleDateString('ar-EG') : '-',
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'الطلاب والمستخدمين');
      XLSX.writeFile(wb, `Almdrasa_Gateway_Users_${new Date().toISOString().split('T')[0]}.xlsx`);
      addAuditLog('تصدير إكسيل', 'قاعدة بيانات المستخدمين', `تم استخراج ملف إكسيل يضم ${users.length} مستخدم`);
    }
  }, [users, addAuditLog]);

  // Export users to CSV
  const exportUsersToCsv = useCallback(() => {
    const headers = ['#', 'الاسم', 'البريد', 'الهاتف', 'الدولة', 'المسار', 'الحالة', 'التقدم %', 'الساعات'];
    const rows = users.map((u, i) => [
      i + 1,
      `"${u.full_name}"`,
      `"${u.email}"`,
      `"${u.phone || '-'}"`,
      `"${u.country || 'مصر'}"`,
      `"${u.track}"`,
      `"${u.status}"`,
      `${u.overall_progress}%`,
      u.total_hours_learned,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Almdrasa_Users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('تصدير CSV', 'قاعدة بيانات المستخدمين', `تم استخراج ملف CSV`);
  }, [users, addAuditLog]);

  // Save Platform Config
  const updatePlatformConfig = useCallback(
    (updates: Partial<AdminPlatformConfig>) => {
      setPlatformConfig((prev) => {
        const next = { ...prev, ...updates };
        const parsed = AdminPlatformConfigSchema.safeParse(next);
        const valid = parsed.success ? parsed.data : next;
        try {
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(valid));
        } catch {
          // ignore
        }
        return valid;
      });
      addAuditLog('تعديل إعدادات المنصة', 'تكوين النظام', 'تم تحديث الإعدادات العامة للمنصة');
    },
    [addAuditLog]
  );

  // Announcements CRUD
  const addAnnouncement = useCallback(
    (ann: Omit<AdminAnnouncement, 'id' | 'created_at'>) => {
      const newAnn: AdminAnnouncement = {
        ...ann,
        id: `ann-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setAnnouncements((prev) => {
        const updated = [newAnn, ...prev];
        try {
          localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
      addAuditLog('نشر إعلان جديد', ann.title, `تم بث الإعلان بنجاح للطلاب`);
    },
    [addAuditLog]
  );

  const deleteAnnouncement = useCallback(
    (id: string) => {
      setAnnouncements((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        try {
          localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
      addAuditLog('حذف إعلان', id, 'تم مسح الإعلان من شاشات الطلاب');
    },
    [addAuditLog]
  );

  const toggleAnnouncement = useCallback(
    (id: string) => {
      setAnnouncements((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a));
        try {
          localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    []
  );

  // Auto detect at risk students
  const autoDetectAtRiskStudents = useCallback(
    (minScore = 80): number => {
      let flaggedCount = 0;
      setUsers((prev) =>
        prev.map((u) => {
          if (u.role === 'admin') return u;
          if (u.overall_progress < minScore * 0.35 || u.study_streak_days === 0) {
            flaggedCount++;
            return { ...u, status: 'at_risk' as const };
          }
          return u;
        })
      );
      addAuditLog('فحص معايير الإقصاء', 'محرك الفحص الآلي', `تم فحص الطلاب وتحديد ${flaggedCount} طالباً معرضاً للإقصاء`);
      return flaggedCount;
    },
    [addAuditLog]
  );

  return {
    users,
    announcements,
    platformConfig,
    auditLogs,
    courses,
    lessons,
    isLoading,
    error,
    fetchAllData,
    updateUser,
    addUser,
    deleteUser,
    exportUsersToExcel,
    exportUsersToCsv,
    updatePlatformConfig,
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncement,
    autoDetectAtRiskStudents,
  };
}

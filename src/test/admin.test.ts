import { describe, it, expect } from 'vitest';
import {
  AdminUserSchema,
  AdminUserUpdateSchema,
  AdminNewUserSchema,
  AdminAnnouncementSchema,
  AdminPlatformConfigSchema,
} from '../types/admin';
import {
  ADMIN_EMAIL,
  MASTER_ADMIN_PROFILE,
  GUEST_STUDENT,
  isMasterAdminEmail,
  persistStudentPreviewState,
  getInitialIsStudentPreview,
} from '../context/AuthContext';

describe('Admin Dashboard Schemas & Role Contracts', () => {
  it('validates MASTER_ADMIN_PROFILE role and credentials', () => {
    expect(MASTER_ADMIN_PROFILE.email).toBe('adhamkasebssj4@gmail.com');
    expect(MASTER_ADMIN_PROFILE.email).toBe(ADMIN_EMAIL);
    expect(MASTER_ADMIN_PROFILE.role).toBe('admin');
    expect(MASTER_ADMIN_PROFILE.track).toBe('Administration');
    expect(MASTER_ADMIN_PROFILE.status).toBe('active');
  });

  it('validates isMasterAdminEmail strictly recognizes only adhamkasebssj4@gmail.com', () => {
    expect(isMasterAdminEmail('adhamkasebssj4@gmail.com')).toBe(true);
    expect(isMasterAdminEmail('ADHAMKASEBSSJ4@GMAIL.COM')).toBe(true);
    expect(isMasterAdminEmail(' adhamkasebssj4@gmail.com ')).toBe(true);
    expect(isMasterAdminEmail('random-admin@example.com')).toBe(false);
    expect(isMasterAdminEmail('student@almdrasa.community')).toBe(false);
    expect(isMasterAdminEmail('other@example.com')).toBe(false);
    expect(isMasterAdminEmail(null)).toBe(false);
    expect(isMasterAdminEmail(undefined)).toBe(false);
  });

  it('validates GUEST_STUDENT has student role and cannot be admin', () => {
    expect(GUEST_STUDENT.email).toBe('student@almdrasa.community');
    expect(GUEST_STUDENT.role).toBe('student');
    expect(GUEST_STUDENT.role).not.toBe('admin');
  });

  it('validates AdminUserSchema with full admin properties', () => {
    const validUser = {
      id: 'usr-admin-test',
      email: 'adhamkasebssj4@gmail.com',
      full_name: 'ADHAM KASEB',
      role: 'admin' as const,
      status: 'active' as const,
      track: 'Administration',
      cohort_year: 2026,
      scholarship_phase: 1,
      study_streak_days: 90,
      total_hours_learned: 800,
      overall_progress: 100,
      phone: '+20100000000',
      country: 'مصر',
    };

    const res = AdminUserSchema.safeParse(validUser);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.role).toBe('admin');
      expect(res.data.overall_progress).toBe(100);
    }
  });

  it('validates AdminUserUpdateSchema and rejects out-of-range progress', () => {
    const validUpdate = {
      id: 'usr-student-01',
      full_name: 'أحمد محمود',
      email: 'ahmed@example.com',
      role: 'student' as const,
      status: 'excelling' as const,
      track: 'Frontend',
      cohort_year: 2026,
      scholarship_phase: 2,
      study_streak_days: 15,
      total_hours_learned: 60,
      overall_progress: 75,
    };

    const validRes = AdminUserUpdateSchema.safeParse(validUpdate);
    expect(validRes.success).toBe(true);

    const invalidProgress = {
      ...validUpdate,
      overall_progress: 150, // exceeds 100
    };
    const invalidRes = AdminUserUpdateSchema.safeParse(invalidProgress);
    expect(invalidRes.success).toBe(false);
  });

  it('validates AdminNewUserSchema rejects passwords shorter than 6 characters', () => {
    const invalidUser = {
      full_name: 'طالب تجريبي',
      email: 'new@example.com',
      password: '123', // too short
      role: 'student' as const,
      status: 'active' as const,
      track: 'Frontend',
      country: 'مصر',
      cohort_year: 2026,
      scholarship_phase: 1,
    };

    const res = AdminNewUserSchema.safeParse(invalidUser);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.message).toContain('6 أحرف');
    }
  });

  it('validates AdminAnnouncementSchema and severity levels', () => {
    const validAnnouncement = {
      id: 'ann-1',
      title: 'تنبيه عاجل',
      message: 'موعد الاختبار غداً في تمام الثامنة مساءً',
      severity: 'urgent' as const,
      is_active: true,
      is_pinned: true,
      target_track: 'all',
      created_at: new Date().toISOString(),
    };

    const res = AdminAnnouncementSchema.safeParse(validAnnouncement);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.severity).toBe('urgent');
    }
  });

  it('validates AdminPlatformConfigSchema default properties', () => {
    const defaultConfig = AdminPlatformConfigSchema.parse({});
    expect(defaultConfig.cohort_title).toContain('الدفعة 6');
    expect(defaultConfig.elimination_max_absences).toBe(2);
    expect(defaultConfig.elimination_min_score).toBe(80);
    expect(defaultConfig.maintenance_mode).toBe(false);
    expect(defaultConfig.registration_open).toBe(true);
  });

  it('imports and exposes exportStyledUsersExcel function', async () => {
    const { exportStyledUsersExcel } = await import('../utils/excelExport');
    expect(typeof exportStyledUsersExcel).toBe('function');
  }, 15000);

  it('persists and retrieves student preview state across reloads', () => {
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => { store[key] = val; },
      removeItem: (key: string) => { delete store[key]; },
    };

    (globalThis as unknown as { window: unknown }).window = {};
    (globalThis as unknown as { sessionStorage: unknown }).sessionStorage = mockStorage;
    (globalThis as unknown as { localStorage: unknown }).localStorage = mockStorage;

    persistStudentPreviewState(true);
    expect(getInitialIsStudentPreview()).toBe(true);

    persistStudentPreviewState(false);
    expect(getInitialIsStudentPreview()).toBe(false);

    delete (globalThis as unknown as { window?: unknown }).window;
    delete (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage;
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
  });
});

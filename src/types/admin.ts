import { z } from 'zod';

export const AdminUserRoleSchema = z.enum(['student', 'admin', 'supervisor']);
export type AdminUserRole = z.infer<typeof AdminUserRoleSchema>;

export const AdminUserStatusSchema = z.enum(['active', 'excelling', 'at_risk', 'suspended']);
export type AdminUserStatus = z.infer<typeof AdminUserStatusSchema>;

export const AdminUserTrackSchema = z.enum(['General', 'Frontend', 'Backend', 'Fullstack', 'Mobile', 'Administration']);
export type AdminUserTrack = z.infer<typeof AdminUserTrackSchema>;

export const AdminUserSchema = z.object({
  id: z.string(),
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  full_name: z.string().min(2, 'الاسم يجب أن لا يقل عن حرفين'),
  avatar_url: z.string().nullable().optional(),
  role: AdminUserRoleSchema.default('student'),
  status: AdminUserStatusSchema.default('active'),
  track: z.string().default('General'),
  cohort_year: z.number().default(2026),
  scholarship_phase: z.number().default(1),
  study_streak_days: z.number().default(0),
  total_hours_learned: z.number().default(0),
  overall_progress: z.number().min(0).max(100).default(0),
  phone: z.string().nullable().optional(),
  country: z.string().nullable().optional().default('مصر'),
  village: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type AdminUser = z.infer<typeof AdminUserSchema>;

export const AdminUserUpdateSchema = z.object({
  id: z.string(),
  full_name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  role: AdminUserRoleSchema,
  status: AdminUserStatusSchema,
  track: z.string(),
  phone: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  village: z.string().optional().nullable(),
  cohort_year: z.number().min(2020).max(2030),
  scholarship_phase: z.number().min(1).max(5),
  study_streak_days: z.number().min(0),
  total_hours_learned: z.number().min(0),
  overall_progress: z.number().min(0).max(100),
});
export type AdminUserUpdate = z.infer<typeof AdminUserUpdateSchema>;

export const AdminNewUserSchema = z.object({
  full_name: z.string().min(2, 'الاسم الكامل مطلوب'),
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  role: AdminUserRoleSchema.default('student'),
  status: AdminUserStatusSchema.default('active'),
  track: z.string().default('Frontend'),
  phone: z.string().optional(),
  country: z.string().default('مصر'),
  cohort_year: z.number().default(2026),
  scholarship_phase: z.number().default(1),
});
export type AdminNewUser = z.infer<typeof AdminNewUserSchema>;

export const AdminAnnouncementSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'عنوان الإعلان مطلوب'),
  message: z.string().min(5, 'نص الإعلان مطلوب'),
  severity: z.enum(['info', 'warning', 'urgent']).default('info'),
  is_active: z.boolean().default(true),
  is_pinned: z.boolean().default(false),
  target_track: z.string().default('all'),
  created_at: z.string(),
});
export type AdminAnnouncement = z.infer<typeof AdminAnnouncementSchema>;

export const AdminPlatformConfigSchema = z.object({
  cohort_title: z.string().default('منحة المدرسة — الدفعة 6'),
  target_date: z.string().default('2026-06-01'),
  days_remaining: z.number().default(71),
  maintenance_mode: z.boolean().default(false),
  registration_open: z.boolean().default(true),
  companion_enabled: z.boolean().default(true),
  companion_tone: z.enum(['encouraging', 'academic', 'strict']).default('encouraging'),
  companion_prompt: z.string().default('أنت المساعد الذكي لمدرسة Almdrasa ومسؤول عن إرشاد طلاب المنحة.'),
  elimination_max_absences: z.number().default(2),
  elimination_min_score: z.number().default(80),
  urgent_banner_text: z.string().default(''),
  urgent_banner_enabled: z.boolean().default(false),
});
export type AdminPlatformConfig = z.infer<typeof AdminPlatformConfigSchema>;

export const AdminCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  instructor_name: z.string().nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  is_published: z.boolean().default(true),
  order_index: z.number().default(1),
  created_at: z.string().optional(),
});
export type AdminCourse = z.infer<typeof AdminCourseSchema>;

export const AdminLessonSchema = z.object({
  id: z.string(),
  course_id: z.string(),
  title: z.string(),
  slug: z.string(),
  audio_url: z.string().optional(),
  audio_duration_seconds: z.number().default(0),
  transcript: z.string().optional(),
  order_index: z.number().default(1),
  is_published: z.boolean().default(true),
});
export type AdminLesson = z.infer<typeof AdminLessonSchema>;

export type AdminTab =
  | 'overview'
  | 'users'
  | 'notes'
  | 'schedule'
  | 'elimination'
  | 'audit';

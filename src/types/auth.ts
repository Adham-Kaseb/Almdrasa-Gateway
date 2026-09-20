import { z } from 'zod';

export const StudentProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  avatar_url: z.string().nullable().optional(),
  cohort_year: z.number().default(2026),
  scholarship_phase: z.number().default(1),
  study_streak_days: z.number().default(0),
  total_hours_learned: z.number().default(0),
  overall_progress: z.number().default(0),
  status: z.enum(['active', 'excelling', 'at_risk']).default('active'),
  last_active_date: z.string().optional(),
  created_at: z.string().optional(),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;

export const SignInCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, 'يرجى إدخال البريد الإلكتروني')
    .email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  rememberMe: z.boolean().default(true),
});

export type SignInCredentials = z.infer<typeof SignInCredentialsSchema>;

export const SignUpCredentialsSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'الاسم يجب أن لا يقل عن 3 أحرف')
      .max(60, 'الاسم طويل جداً'),
    email: z
      .string()
      .min(1, 'يرجى إدخال البريد الإلكتروني')
      .email('صيغة البريد الإلكتروني غير صحيحة'),
    password: z
      .string()
      .min(6, 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل'),
    confirmPassword: z
      .string()
      .min(1, 'يرجى تأكيد كلمة المرور'),
    track: z.string().default('frontend'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;

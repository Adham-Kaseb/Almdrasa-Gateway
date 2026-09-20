import { describe, it, expect } from 'vitest';
import {
  StudentProfileSchema,
  SignInCredentialsSchema,
  SignUpCredentialsSchema,
} from '../types/auth';
import { GUEST_STUDENT } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

describe('Auth & Student Portal Schemas', () => {
  it('validates a valid student profile schema', () => {
    const sampleStudent = {
      id: 'usr-12345',
      email: 'student@almdrasa.community',
      full_name: 'أحمد محمود',
      avatar_url: 'https://example.com/avatar.jpg',
      cohort_year: 2026,
      scholarship_phase: 1,
      study_streak_days: 5,
      total_hours_learned: 24,
      overall_progress: 40,
      status: 'active' as const,
    };

    const res = StudentProfileSchema.safeParse(sampleStudent);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.cohort_year).toBe(2026);
      expect(res.data.status).toBe('active');
    }
  });

  it('validates GUEST_STUDENT profile', () => {
    const res = StudentProfileSchema.safeParse(GUEST_STUDENT);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.full_name).toBe('طالب المنحة التجريبي');
    }
  });

  it('validates SignInCredentialsSchema with valid and invalid emails', () => {
    const valid = {
      email: 'student@example.com',
      password: 'password123',
      rememberMe: true,
    };
    expect(SignInCredentialsSchema.safeParse(valid).success).toBe(true);

    const invalidEmail = {
      email: 'not-an-email',
      password: 'password123',
    };
    expect(SignInCredentialsSchema.safeParse(invalidEmail).success).toBe(false);

    const shortPassword = {
      email: 'student@example.com',
      password: '123',
    };
    expect(SignInCredentialsSchema.safeParse(shortPassword).success).toBe(false);
  });

  it('validates SignUpCredentialsSchema with matching and non-matching passwords', () => {
    const validSignUp = {
      fullName: 'أحمد عبد الله',
      email: 'ahmed@example.com',
      password: 'SecretPassword123',
      confirmPassword: 'SecretPassword123',
      track: 'frontend',
    };
    expect(SignUpCredentialsSchema.safeParse(validSignUp).success).toBe(true);

    const mismatchedPasswords = {
      fullName: 'أحمد عبد الله',
      email: 'ahmed@example.com',
      password: 'SecretPassword123',
      confirmPassword: 'DifferentPassword456',
      track: 'frontend',
    };
    const res = SignUpCredentialsSchema.safeParse(mismatchedPasswords);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.message).toBe('كلمتا المرور غير متطابقتين');
    }
  });

  it('verifies Supabase client initialization', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });
});

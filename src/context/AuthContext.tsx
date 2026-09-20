import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { StudentProfile, StudentProfileSchema } from '../types/auth';
import { soundFx } from '../utils/audio';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  student: StudentProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  enterAsGuest: () => void;
  refreshStudentProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const GUEST_STUDENT: StudentProfile = {
  id: 'guest-student-001',
  email: 'student@almdrasa.community',
  full_name: 'طالب المنحة التجريبي',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80',
  cohort_year: 2026,
  scholarship_phase: 1,
  study_streak_days: 12,
  total_hours_learned: 48,
  overall_progress: 35,
  status: 'active',
  last_active_date: 'اليوم',
  created_at: new Date().toISOString(),
};

const GUEST_STORAGE_KEY = 'almdrasa_gateway_is_guest';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(GUEST_STORAGE_KEY) === 'true';
  });

  // Fetch or upsert student record in public.students table
  const fetchStudentProfile = useCallback(async (authUser: User): Promise<StudentProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching student profile:', error);
      }

      if (data) {
        const parsed = StudentProfileSchema.safeParse(data);
        if (parsed.success) {
          return parsed.data;
        }
      }

      // If no student row found, create one matching auth metadata
      const rawName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'طالب المدرسة';
      const rawAvatar = authUser.user_metadata?.avatar_url || null;

      const newStudent = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: rawName,
        avatar_url: rawAvatar,
        cohort_year: 2026,
        scholarship_phase: 1,
        study_streak_days: 1,
        total_hours_learned: 0,
        overall_progress: 0,
        status: 'active' as const,
        last_active_date: new Date().toISOString().split('T')[0],
      };

      const { data: inserted, error: insertError } = await supabase
        .from('students')
        .upsert(newStudent)
        .select()
        .maybeSingle();

      if (insertError) {
        console.warn('Could not upsert student row (falling back to memory):', insertError);
        return newStudent;
      }

      return (inserted as StudentProfile) || newStudent;
    } catch (err) {
      console.warn('Profile fetch exception:', err);
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || 'طالب المدرسة',
        avatar_url: authUser.user_metadata?.avatar_url || null,
        cohort_year: 2026,
        scholarship_phase: 1,
        study_streak_days: 1,
        total_hours_learned: 0,
        overall_progress: 0,
        status: 'active',
      };
    }
  }, []);

  // Initialize auth state and listen for session changes
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          if (data.session?.user) {
            const profile = await fetchStudentProfile(data.session.user);
            if (isMounted) setStudent(profile);
          } else if (isGuest) {
            setStudent(GUEST_STUDENT);
          }
        }
      } catch (err) {
        console.error('Failed to get initial session:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        setIsGuest(false);
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
        const profile = await fetchStudentProfile(newSession.user);
        if (isMounted) setStudent(profile);
      } else {
        if (!isGuest) {
          setStudent(null);
        }
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchStudentProfile, isGuest]);

  const refreshStudentProfile = useCallback(async () => {
    if (user) {
      const profile = await fetchStudentProfile(user);
      setStudent(profile);
    }
  }, [user, fetchStudentProfile]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        soundFx.playClick(240, 0.04);
        return { success: false, error: translateAuthError(error) };
      }

      soundFx.playPop();
      setUser(data.user);
      setSession(data.session);
      setIsGuest(false);
      sessionStorage.removeItem(GUEST_STORAGE_KEY);

      if (data.user) {
        const profile = await fetchStudentProfile(data.user);
        setStudent(profile);
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة ثانية.',
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        soundFx.playClick(240, 0.04);
        return { success: false, error: translateAuthError(error) };
      }

      soundFx.playPop();
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsGuest(false);
        sessionStorage.removeItem(GUEST_STORAGE_KEY);

        const profile = await fetchStudentProfile(data.user);
        setStudent(profile);
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'تعذر إنشاء الحساب. يرجى التحقق من صحة البيانات والمحاولة مجدداً.',
      };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      soundFx.playClick(480, 0.03);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'تعذر الاتصال بخدمة Google. يرجى التأكد من تفعيل الموفر في Supabase.',
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      soundFx.playClick(320, 0.03);
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err);
    } finally {
      setUser(null);
      setSession(null);
      setStudent(null);
      setIsGuest(false);
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
    }
  };

  const enterAsGuest = () => {
    soundFx.playPop();
    setIsGuest(true);
    sessionStorage.setItem(GUEST_STORAGE_KEY, 'true');
    setStudent(GUEST_STUDENT);
  };

  const isAuthenticated = Boolean(user || isGuest);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        student,
        isLoading,
        isGuest,
        isAuthenticated,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        enterAsGuest,
        refreshStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function translateAuthError(error: AuthError): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول بدلاً من ذلك.';
  }
  if (msg.includes('password should be at least')) {
    return 'كلمة المرور يجب أن لا تقل عن 6 أحرف.';
  }
  if (msg.includes('email not confirmed')) {
    return 'يرجى تأكيد بريدك الإلكتروني من خلال الرابط المرسل إلى صندوق الوارد.';
  }
  if (msg.includes('rate limit')) {
    return 'تم تجاوز عدد المحاولات المسموح به. يرجى الانتظار دقيقة واحدة والمحاولة مجدداً.';
  }
  return error.message || 'حدث خطأ في المصادقة. يرجى التحقق من اتصالك بالإنترنت.';
}

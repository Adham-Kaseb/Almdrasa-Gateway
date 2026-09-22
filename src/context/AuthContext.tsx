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
  isAdmin: boolean;
  isStudentPreview: boolean;
  setIsStudentPreview: (val: boolean) => void;
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
  role: 'student',
  track: 'General',
  last_active_date: 'اليوم',
  created_at: new Date().toISOString(),
};

export const ADMIN_EMAIL = 'adhamkasebssj4@gmail.com';

export const isMasterAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export const MASTER_ADMIN_PROFILE: StudentProfile = {
  id: 'a3d48209-d188-4d1d-b26b-b7fd78271a0b',
  email: ADMIN_EMAIL,
  full_name: 'ADHAM KASEB',
  avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocLPKT2Zy8WiN7pzQsnuGch_2kljtSWTz57osZDprrS8RLAKHo1g=s96-c',
  cohort_year: 2026,
  scholarship_phase: 1,
  study_streak_days: 120,
  total_hours_learned: 1200,
  overall_progress: 100,
  status: 'active',
  role: 'admin',
  track: 'Administration',
  country: 'مصر',
  village: 'الجيزة',
  last_active_date: 'الآن',
  created_at: new Date().toISOString(),
};

const GUEST_STORAGE_KEY = 'almdrasa_gateway_is_guest';
const ADMIN_STORAGE_KEY = 'almdrasa_gateway_is_admin';
const PROFILE_STORAGE_KEY = 'almdrasa_gateway_cached_profile';
const USER_STORAGE_KEY = 'almdrasa_gateway_cached_user';
const PREVIEW_STORAGE_KEY = 'almdrasa_gateway_student_preview';

export const getInitialIsStudentPreview = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return (
      sessionStorage.getItem(PREVIEW_STORAGE_KEY) === 'true' ||
      localStorage.getItem(PREVIEW_STORAGE_KEY) === 'true'
    );
  } catch {
    return false;
  }
};

export const persistStudentPreviewState = (isPreview: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (isPreview) {
      sessionStorage.setItem(PREVIEW_STORAGE_KEY, 'true');
      localStorage.setItem(PREVIEW_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
      localStorage.removeItem(PREVIEW_STORAGE_KEY);
    }
  } catch {}
};

export const getCachedProfile = (): StudentProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      (parsed.role === 'admin' && !isMasterAdminEmail(parsed.email)) ||
      parsed.id === 'master-admin-fallback' ||
      (typeof parsed.avatar_url === 'string' && parsed.avatar_url.includes('unsplash'))
    ) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
    const validated = StudentProfileSchema.safeParse(parsed);
    if (validated.success) return validated.data;
    return null;
  } catch {
    return null;
  }
};

export const getCachedUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !isMasterAdminEmail(parsed.email) &&
      (parsed.user_metadata?.role === 'admin' || parsed.id === 'master-admin-fallback')
    ) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const persistCachedProfile = (profile: StudentProfile | null, userObj?: User | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (profile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
    if (userObj) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
    } else if (userObj === null) {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {}
};

export const getInitialIsAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const cachedUser = getCachedUser();
    const cached = getCachedProfile();
    if (!cachedUser || !isMasterAdminEmail(cachedUser.email)) {
      return false;
    }
    if (cached?.role === 'admin') return true;
    return (
      sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true' ||
      localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
    );
  } catch {
    return false;
  }
};

export const persistAdminState = (isAdmin: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (isAdmin) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  } catch {}
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialAdmin = getInitialIsAdmin();
  const cachedProfile = getCachedProfile();
  const cachedUser = getCachedUser();

  const [isAdminState, setIsAdminState] = useState<boolean>(() => {
    if (cachedProfile?.role === 'admin') return true;
    return initialAdmin;
  });
  const [user, setUser] = useState<User | null>(() => {
    if (cachedUser) return cachedUser;
    return null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    if (cachedProfile) return cachedProfile;
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStudentPreview, setIsStudentPreviewState] = useState<boolean>(() => {
    return getInitialIsStudentPreview();
  });

  const setIsStudentPreview = useCallback((val: boolean) => {
    persistStudentPreviewState(val);
    setIsStudentPreviewState(val);
  }, []);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(GUEST_STORAGE_KEY) === 'true';
  });

  // Fetch or upsert student and profile record
  const fetchStudentProfile = useCallback(async (authUser: User): Promise<StudentProfile | null> => {
    const isMasterAdmin = isMasterAdminEmail(authUser.email);

    try {
      // Query profiles for role and detailed fields
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      const { data: studentRow } = await supabase
        .from('students')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      const resolvedRole = isMasterAdmin ? ('admin' as const) : ('student' as const);

      const mergedData = {
        id: authUser.id,
        email: authUser.email || (isMasterAdmin ? ADMIN_EMAIL : ''),
        full_name: profileRow?.full_name || studentRow?.full_name || authUser.user_metadata?.full_name || (isMasterAdmin ? MASTER_ADMIN_PROFILE.full_name : 'طالب المدرسة'),
        avatar_url: profileRow?.avatar_url || studentRow?.avatar_url || authUser.user_metadata?.avatar_url || (isMasterAdmin ? MASTER_ADMIN_PROFILE.avatar_url : null),
        cohort_year: studentRow?.cohort_year || 2026,
        scholarship_phase: studentRow?.scholarship_phase || 1,
        study_streak_days: studentRow?.study_streak_days || (isMasterAdmin ? 120 : 0),
        total_hours_learned: studentRow?.total_hours_learned || (isMasterAdmin ? 1200 : 0),
        overall_progress: studentRow?.overall_progress || (isMasterAdmin ? 100 : 0),
        status: (studentRow?.status || 'active') as any,
        role: resolvedRole,
        track: studentRow?.track || (isMasterAdmin ? 'Administration' : 'General'),
        phone: profileRow?.phone || null,
        country: profileRow?.country || 'مصر',
        village: profileRow?.village || (isMasterAdmin ? 'الجيزة' : null),
        last_active_date: studentRow?.last_active_date || new Date().toISOString().split('T')[0],
      };

      const parsed = StudentProfileSchema.safeParse(mergedData);
      const finalProfile = parsed.success ? parsed.data : (mergedData as StudentProfile);
      if (isMasterAdmin) {
        persistAdminState(true);
        setIsAdminState(true);
      } else {
        persistAdminState(false);
        setIsAdminState(false);
      }
      return finalProfile;
    } catch {
      if (isMasterAdmin) {
        persistAdminState(true);
        setIsAdminState(true);
        return {
          ...MASTER_ADMIN_PROFILE,
          id: authUser.id,
          email: authUser.email || ADMIN_EMAIL,
        };
      }
      persistAdminState(false);
      setIsAdminState(false);
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || 'طالب المدرسة',
        avatar_url: authUser.user_metadata?.avatar_url || null,
        cohort_year: 2026,
        scholarship_phase: 1,
        study_streak_days: 0,
        total_hours_learned: 0,
        overall_progress: 0,
        status: 'active',
        role: 'student',
        track: 'General',
      };
    }
  }, []);

  // Initialize auth state and listen for session changes
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const isAdminStored = getInitialIsAdmin();
        const initialCached = getCachedProfile();

        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(data.session);
          if (data.session?.user) {
            setUser(data.session.user);
            const profile = await fetchStudentProfile(data.session.user);
            if (isMounted) {
              setStudent(profile);
              persistCachedProfile(profile, data.session.user);
              if (profile?.role === 'admin' && isMasterAdminEmail(data.session.user.email)) {
                persistAdminState(true);
                setIsAdminState(true);
              } else {
                persistAdminState(false);
                setIsAdminState(false);
              }
            }
          } else if (isAdminStored && initialCached && initialCached.role === 'admin' && isMasterAdminEmail(initialCached.email)) {
            setStudent(initialCached);
            setIsAdminState(true);
          } else if (isGuest) {
            setStudent(GUEST_STUDENT);
            persistAdminState(false);
            setIsAdminState(false);
          } else {
            persistCachedProfile(null, null);
            persistAdminState(false);
            setIsAdminState(false);
            setStudent(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to get initial session:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);

      if (newSession?.user) {
        setUser(newSession.user);
        setIsGuest(false);
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
        const profile = await fetchStudentProfile(newSession.user);
        if (isMounted) {
          setStudent(profile);
          persistCachedProfile(profile, newSession.user);
          if (profile?.role === 'admin' && isMasterAdminEmail(newSession.user.email)) {
            persistAdminState(true);
            setIsAdminState(true);
          } else {
            persistAdminState(false);
            setIsAdminState(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        persistCachedProfile(null, null);
        persistAdminState(false);
        setIsAdminState(false);
        setStudent(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchStudentProfile]);

  const refreshStudentProfile = useCallback(async () => {
    if (user) {
      const profile = await fetchStudentProfile(user);
      setStudent(profile);
      persistCachedProfile(profile, user);
    }
  }, [user, fetchStudentProfile]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (!error && data.user) {
        soundFx.playPop();
        setUser(data.user);
        setSession(data.session);
        setIsGuest(false);
        sessionStorage.removeItem(GUEST_STORAGE_KEY);

        const profile = await fetchStudentProfile(data.user);
        if (profile?.role === 'admin' && isMasterAdminEmail(data.user.email)) {
          persistAdminState(true);
          setIsAdminState(true);
        } else {
          persistAdminState(false);
          setIsAdminState(false);
        }
        setStudent(profile);
        persistCachedProfile(profile, data.user);

        return { success: true };
      }

      soundFx.playClick(240, 0.04);
      return { success: false, error: translateAuthError(error!) };
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
        persistCachedProfile(profile, data.user);
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
      setIsStudentPreview(false);
      persistStudentPreviewState(false);
      persistAdminState(false);
      setIsAdminState(false);
      persistCachedProfile(null, null);
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
    }
  };

  const enterAsGuest = () => {
    soundFx.playPop();
    setIsGuest(true);
    setIsStudentPreview(false);
    persistStudentPreviewState(false);
    sessionStorage.setItem(GUEST_STORAGE_KEY, 'true');
    setStudent(GUEST_STUDENT);
    persistCachedProfile(GUEST_STUDENT, null);
  };

  const isMasterAdminUser = Boolean(user && isMasterAdminEmail(user.email));

  const isAdmin = Boolean(
    isMasterAdminUser &&
    (isAdminState || student?.role === 'admin')
  );

  const isAuthenticated = Boolean(user || isGuest || isAdmin);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        student,
        isLoading,
        isGuest,
        isAuthenticated,
        isAdmin,
        isStudentPreview,
        setIsStudentPreview,
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

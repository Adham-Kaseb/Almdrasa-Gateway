import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Check,
  AlertCircle,
  Loader2,
  Compass,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { soundFx } from "../../utils/audio";
import {
  SignInCredentialsSchema,
  SignUpCredentialsSchema,
} from "../../types/auth";

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { signIn, signUp, signInWithGoogle, enterAsGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-white/10" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 9) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "ضعيفة", color: "bg-red-500" };
    if (score === 2)
      return { score: 2, label: "متوسطة", color: "bg-amber-400" };
    if (score === 3)
      return { score: 3, label: "جيدة", color: "bg-emerald-400" };
    return { score: 4, label: "قوية جداً", color: "bg-[#DFCA9F]" };
  };

  const strength = getPasswordStrength(password);

  const handleTabChange = (tab: "signin" | "signup") => {
    soundFx.playClick(460, 0.02);
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validation = SignInCredentialsSchema.safeParse({ email, password });
    if (!validation.success) {
      soundFx.playClick(240, 0.04);
      setErrorMessage(
        validation.error.issues[0]?.message || "بيانات الدخول غير مكتملة",
      );
      return;
    }

    setIsSubmitting(true);
    const res = await signIn(email, password);
    setIsSubmitting(false);

    if (res.success) {
      soundFx.playStartupChime();
      setSuccessMessage("تم تسجيل الدخول بنجاح! جاري تحضير سطح المكتب...");
      setTimeout(() => {
        onSuccess?.();
      }, 700);
    } else {
      setErrorMessage(
        res.error || "فشل تسجيل الدخول. يرجى التحقق من البيانات.",
      );
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validation = SignUpCredentialsSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      track: "frontend",
    });

    if (!validation.success) {
      soundFx.playClick(240, 0.04);
      setErrorMessage(
        validation.error.issues[0]?.message || "يرجى تصحيح الأخطاء في النموذج",
      );
      return;
    }

    setIsSubmitting(true);
    const res = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (res.success) {
      soundFx.playStartupChime();
      setSuccessMessage(
        "تم إنشاء حساب الطالب بنجاح! مرحباً بك في منحة المدرسة.",
      );
      setTimeout(() => {
        onSuccess?.();
      }, 900);
    } else {
      setErrorMessage(
        res.error || "تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.",
      );
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    const res = await signInWithGoogle();
    if (!res.success) {
      setIsGoogleSubmitting(false);
      setErrorMessage(res.error || "تعذر الاتصال بـ Google.");
    }
  };

  const handleGuestEntry = () => {
    soundFx.playStartupChime();
    enterAsGuest();
    onSuccess?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0B0A]/95 backdrop-blur-3xl text-[#F3EFE7] overflow-y-auto select-none"
      dir="rtl"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DFCA9F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 my-auto"
      >
        {/* Main Card */}
        <div className="rounded-3xl bg-[#141311]/90 border border-white/12 p-6 sm:p-8 shadow-[0_32px_96px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          {/* Header & Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-[#DFCA9F]/25 to-[#CCA868]/10 border border-[#DFCA9F]/40 text-[#DFCA9F] mb-3 shadow-lg shadow-[#DFCA9F]/10">
              <GraduationCap className="w-8 h-8 stroke-2" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8F4EC] tracking-tight">
              منصة بوابة المدرسة
            </h1>
            <p className="text-xs text-[#9E988F] mt-2">
              بوابة الطلاب والمهندسين لبيئة المنحة والتعلم التفاعلي
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#1D1C19] border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => handleTabChange("signin")}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "signin"
                  ? "bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] shadow-md shadow-[#DFCA9F]/15 font-extrabold"
                  : "text-[#9E988F] hover:text-[#F8F4EC]"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("signup")}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "signup"
                  ? "bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] shadow-md shadow-[#DFCA9F]/15 font-extrabold"
                  : "text-[#9E988F] hover:text-[#F8F4EC]"
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 mb-4 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 mb-4 leading-relaxed"
            >
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#C8C2B7] mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="auth-input"
                  />
                  <Mail className="w-4 h-4 text-[#8C857B] absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#C8C2B7]">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick(350, 0.02);
                      setErrorMessage(
                        "يرجى مراسلة مشرف الدفعة أو استخدام تسجيل الدخول المباشر.",
                      );
                    }}
                    className="text-[11px] text-[#DFCA9F] hover:underline cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="auth-input auth-input-password"
                  />
                  <Lock className="w-4 h-4 text-[#8C857B] absolute right-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3 text-[#8C857B] hover:text-[#DFCA9F] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#DFCA9F]/15 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-2" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#C8C2B7] mb-1.5">
                  الاسم الكامل للطالب
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد علي"
                    className="auth-input"
                  />
                  <User className="w-4 h-4 text-[#8C857B] absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C2B7] mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="auth-input"
                  />
                  <Mail className="w-4 h-4 text-[#8C857B] absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C2B7] mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 أحرف على الأقل"
                    className="auth-input auth-input-password"
                  />
                  <Lock className="w-4 h-4 text-[#8C857B] absolute right-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3 text-[#8C857B] hover:text-[#DFCA9F] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#9E988F]">
                      <span>قوة كلمة المرور:</span>
                      <span className="font-semibold text-[#DFCA9F]">
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 transition-all duration-300 ${
                            step <= strength.score
                              ? strength.color
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C2B7] mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور"
                    className="auth-input auth-input-password"
                  />
                  <Lock className="w-4 h-4 text-[#8C857B] absolute right-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3.5 top-3 text-[#8C857B] hover:text-[#DFCA9F] cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#DFCA9F]/15 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري إنشاء الحساب...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#141310]" />
                    <span>إنشاء حساب والانضمام للبوابة</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-[#141311] px-3 text-[#7A746B]">
                أو المتابعة السريعة
              </span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F8F4EC] hover:text-white flex items-center justify-center gap-3 transition-all cursor-pointer group shadow-xs disabled:opacity-50"
          >
            {isGoogleSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#DFCA9F]" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                />
              </svg>
            )}
            <span>المتابعة باستخدام حساب Google</span>
          </button>

          {/* Guest Bypass Button */}
          <div className="mt-5 text-center pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleGuestEntry}
              className="inline-flex items-center gap-1.5 text-xs text-[#9E988F] hover:text-[#DFCA9F] transition-colors cursor-pointer group"
            >
              <Compass className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
              <span>استكشاف النظام كزائر (بدون تسجيل)</span>
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[10.5px] text-[#6E685F] mt-4">
          منحة المدرسة لتطوير مهندسي المستقبل • الدفعة السادسة 2026
        </p>
      </motion.div>
    </div>
  );
};

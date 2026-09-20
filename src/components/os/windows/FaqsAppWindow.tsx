import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Briefcase,
  CheckCircle,
  Calendar,
  LayoutGrid,
  Maximize2,
  Copy,
  Check,
  CreditCard,
  Mail,
  GraduationCap,
  Globe2,
  Users,
  CheckCircle2,
  Layers,
  Compass,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';

interface FaqSlide {
  id: number;
  question: string;
  type: 'bullets' | 'jobs' | 'narrative';
  content: React.ReactNode;
}

export const FaqsAppWindow: React.FC = () => {
  const { containerRef: gridScrollRef } = useSmoothScroll();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const slides: FaqSlide[] = [
    {
      id: 1,
      question: 'بماذا سأستفيد من هذه المنحة؟',
      type: 'bullets',
      content: (
        <div className="space-y-3.5 text-[#1E1D1A] text-sm sm:text-[15px] leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              ستتعلم البرمجة وتخصص الفرونت إند عن طريق <strong>دبلومة متكاملة تضم 24 دورة احترافية</strong> مقسمة على 4 مسارات وهم:{' '}
              <span className="font-semibold text-[#5B00FF]">مسار أساسيات البرمجة بلغة بايثون، وHTML & CSS، وجافا سكريبت، ومكتبة ReactJS</span>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              إنشاء <strong>20 مشروع تطبيقي</strong> من بيئة العمل الواقعية.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              إنشاء <strong>معرض أعمال (Portfolio) وموقع خاص بك</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              إنشاء <strong>ملف جيت هاب GitHub</strong> وحساب <strong>LinkedIn احترافي</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              <strong>متابعة عن طريق مهندسين (Mentors)</strong> يراجعون لك مشاريعك ويعطونك Feedback.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              <strong>جروب تواصل خاص بالمنحة</strong> للسؤال عن أي شيء غير مفهوم في الدورات.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              <strong>اجتماعات أسبوعية أونلاين</strong> مع المهندسين (Mentors) على Zoom.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      question: 'ما هي الوظائف التي أستطيع التقديم عليها بعد التخرج من هذه المنحة؟',
      type: 'jobs',
      content: (
        <div className="space-y-6 text-[#1E1D1A]">
          <p className="text-sm sm:text-[16px] leading-relaxed text-[#35322D]">
            ستطبق في منحة الدبلومة على <strong>مشاريع عملية من بيئة العمل الواقعية</strong>، وستكتسب خبرات عملية ونصائح هامة جدًا من خبرات المهندسين الذين يعملون في كبرى الشركات العالمية، مما يساعدك على التأهل والتقديم على <strong>3 وظائف بعد التخرج من المنحة</strong> وهم:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] flex flex-col items-center text-center shadow-2xs group hover:scale-102 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center mb-2.5 shadow-sm">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#5B00FF] mb-1">المسمى الأول</span>
              <div className="text-base font-extrabold text-[#191816] tracking-tight font-mono">
                Junior JavaScript Engineer
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] flex flex-col items-center text-center shadow-2xs group hover:scale-102 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center mb-2.5 shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#5B00FF] mb-1">المسمى الثاني</span>
              <div className="text-base font-extrabold text-[#191816] tracking-tight font-mono">
                Junior React Engineer
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] flex flex-col items-center text-center shadow-2xs group hover:scale-102 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center mb-2.5 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#5B00FF] mb-1">المسمى الثالث</span>
              <div className="text-base font-extrabold text-[#191816] tracking-tight font-mono">
                Junior Front-end Engineer
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      question: 'ما هي شروط الاشتراك في المنحة؟',
      type: 'bullets',
      content: (
        <div className="space-y-4 text-[#1E1D1A] text-sm sm:text-[15px] leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              <strong>عدم المقدرة المادية</strong> على دفع الثمن الفعلي للدبلومة (<strong>700 دولار</strong>).
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              <strong>أن تكون غير محترفًا للبرمجة ولا إحدى مجالاتها</strong>، فهذه الدبلومة للمبتدئين.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <div>
              <p className="mb-2">
                أن تُسدد رسوم الاشتراك المدعمة للمنحة وقيمتها من <strong>داخل مصر</strong>:
              </p>
              <div className="inline-flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#F4EFFF] border border-[#D8C7FF] text-[#1E1D1A]">
                <span>💵 <strong>4499 جنيه مصري</strong> تدفع مرة واحدة لنظام الكاش</span>
                <span className="text-[#7C3AED] font-bold">؛ أو</span>
                <span>💳 <strong>899 جنيه مصري</strong> شهرياً لنظام التقسيط على 6 أشهر</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <div>
              <p className="mb-2">
                ومن <strong>خارج مصر</strong>:
              </p>
              <div className="inline-flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#F4EFFF] border border-[#D8C7FF] text-[#1E1D1A]">
                <span>💵 <strong>149.99 دولار</strong> لنظام الكاش</span>
                <span className="text-[#7C3AED] font-bold">؛ أو</span>
                <span>💳 <strong>29.99 دولار</strong> لنظام التقسيط شهرياً على 6 أشهر</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      question: 'متى تبدأ منحة الدبلومة؟',
      type: 'bullets',
      content: (
        <div className="space-y-4 text-[#1E1D1A] text-sm sm:text-[15px] leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              متاح التقديم للدبلومة بسعرها الرسمي وبدء الدراسة في أي وقت، <strong>أما المنحة فلها أوقات معينة</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <div className="p-4 rounded-2xl bg-[#F4EFFF] border border-[#D8C7FF] w-full">
              <div className="flex items-center gap-2 text-[#5B00FF] font-bold mb-1">
                <Calendar className="w-4 h-4" />
                <span>مواعيد المنحة الحالية:</span>
              </div>
              <p className="text-[#302C26]">
                المنحة الحالية متاح التقديم لها من يوم <strong>8 سبتمبر 2024</strong> وحتى يوم <strong>8 أكتوبر</strong> أو اكتمال الأعداد المتاحة، ويتم بدء الدراسة في المنحة يوم <strong>9 أكتوبر 2024</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              إذا فاتت هذه المنحة، ستنتظر <strong>4-6 شهور</strong> للتقديم مرة أخرى في المنحة التالية.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      question: 'كيف أعرف أنه تم قبولي في منحة الدبلومة؟',
      type: 'narrative',
      content: (
        <div className="space-y-5 text-[#1E1D1A]">
          <div className="p-5 rounded-2xl bg-[#F4EFFF] border border-[#D8C7FF] leading-relaxed text-sm sm:text-[16px] text-[#2C2822]">
            بمجرد <strong>دفع رسوم المنحة</strong> سواء كاش أو بالتقسيط من خلال الصفحة الخاصة بالمنحة (الرابط المرفق) فأنت بذلك <strong>تم قبولك</strong>، وستظهر لك رسالة بعد عملية الدفع بها كافة التفاصيل القادمة.
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E7E2D8] flex items-start gap-3 shadow-2xs">
            <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#4E4A43] leading-relaxed">
              تتضمن الرسالة كيفية الوصول للمجموعة الخاصة بالمنحة على <strong>منصة المدرسة</strong> للمتابعة ومعرفة التفاصيل القادمة عن منهج الدبلومة وكيفية الاستعداد وغيرهم.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      question: 'كيف ستتم عملية تسديد الرسوم للمنحة؟',
      type: 'narrative',
      content: (
        <div className="space-y-4 text-[#1E1D1A]">
          <p className="text-sm sm:text-[15px] leading-relaxed text-[#2C2822]">
            قم بملئ <strong>"طلب الحصول على منحة دبلومة الفرونت إند"</strong> من صفحة المنحة، وبعد ملئ بياناتك بشكل صحيح ستظهر لك الرسالة التالية التي تستطيع أن تختار منها الدفع كاش أو بالتقسيط. كما ويتم أيضًا إرسال تفاصيل وروابط الدفع سواء كاش أو تقسيط من خلال البريد الإلكتروني الذي تم التسجيل به.
          </p>

          {/* Simulated Internal Notice / Modal Card */}
          <div className="p-5 rounded-2xl bg-linear-to-br from-[#F6F1FF] to-[#EDE4FF] border-2 border-[#D3BEFF] shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[#5B00FF] font-extrabold text-sm">
              <Mail className="w-4 h-4 text-[#5B00FF]" />
              <span>محتوى الإشعار الداخلي:</span>
            </div>

            <p className="text-xs sm:text-[14px] text-[#332E38] leading-relaxed mb-4">
              "لكي تحصل على المنحة، يجب عليك سداد الرسوم الرمزية الخاصة بالمنحة والمدعومة من قبل المدرسة حتى يتاح لك الدخول إلي المجموعة الدراسية الخاصة بالمنحة على منصة المدرسة والتي بها كل التفاصيل الأخرى من نظام الدراسة وموعد البدء وغيرهم"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-[#D5C2FA] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5B00FF] text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#5B00FF]">نظام الكاش:</div>
                  <div className="text-xs text-[#2C2822] font-semibold">للدفع بنظام الكاش، اضغط هنا.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#D5C2FA] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#7C3AED]">نظام التقسيط:</div>
                  <div className="text-xs text-[#2C2822] font-semibold">للدفع بنظام التقسيط، اضغط هنا، لتدفع أول قسط شهري.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      question: 'هل المنحة لطلاب الكليات المتخصصة في علوم الحاسب فقط؟',
      type: 'narrative',
      content: (
        <div className="space-y-4 text-[#1E1D1A]">
          <div className="p-5 rounded-2xl bg-[#F4EFFF] border border-[#D8C7FF] text-sm sm:text-[16px] leading-relaxed text-[#2C2822] font-medium">
            منحة الدبلومة <strong>مناسبة لأي شخص يرغب في تعلم البرمجة والاستعداد لسوق العمل بعد 9 أشهر</strong> سواء كان طالبًا أو خريجًا أو يريد تغيير مسار عمله للبرمجة حتى وإن لم يكن لديه أي فكرة عن البرمجة.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-white border border-[#E5DFEB] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#5B00FF]/10 text-[#5B00FF] flex items-center justify-center mb-2">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#5B00FF] mb-1">الطلاب</div>
              <p className="text-xs text-[#4A453E] leading-relaxed">
                لكافة الطلاب من أي كلية أو معهد دون اشتراط تخصص علوم الحاسب.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E5DFEB] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#5B00FF]/10 text-[#5B00FF] flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#5B00FF] mb-1">الخريجون</div>
              <p className="text-xs text-[#4A453E] leading-relaxed">
                للخريجين الراغبين في اكتساب مهارات رقمية مطلوبة برواتب مجزية.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E5DFEB] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#5B00FF]/10 text-[#5B00FF] flex items-center justify-center mb-2">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-[#5B00FF] mb-1">تغيير المسار (Career Shift)</div>
              <p className="text-xs text-[#4A453E] leading-relaxed">
                لمن يريد التحويل للبرمجة من الصفر وبدون أي خلفية كود مسبقة.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      question: 'هل اللغة الانجليزية مهمة وشرط لتعلم واتقان البرمجة أو للتسجيل في هذه المنحة؟',
      type: 'bullets',
      content: (
        <div className="space-y-4 text-[#1E1D1A] text-sm sm:text-[15px] leading-relaxed">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4EFFF] border border-[#D8C7FF]">
            <CheckCircle2 className="w-5 h-5 text-[#5B00FF] shrink-0 mt-0.5" />
            <p>
              <strong>تم إنشاء منصة المدرسة لتعليم البرمجة باللغة العربية</strong> عن طريق مهندسين في شركات عالمية كأمازون وغيرها ولكن يدرسون باللغة العربية مع ذكر المصطلحات باللغة الإنجليزية، <strong>لذلك عدم إتقان اللغة الإنجليزية لا يمثل أي مشكلة</strong> لتعلم البرمجة سواء في هذه المنحة أو أي دورة أخرى على منصة المدرسة.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E5DFEB] shadow-2xs">
            <Globe2 className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
            <p className="text-[#353028]">
              <strong>ولكن إتقان اللغة الإنجليزية عمومًا أمر مهم وضروري</strong> حتى تتعامل مع العملاء أو زملائك في العمل بسهولة خصوصًا إذا كنت ستعمل مع عملاء أو شركات أجنبية. <strong>لذلك يجب عليك تعلمها لتتطور في عملك</strong>.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      question: 'هل الدورات ستكون أونلاين أم أوفلاين؟ وما هو نظام الدراسة في المنحة؟',
      type: 'bullets',
      content: (
        <div className="space-y-3.5 text-[#1E1D1A] text-sm sm:text-[15px] leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              <strong>نظام الدراسة في منصة المدرسة عمومًا أونلاين وليس أوفلاين</strong>، والدورات كلها دورات مسجلة بطريقة احترافية وباستخدام رسوم توضيحية وجرافيكس تفاعلي لإيصال المعلومة بأفضل وأسرع طريقة.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              <strong>يوجد مجموعات دراسية للتواصل عن طريق الشات لأي أسئلة</strong> (متاح إرسال رسائل نصية، ورسائل صوتية، وملفات وصور لتوضيح أي شيء غير مفهوم)، مع أيضًا <strong>إمكانية إضافة تعليق في أي مكان على أي درس</strong> وسيتم الرد عليك من قبل المشرفين (Mentors).
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#5B00FF] font-black text-lg leading-none shrink-0 mt-1">✱</span>
            <p>
              كما و<strong>يوجد اجتماعات أسبوعية على Zoom للإجابة على أي تساؤلات</strong> أو لشرح أي جزء غير مفهوم من الدورات، ويتم إرسال جدول ومواعيد الاجتماعات في المجموعة الدراسية الخاصة بالمنحة.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const paginate = useCallback(
    (newDirection: number) => {
      soundFx.playClick(500, 0.03);
      setDirection(newDirection);
      setCurrentSlide((prev) => {
        const next = prev + newDirection;
        if (next < 0) return slides.length - 1;
        if (next >= slides.length) return 0;
        return next;
      });
    },
    [slides.length]
  );

  const goToSlide = (index: number) => {
    soundFx.playPop();
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        paginate(1);
      } else if (e.key === 'ArrowRight') {
        paginate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  const copyQuestion = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFx.playPop();
    setTimeout(() => setCopiedId(null), 1800);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
    }),
  };

  return (
    <div className="h-full flex flex-col bg-[#4700D8] text-[#1E1D1A] overflow-hidden select-text font-sans relative">
      {/* Dynamic Background Pattern with geometric asterisks matching Almdrasa brand */}
      <div className="absolute inset-0 bg-linear-to-br from-[#4700D8] via-[#5B00FF] to-[#3B00B3] pointer-events-none" />

      {/* Subtle Asterisk SVG Watermark in background matching original slides */}
      <svg
        className="absolute top-4 left-1/2 -translate-x-1/2 w-96 h-96 text-white/5 pointer-events-none"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M45 0h10v100H45z" />
        <path d="M0 45h100v10H0z" />
        <path d="M18.2 11.1l7.1-7.1 70.7 70.7-7.1 7.1z" />
        <path d="M81.8 11.1l7.1 7.1-70.7 70.7-7.1-7.1z" />
      </svg>

      {/* Top Header Bar inside window */}
      <header className="relative z-10 px-6 py-3 flex items-center justify-between border-b border-white/10 bg-black/15 backdrop-blur-md text-white shrink-0">
        <div>
          <div className="text-xs sm:text-sm font-extrabold tracking-wide">الأسئلة الأكثر شيوعاً</div>
          <div className="text-[10px] sm:text-[11px] text-[#D0C0FF]">منحة مدرسة Almdrasa • الدفعة السادسة</div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/25 border border-white/10">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(400, 0.02);
              setViewMode('slider');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'slider'
                ? 'bg-white text-[#5B00FF] shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>عرض الشرائح</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(400, 0.02);
              setViewMode('grid');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-white text-[#5B00FF] shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>عرض الكل</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === 'slider' ? (
        <div className="flex-1 relative z-10 flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 overflow-hidden">
          {/* Slider Container with generous width to stretch nicely in fullscreen */}
          <div className="w-full max-w-4xl lg:max-w-5xl flex-1 flex items-center justify-center relative min-h-0">
            {/* Previous Arrow Button */}
            <button
              type="button"
              onClick={() => paginate(1)}
              className="absolute -right-2 sm:-right-6 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
              title="السابق (سهم يمين)"
              aria-label="السابق"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Active Card Container */}
            <div className="w-full h-full max-h-125 relative flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full rounded-[28px] sm:rounded-[36px] bg-white p-6 sm:p-10 md:p-12 shadow-[0_24px_70px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden select-text border border-white/80"
                >
                  {/* Top: Question and Copy Button */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <h2 className="text-xl sm:text-2xl md:text-[28px] font-black text-[#5B00FF] leading-snug tracking-tight text-right flex-1">
                        {slides[currentSlide].question}
                      </h2>
                      <button
                        type="button"
                        onClick={() => copyQuestion(slides[currentSlide].question, slides[currentSlide].id)}
                        className="p-2 rounded-xl text-[#7C3AED] hover:bg-[#F3EDFF] transition-colors shrink-0 cursor-pointer"
                        title="نسخ السؤال"
                        aria-label="نسخ نص السؤال"
                      >
                        {copiedId === slides[currentSlide].id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Middle: Formatted Content */}
                    <div className="overflow-y-auto max-h-72.5 pr-1.5 scrollbar-thin">
                      {slides[currentSlide].content}
                    </div>
                  </div>

                  {/* Bottom: Giant Slide Number + Almdrasa Branding Logo matching image */}
                  <div className="relative pt-4 border-t border-[#F0EBF8] flex items-end justify-between select-none">
                    {/* Giant Number Watermark matching original image */}
                    <div className="text-[64px] sm:text-[88px] font-black leading-none text-[#5B00FF]/25 font-mono">
                      {slides[currentSlide].id}
                    </div>

                    {/* Centered Almdrasa Branding Logo */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F0FF] border border-[#E4D8FF] text-[#5B00FF] text-xs font-bold">
                      <span className="font-mono text-sm tracking-tighter">&#123;;&gt;</span>
                      <span>المدرسة</span>
                    </div>

                    {/* Right decorative arrows matching original slides */}
                    <div className="flex items-center gap-1 text-[#5B00FF]/40 font-black text-lg">
                      <span>»»</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Arrow Button */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              className="absolute -left-2 sm:-left-6 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
              title="التالي (سهم يسار)"
              aria-label="التالي"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Bottom Pagination Indicators */}
          <div className="relative z-10 mt-4 flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
            <span className="text-xs font-bold text-white/90">
              {currentSlide + 1} من {slides.length}
            </span>

            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`transition-all rounded-full cursor-pointer flex items-center justify-center font-bold ${
                      isActive
                        ? 'w-7 h-7 bg-white text-[#5B00FF] text-xs shadow-md scale-105'
                        : 'w-6 h-6 bg-white/20 hover:bg-white/40 text-white text-[11px]'
                    }`}
                    title={`انتقال للسؤال ${s.id}`}
                    aria-label={`انتقال للشريحة رقم ${s.id}`}
                  >
                    {s.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Grid Mode: View all 9 cards at once */
        <div ref={gridScrollRef} className="flex-1 relative z-10 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
          {slides.map((s) => (
            <div
              key={s.id}
              className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-white/80 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B00FF] text-white flex items-center justify-center font-black text-sm shrink-0">
                    {s.id}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#5B00FF] leading-snug">
                    {s.question}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => copyQuestion(s.question, s.id)}
                  className="p-1.5 rounded-lg text-[#7C3AED] hover:bg-[#F3EDFF] transition-colors shrink-0 cursor-pointer"
                  title="نسخ السؤال"
                  aria-label="نسخ نص السؤال"
                >
                  {copiedId === s.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="text-sm text-[#2C2822]">{s.content}</div>

              <div className="mt-4 pt-3 border-t border-[#F0EBF8] flex items-center justify-between text-xs text-[#7C3AED] font-semibold">
                <span>المدرسة دوت كوم • الدفعة السادسة</span>
                <span className="font-mono">&#123;;&gt;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

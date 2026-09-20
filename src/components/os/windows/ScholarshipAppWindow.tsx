import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  CreditCard,
  Clock,
  Users,
  Building2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Infinity as InfinityIcon,
  Award,
} from "lucide-react";
import { soundFx } from "../../../utils/audio";
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';

interface FAQItem {
  id: string;
  category: "pricing" | "duration" | "eligibility" | "compare" | "features";
  categoryLabel: string;
  question: string;
  shortAnswer: string;
  content: React.ReactNode;
}



export const ScholarshipAppWindow: React.FC = () => {
  const { containerRef } = useSmoothScroll();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqList: FAQItem[] = [
    {
      id: "faq-what",
      category: "pricing",
      categoryLabel: "التعريف والخصم",
      question: "إيه هي المنحة؟",
      shortAnswer:
        "دبلومة الواجهة الأمامية بتخفيض سنوي 87% (4,500ج بدلاً من 34,000ج).",
      content: (
        <div className="space-y-3">
          <p className="text-[13.5px] text-[#2C2822] leading-relaxed">
            هي <strong>دبلومة المدرسة للواجهة الأمامية (Frontend Diploma)</strong> ولكن بتخفيض استثنائي كبير بنسبة <strong>87%</strong>. فبدلاً من أن يشتري الطالب الدبلومة بسعرها الرسمي البالغ <strong>34,000 ج.م</strong>، يتاح له مرة واحدة كل عام الاستفادة من المنحة والحصول عليها بمبلغ <strong>4,500 ج.م</strong> فقط.
          </p>
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#5B00FF]/8 border border-[#5B00FF]/20 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#5B00FF]/70">السعر الأصلي للدبلومة:</span>
              <span className="line-through text-[#5B00FF]/50 font-semibold">34,000 ج.م</span>
            </div>
            <span className="text-[#5B00FF]/40">←</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#5B00FF]/70">سعر المنحة المخفّض:</span>
              <span className="text-[#5B00FF] font-bold text-[15px]">4,500 ج.م</span>
            </div>
            <div className="mr-auto text-[11.5px] font-semibold text-[#5B00FF]">
              وفرت 29,500 ج.م (خصم 87%)
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "faq-plans",
      category: "pricing",
      categoryLabel: "أنظمة السداد",
      question: "إيه أنظمة الاشتراك في المنحة؟",
      shortAnswer: "نظامين: كاش 4,500ج دفعة واحدة أو تقسيط 900ج شهرياً لمدة 6 شهور.",
      content: (
        <div className="space-y-3">
          <p className="text-[13.5px] text-[#2C2822] leading-relaxed">
            توفّر المدرسة نظامين مرنين لتسهيل انضمام جميع الطلاب:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-bold text-[#5B00FF]">1. نظام الكاش (دفع مرة واحدة)</span>
                <CreditCard className="w-4 h-4 text-[#5B00FF]" />
              </div>
              <div className="text-[20px] font-bold text-[#1E1D1A]">4,500 ج.م</div>
              <div className="text-[11.5px] text-[#555] mt-0.5">
                سداد المبلغ كاملاً لمرة واحدة عند التسجيل.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-bold text-[#5B00FF]">2. نظام التقسيط الميسر</span>
                <Calendar className="w-4 h-4 text-[#5B00FF]" />
              </div>
              <div className="text-[20px] font-bold text-[#1E1D1A]">900 ج.م <span className="text-[12px] font-normal text-[#555]">/ شهرياً</span></div>
              <div className="text-[11.5px] text-[#555] mt-0.5">
                قسط شهري ميسر يُسدد على مدار 6 أشهر فقط.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "faq-duration",
      category: "duration",
      categoryLabel: "المدة والمراحل",
      question: "كل ما يخص المنحة من ناحية المدة ... إيه؟",
      shortAnswer: "12 شهراً مقسمة: 9 شهور أساسية + 3 شهور مجاناً عند التعثر.",
      content: (
        <div className="space-y-3">
          <p className="text-[13.5px] text-[#2C2822] leading-relaxed">
            المنحة مدتها <strong>12 شهراً كاملين</strong>، مقسمين بدقة إلى مرحلتين أساسيتين لدعم مسيرتك:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15">
              <div className="text-[11.5px] font-semibold text-[#5B00FF]">المرحلة الأولى (الأساسية)</div>
              <div className="text-[18px] font-bold text-[#1E1D1A] mt-0.5">9 أشهر دراسية</div>
              <p className="text-[11.5px] text-[#555] mt-1 leading-relaxed">
                وهي المدة الرئيسية والأساسية لإنهاء كامل مقررات ومشاريع الدبلومة.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15">
              <div className="text-[11.5px] font-semibold text-[#5B00FF]">مرحلة الأمان (عند التعثر)</div>
              <div className="text-[18px] font-bold text-[#1E1D1A] mt-0.5">3 أشهر مجانية تماماً</div>
              <p className="text-[11.5px] text-[#555] mt-1 leading-relaxed">
                في حالة تعثر الطالب يحصل على 3 شهور زيادة مجاناً دون أي تكلفة إضافية.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-[#555]">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>سياسة التمديد بعد 12 شهراً:</strong> انطلاقاً من هذه الدفعة، لا يُسمح بأي تمديد مجاني بعد انقضاء الـ 12 شهراً. وفي حال الرغبة بالتمديد، يكون التمديد مدفوعاً بنفس قيمة القسط المعتاد (<strong>900 ج.م</strong>).
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "faq-eligibility",
      category: "eligibility",
      categoryLabel: "شروط الاستحقاق",
      question: "مين المستحق في التسجيل للمنحة؟",
      shortAnswer: "ببساطة: أي شخص غير مقتدر على شراء الدبلومة بسعرها الأساسي.",
      content: (
        <div className="space-y-2.5">
          <p className="text-[13.5px] text-[#2C2822] leading-relaxed">
            الإجابة المباشرة والبسيطة: <strong>أي شخص غير مقتدر على شراء الدبلومة بسعرها الرسمي (34,000 ج.م).</strong>
          </p>
          <div className="p-3.5 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15 flex items-center gap-3 text-[12.5px] text-[#2C2822]">
            <Users className="w-5 h-5 text-[#5B00FF] shrink-0" />
            <span>
              المنحة مبادرة سنوية لدعم الشباب والطلبة الجادين لتمكينهم من تعلم البرمجة وبناء مسار مهني مستقل دون عوائق مالية.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "faq-compare",
      category: "compare",
      categoryLabel: "المقارنة الجوهرية",
      question: "إيه الفرق بين شراء الدبلومة وبين الحصول عليها في إطار المنحة؟",
      shortAnswer: "المنحة: مدة 12 شهر ونظام إقصاء | الشراء: وصول دائم مدى الحياة وتحديثات مجانية.",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* المنحة */}
            <div className="p-4 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#5B00FF]" />
                <h4 className="font-bold text-[14px] text-[#1E1D1A]">1. في إطار المنحة</h4>
              </div>
              <ul className="space-y-2 text-[12.5px] text-[#2C2822]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B00FF] shrink-0 mt-1.5" />
                  <span><strong>مدة محددة:</strong> 12 شهراً إجمالاً (9 شهور أساسية + 3 شهور أمان).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B00FF] shrink-0 mt-1.5" />
                  <span><strong>نظام الانضباط:</strong> يتضمن فرصتي (2) إقصاء لضمان الجدية والإنجاز.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B00FF] shrink-0 mt-1.5" />
                  <span><strong>التكلفة:</strong> مخفضة جداً بنسبة 87% (4,500 ج.م فقط).</span>
                </li>
              </ul>
            </div>

            {/* الشراء المباشر */}
            <div className="p-4 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15">
              <div className="flex items-center gap-2 mb-2">
                <InfinityIcon className="w-4 h-4 text-[#5B00FF]" />
                <h4 className="font-bold text-[14px] text-[#1E1D1A]">2. الشراء المباشر</h4>
              </div>
              <ul className="space-y-2 text-[12.5px] text-[#2C2822]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B00FF] shrink-0 mt-1.5" />
                  <span><strong>وصول مدى الحياة:</strong> المحتوى والدبلومة معك للأبد دون أي مهلة انتهاء.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B00FF] shrink-0 mt-1.5" />
                  <span><strong>تحديثات مجانية مستمرة:</strong> كل مسار من المسارات الـ 4، أي دورة تدريبية جديدة تصدر له تصلك مجاناً تماماً مدى الحياة.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B00FF] shrink-0 mt-1.5" />
                  <span><strong>التكلفة:</strong> السعر الكامل المعتاد (34,000 ج.م).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "faq-special",
      category: "features",
      categoryLabel: "الميزة التنافسية الكبرى",
      question: "طيب إيه بيميز المنحة كدا؟",
      shortAnswer: "تدريب شهرين في homains مدفوع للأوائل + إشراف مجاني كامل من مهندسين في نفس تخصصك.",
      content: (
        <div className="space-y-3.5">
          <p className="text-[13.5px] text-[#2C2822] leading-relaxed">
            الذي يميّز منحة المدرسة هو الجمع النادر بين التعلم النظري الرصين والتدريب العملي الحقيقي في كبرى الشركات:
          </p>

          <div className="p-4 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15">
            <div className="flex items-center gap-2 mb-2 text-[#5B00FF] font-bold text-[13px]">
              <Building2 className="w-4.5 h-4.5 text-[#5B00FF]" />
              <span>1. تدريب مدفوع بالكامل للأوائل في مصر (شركة homains)</span>
            </div>
            <p className="text-[12.5px] text-[#2C2822] leading-relaxed">
              التدريب الميداني الذي نتكفل بكامل ثمنه للأوائل بعد التخرج. تدريب حقيقي مدته <strong>شهرين داخل مصر بشركة homains</strong>. فرصة سهلة وسريعة ومضمونة لتدريب تدفع المنصة تكلفته بالكامل.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15">
              <div className="flex items-center gap-2 text-[#5B00FF] font-bold text-[12.5px] mb-1">
                <span className="text-[#5B00FF] font-black text-lg leading-none">✱</span>
                <span>2. سنة كاملة من التأسيس والتخصص</span>
              </div>
              <p className="text-[12px] text-[#2C2822] leading-relaxed">
                في خلال سنة كاملة تتعلم أساسيات البرمجة وتتقن مجالاً محترماً يضمن لك دخلاً ممتازاً وفرص عمل حقيقية.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#5B00FF]/6 border border-[#5B00FF]/15">
              <div className="flex items-center gap-2 text-[#5B00FF] font-bold text-[12.5px] mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>3. إشراف ومشرفون في نفس التخصص</span>
              </div>
              <p className="text-[12px] text-[#2C2822] leading-relaxed">
                خدمة الإشراف والمتابعة <strong>مجاناً تماماً</strong> معك طوال مدة المنحة، ومشرفوك يعملون في نفس تخصصك لنقل خبرة واقعية.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredFAQs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      return matchesCategory;
    });
  }, [faqList, activeCategory]);

  return (
    <div className="h-full flex flex-col bg-[#4700D8] text-[#1E1D1A] overflow-hidden select-text font-sans relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#4700D8] via-[#5B00FF] to-[#3B00B3] pointer-events-none" />

      {/* Subtle Asterisk SVG Watermark */}
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

      {/* Top Header Bar */}
      <header className="relative z-10 px-6 py-3 flex items-center justify-between border-b border-white/10 bg-black/15 backdrop-blur-md text-white shrink-0 gap-3">
        <div className="shrink-0">
          <div className="text-xs sm:text-sm font-extrabold tracking-wide">تفاصيل المنحة</div>
          <div className="text-[10px] sm:text-[11px] text-[#D0C0FF]">منحة مدرسة Almdrasa • الدفعة السادسة</div>
        </div>
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "الكل" },
            { id: "pricing", label: "الأسعار" },
            { id: "duration", label: "المدة" },
            { id: "compare", label: "المقارنة" },
            { id: "features", label: "المميزات" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundFx.playClick(500, 0.02);
                setActiveCategory(tab.id);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-white text-[#5B00FF] shadow-xs"
                  : "text-white/70 hover:text-white bg-white/10 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Scrollable Content */}
      <div ref={containerRef} className="flex-1 relative z-10 overflow-y-auto p-5 md:p-8">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Page Title */}
          <div className="text-white mb-2">
            <h1 className="text-[22px] md:text-[26px] font-black leading-tight tracking-tight">
              كل ما يخص منحة المدرسة البرمجية
            </h1>
            <p className="text-[12.5px] text-[#D0C0FF] mt-1 leading-relaxed">
              إجابات واضحة لكل ما يتعلق بدبلومة الواجهة الأمامية، الخصم، أنظمة السداد، المدة، وتدريب الأوائل.
            </p>
          </div>

          {/* FAQ Cards List */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-10 rounded-[28px] bg-white/10 border border-white/15 backdrop-blur-md">
                <HelpCircle className="w-8 h-8 text-white/50 mx-auto mb-2" />
                <p className="text-[14px] font-bold text-white">لم يتم العثور على نتائج</p>
                <p className="text-[12px] text-white/60 mt-1">جرب اختيار "الكل"</p>
              </div>
            ) : (
              filteredFAQs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="rounded-[28px] bg-white p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.30)] border border-white/80 relative overflow-hidden"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F0EBF8]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#5B00FF] text-white text-[12px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <h3 className="text-[15px] md:text-[17px] font-black text-[#5B00FF] leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <span className="text-[10.5px] font-bold text-[#7C3AED] tracking-wide shrink-0 bg-[#F3EDFF] px-2 py-0.5 rounded-full">
                      {faq.categoryLabel}
                    </span>
                  </div>

                  {/* Answer Content */}
                  <div className="pt-1">
                    {faq.content}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 pt-3 border-t border-[#F0EBF8] flex items-center justify-between text-[11px] text-[#7C3AED] font-semibold select-none">
                    <span>منحة المدرسة • الدفعة السادسة</span>
                    <span className="font-mono text-sm tracking-tighter">&#123;;&#62;</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary Callout */}
          <div className="rounded-[24px] bg-white/10 border border-white/20 backdrop-blur-md p-4 flex items-center gap-3 text-[12.5px] text-white">
            <Award className="w-5 h-5 text-white/70 shrink-0" />
            <span>
              <strong>خلاصة المنحة:</strong> سنة دراسية كاملة + تدريب عملي شهرين في شركة homains للأوائل + إشراف مجاني متواصل لضمان وصولك لسوق العمل.
            </span>
          </div>

          {/* Brand Footer */}
          <div className="text-center py-3 text-white/30 text-[11px] font-mono tracking-widest select-none">
            &#123;;&gt;&#125; Almdrasa Gateway
          </div>
        </div>
      </div>
    </div>
  );
};

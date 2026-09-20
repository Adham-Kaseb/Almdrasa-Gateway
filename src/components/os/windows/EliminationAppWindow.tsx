import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Gift,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Scale,
  HeartHandshake,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';

export const EliminationAppWindow: React.FC = () => {
  const { containerRef } = useSmoothScroll();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    soundFx.playClick(450, 0.02);
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: 'هل توقيع الإقصاء يعني إنهاء قيدي أو طردي من الدبلومة؟',
      a: 'لا، إطلاقاً! الإقصاء في التعديل الجديد هو إجراء تنظيمي مفصلي يحدد فقط انتهاء مرحلة الـ 9 شهور الأساسية، ويمنحك تلقائياً وبشكل فوري حق الاستفادة من فترة الأمان (الـ 3 شهور الإضافية) مجاناً بالكامل دون أي رسوم، مع احتفاظك بكامل مميزات المنحة والوصول للمحتوى وجلسات المراجعة.',
    },
    {
      q: 'هل توجد أي إقصاءات شهرية خلال الأشهر من 1 إلى 8؟',
      a: 'لا يوجد أي إقصاء شهري على الإطلاق! تم اعتماد سياسة "مرحلة واحدة فقط" لتوفير الاستقرار النفسي والدراسي للطالب. لن يتعرض أي طالب لأي إقصاء مبكر، ولديك 9 أشهر كاملة للتركيز على الفهم والتطبيق العملي.',
    },
    {
      q: 'إذا اجتزت الدبلومة والمشاريع قبل نهاية الشهر التاسع، ما هو موقفي؟',
      a: 'في هذه الحالة تكون قد حققت الشرط الذهبي؛ لا يتم توقيع أي إقصاء عليك نهائياً، وتعتبر قد أنهيت المنحة بتفوق في موعدها القياسي المحدد، وتنتقل مباشرة لمرحلة الاعتماد واستلام شهادة التخرج.',
    },
    {
      q: 'هل أدفع أي مقابل مالي للحصول على الـ 3 شهور الإضافية بعد الإقصاء؟',
      a: 'صفر جنيه! الـ 3 شهور الإضافية عند التعثر هي حق مكفول ومجاني 100% لكل طالب في المنحة، وتفعل فوراً وبشكل تلقائي بمجرد توقيع إقصاء نهاية الشهر التاسع.',
    },
    {
      q: 'ماذا يحدث بعد انقضاء الـ 12 شهراً بالكامل (9 شهور + 3 شهور أمان)؟',
      a: 'تكون المنحة المجانية قد استوفت فترتها القصوى المحددة (12 شهراً). في حال رغب الطالب في مزيد من الوقت بعد الـ 12 شهراً، يُتاح له التمديد المدفوع بقيمة القسط المعتاد (900 ج.م شهرياً)، ولا يُسمح بأي تمديد مجاني بعد ذلك.',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#4700D8] text-[#1E1D1A] overflow-hidden select-text font-sans relative">
      {/* Dynamic Background matching signature royal purple gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#4700D8] via-[#5B00FF] to-[#3B00B3] pointer-events-none" />

      {/* Subtle Asterisk SVG Watermark matching Almdrasa brand */}
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

      {/* Glassmorphic Top Header Bar */}
      <header className="relative z-10 px-6 py-3.5 flex items-center justify-between border-b border-white/10 bg-black/15 backdrop-blur-md text-white shrink-0">
        <div>
          <div className="text-xs sm:text-sm font-extrabold tracking-wide">نظام الإقصاء وضوابط المنحة</div>
          <div className="text-[10px] sm:text-[11px] text-[#D0C0FF]">
            السياسة الرسمية للدفعة السادسة • تحديث لائحة الإقصاء والمتابعة • منحة Almdrasa
          </div>
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <div ref={containerRef} className="flex-1 relative z-10 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 custom-scrollbar">
        {/* Main Luxurious White Card Container */}
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white p-6 sm:p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.3)] border border-white/60 space-y-8 relative">

          {/* 1. Hero / Main Policy Overview Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-[#2E0080] via-[#4700D8] to-[#5B00FF] text-white shadow-lg border border-purple-400/30 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#E6DCFF] text-xs font-bold border border-white/20">
                السياسة الرسمية المعتمدة للدفعة السادسة
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <ShieldAlert className="w-7 h-7 text-[#D3BEFF] shrink-0" />
                <span>نظام الإقصاء الخاص بمنحة المدرسة</span>
              </h2>

              <p className="text-xs sm:text-sm md:text-[15px] text-[#E5DCFF] leading-relaxed max-w-3xl">
                دليل إرشادي رسمي يوضح التعديلات المعتمدة لنظام الإقصاء: مرحلة واحدة فاصلة بنهاية الـ 9 شهور، أمان تام لمن يجتاز، وصمام أمان يمنحك 3 أشهر إضافية مجاناً بالكامل.
              </p>

              {/* Quick Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">عدد مراحل الإقصاء</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">مرحلة واحدة فقط</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">توقيت التقييم</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">نهاية الشهر التاسع</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">حالة الاجتياز</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-300 mt-0.5">لا إقصاء إطلاقاً</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">فترة الأمان للتعثر</div>
                  <div className="text-base sm:text-lg font-bold text-amber-300 mt-0.5">3 شهور مجاناً</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Core 4 Pillars Grid */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#5B00FF]" />
              <h3 className="text-base sm:text-lg font-black text-[#191816]">
                الأركان الأربعة لنظام الإقصاء المحدث
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pillar 1 */}
              <div className="p-5 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] transition-all hover:shadow-xs group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#5B00FF]/15 text-[#5B00FF] border border-[#5B00FF]/25">
                    الركن الأول
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#DCD0FF] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-[#5B00FF]" />
                  </div>
                </div>
                <h4 className="text-base font-extrabold text-[#191816] mb-1.5">
                  مرحلة واحدة فقط طوال الدفعة
                </h4>
                <p className="text-xs sm:text-[13px] text-[#524D44] leading-relaxed">
                  الإقصاء سيكون <strong>مرحلة واحدة فقط ومرة واحدة فقط خلال الدفعة كاملة</strong>. تم إلغاء أي نظم إقصاء شهرية متعددة لتجنيب الطالب أي ضغوط نفسية وتمكينه من التركيز على التعلم العميق.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] transition-all hover:shadow-xs group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#5B00FF]/15 text-[#5B00FF] border border-[#5B00FF]/25">
                    الركن الثاني
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#DCD0FF] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Clock className="w-5 h-5 text-[#5B00FF]" />
                  </div>
                </div>
                <h4 className="text-base font-extrabold text-[#191816] mb-1.5">
                  التوقيع في ختام الـ 9 شهور الأساسية
                </h4>
                <p className="text-xs sm:text-[13px] text-[#524D44] leading-relaxed">
                  يتم توقيع الإقصاء <strong>حصراً في نهاية الـ 9 شهور الأساسيين</strong> المخصصة للدبلومة. هذا يعني أن أول 8 أشهر بالكامل خالية من أي توقيع إقصاء، مما يتيح لك مرونة تعويض أي تقصير.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] transition-all hover:shadow-xs group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    الركن الثالث
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <h4 className="text-base font-extrabold text-[#191816] mb-1.5">
                  اجتياز الدبلومة = لا إقصاء
                </h4>
                <p className="text-xs sm:text-[13px] text-[#524D44] leading-relaxed">
                  في حالة <strong>اجتاز الطالب الدبلومة في الموعد المحدد (خلال الـ 9 شهور الأولى)</strong>، لا يتم توقيع أي إقصاء عليه نهائياً، ويُمنح شهادة التخرج والتميز فور اعتماده من المشرفين.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-5 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] transition-all hover:shadow-xs group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#5B00FF]/15 text-[#5B00FF] border border-[#5B00FF]/25">
                    الركن الرابع
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#DCD0FF] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Gift className="w-5 h-5 text-[#5B00FF]" />
                  </div>
                </div>
                <h4 className="text-base font-extrabold text-[#191816] mb-1.5">
                  صمام الأمان: الـ 3 شهور الإضافية مجاناً
                </h4>
                <p className="text-xs sm:text-[13px] text-[#524D44] leading-relaxed">
                  في حال لم يتمكن الطالب من الاجتياز، <strong>يتم توقيع الإقصاء عليه مع حصوله المباشر على الـ 3 شهور الإضافية مجاناً</strong> دون أي أعباء مالية لإتاحة الفرصة له لإنهاء مشاريعه والتخرج.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Accordion FAQ Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#5B00FF]" />
              <h3 className="text-base sm:text-lg font-black text-[#191816]">
                الأسئلة الشائعة حول نظام الإقصاء
              </h3>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#DCD0FF] overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#5B00FF]/50"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4.5 flex items-center justify-between text-right gap-4 hover:bg-[#F9F7FF] transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold text-[#191816] leading-snug">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4.5 h-4.5 text-[#5B00FF] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4.5 pb-4.5 text-xs sm:text-[13px] text-[#4A453E] leading-relaxed border-t border-[#EDE5FF] pt-3 bg-[#FBF9FF]">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Mentor Guidance / Official Message */}
          <section className="p-5 rounded-2xl bg-linear-to-r from-[#F6F1FF] to-[#EDE4FF] border border-[#D3BEFF] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-[13px] text-[#3D3830] leading-relaxed">
              <span className="font-extrabold text-[#191816] block mb-1">
                رسالة من إدارة وموجهي مدرسة Almdrasa:
              </span>
              الهدف من هذا النظام ليس معاقبة أي طالب، بل مساعدتك على تنظيم وقتك ووضع جدول إنجاز حقيقي. الـ 9 شهور الأولى كافية جداً لإتقان كل الأساسيات والمشاريع، والـ 3 شهور الإضافية المجانية تمثل شبكة أمان لضمان عدم ضياع مجهودك. انطلق بثقة والتزام!
            </div>
          </section>

          {/* Almdrasa brand mark in footer */}
          <div className="pt-2 text-center select-none pointer-events-none">
            <span className="text-[#5B00FF]/20 font-black text-xl tracking-widest font-mono">
              {'{;>}'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminationAppWindow;

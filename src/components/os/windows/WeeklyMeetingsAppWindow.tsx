import React, { useState, useMemo } from 'react';
import {
  Video,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Calendar,
  CalendarPlus,
  Search,
  Info,
  ShieldCheck,
  Monitor,
  Wrench,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';
import {
  ARAB_COUNTRIES_SCHEDULE,
  ArabCountrySchedule,
} from '../../../data/arabTimezonesData';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';

export const WeeklyMeetingsAppWindow: React.FC = () => {
  const { containerRef } = useSmoothScroll();
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const meetUrl = 'https://meet.google.com/knr-ijbg-bxn';

  const handleCopyLink = () => {
    soundFx.playClick(620, 0.03);
    navigator.clipboard.writeText(meetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinMeet = () => {
    soundFx.playClick(680, 0.04);
    window.open(meetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCalendar = () => {
    soundFx.playClick(580, 0.03);
    const calUrl =
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
      encodeURIComponent('اجتماع منحة المدرسة الأسبوعي المباشر') +
      '&details=' +
      encodeURIComponent(
        'جلسة الدعم والإشراف العملي الأسبوعية لطلاب المنحة.\nرابط الدخول عبر Google Meet:\nhttps://meet.google.com/knr-ijbg-bxn'
      ) +
      '&location=' +
      encodeURIComponent('https://meet.google.com/knr-ijbg-bxn') +
      '&recur=' +
      encodeURIComponent('RRULE:FREQ=WEEKLY;BYDAY=SA,TU');
    window.open(calUrl, '_blank', 'noopener,noreferrer');
  };

  // Filter Arab Countries
  const filteredCountries = useMemo(() => {
    return ARAB_COUNTRIES_SCHEDULE.filter((country: ArabCountrySchedule) => {
      if (timeFilter !== 'all') {
        if (timeFilter === 'same' && country.diffType !== 'same') return false;
        if (timeFilter === 'ahead1' && country.offsetHours !== 1) return false;
        if (timeFilter === 'ahead2' && country.offsetHours !== 2) return false;
        if (timeFilter === 'behind1' && country.offsetHours !== -1) return false;
        if (timeFilter === 'behind2' && country.offsetHours !== -2) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = country.name.toLowerCase().includes(q);
        const matchCapital = country.capital.toLowerCase().includes(q);
        const matchRegion = country.region.toLowerCase().includes(q);
        const matchTime = country.meetingTime.toLowerCase().includes(q);
        return matchName || matchCapital || matchRegion || matchTime;
      }

      return true;
    });
  }, [searchQuery, timeFilter]);

  return (
    <div className="h-full flex flex-col bg-[#4700D8] text-[#1E1D1A] overflow-hidden select-text font-sans relative">
      {/* Dynamic Background matching FAQs signature royal purple gradient */}
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
          <div className="text-xs sm:text-sm font-extrabold tracking-wide">الاجتماعات الأسبوعية المباشرة</div>
          <div className="text-[10px] sm:text-[11px] text-[#D0C0FF]">
            جلسات الدعم والمراجعة الفنية مع المهندسين (Mentors) • منحة Almdrasa
          </div>
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <div ref={containerRef} className="flex-1 relative z-10 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 custom-scrollbar">
        {/* Main Luxurious White Card Container */}
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white p-6 sm:p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.3)] border border-white/60 space-y-8 relative">

          {/* 1. Hero / Live Room Access Card */}
          <div className="p-5 sm:p-7 rounded-2xl bg-linear-to-br from-[#2E0080] via-[#4700D8] to-[#5B00FF] text-white shadow-lg border border-purple-400/30 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#E6DCFF] text-xs font-bold border border-white/20">
                  رابط الجلسة المعتمد عبر Google Meet
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  انضم مباشرة لجلسة الدعم وحل المشكلات
                </h2>
                <p className="text-xs sm:text-sm text-[#D3BEFF] font-mono select-all">
                  {meetUrl}
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
                <button
                  type="button"
                  onClick={handleJoinMeet}
                  className="px-5 py-3 rounded-xl bg-white text-[#5B00FF] hover:bg-[#F6F1FF] font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 hover:shadow-lg"
                >
                  <Video className="w-4.5 h-4.5 stroke-[2.4]" />
                  <span>دخول الاجتماع الآن</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  title="نسخ الرابط للحافظة"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ الرابط</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  title="إضافة تذكير دوري للتقويم"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>إضافة للتقويم</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Fixed Timings & The 30-Minute Golden Rule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#5B00FF]">المواعيد الثابتة أسبوعياً</span>
                <h3 className="text-base sm:text-lg font-extrabold text-[#191816] mt-0.5">
                  يومي السبت والثلاثاء
                </h3>
                <p className="text-xs sm:text-sm text-[#4A453E] mt-1.5 leading-relaxed">
                  تنطلق الجلسة في تمام الساعة <strong>6:00 مساءً (بتوقيت القاهرة)</strong> بانتظام على مدار فترة المنحة.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#5B00FF]">قاعدة الـ 30 دقيقة الذهبية</span>
                <h3 className="text-base sm:text-lg font-extrabold text-[#191816] mt-0.5">
                  نافذة الحضور واستمرار الدعم
                </h3>
                <p className="text-xs sm:text-sm text-[#4A453E] mt-1.5 leading-relaxed">
                  يتواجد المشرف من <strong>6:00 م حتى 6:30 م</strong>. إذا تواجد طلاب، يستمر الاجتماع بلا وقت إلزامي للنهاية حتى حل جميع استفساراتهم.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Mentor Support Playbook */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#5B00FF] tracking-wider uppercase">
                دليل الاستفادة القصوى
              </span>
              <div className="h-px flex-1 bg-[#E8E1FF]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center mb-2.5 shadow-xs">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="text-sm font-extrabold text-[#191816]">1. تجهيز الكود مسبقاً</div>
                <p className="text-xs text-[#524D44] mt-1.5 leading-relaxed">
                  حدد السطر البرمجي ورسالة الخطأ من الـ Console قبل دخول الجلسة لسرعة التشخيص.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center mb-2.5 shadow-xs">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="text-sm font-extrabold text-[#191816]">2. مشاركة الشاشة المباشرة</div>
                <p className="text-xs text-[#524D44] mt-1.5 leading-relaxed">
                  شارك شاشة VS Code والمتصفح ليتمكن المهندس من مراجعة البنية وتصحيح المسار فوراً.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-linear-to-b from-[#F7F4FF] to-[#EDE5FF] border border-[#DCD0FF] text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center mb-2.5 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-sm font-extrabold text-[#191816]">3. التطبيق العملي الفوري</div>
                <p className="text-xs text-[#524D44] mt-1.5 leading-relaxed">
                  قم بتطبيق الحل البرمجي وتشغيله أثناء تواجد المشرف للتأكد من زوال المشكلة تماماً.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Arab Countries Timetable Section */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#191816] flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-[#5B00FF]" />
                  <span>جدول مواعيد الاجتماع لكافة الدول العربية (22 دولة)</span>
                </h3>
                <p className="text-xs text-[#6B655B] mt-0.5">
                  تحويل فوري لموعد بدء الاجتماع ونافذة تواجد المشرف حسب التوقيت المحلي لبلدك
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="w-4 h-4 text-[#7C3AED] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن دولتك أو عاصمتك..."
                  className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#F8F6FF] border border-[#DCD0FF] text-xs font-medium text-[#1E1D1A] placeholder-[#8A80A8] focus:outline-none focus:ring-2 focus:ring-[#5B00FF] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'جميع الدول' },
                { id: 'same', label: 'نفس التوقيت' },
                { id: 'ahead1', label: '+1 ساعة' },
                { id: 'ahead2', label: '+2 ساعة' },
                { id: 'behind1', label: '-1 ساعة' },
                { id: 'behind2', label: '-2 ساعة' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick(500, 0.02);
                    setTimeFilter(chip.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timeFilter === chip.id
                      ? 'bg-[#5B00FF] text-white shadow-xs'
                      : 'bg-[#F4EFFF] text-[#5B00FF] hover:bg-[#EAE0FF] border border-[#DDD0FF]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Timetable */}
            <div className="overflow-x-auto rounded-2xl border border-[#DCD0FF] shadow-2xs">
              <table className="w-full text-right border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#F6F1FF] text-[#4700D8] border-b border-[#DCD0FF] font-bold">
                    <th className="py-3 px-4">الدولة / العاصمة</th>
                    <th className="py-3 px-4">موعد بدء الاجتماع</th>
                    <th className="py-3 px-4">نافذة تواجد المشرف</th>
                    <th className="py-3 px-4">الفارق الزمني عن القاهرة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8FF]">
                  {filteredCountries.map((c) => {
                    const isEgypt = c.id === 'egypt';
                    return (
                      <tr
                        key={c.id}
                        className={`hover:bg-[#FBF9FF] transition-colors ${
                          isEgypt ? 'bg-[#FAF7FF] font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl shrink-0">{c.flag}</span>
                            <div>
                              <div className="font-extrabold text-[#191816] flex items-center gap-1.5">
                                <span>{c.name}</span>
                                {isEgypt && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#5B00FF] text-white font-bold">
                                    المرجع الأساسي
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#6B655B]">{c.capital}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0E9FF] text-[#4700D8] font-bold text-xs border border-[#DDD0FF]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{c.meetingTime}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-xs text-[#4A453E] font-medium font-mono">
                            {c.waitWindow}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              c.diffType === 'same'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : c.diffType === 'ahead'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {c.diffType === 'same'
                              ? 'نفس التوقيت'
                              : c.offsetHours > 0
                              ? `+${c.offsetHours} ساعة`
                              : `${c.offsetHours} ساعة`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredCountries.length === 0 && (
                <div className="py-8 text-center text-[#6B655B] text-xs">
                  لم يتم العثور على أي دولة تطابق معايير البحث الحالية.
                </div>
              )}
            </div>
          </div>

          {/* 5. DST Notices & Technical Checklist */}
          <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-[#F6F1FF] to-[#EDE4FF] border border-[#D3BEFF] flex flex-col sm:flex-row items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#5B00FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Info className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 text-xs sm:text-[13px] text-[#3D3830] leading-relaxed">
              <div className="font-extrabold text-[#191816]">
                ملاحظات التوقيت الصيفي/الشتوي (DST) والإرشادات التقنية
              </div>
              <p>
                يتم احتساب المواعيد وفق توقيت القاهرة الشتوي (UTC+2) أو الصيفي (UTC+3) عند تفعيله رسمياً في مصر. في حال تطبيق التوقيت الصيفي بمصر، يتطابق التوقيت مباشرة مع مكة المكرمة والرياض والدوحة وعمّان ودمشق.
              </p>
              <div className="pt-1 flex items-center gap-4 flex-wrap text-[11px] font-semibold text-[#5B00FF]">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> متصفح Chrome أو Edge محدث
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> فحص عمل الميكروفون
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> اتصال إنترنت مستقر
                </span>
              </div>
            </div>
          </div>

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

export default WeeklyMeetingsAppWindow;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Table as TableIcon,
  LayoutGrid,
  Code2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';
import {
  BATCH_SCHEDULE_DATA,
  SCHEDULE_TRACKS,
} from '../../../data/scheduleData';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';

export const BatchScheduleAppWindow: React.FC = () => {
  const { containerRef } = useSmoothScroll();
  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [activeMonth, setActiveMonth] = useState<string>('all');
  const [activeInstructor, setActiveInstructor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedCourseIds, setExpandedCourseIds] = useState<Record<string, boolean>>({});

  // Slider state for cards view
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(0);

  // Reset slider when filteredCourses changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTrack, activeMonth, activeInstructor, searchQuery]);



  const toggleCourseExpand = (id: string) => {
    soundFx.playClick(500, 0.02);
    setExpandedCourseIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCourses = useMemo(() => {
    return BATCH_SCHEDULE_DATA.filter((course) => {
      // Track Filter
      if (activeTrack !== 'all' && course.trackId !== activeTrack) {
        return false;
      }

      // Month Filter
      if (activeMonth !== 'all' && course.monthNumber.toString() !== activeMonth) {
        return false;
      }

      // Instructor Filter
      if (activeInstructor !== 'all' && course.instructor !== activeInstructor) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inCourse = course.courseName.toLowerCase().includes(q);
        const inTrack = course.trackName.toLowerCase().includes(q);
        const inInstructor = course.instructor.toLowerCase().includes(q);
        const inMonth = course.monthName.toLowerCase().includes(q);
        const inWeek = course.weekName.toLowerCase().includes(q);
        const inDate = course.date.toLowerCase().includes(q);
        const inTopics = course.topics.some((t) => t.toLowerCase().includes(q));

        return inCourse || inTrack || inInstructor || inMonth || inWeek || inDate || inTopics;
      }

      return true;
    });
  }, [activeTrack, activeMonth, activeInstructor, searchQuery]);

  const paginate = useCallback(
    (dir: number) => {
      if (filteredCourses.length === 0) return;
      soundFx.playPop();
      setSlideDirection(dir);
      setCurrentSlide((prev) =>
        (prev - dir + filteredCourses.length) % filteredCourses.length
      );
    },
    [filteredCourses.length]
  );

  const uniqueInstructors = ['م. أحمد فتحي', 'م. محمد أبوسريع', 'م. أحمد علي'];


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
          <div className="text-xs sm:text-sm font-extrabold tracking-wide">جدول الدفعة السادسة البرمجية</div>
          <div className="text-[10px] sm:text-[11px] text-[#D0C0FF]">
            الخطة الأسبوعية الشاملة ومسارات دبلومة المدرسة (يوليو 2026 – فبراير 2027)
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-black/25 border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(500, 0.02);
              setViewMode('table');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#5B00FF] shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>عرض الجدول</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(500, 0.02);
              setViewMode('cards');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-[#5B00FF] shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>عرض البطاقات</span>
          </button>
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <div
        ref={containerRef}
        className="flex-1 relative z-10 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 custom-scrollbar"
      >
        {/* Main Luxurious White Card Container */}
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white p-6 sm:p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.3)] border border-white/60 space-y-7 relative">

          {/* 1. Hero / Schedule Overview Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-[#2E0080] via-[#4700D8] to-[#5B00FF] text-white shadow-lg border border-purple-400/30 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#E6DCFF] text-xs font-bold border border-white/20">
                الخطة الأكاديمية الشاملة • الدفعة السادسة
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <Calendar className="w-7 h-7 text-[#D3BEFF] shrink-0" />
                <span>جدول الدفعة السادسة — المسارات والخطط الأسبوعية</span>
              </h2>

              <p className="text-xs sm:text-sm md:text-[15px] text-[#E5DCFF] leading-relaxed max-w-3xl">
                الخطة الدراسية الكاملة للمنحة على مدار 8 أشهر (يوليو 2026 – فبراير 2027) مقسمة بالتفصيل حسب المسارات، الدورات، المحاضرين، وتواريخ الإطلاق.
              </p>

              {/* Quick Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">المسارات التخصصية</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">4 مسارات متكاملة</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">إجمالي الوحدات</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">24 أسبوعاً دراسياً</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">مشروع التخرج</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-300 mt-0.5">اعتماد عملي نهائي</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[11px] text-[#D8CBFF] font-medium">المدة الأكاديمية</div>
                  <div className="text-base sm:text-lg font-bold text-amber-300 mt-0.5">8 أشهر (يوليو – فبراير)</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Search & Filters Area */}
          <div className="space-y-4 pt-1">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C3AED] pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث في الدورات، المواضيع، فيجما، أو المحاضرين (مثل: بايثون، React، Figma، Git، ChatGPT...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F8F6FF] border border-[#DCD0FF] text-[#1E1D1A] placeholder-[#8A80A8] focus:outline-none focus:ring-2 focus:ring-[#5B00FF] focus:border-transparent transition-all shadow-2xs"
              />
            </div>

            {/* Track Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick(500, 0.02);
                  setActiveTrack('all');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTrack === 'all'
                    ? 'bg-[#5B00FF] text-white shadow-xs'
                    : 'bg-[#F4EFFF] text-[#5B00FF] hover:bg-[#EAE0FF] border border-[#DDD0FF]'
                }`}
              >
                جميع المسارات (4)
              </button>

              {SCHEDULE_TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick(500, 0.02);
                    setActiveTrack(t.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTrack === t.id
                      ? 'bg-[#5B00FF] text-white shadow-xs'
                      : 'bg-[#F4EFFF] text-[#5B00FF] hover:bg-[#EAE0FF] border border-[#DDD0FF]'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Months Pills & Instructor Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              {/* Months */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[#6B655B] font-bold ml-1 shrink-0">الشهر:</span>
                <button
                  type="button"
                  onClick={() => setActiveMonth('all')}
                  className={`h-7 px-3 inline-flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeMonth === 'all'
                      ? 'bg-[#5B00FF] text-white shadow-xs'
                      : 'bg-[#F4EFFF] text-[#5B00FF] hover:bg-[#EAE0FF] border border-[#DDD0FF]'
                  }`}
                >
                  الكل
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setActiveMonth(m.toString())}
                    className={`w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeMonth === m.toString()
                        ? 'bg-[#5B00FF] text-white shadow-xs'
                        : 'bg-[#F4EFFF] text-[#5B00FF] hover:bg-[#EAE0FF] border border-[#DDD0FF]'
                    }`}
                  >
                    <span>{m}</span>
                  </button>
                ))}
              </div>

              {/* Instructors */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[#6B655B] font-bold ml-1 shrink-0">المحاضر:</span>
                <button
                  type="button"
                  onClick={() => setActiveInstructor('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeInstructor === 'all'
                      ? 'bg-[#5B00FF] text-white shadow-xs'
                      : 'bg-[#F4EFFF] text-[#5B00FF] hover:bg-[#EAE0FF] border border-[#DDD0FF]'
                  }`}
                >
                  الكل
                </button>
                {uniqueInstructors.map((inst) => (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => setActiveInstructor(inst)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeInstructor === inst
                        ? 'bg-[#5B00FF] text-white shadow-xs'
                        : 'bg-[#F4EFFF] text-[#5B00FF] hover:bg-[#EAE0FF] border border-[#DDD0FF]'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Counter / Filter Indicator */}
          <div className="flex items-center justify-between text-xs text-[#6B655B] pt-1">
            <span>
              يتم عرض <strong>{filteredCourses.length}</strong> وحدة دراسية / دورة
            </span>
            {(activeTrack !== 'all' || activeMonth !== 'all' || activeInstructor !== 'all' || searchQuery.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setActiveTrack('all');
                  setActiveMonth('all');
                  setActiveInstructor('all');
                  setSearchQuery('');
                }}
                className="text-[#5B00FF] hover:underline font-bold cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>

          {/* 3. TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="rounded-2xl border border-[#DCD0FF] bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-160">
                  <thead>
                    <tr className="bg-[#F6F1FF] text-[#4700D8] border-b border-[#DCD0FF] text-xs font-bold">
                      <th className="py-3.5 px-3 w-20 text-center">الشهر</th>
                      <th className="py-3.5 px-3 w-24 text-center">الأسبوع</th>
                      <th className="py-3.5 px-4">اسم الدورة</th>
                      <th className="py-3.5 px-3 w-36 text-center">اسم المحاضر</th>
                      <th className="py-3.5 px-3 w-32 text-center">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE8FF] text-xs sm:text-sm">
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-[#6B655B]">
                          <BookOpen className="w-8 h-8 text-[#A8A196] mx-auto mb-2" />
                          <p className="font-extrabold text-sm text-[#191816]">لا توجد نتائج مطابقة لبحثك</p>
                          <p className="text-xs mt-1">جرب إدخال كلمات بحث أخرى أو تفقد الفلاتر المحددة</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((item, idx) => {
                        const isFirstOfTrack =
                          idx === 0 || filteredCourses[idx - 1].trackId !== item.trackId;

                        return (
                          <React.Fragment key={item.id}>
                            {/* Track Divider Header Row when viewing All or track transition */}
                            {isFirstOfTrack && activeTrack === 'all' && (
                              <tr className="bg-[#5B00FF] text-white">
                                <td colSpan={5} className="py-2.5 px-4 font-bold text-xs tracking-wide">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="w-4 h-4 text-amber-300" />
                                      <span>{item.trackName}</span>
                                    </div>
                                    <span className="text-[11px] font-normal opacity-90">
                                      تقديم: {item.instructor}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )}

                            <tr
                              className={`transition-colors hover:bg-[#FAF8FF] ${
                                item.isGraduation
                                  ? 'bg-amber-50/70 hover:bg-amber-100/50'
                                  : item.isProject
                                  ? 'bg-purple-50/40 hover:bg-purple-100/40'
                                  : ''
                              }`}
                            >
                              {/* الشهر */}
                              <td className="py-3 px-3 text-center align-top font-bold text-[#4A453E] border-l border-[#EFE8FF]">
                                <span className="inline-block px-2.5 py-1 rounded-md bg-[#F4EFFF] text-xs font-bold text-[#5B00FF]">
                                  {item.monthName}
                                </span>
                              </td>

                              {/* الأسبوع */}
                              <td className="py-3 px-3 text-center align-top font-medium text-[#6B655B] border-l border-[#EFE8FF]">
                                <span className="text-xs">{item.weekName}</span>
                              </td>

                              {/* اسم الدورة */}
                              <td className="py-3 px-4 align-top font-extrabold text-[#191816] border-l border-[#EFE8FF]">
                                <div className="flex flex-col gap-1">
                                  <span className="leading-snug">{item.courseName}</span>
                                  {item.isGraduation ? (
                                    <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-2xs">
                                      <GraduationCap className="w-3 h-3" />
                                      مشروع التخرج النهائي
                                    </span>
                                  ) : item.isProject ? (
                                    <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#5B00FF]/15 text-[#5B00FF]">
                                      <Code2 className="w-3 h-3" />
                                      مشروع تطبيقي
                                    </span>
                                  ) : null}
                                </div>
                              </td>

                              {/* اسم المحاضر */}
                              <td className="py-3 px-3 text-center align-top border-l border-[#EFE8FF]">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-[#F8F6FF] border border-[#DDD0FF] text-[#4700D8] text-[11.5px] font-bold whitespace-nowrap">
                                  {item.instructor}
                                </span>
                              </td>

                              {/* التاريخ */}
                              <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-white border border-[#DCD0FF] text-[#191816] font-mono text-xs font-medium shadow-2xs">
                                  {item.date}
                                </span>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. CARDS / SLIDER VIEW */}
          {viewMode === 'cards' && (
            filteredCourses.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-[#F8F6FF] border border-[#DCD0FF]">
                <BookOpen className="w-8 h-8 text-[#A8A196] mx-auto mb-2" />
                <p className="font-extrabold text-sm text-[#191816]">لا توجد نتائج مطابقة</p>
                <p className="text-xs mt-1 text-[#6B655B]">جرب إعادة ضبط الفلاتر</p>
              </div>
            ) : (
              <div className="relative flex flex-col items-center gap-5">
                {/* Slide Container */}
                <div className="w-full relative flex items-center justify-center min-h-[380px]">
                  {/* Prev Arrow */}
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    aria-label="السابق"
                    className="absolute -right-3 z-20 w-10 h-10 rounded-full bg-[#5B00FF] hover:bg-[#4700D8] text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer border border-[#5B00FF]/50"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>

                  {/* Animated Card */}
                  <div className="w-full overflow-hidden">
                    <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                      {(() => {
                        const course = filteredCourses[currentSlide];
                        if (!course) return null;
                        const isExpanded = expandedCourseIds[course.id];
                        return (
                          <motion.div
                            key={course.id}
                            custom={slideDirection}
                            variants={{
                              enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0, scale: 0.96 }),
                              center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
                              exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 280 : -280, opacity: 0, scale: 0.96 }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className={`w-full p-6 sm:p-8 rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border flex flex-col gap-4 ${
                              course.isGraduation
                                ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-400/40'
                                : course.isProject
                                ? 'border-[#5B00FF]/40'
                                : 'border-[#DCD0FF]'
                            }`}
                          >
                            {/* Card Top Meta */}
                            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EDE5FF] text-[11.5px]">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-[#F4EFFF] text-[#5B00FF] font-bold">
                                  الشهر {course.monthName}
                                </span>
                                <span className="text-[#A8A196]">·</span>
                                <span className="text-[#6B655B] font-medium">الأسبوع {course.weekName}</span>
                              </div>
                              <span className="font-mono text-[#191816] font-bold bg-[#F8F6FF] px-2.5 py-0.5 rounded border border-[#DDD0FF]">
                                {course.date}
                              </span>
                            </div>

                            {/* Course Title */}
                            <div>
                              <h3 className="text-xl sm:text-2xl font-black text-[#5B00FF] leading-snug">
                                {course.courseName}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-[#6B655B]">المسار:</span>
                                <span className="text-xs font-bold text-[#4700D8]">{course.trackName}</span>
                              </div>
                            </div>

                            {/* Badges */}
                            {course.isGraduation && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-xs w-fit">
                                <GraduationCap className="w-4 h-4" />
                                مشروع التخرج والاعتماد النهائي للدبلومة
                              </div>
                            )}
                            {course.isProject && !course.isGraduation && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[#5B00FF]/12 text-[#5B00FF] w-fit">
                                <Code2 className="w-3.5 h-3.5" />
                                مشروع تطبيقي عملي
                              </div>
                            )}

                            {/* Topics */}
                            <div className="pt-2 border-t border-[#EDE5FF]">
                              <div className="flex items-center justify-between text-xs font-bold text-[#4A453E] mb-2">
                                <span>المواضيع والمحاور:</span>
                                {course.topics.length > 3 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleCourseExpand(course.id)}
                                    className="text-[#5B00FF] hover:underline flex items-center gap-0.5 text-xs font-bold cursor-pointer"
                                  >
                                    <span>{isExpanded ? 'إخفاء' : `عرض الكل (${course.topics.length})`}</span>
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                )}
                              </div>
                              <ul className="space-y-1.5">
                                {(isExpanded || course.topics.length <= 3
                                  ? course.topics
                                  : course.topics.slice(0, 3)
                                ).map((topic, tIdx) => (
                                  <li key={tIdx} className="flex items-start gap-2 text-xs text-[#403B33] leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B00FF] shrink-0 mt-1.5" />
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Footer */}
                            <div className="pt-3 border-t border-[#EDE5FF] flex items-end justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#EDE5FF] text-[#5B00FF] flex items-center justify-center font-black text-xs">
                                  {course.instructor.charAt(3) || 'م'}
                                </div>
                                <span className="font-bold text-sm text-[#191816]">{course.instructor}</span>
                              </div>
                              {/* Giant slide number watermark */}
                              <div className="text-[56px] font-black leading-none text-[#5B00FF]/15 font-mono select-none">
                                {currentSlide + 1}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                  </div>

                  {/* Next Arrow */}
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    aria-label="التالي"
                    className="absolute -left-3 z-20 w-10 h-10 rounded-full bg-[#5B00FF] hover:bg-[#4700D8] text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer border border-[#5B00FF]/50"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-3 bg-[#F4EFFF] border border-[#DDD0FF] px-5 py-2 rounded-full shadow-xs">
                  <span className="text-xs font-bold text-[#5B00FF]">
                    {currentSlide + 1} من {filteredCourses.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {filteredCourses.map((_, idx) => {
                      const isActive = currentSlide === idx;
                      // Only show a condensed dot row if many slides
                      if (filteredCourses.length > 12) {
                        // Show dot only for nearby slides
                        if (Math.abs(idx - currentSlide) > 3 && idx !== 0 && idx !== filteredCourses.length - 1) {
                          if (Math.abs(idx - currentSlide) === 4) return <span key={idx} className="text-[#5B00FF]/30 text-xs">…</span>;
                          return null;
                        }
                      }
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            soundFx.playPop();
                            setSlideDirection(idx > currentSlide ? -1 : 1);
                            setCurrentSlide(idx);
                          }}
                          className={`transition-all rounded-full cursor-pointer ${
                            isActive
                              ? 'w-6 h-6 bg-[#5B00FF] text-white text-[10px] font-black shadow-sm flex items-center justify-center'
                              : 'w-2 h-2 bg-[#5B00FF]/25 hover:bg-[#5B00FF]/50'
                          }`}
                          aria-label={`الانتقال للبطاقة ${idx + 1}`}
                        >
                          {isActive ? idx + 1 : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}

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

export default BatchScheduleAppWindow;

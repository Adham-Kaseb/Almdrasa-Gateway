import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ShieldAlert } from "lucide-react";
import { useOS } from "../../context/OSContext";
import { soundFx } from "../../utils/audio";

export const ARABIC_DAYS = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export interface FormattedClockData {
  hoursStr: string;
  minutesStr: string;
  secondsStr: string;
  ampm: "ص" | "م" | "";
  dayName: string;
  dayNum: number;
  monthName: string;
  year: number;
  is24h: boolean;
}

export function formatClockDetails(
  date: Date,
  is24h: boolean,
): FormattedClockData {
  const dayName = ARABIC_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  let rawHours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let ampm: "ص" | "م" | "" = "";
  let hours = rawHours;

  if (!is24h) {
    ampm = rawHours >= 12 ? "م" : "ص";
    hours = rawHours % 12 || 12;
  }

  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return {
    hoursStr,
    minutesStr,
    secondsStr,
    ampm,
    dayName,
    dayNum,
    monthName,
    year,
    is24h,
  };
}

export const SCHOLARSHIP_BATCH_6 = {
  batchNumber: 6,
  name: "الدفعة السادسة",
  startDate: new Date(2026, 6, 4), // 04 July 2026
  firstDeadlineDate: new Date(2027, 3, 4), // 04 April 2027 (after 9 complete months)
  endDate: new Date(2027, 6, 4), // 04 July 2027
};

export interface ScholarshipCountdownData {
  remainingDays: number;
  totalDays: number;
  elapsedDays: number;
  progressPercent: number;
  isEnded: boolean;
  isStarted: boolean;
  batchNumber: number;
  deadlineDateFormatted: string;
  deadlineRemainingDays: number;
  deadlineTotalDays: number;
  deadlineProgressPercent: number;
  isDeadlinePassed: boolean;
}

export function calculateScholarshipCountdown(
  currentDate: Date = new Date(),
): ScholarshipCountdownData {
  const startDay = new Date(2026, 6, 4, 0, 0, 0, 0);
  const deadlineDay = new Date(2027, 3, 4, 0, 0, 0, 0); // 04 April 2027 (after 9 complete months)
  const endDay = new Date(2027, 6, 4, 0, 0, 0, 0);
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0,
    0,
    0,
    0,
  );

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round(
    (endDay.getTime() - startDay.getTime()) / msPerDay,
  );
  const remainingDays = Math.max(
    0,
    Math.ceil((endDay.getTime() - today.getTime()) / msPerDay),
  );
  const elapsedDays = Math.min(
    totalDays,
    Math.max(0, Math.floor((today.getTime() - startDay.getTime()) / msPerDay)),
  );
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((elapsedDays / totalDays) * 100)),
  );

  // 9-Month Elimination & Review Deadline calculations
  const deadlineTotalDays = Math.round(
    (deadlineDay.getTime() - startDay.getTime()) / msPerDay,
  );
  const deadlineRemainingDays = Math.max(
    0,
    Math.ceil((deadlineDay.getTime() - today.getTime()) / msPerDay),
  );
  const deadlineProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((elapsedDays / deadlineTotalDays) * 100)),
  );
  const isDeadlinePassed = today.getTime() >= deadlineDay.getTime();

  return {
    remainingDays,
    totalDays,
    elapsedDays,
    progressPercent,
    isEnded: remainingDays <= 0,
    isStarted: today.getTime() >= startDay.getTime(),
    batchNumber: 6,
    deadlineDateFormatted: "04 أبريل 2027",
    deadlineRemainingDays,
    deadlineTotalDays,
    deadlineProgressPercent,
    isDeadlinePassed,
  };
}

export const DesktopClockWidget: React.FC = () => {
  const { appSettings, updateAppSettings } = useOS();
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [showScholarshipDetails, setShowScholarshipDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const is24h = appSettings.focus?.clockFormat24h ?? false;

  useEffect(() => {
    // Sync with system time every second
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Close details popover if clicked outside
  useEffect(() => {
    if (!showScholarshipDetails) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(e.target as Node)
      ) {
        setShowScholarshipDetails(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [showScholarshipDetails]);

  const clockData = formatClockDetails(currentTime, is24h);
  const scholarshipData = calculateScholarshipCountdown(currentTime);

  const toggleFormat = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(620, 0.035);
    updateAppSettings({
      focus: {
        ...appSettings.focus,
        clockFormat24h: !is24h,
      },
    });
  };

  const toggleScholarshipDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(520, 0.03);
    setShowScholarshipDetails((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-auto flex items-center gap-2 sm:gap-2.5 max-w-[95vw]"
      data-testid="desktop-clock-container"
    >
      {/* 1. Digital Clock Widget Capsule */}
      <div
        onClick={toggleFormat}
        role="button"
        tabIndex={0}
        aria-label={`الوقت الحالي: ${clockData.hoursStr}:${clockData.minutesStr} ${clockData.ampm}، اليوم ${clockData.dayName} ${clockData.dayNum} ${clockData.monthName}. اضغط للتبديل بين نظام 12 و 24 ساعة.`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleFormat(e as unknown as React.MouseEvent);
          }
        }}
        className="group relative h-10 sm:h-11 flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 rounded-2xl bg-[#0B0B0A]/60 backdrop-blur-xl border border-white/10 hover:border-[#DFCA9F]/40 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.08)_inset] hover:shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_24px_rgba(223,202,159,0.12)] transition-all duration-300 cursor-pointer shrink-0"
        data-testid="desktop-clock-widget"
      >
        {/* Subtle Ambient Glow on Hover */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#DFCA9F]/0 via-[#DFCA9F]/5 to-[#DFCA9F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Digital Time Section */}
        <div className="flex items-center gap-1.5" dir="ltr">
          <div className="flex items-baseline font-mono font-semibold tracking-tight text-[#F8F4EC] text-sm sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <span className="tabular-nums">{clockData.hoursStr}</span>
            <span className="text-[#DFCA9F] mx-0.5 animate-pulse select-none font-sans font-bold">
              :
            </span>
            <span className="tabular-nums">{clockData.minutesStr}</span>
          </div>

          {/* AM/PM or 24H Period Badge */}
          {clockData.ampm ? (
            <span className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#DFCA9F] bg-[#DFCA9F]/15 border border-[#DFCA9F]/25 rounded-md leading-none select-none">
              {clockData.ampm}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-[#C5B79E]/80 bg-white/5 border border-white/10 rounded-md leading-none select-none font-mono">
              24H
            </span>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-3.5 sm:h-5 bg-white/15 group-hover:bg-[#DFCA9F]/30 transition-colors" />

        {/* Day & Month Section (Arabic Native RTL) */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 text-right"
          dir="rtl"
        >
          {/* Day of Week with Champagne Gold Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFCA9F] shadow-[0_0_8px_rgba(223,202,159,0.8)]" />
            <span className="text-[11px] sm:text-[13px] font-medium text-[#F3EFE7] tracking-normal">
              {clockData.dayName}
            </span>
          </div>

          {/* Day Number and Arabic Month */}
          <span className="text-[10px] sm:text-[12px] font-normal text-[#C5B79E] flex items-center gap-1">
            <span className="font-semibold text-[#F8F4EC]">
              {clockData.dayNum}
            </span>
            <span>{clockData.monthName}</span>
          </span>
        </div>
      </div>

      {/* 2. Scholarship Batch 6 Remaining Days Widget (Adjacent to Clock) */}
      <div
        ref={detailsRef}
        className="relative shrink-0"
        onMouseEnter={() => setShowScholarshipDetails(true)}
        onMouseLeave={() => setShowScholarshipDetails(false)}
      >
        <div
          onClick={toggleScholarshipDetails}
          role="button"
          tabIndex={0}
          aria-label={`منحة المدرسة - الدفعة 6: متبقي ${scholarshipData.remainingDays} يوماً حتى النهاية (04 يوليو 2027)`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleScholarshipDetails(e as unknown as React.MouseEvent);
            }
          }}
          className="group relative h-10 sm:h-11 flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 rounded-2xl bg-[#0B0B0A]/60 backdrop-blur-xl border border-white/10 hover:border-[#DFCA9F]/40 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.08)_inset] hover:shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_24px_rgba(223,202,159,0.12)] transition-all duration-300 cursor-pointer"
          data-testid="scholarship-countdown-widget"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#DFCA9F]/0 via-[#DFCA9F]/5 to-[#DFCA9F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Academic Cap Icon with subtle gold background */}
          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#DFCA9F]/15 border border-[#DFCA9F]/25 text-[#DFCA9F] group-hover:scale-110 transition-transform">
            <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
          </div>

          {/* Countdown Presentation */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 text-right leading-none"
            dir="rtl"
          >
            <span className="text-[10px] sm:text-[11px] text-[#C5B79E] font-medium hidden xs:inline">
              متبقي
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-[#F8F4EC] tabular-nums tracking-tight">
              {scholarshipData.remainingDays}
            </span>
            <span className="text-[11px] sm:text-[12px] text-[#DFCA9F] font-semibold">
              يوم
            </span>
          </div>

          {/* Batch 6 Tag */}
          <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#DFCA9F] bg-[#DFCA9F]/15 border border-[#DFCA9F]/25 rounded-md leading-none select-none shrink-0">
            الدفعة 6
          </span>
        </div>

        {/* Interactive Breakdown Popover Card */}
        <AnimatePresence>
          {showScholarshipDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full mt-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-77.5 sm:w-85 p-4.5 rounded-2xl bg-[#141311]/95 backdrop-blur-2xl border border-[#DFCA9F]/20 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(223,202,159,0.1)] z-20 text-right pointer-events-auto"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#DFCA9F]/20 to-white/5 border border-[#DFCA9F]/35 flex items-center justify-center text-[#DFCA9F] shadow-sm">
                    <GraduationCap className="w-4.5 h-4.5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#F8F4EC] tracking-tight">
                      منحة مدرسة
                    </h4>
                    <span className="text-[10.5px] text-[#A69F93]">
                      الدفعة السادسة 2026 - 2027
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DFCA9F]/15 border border-[#DFCA9F]/30 text-[#DFCA9F] font-bold text-xs font-mono shadow-xs">
                  <span>{scholarshipData.progressPercent}%</span>
                  <span className="text-[9.5px] text-[#DFCA9F]/70">مكتمل</span>
                </div>
              </div>

              {/* Progress Bar & Elapsed days */}
              <div className="space-y-2 mb-4 bg-white/2 p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#C5B79E] font-medium">معدل الانقضاء:</span>
                  <div className="font-mono text-xs font-bold text-[#F8F4EC] flex items-center gap-1">
                    <span className="text-[#DFCA9F]">{scholarshipData.elapsedDays}</span>
                    <span className="text-[#6E685E]">/</span>
                    <span>{scholarshipData.totalDays}</span>
                    <span className="text-[10px] text-[#A69F93] font-sans">يوم</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#DFCA9F] via-[#F3E2BD] to-[#CCA868] shadow-[0_0_12px_rgba(223,202,159,0.5)] transition-all duration-500"
                    style={{ width: `${scholarshipData.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Start and End Timeline Box */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#191815] p-3 rounded-xl border border-white/8 mb-3.5">
                <div className="space-y-0.5">
                  <span className="text-[#9E988F] block text-[10px]">
                    تاريخ الانطلاق:
                  </span>
                  <span className="text-[#F8F4EC] font-bold tracking-tight">
                    04 يوليو 2026
                  </span>
                </div>
                <div className="space-y-0.5 border-r border-white/8 pr-2.5">
                  <span className="text-[#9E988F] block text-[10px]">
                    تاريخ النهاية:
                  </span>
                  <span className="text-[#DFCA9F] font-bold tracking-tight">
                    04 يوليو 2027
                  </span>
                </div>
              </div>

              {/* Upcoming Elimination & Evaluation Milestone Box */}
              <div className="p-3.5 rounded-xl bg-linear-to-b from-[#DFCA9F]/12 via-[#DFCA9F]/6 to-transparent border border-[#DFCA9F]/25 mb-3.5 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#DFCA9F]/20 flex items-center justify-center text-[#DFCA9F]">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#F8F4EC]">
                      موعد الإقصاء
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                    بعد 9 أشهر
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-[#A69F93]">تاريخ التقييم الأول:</span>
                  <span className="text-[#F8F4EC] font-bold font-mono">
                    {scholarshipData.deadlineDateFormatted}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-[#DFCA9F]/15 flex items-center justify-between text-xs">
                  <span className="text-[#C5B79E] font-medium">
                    المتبقي حتى موعد الإقصاء:
                  </span>
                  <span className="text-[#DFCA9F] font-extrabold font-mono text-xs px-2.5 py-1 rounded-lg bg-[#DFCA9F]/15 border border-[#DFCA9F]/35 shadow-xs">
                    {scholarshipData.deadlineRemainingDays} يوم
                  </span>
                </div>
              </div>

              {/* Remaining Countdown Highlight Until Graduation */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs px-1">
                <span className="text-[#A69F93] font-medium">
                  الأيام المتبقية حتى التخرج:
                </span>
                <span className="text-[#DFCA9F] font-black font-mono text-base tracking-tight flex items-baseline gap-1">
                  <span>{scholarshipData.remainingDays}</span>
                  <span className="text-[11px] font-sans font-bold text-[#DFCA9F]/80">يوم</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

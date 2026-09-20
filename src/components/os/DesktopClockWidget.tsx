import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { soundFx } from '../../utils/audio';

export const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export interface FormattedClockData {
  hoursStr: string;
  minutesStr: string;
  secondsStr: string;
  ampm: 'ص' | 'م' | '';
  dayName: string;
  dayNum: number;
  monthName: string;
  year: number;
  is24h: boolean;
}

export function formatClockDetails(date: Date, is24h: boolean): FormattedClockData {
  const dayName = ARABIC_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  let rawHours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let ampm: 'ص' | 'م' | '' = '';
  let hours = rawHours;

  if (!is24h) {
    ampm = rawHours >= 12 ? 'م' : 'ص';
    hours = rawHours % 12 || 12;
  }

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

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

export const DesktopClockWidget: React.FC = () => {
  const { appSettings, updateAppSettings } = useOS();
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [showSeconds, setShowSeconds] = useState<boolean>(false);

  const is24h = appSettings.focus?.clockFormat24h ?? false;

  useEffect(() => {
    // Sync with system time
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clockData = formatClockDetails(currentTime, is24h);

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

  const toggleSeconds = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick(520, 0.03);
    setShowSeconds((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-auto"
      data-testid="desktop-clock-widget"
    >
      <div
        onClick={toggleFormat}
        role="button"
        tabIndex={0}
        aria-label={`الوقت الحالي: ${clockData.hoursStr}:${clockData.minutesStr} ${clockData.ampm}، اليوم ${clockData.dayName} ${clockData.dayNum} ${clockData.monthName}. اضغط للتبديل بين نظام 12 و 24 ساعة.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleFormat(e as unknown as React.MouseEvent);
          }
        }}
        className="group relative flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-[#0B0B0A]/55 backdrop-blur-xl border border-white/10 hover:border-[#DFCA9F]/40 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.08)_inset] hover:shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_24px_rgba(223,202,159,0.12)] transition-all duration-300 cursor-pointer"
      >
        {/* Subtle Ambient Glow on Hover */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#DFCA9F]/0 via-[#DFCA9F]/5 to-[#DFCA9F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Digital Time Section */}
        <div className="flex items-center gap-1.5" dir="ltr">
          <div className="flex items-baseline font-mono font-semibold tracking-tight text-[#F8F4EC] text-base sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <span className="tabular-nums">{clockData.hoursStr}</span>
            <span className="text-[#DFCA9F] mx-0.5 animate-pulse select-none font-sans font-bold">:</span>
            <span className="tabular-nums">{clockData.minutesStr}</span>
            {showSeconds && (
              <>
                <span className="text-[#DFCA9F]/60 mx-0.5 text-xs font-sans">:</span>
                <span className="text-[#C5B79E] text-xs tabular-nums w-4">
                  {clockData.secondsStr}
                </span>
              </>
            )}
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
        <div className="w-[1px] h-4 sm:h-5 bg-white/15 group-hover:bg-[#DFCA9F]/30 transition-colors" />

        {/* Day & Month Section (Arabic Native RTL) */}
        <div className="flex items-center gap-2 text-right" dir="rtl">
          {/* Day of Week with Champagne Gold Pill */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFCA9F] shadow-[0_0_8px_rgba(223,202,159,0.8)]" />
            <span className="text-[12px] sm:text-[13px] font-medium text-[#F3EFE7] tracking-normal">
              {clockData.dayName}
            </span>
          </div>

          {/* Day Number and Arabic Month */}
          <span className="text-[11px] sm:text-[12px] font-normal text-[#C5B79E] flex items-center gap-1">
            <span className="font-semibold text-[#F8F4EC]">{clockData.dayNum}</span>
            <span>{clockData.monthName}</span>
          </span>
        </div>

        {/* Seconds toggle button on hover (subtle small icon) */}
        <button
          type="button"
          onClick={toggleSeconds}
          title={showSeconds ? 'إخفاء الثواني' : 'إظهار الثواني'}
          className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 text-[#C5B79E] hover:text-[#DFCA9F] transition-all ml-0.5"
          aria-label={showSeconds ? 'إخفاء الثواني' : 'إظهار الثواني'}
        >
          <Clock className="w-2.5 h-2.5" />
        </button>
      </div>
    </motion.div>
  );
};

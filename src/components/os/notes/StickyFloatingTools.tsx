import React, { useState } from 'react';
import {
  Clock,
  PenTool,
  Mic,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';

interface StickyFloatingToolsProps {
  onInsertTimestamp: () => void;
  onOpenDrawingModal: () => void;
  onOpenVoiceModal?: () => void;
  direction?: 'rtl' | 'ltr';
}

export const StickyFloatingTools: React.FC<StickyFloatingToolsProps> = ({
  onInsertTimestamp,
  onOpenDrawingModal,
  onOpenVoiceModal,
  direction = 'rtl',
}) => {
  const isLtr = direction === 'ltr';
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`sticky top-6 self-start z-30 flex flex-col items-center transition-all duration-200 select-none ${
        isCollapsed ? 'opacity-85 hover:opacity-100' : 'opacity-100'
      }`}
    >
      {/* Floating Toolbar Pill */}
      <div className="bg-[#1C1B18]/90 backdrop-blur-md border border-white/14 shadow-[0_12px_32px_rgba(0,0,0,0.4)] rounded-2xl p-1.5 flex flex-col items-center gap-1.5 text-[#F3EFE7]">
        {/* Toggle Collapse Button / 3 dots above each other */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick(400, 0.02);
            setIsCollapsed(!isCollapsed);
          }}
          className="w-8 h-7 rounded-lg text-[#DFCA9F]/70 hover:text-[#DFCA9F] hover:bg-white/8 flex items-center justify-center transition-colors cursor-pointer"
          title={
            isCollapsed
              ? isLtr
                ? 'Expand Tools'
                : 'توسيع شريط الأدوات'
              : isLtr
              ? 'Collapse Tools'
              : 'تصغير شريط الأدوات'
          }
        >
          {isCollapsed ? (
            isLtr ? (
              <ChevronRight className="w-3.5 h-3.5 text-[#DFCA9F]" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-[#DFCA9F]" />
            )
          ) : (
            <MoreVertical className="w-4 h-4 text-[#DFCA9F]" />
          )}
        </button>

        {!isCollapsed && (
          <>
            <div className="w-5 h-px bg-white/10 my-0.5" />

            {/* Tool 1: Real-time Timestamp Inserter */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                soundFx.playPop();
                onInsertTimestamp();
              }}
              className="w-8.5 h-8.5 rounded-xl bg-white/6 hover:bg-[#DFCA9F]/20 text-[#DFCA9F] border border-white/10 hover:border-[#DFCA9F]/50 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs hover:shadow-[0_0_12px_rgba(223,202,159,0.25)]"
              aria-label={
                isLtr
                  ? 'Insert Current Date & Time'
                  : 'إدراج الوقت والتاريخ الحالي'
              }
              title={
                isLtr
                  ? 'Insert current date & time'
                  : 'إدراج الوقت والتاريخ الحالي'
              }
            >
              <Clock className="w-4 h-4 text-[#DFCA9F]" />
            </button>

            {/* Tool 2: Freehand Pen Drawing Canvas */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                soundFx.playPop();
                onOpenDrawingModal();
              }}
              className="w-8.5 h-8.5 rounded-xl bg-white/6 hover:bg-[#DFCA9F]/20 text-[#DFCA9F] border border-white/10 hover:border-[#DFCA9F]/50 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs hover:shadow-[0_0_12px_rgba(223,202,159,0.25)]"
              aria-label={
                isLtr ? 'Freehand Pen Tool' : 'قلم الرسم والتخطيط الحر'
              }
              title={
                isLtr
                  ? 'Freehand drawing pen'
                  : 'قلم الرسم والتخطيط الحر'
              }
            >
              <PenTool className="w-4 h-4 text-[#DFCA9F]" />
            </button>

            {/* Tool 3: Voice Note Recorder */}
            {onOpenVoiceModal && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  soundFx.playPop();
                  onOpenVoiceModal();
                }}
                className="w-8.5 h-8.5 rounded-xl bg-white/6 hover:bg-[#DFCA9F]/20 text-[#DFCA9F] border border-white/10 hover:border-[#DFCA9F]/50 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs hover:shadow-[0_0_12px_rgba(223,202,159,0.25)]"
                aria-label={
                  isLtr ? 'Record Voice Note' : 'تسجيل ملاحظة صوتية'
                }
                title={
                  isLtr
                    ? 'Record voice note'
                    : 'تسجيل ملاحظة صوتية'
                }
              >
                <Mic className="w-4 h-4 text-[#DFCA9F]" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

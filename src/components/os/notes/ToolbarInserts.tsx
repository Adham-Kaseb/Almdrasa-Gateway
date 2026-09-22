import React, { useRef } from 'react';
import { Lightbulb, AlertTriangle, Code2, Image as ImageIcon } from 'lucide-react';
import { HIGHLIGHT_COLORS } from '../../../types/notes';
import { soundFx } from '../../../utils/audio';
import { YouTubeIcon } from './InsertYouTubeModal';

interface ToolbarInsertsProps {
  onFormat: (cmd: string, val?: string) => void;
  onInsertCallout: (type: 'tip' | 'warning' | 'question' | 'code') => void;
  onInsertImage: (file: File) => void;
  onOpenCodeModal?: () => void;
  onOpenYouTubeModal?: () => void;
  direction?: 'rtl' | 'ltr';
}

export const ToolbarInserts: React.FC<ToolbarInsertsProps> = ({
  onFormat,
  onInsertCallout,
  onInsertImage,
  onOpenCodeModal,
  onOpenYouTubeModal,
  direction = 'rtl',
}) => {
  const isLtr = direction === 'ltr';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onInsertImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/80 p-1.5 rounded-2xl border border-[#E5E0D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-xs">
      <span className="text-[11px] font-semibold text-[#756F66] px-1">
        {isLtr ? 'Highlight:' : 'تظليل:'}
      </span>
      {HIGHLIGHT_COLORS.map((col) => (
        <button
          key={col.id}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            soundFx.playClick(500, 0.02);
            onFormat('hiliteColor', col.colorHex);
          }}
          style={{ backgroundColor: col.colorHex }}
          className="w-4.5 h-4.5 rounded-full border border-black/15 hover:scale-115 active:scale-95 transition-transform cursor-pointer shadow-2xs"
          title={isLtr ? `Highlight ${col.id}` : `تظليل ${col.name}`}
        />
      ))}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          soundFx.playClick(400, 0.02);
          onFormat('removeFormat');
        }}
        className="text-[11px] px-1.5 py-0.5 rounded-md hover:bg-black/5 text-[#756F66] font-medium transition-colors cursor-pointer"
        title={isLtr ? 'Clear formatting' : 'إزالة التظليل والتنسيق'}
      >
        {isLtr ? 'Clear' : 'مسح'}
      </button>

      <div className="h-4.5 w-px bg-[#DCD6C9] mx-1" />

      {/* Modern Luxury Callout & Insert Action Badges */}
      <div className="flex items-center gap-1.5">
        {/* Tip / Idea Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            soundFx.playPop();
            onInsertCallout('tip');
          }}
          className="group px-2.5 py-1 rounded-xl text-[11px] font-bold bg-linear-to-b from-amber-50 to-amber-100/90 hover:from-amber-100 hover:to-amber-200/90 text-amber-900 border border-amber-300/80 hover:border-amber-400 shadow-[0_1px_3px_rgba(217,119,6,0.12)] hover:shadow-[0_2px_6px_rgba(217,119,6,0.2)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          title={isLtr ? 'Insert Tip callout box' : 'إدراج صندوق فكرة أو نصيحة دراسية'}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 transition-transform group-hover:scale-110" />
          <span>{isLtr ? 'Tip' : 'فكرة'}</span>
        </button>

        {/* Warning / Alert Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            soundFx.playPop();
            onInsertCallout('warning');
          }}
          className="group px-2.5 py-1 rounded-xl text-[11px] font-bold bg-linear-to-b from-rose-50 to-rose-100/90 hover:from-rose-100 hover:to-rose-200/90 text-rose-900 border border-rose-300/80 hover:border-rose-400 shadow-[0_1px_3px_rgba(225,29,72,0.12)] hover:shadow-[0_2px_6px_rgba(225,29,72,0.2)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          title={isLtr ? 'Insert Warning callout box' : 'إدراج صندوق تنبيه أو تحذير برمجي'}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 transition-transform group-hover:scale-110" />
          <span>{isLtr ? 'Alert' : 'تنبيه'}</span>
        </button>

        {/* Code Snippet Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            soundFx.playPop();
            if (onOpenCodeModal) {
              onOpenCodeModal();
            } else {
              onInsertCallout('code');
            }
          }}
          className="group px-2.5 py-1 rounded-xl text-[11px] font-sans font-bold bg-linear-to-b from-[#FAF8F5] to-[#EAE6DD] hover:from-[#F0ECE3] hover:to-[#DDD7CA] text-[#2C2824] border border-[#CDC6B6] hover:border-[#B8AF9D] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          title={isLtr ? 'Insert Code block (Python, HTML, CSS, JS, React)' : 'إدراج كود برمجي ملون (بايثون، HTML، CSS، JS، React)'}
        >
          <Code2 className="w-3.5 h-3.5 text-[#655E53] transition-transform group-hover:scale-110" />
          <span>{isLtr ? 'Code' : 'كود'}</span>
        </button>

        {/* Image Attachment Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            soundFx.playPop();
            fileInputRef.current?.click();
          }}
          className="group px-2.5 py-1 rounded-xl text-[11px] font-sans font-bold bg-linear-to-b from-emerald-50 to-emerald-100/90 hover:from-emerald-100 hover:to-emerald-200/90 text-emerald-900 border border-emerald-300/80 hover:border-emerald-400 shadow-[0_1px_3px_rgba(5,150,105,0.12)] hover:shadow-[0_2px_6px_rgba(5,150,105,0.2)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          title={isLtr ? 'Insert image (max 2MB)' : 'إدراج صورة من جهازك (أقصى حجم 2 ميجابايت)'}
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600 transition-transform group-hover:scale-110" />
          <span>{isLtr ? 'Image' : 'صورة'}</span>
        </button>

        {/* YouTube Video Embed Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            soundFx.playPop();
            onOpenYouTubeModal?.();
          }}
          className="group px-2.5 py-1 rounded-xl text-[11px] font-sans font-bold bg-linear-to-b from-red-50 to-rose-100/90 hover:from-red-100 hover:to-rose-200/90 text-rose-950 border border-red-300/80 hover:border-red-400 shadow-[0_1px_3px_rgba(225,29,72,0.12)] hover:shadow-[0_2px_6px_rgba(225,29,72,0.2)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          title={isLtr ? 'Embed YouTube video from URL' : 'إدراج فيديو يوتيوب من الرابط'}
        >
          <YouTubeIcon className="w-3.5 h-3.5 text-red-600 transition-transform group-hover:scale-110" />
          <span>{isLtr ? 'YouTube' : 'يوتيوب'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};


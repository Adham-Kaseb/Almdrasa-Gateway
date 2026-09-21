import React, { useRef } from 'react';
import { Code, Image as ImageIcon } from 'lucide-react';
import { HIGHLIGHT_COLORS } from '../../../types/notes';

interface ToolbarInsertsProps {
  onFormat: (cmd: string, val?: string) => void;
  onInsertCallout: (type: 'tip' | 'warning' | 'question' | 'code') => void;
  onInsertImage: (file: File) => void;
}

export const ToolbarInserts: React.FC<ToolbarInsertsProps> = ({
  onFormat,
  onInsertCallout,
  onInsertImage,
}) => {
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
    <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-[#E5E0D6] shadow-2xs">
      <span className="text-[11px] font-semibold text-[#756F66] px-1">تظليل:</span>
      {HIGHLIGHT_COLORS.map((col) => (
        <button
          key={col.id}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat('hiliteColor', col.colorHex)}
          style={{ backgroundColor: col.colorHex }}
          className="w-4.5 h-4.5 rounded-full border border-black/15 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
          title={`تظليل ${col.name}`}
        />
      ))}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('removeFormat')}
        className="text-[10.5px] px-1.5 py-0.5 rounded-md hover:bg-black/5 text-[#756F66] transition-colors cursor-pointer"
        title="إزالة التظليل والتنسيق"
      >
        مسح
      </button>
      <div className="h-4 w-px bg-[#D4CFC5] mx-0.5" />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onInsertCallout('tip')}
        className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer"
        title="إدراج صندوق فكرة أو نصيحة"
      >
        💡 فكرة
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onInsertCallout('warning')}
        className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-all cursor-pointer"
        title="إدراج صندوق تحذير برمجي"
      >
        ⚠️ تنبيه
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onInsertCallout('code')}
        className="px-2 py-0.5 rounded-md text-[11px] font-sans font-bold bg-stone-200 hover:bg-stone-300 text-stone-900 border border-stone-400 transition-all cursor-pointer flex items-center gap-1"
        title="إدراج كود برمجي"
      >
        <Code className="w-3 h-3" /> كود
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="px-2 py-0.5 rounded-md text-[11px] font-sans font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1"
        title="إدراج صورة (أقصى حجم 2 ميجابايت)"
      >
        <ImageIcon className="w-3 h-3" /> صورة
      </button>
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


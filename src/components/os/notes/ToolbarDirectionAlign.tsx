import React from 'react';
import { AlignRight, AlignCenter, AlignLeft } from 'lucide-react';
import { TextDirection, TextAlign } from '../../../types/notes';

interface ToolbarDirectionAlignProps {
  direction: TextDirection;
  textAlign: TextAlign;
  onToggleDirection: (dir: TextDirection) => void;
  onSetTextAlign: (align: TextAlign) => void;
}

export const ToolbarDirectionAlign: React.FC<ToolbarDirectionAlignProps> = ({
  direction,
  textAlign,
  onToggleDirection,
  onSetTextAlign,
}) => {
  return (
    <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-[#E5E0D6] shadow-2xs">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleDirection('rtl')}
        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          direction === 'rtl' ? 'bg-[#DFCA9F] text-[#191816] shadow-2xs' : 'text-[#756F66] hover:bg-black/5'
        }`}
        title="اتجاه الكتابة من اليمين لليسار (عربي)"
      >
        عربي (RTL)
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToggleDirection('ltr')}
        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          direction === 'ltr' ? 'bg-[#DFCA9F] text-[#191816] shadow-2xs' : 'text-[#756F66] hover:bg-black/5'
        }`}
        title="Text Direction Left to Right (English)"
      >
        English (LTR)
      </button>
      <div className="h-4 w-px bg-[#D4CFC5] mx-0.5" />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSetTextAlign('right')}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${textAlign === 'right' ? 'bg-[#DFCA9F] text-[#191816]' : 'text-[#756F66] hover:bg-black/5'}`}
        title="محاذاة لليمين"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSetTextAlign('center')}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${textAlign === 'center' ? 'bg-[#DFCA9F] text-[#191816]' : 'text-[#756F66] hover:bg-black/5'}`}
        title="توسيط"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSetTextAlign('left')}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${textAlign === 'left' ? 'bg-[#DFCA9F] text-[#191816]' : 'text-[#756F66] hover:bg-black/5'}`}
        title="محاذاة لليسار"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

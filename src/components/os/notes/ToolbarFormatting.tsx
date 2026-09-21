import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';

interface ToolbarFormattingProps {
  onFormat: (cmd: string, val?: string) => void;
  direction?: 'rtl' | 'ltr';
}

export const ToolbarFormatting: React.FC<ToolbarFormattingProps> = ({ onFormat, direction = 'rtl' }) => {
  const isLtr = direction === 'ltr';
  return (
    <div className="flex items-center gap-0.5 bg-white/70 p-1 rounded-xl border border-[#E5E0D6] shadow-2xs">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('bold')}
        className="p-1.5 rounded-lg hover:bg-black/5 font-bold cursor-pointer"
        title={isLtr ? "Bold (Ctrl+B)" : "خط عريض (Bold)"}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('italic')}
        className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
        title={isLtr ? "Italic (Ctrl+I)" : "خط مائل (Italic)"}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('underline')}
        className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
        title={isLtr ? "Underline (Ctrl+U)" : "تسطير (Underline)"}
      >
        <Underline className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('strikeThrough')}
        className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
        title={isLtr ? "Strikethrough" : "شطب (Strikethrough)"}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>
      <div className="h-4 w-px bg-[#D4CFC5] mx-0.5" />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('formatBlock', '<h1>')}
        className="px-1.5 py-1 text-xs font-bold hover:bg-black/5 rounded-lg cursor-pointer"
        title={isLtr ? "Heading 1 (H1)" : "عنوان رئيسي كبير (H1)"}
      >
        H1
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('formatBlock', '<h2>')}
        className="px-1.5 py-1 text-xs font-bold hover:bg-black/5 rounded-lg cursor-pointer"
        title={isLtr ? "Heading 2 (H2)" : "عنوان فرعي (H2)"}
      >
        H2
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('insertUnorderedList')}
        className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
        title={isLtr ? "Bullet List" : "قائمة نقطية"}
      >
        <List className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('insertOrderedList')}
        className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
        title={isLtr ? "Numbered List" : "قائمة مرقمة"}
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onFormat('formatBlock', '<blockquote>')}
        className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
        title={isLtr ? "Quote" : "اقتباس"}
      >
        <Quote className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

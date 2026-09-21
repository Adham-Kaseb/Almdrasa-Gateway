import React, { useRef, useEffect } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { TextDirection, TextAlign } from '../../../types/notes';

interface NotesEditorProps {
  title: string;
  content: string;
  direction: TextDirection;
  textAlign: TextAlign;
  updatedAt: string;
  editorRef?: React.RefObject<HTMLDivElement | null>;
  onTitleChange: (newTitle: string) => void;
  onContentChange: (newHtml: string) => void;
  onInsertImage?: (file: File) => void;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({
  title,
  content,
  direction,
  textAlign,
  updatedAt,
  editorRef: externalRef,
  onTitleChange,
  onContentChange,
  onInsertImage,
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const editorRef = externalRef || internalRef;

  // Sync content only if different to avoid cursor jumps
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content, editorRef]);

  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file && onInsertImage) {
          e.preventDefault();
          onInsertImage(file);
          return;
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      e.preventDefault();
      onInsertImage?.(files[0]);
    }
  };

  // Word count helper
  const plainText = editorRef.current?.innerText || '';
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5] overflow-hidden">
      {/* Blank Page Canvas Header */}
      <div className="px-8 pt-6 pb-3 border-b border-[#EAE5DC] bg-white/70 flex flex-col gap-2 shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="عنوان الملاحظة أو الدرس اليومي..."
          dir={direction}
          style={{ color: '#191816' }}
          className="w-full text-2xl sm:text-3xl font-sans font-bold placeholder:text-[#A69F93] bg-transparent border-none focus:outline-none"
        />
        <div className="flex items-center justify-between text-[11px] text-[#756F66] font-sans">
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تم الحفظ تلقائياً في المتصفح</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#8C857B]">
              <Clock className="w-3 h-3" />
              <span>آخر تعديل: {new Date(updatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-bold">
              الكلمات: {wordCount} • الحروف: {charCount}
            </span>
          </div>
        </div>
      </div>

      {/* The Blank Page ContentEditable Writing Surface */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center cursor-text" onClick={() => editorRef.current?.focus()}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onDrop={handleDrop}
          dir={direction}
          style={{ textAlign }}
          data-placeholder="ابدأ بكتابة ملخص درسك، ملاحظاتك البرمجية، أو أفكار مشاريعك هنا..."
          className="notes-editor-surface w-full max-w-4xl min-h-125 p-8 md:p-12 rounded-2xl bg-white border border-[#E2DCCE] shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:outline-none text-[#191816] text-[15px] leading-relaxed font-sans empty:before:content-[attr(data-placeholder)] empty:before:text-[#A69F93] select-text"
        />
      </div>
    </div>
  );
};

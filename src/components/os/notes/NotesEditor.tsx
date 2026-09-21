import React, { useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { TextDirection, TextAlign } from "../../../types/notes";
import { StickyFloatingTools } from "./StickyFloatingTools";
import { useOS } from "../../../context/OSContext";
import { soundFx } from "../../../utils/audio";

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
  onInsertTimestamp?: () => void;
  onOpenDrawingModal?: () => void;
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
  onInsertTimestamp,
  onOpenDrawingModal,
}) => {
  const { appSettings } = useOS();
  const typingSoundEnabled = appSettings.audio.typingSoundEnabled;

  const internalRef = useRef<HTMLDivElement>(null);
  const editorRef = externalRef || internalRef;

  // Sync content only if different to avoid cursor jumps
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content, editorRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ignore lone modifier keys
    if (
      ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
        e.key,
      )
    ) {
      return;
    }

    if (typingSoundEnabled) {
      soundFx.playTypingKey(e.key);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
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
    if (files && files.length > 0 && files[0].type.startsWith("image/")) {
      e.preventDefault();
      onInsertImage?.(files[0]);
    }
  };

  // Word count helper
  const plainText = editorRef.current?.innerText || "";
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;

  const isLtr = direction === "ltr";

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5] overflow-hidden">
      {/* Blank Page Canvas Header */}
      <div className="px-8 pt-6 pb-3 border-b border-[#EAE5DC] bg-white/70 flex flex-col gap-2 shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isLtr
              ? "Note title or daily topic..."
              : "عنوان الملاحظة أو الدرس اليومي..."
          }
          dir={direction}
          style={{ color: "#191816", textAlign }}
          className="w-full text-2xl sm:text-3xl font-sans font-bold placeholder:text-[#A69F93] bg-transparent border-none focus:outline-none"
        />
        <div className="flex items-center justify-between text-[11px] text-[#756F66] font-sans">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#8C857B]">
              <Clock className="w-3 h-3" />
              <span>
                {isLtr ? "Last edit: " : "آخر تعديل: "}
                {new Date(updatedAt).toLocaleTimeString(
                  isLtr ? "en-US" : "ar-EG",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </span>
            </div>
            <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-bold">
              {isLtr
                ? `Words: ${wordCount} • Chars: ${charCount}`
                : `الكلمات: ${wordCount} • الحروف: ${charCount}`}
            </span>
          </div>
        </div>
      </div>

      {/* The Blank Page ContentEditable Writing Surface */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative cursor-text"
        onClick={() => editorRef.current?.focus()}
      >
        <div className="max-w-7xl mx-auto flex items-start justify-center gap-3 relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onDrop={handleDrop}
            dir={direction}
            style={{ textAlign }}
            data-placeholder={
              isLtr
                ? "Start typing your lesson summary, code notes, or project ideas here..."
                : "ابدأ بكتابة ملخص درسك، ملاحظاتك البرمجية، أو أفكار مشاريعك هنا..."
            }
            className="notes-editor-surface flex-1 max-w-6xl min-h-125 p-8 md:p-12 rounded-2xl bg-white border border-[#E2DCCE] shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:outline-none text-[#191816] text-[15px] leading-relaxed font-sans empty:before:content-[attr(data-placeholder)] empty:before:text-[#A69F93] select-text"
          />

          {/* Sticky Floating Tools Beside Writing Sheet */}
          {onInsertTimestamp && onOpenDrawingModal && (
            <div
              className="sticky top-6 self-start z-30 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <StickyFloatingTools
                onInsertTimestamp={onInsertTimestamp}
                onOpenDrawingModal={onOpenDrawingModal}
                direction={direction}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

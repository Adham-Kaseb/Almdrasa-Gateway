import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Calendar, User, Compass, FileText } from 'lucide-react';
import { StudentNoteRecord } from '../../../types/notes';
import { soundFx } from '../../../utils/audio';

interface StudentNotePreviewModalProps {
  note: StudentNoteRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentNotePreviewModal: React.FC<StudentNotePreviewModalProps> = ({ note, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  const handleCopy = () => {
    soundFx.playPop();
    const cleanText = `${note.title}\nالطالب: ${note.student_name} (${note.student_email})\n\n${note.content.replace(/<[^>]*>?/gm, '')}`;
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans animate-fade-in"
    >
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#141311] border border-[#DFCA9F]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-linear-to-r from-[#1C1B17] to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#DFCA9F]/10 border border-[#DFCA9F]/20 text-[#DFCA9F]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="note-preview-title" className="text-base font-bold text-[#F8F4EC]">
                {note.title || 'ملاحظة بدون عنوان'}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C857B] mt-1">
                <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#DFCA9F]" />{note.student_name}</span>
                <span>•</span>
                <span className="text-[#C8C2B7]">{note.student_email}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#DFCA9F]"><Compass className="w-3 h-3" />{note.student_track}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="نسخ نص الملاحظة"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#C8C2B7] hover:text-[#F8F4EC] border border-white/10 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#DFCA9F]" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق معاينة الملاحظة"
              className="p-2 rounded-xl text-[#8C857B] hover:text-[#F8F4EC] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0E0D0C]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5 text-[11px] text-[#7A746B]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#DFCA9F]" />
              آخر تحديث: {new Date(note.updated_at).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'medium' })}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#DFCA9F] font-mono text-[10px] uppercase">
              {note.direction}
            </span>
          </div>

          <div
            dir={note.direction}
            style={{ textAlign: note.text_align }}
            className="notes-editor-surface text-sm text-[#F1EDE4] leading-relaxed select-text min-h-55"
            dangerouslySetInnerHTML={{
              __html: note.content || '<p class="text-neutral-500 italic">لا يوجد محتوى مكتوب في هذه التدوينة بعد...</p>',
            }}
          />
        </div>
      </div>
    </div>
  );
};

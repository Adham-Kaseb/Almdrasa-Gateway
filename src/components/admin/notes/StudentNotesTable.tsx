import React from 'react';
import { Eye, Trash2, BookOpen, Clock, ArrowUpRight } from 'lucide-react';
import { StudentNoteRecord } from '../../../types/notes';

interface StudentNotesTableProps {
  notes: StudentNoteRecord[];
  isLoading: boolean;
  onViewNote: (note: StudentNoteRecord) => void;
  onDeleteNote: (id: string) => void;
}

export const StudentNotesTable: React.FC<StudentNotesTableProps> = ({
  notes,
  isLoading,
  onViewNote,
  onDeleteNote,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#141311]/90 border border-white/5 animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-10 h-10 rounded-xl bg-white/10" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-white/10 rounded-md w-3/4" />
                <div className="h-2.5 bg-white/5 rounded-md w-1/2" />
              </div>
            </div>
            <div className="h-3.5 bg-white/10 rounded-md w-1/4 hidden sm:block" />
            <div className="w-20 h-8 bg-white/10 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#141311]/90 border border-white/10 space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#DFCA9F]/10 text-[#DFCA9F] flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#F8F4EC]">لا توجد ملاحظات مطابقة</h3>
        <p className="text-xs text-[#8C857B] max-w-sm mx-auto">
          لم يتم العثور على أي ملاحظات للطلاب بناءً على معايير البحث الحالية أو لم يقم الطلاب بتدوين ملاحظات بعد.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {notes.map((note) => {
        const snippet = note.content.replace(/<[^>]*>?/gm, '').trim().slice(0, 100) || 'ملاحظة فارغة بدون نص...';
        return (
          <article
            key={note.id}
            className="p-4 rounded-2xl bg-[#141311]/90 hover:bg-[#1A1916] border border-white/10 hover:border-[#DFCA9F]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#DFCA9F]/20 to-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-[#DFCA9F] shrink-0">
                {note.student_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs font-bold text-[#F8F4EC] truncate">{note.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DFCA9F]/10 text-[#DFCA9F] border border-[#DFCA9F]/20 font-medium">
                    {note.student_track}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-[#8C857B] font-mono">
                    {note.direction.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#8C857B] line-clamp-1 mt-1 font-sans">{snippet}</p>
                <div className="flex items-center gap-2 text-[10px] text-[#7A746B] mt-1.5">
                  <span className="text-[#C8C2B7] font-medium">{note.student_name}</span>
                  <span>({note.student_email})</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#DFCA9F]" />
                    {new Date(note.updated_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => onViewNote(note)}
                aria-label={`قراءة تدوينة ${note.title}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#DFCA9F]/10 hover:bg-[#DFCA9F]/20 border border-[#DFCA9F]/30 text-xs font-bold text-[#DFCA9F] transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>قراءة الملاحظة</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteNote(note.id)}
                aria-label="حذف الملاحظة"
                className="p-2 rounded-xl text-[#7A746B] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

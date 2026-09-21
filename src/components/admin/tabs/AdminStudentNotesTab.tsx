import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useAdminStudentNotes } from '../../../hooks/useAdminStudentNotes';
import { StudentNoteRecord } from '../../../types/notes';
import { StudentNotesStats } from '../notes/StudentNotesStats';
import { StudentNotesFilterBar } from '../notes/StudentNotesFilterBar';
import { StudentNotesTable } from '../notes/StudentNotesTable';
import { StudentNotePreviewModal } from '../notes/StudentNotePreviewModal';

export const AdminStudentNotesTab: React.FC = () => {
  const {
    notes,
    allNotesCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTrack,
    setSelectedTrack,
    stats,
    refreshNotes,
    deleteNote,
  } = useAdminStudentNotes();

  const [previewNote, setPreviewNote] = useState<StudentNoteRecord | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الملاحظة نهائياً من سجلات الإدارة وقاعدة البيانات؟')) {
      await deleteNote(id);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 4-State UI: Error State Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refreshNotes}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <StudentNotesStats stats={stats} />

      {/* Filter and Search Bar */}
      <StudentNotesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTrack={selectedTrack}
        onSelectTrack={setSelectedTrack}
        onRefresh={refreshNotes}
        isLoading={isLoading}
      />

      {/* Count Summary */}
      <div className="flex items-center justify-between text-xs text-[#8C857B] px-1">
        <span>عرض {notes.length} من أصل {allNotesCount} ملاحظة مسجلة في قاعدة بيانات Supabase</span>
        <span className="text-[#DFCA9F]/90 font-medium">مزامنة حية ولحظية</span>
      </div>

      {/* Notes List & 4-State UI (Loading / Empty / Success) */}
      <StudentNotesTable
        notes={notes}
        isLoading={isLoading}
        onViewNote={(note) => setPreviewNote(note)}
        onDeleteNote={handleDelete}
      />

      {/* Rich Reader Modal Drawer */}
      <StudentNotePreviewModal
        note={previewNote}
        isOpen={Boolean(previewNote)}
        onClose={() => setPreviewNote(null)}
      />
    </div>
  );
};

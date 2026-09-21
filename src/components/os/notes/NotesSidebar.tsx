import React from 'react';
import { Plus, Search, Trash2, BookOpen } from 'lucide-react';
import { StudentNote } from '../../../types/notes';

interface NotesSidebarProps {
  notes: StudentNote[];
  activeNoteId: string;
  searchQuery: string;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  onSearchChange: (q: string) => void;
  direction?: 'rtl' | 'ltr';
}

export const NotesSidebar: React.FC<NotesSidebarProps> = ({
  notes,
  activeNoteId,
  searchQuery,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  onSearchChange,
  direction = 'rtl',
}) => {
  const isLtr = direction === 'ltr';

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 border-l border-[#E5E0D6] bg-[#F7F5F0] flex flex-col shrink-0 select-none overflow-hidden">
      {/* Sidebar Header & New Note Button */}
      <div className="p-3 border-b border-[#E5E0D6] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#191816]">
            <BookOpen className="w-4 h-4 text-[#9C7A38]" />
            <span>
              {isLtr ? `My Notes (${notes.length})` : `ملاحظاتي (${notes.length})`}
            </span>
          </div>
          <button
            type="button"
            onClick={onAddNote}
            className="px-2.5 py-1 rounded-lg bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#191816] text-xs font-extrabold flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title={isLtr ? "Create new note" : "إنشاء ملاحظة جديدة"}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isLtr ? 'New' : 'جديدة'}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute ${isLtr ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-[#8C857B] pointer-events-none`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isLtr ? "Search notes..." : "بحث في الملاحظات..."}
            style={{ color: '#191816' }}
            dir={direction}
            className={`w-full bg-white/80 border border-[#E5E0D6] rounded-lg ${isLtr ? 'pl-8! pr-2.5' : 'pr-8! pl-2.5'} py-1 text-xs placeholder:text-[#8C857B] focus:outline-none focus:ring-1 focus:ring-[#DFCA9F] transition-all`}
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#8C857B]">
            {isLtr ? 'No matching notes found' : 'لا توجد ملاحظات مطابقة'}
          </div>
        ) : (
          filteredNotes.map((n) => {
            const isActive = n.id === activeNoteId;
            return (
              <div
                key={n.id}
                onClick={() => onSelectNote(n.id)}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-white border-[#DFCA9F] shadow-xs'
                    : 'bg-white/40 hover:bg-white/70 border-transparent hover:border-[#E5E0D6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#191816] truncate max-w-40">
                    {n.title || (isLtr ? 'Untitled note' : 'ملاحظة بلا عنوان')}
                  </h4>
                  {notes.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity cursor-pointer"
                      title={isLtr ? "Delete note" : "حذف الملاحظة"}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8C857B] mt-1 font-sans">
                  <span>
                    {new Date(n.updatedAt).toLocaleDateString(isLtr ? 'en-US' : 'ar-EG')}
                  </span>
                  <span className="uppercase text-[9px] px-1 rounded bg-black/5 font-bold">
                    {n.direction}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

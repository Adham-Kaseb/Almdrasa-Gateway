import React, { useRef } from 'react';
import { useStudentNotes } from '../../../hooks/useStudentNotes';
import { NotesToolbar } from '../notes/NotesToolbar';
import { NotesSidebar } from '../notes/NotesSidebar';
import { NotesEditor } from '../notes/NotesEditor';
import { useNoteFormatter } from '../notes/useNoteFormatter';

export const NotesAppWindow: React.FC = () => {
  const {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    searchQuery,
    setSearchQuery,
    isCopied,
    updateActiveNote,
    addNote,
    deleteNote,
    copyAll,
    exportNote,
    resetActiveNote,
  } = useStudentNotes();

  const editorRef = useRef<HTMLDivElement>(null);

  const { handleFormat, handleInsertCallout, handleInsertImage } = useNoteFormatter({
    editorRef,
    updateActiveNote,
  });

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#FAF8F5]">
      {/* Top Rich Writing & Formatting Toolbar */}
      <NotesToolbar
        direction={activeNote.direction}
        textAlign={activeNote.textAlign}
        onToggleDirection={(dir) => updateActiveNote({ direction: dir })}
        onSetTextAlign={(align) => updateActiveNote({ textAlign: align })}
        onFormat={handleFormat}
        onInsertCallout={handleInsertCallout}
        onInsertImage={handleInsertImage}
        onCopyAll={copyAll}
        onExport={exportNote}
        onReset={resetActiveNote}
        isCopied={isCopied}
      />

      {/* Main Studio Area: Sidebar + Blank Paper Editor Canvas */}
      <div className="flex-1 flex overflow-hidden">
        <NotesSidebar
          notes={notes}
          activeNoteId={activeNoteId}
          searchQuery={searchQuery}
          onSelectNote={setActiveNoteId}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
          onSearchChange={setSearchQuery}
        />

        <NotesEditor
          title={activeNote.title}
          content={activeNote.content}
          direction={activeNote.direction}
          textAlign={activeNote.textAlign}
          updatedAt={activeNote.updatedAt}
          editorRef={editorRef}
          onTitleChange={(title) => updateActiveNote({ title })}
          onContentChange={(content) => updateActiveNote({ content })}
          onInsertImage={handleInsertImage}
        />
      </div>
    </div>
  );
};

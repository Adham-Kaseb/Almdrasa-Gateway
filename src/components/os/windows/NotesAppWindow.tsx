import React, { useRef, useState } from 'react';
import { useStudentNotes } from '../../../hooks/useStudentNotes';
import { NotesToolbar } from '../notes/NotesToolbar';
import { NotesSidebar } from '../notes/NotesSidebar';
import { NotesEditor } from '../notes/NotesEditor';
import { useNoteFormatter } from '../notes/useNoteFormatter';
import { InsertCodeModal } from '../notes/InsertCodeModal';
import { DrawingCanvasModal } from '../notes/DrawingCanvasModal';

interface NotesAppWindowProps {
  onDirectionChange?: (dir: 'rtl' | 'ltr') => void;
}

export const NotesAppWindow: React.FC<NotesAppWindowProps> = ({ onDirectionChange }) => {
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
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);

  const {
    handleFormat,
    handleInsertCallout,
    handleInsertImage,
    handleInsertCodeSnippet,
    handleInsertTimestamp,
    handleInsertDrawing,
  } = useNoteFormatter({
    editorRef,
    updateActiveNote,
  });

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#FAF8F5]">
      {/* Top Rich Writing & Formatting Toolbar */}
      <NotesToolbar
        direction={activeNote.direction}
        textAlign={activeNote.textAlign}
        onToggleDirection={(dir) => {
          const updates: Partial<typeof activeNote> = {
            direction: dir,
            textAlign: dir === 'ltr' ? 'left' : 'right',
          };
          if (dir === 'ltr' && activeNote.title === 'ملاحظات اليوم — الدفعة 6') {
            updates.title = "Today's Notes — Batch 6";
          } else if (dir === 'rtl' && activeNote.title === "Today's Notes — Batch 6") {
            updates.title = 'ملاحظات اليوم — الدفعة 6';
          }
          updateActiveNote(updates);
          onDirectionChange?.(dir);
        }}
        onSetTextAlign={(align) => updateActiveNote({ textAlign: align })}
        onFormat={handleFormat}
        onInsertCallout={handleInsertCallout}
        onInsertImage={handleInsertImage}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
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
          direction={activeNote.direction}
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
          onInsertTimestamp={() => handleInsertTimestamp(activeNote.direction === 'ltr')}
          onOpenDrawingModal={() => setIsDrawingModalOpen(true)}
        />
      </div>

      {/* Modal to choose code language (Python, HTML, CSS, JS, React) with VSCode Snippet Theme */}
      <InsertCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onInsertCodeHtml={handleInsertCodeSnippet}
        direction={activeNote.direction}
      />

      {/* Modal for Freehand Pen Sketching & Mouse Drawing */}
      <DrawingCanvasModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onInsertDrawing={handleInsertDrawing}
        direction={activeNote.direction}
      />
    </div>
  );
};

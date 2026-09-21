import { useState, useEffect, useCallback, useRef } from 'react';
import { StudentNote } from '../types/notes';
import { soundFx } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'almdrasa_gateway_student_notes';
export const ALL_STUDENT_NOTES_KEY = 'almdrasa_all_student_notes';

const createDefaultNote = (userProfile?: { id?: string; name?: string; email?: string; track?: string }): StudentNote => ({
  id: `note-${Date.now()}`,
  title: 'ملاحظات اليوم — الدفعة 6',
  content: '',
  direction: 'rtl',
  textAlign: 'right',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: userProfile?.id || 'guest-student-001',
  studentName: userProfile?.name || 'طالب المنحة',
  studentEmail: userProfile?.email || 'student@almdrasa.community',
  studentTrack: userProfile?.track || 'General',
});

export const useStudentNotes = () => {
  const { student, user } = useAuth();

  const currentProfile = {
    id: student?.id || user?.id || 'guest-student-001',
    name: student?.full_name || (user?.user_metadata as any)?.full_name || 'طالب المنحة',
    email: student?.email || user?.email || 'student@almdrasa.community',
    track: student?.track || 'General',
  };

  const [notes, setNotes] = useState<StudentNote[]>(() => {
    if (typeof window === 'undefined') return [createDefaultNote(currentProfile)];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [createDefaultNote(currentProfile)];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(() => notes[0]?.id || 'default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync current notes to localStorage and global cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

      // Also merge into ALL_STUDENT_NOTES_KEY for admin inspection
      const rawAll = localStorage.getItem(ALL_STUDENT_NOTES_KEY);
      const existingAll: StudentNote[] = rawAll ? JSON.parse(rawAll) : [];
      const noteMap = new Map<string, StudentNote>(existingAll.map((n) => [n.id, n]));
      notes.forEach((n) => noteMap.set(n.id, n));
      localStorage.setItem(ALL_STUDENT_NOTES_KEY, JSON.stringify(Array.from(noteMap.values())));
    } catch {}
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Cloud sync to Supabase with debounce
  const syncNoteToCloud = useCallback((noteToSync: StudentNote) => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await supabase.from('student_notes').upsert({
          id: noteToSync.id,
          user_id: noteToSync.userId || currentProfile.id,
          student_name: noteToSync.studentName || currentProfile.name,
          student_email: noteToSync.studentEmail || currentProfile.email,
          student_track: noteToSync.studentTrack || currentProfile.track,
          title: noteToSync.title,
          content: noteToSync.content,
          direction: noteToSync.direction,
          text_align: noteToSync.textAlign,
          created_at: noteToSync.createdAt,
          updated_at: noteToSync.updatedAt,
        });
      } catch {
        // Fallback gracefully to local storage
      }
    }, 600);
  }, [currentProfile.id, currentProfile.name, currentProfile.email, currentProfile.track]);

  const updateActiveNote = useCallback(
    (updates: Partial<StudentNote>) => {
      setNotes((prev) => {
        const updatedNotes = prev.map((n) => {
          if (n.id === activeNote.id) {
            const updated: StudentNote = {
              ...n,
              ...updates,
              userId: n.userId || currentProfile.id,
              studentName: n.studentName || currentProfile.name,
              studentEmail: n.studentEmail || currentProfile.email,
              studentTrack: n.studentTrack || currentProfile.track,
              updatedAt: new Date().toISOString(),
            };
            syncNoteToCloud(updated);
            return updated;
          }
          return n;
        });
        return updatedNotes;
      });
    },
    [activeNote.id, currentProfile.id, currentProfile.name, currentProfile.email, currentProfile.track, syncNoteToCloud]
  );

  const addNote = useCallback(() => {
    soundFx.playPop();
    const newNote = createDefaultNote(currentProfile);
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    syncNoteToCloud(newNote);
  }, [currentProfile, syncNoteToCloud]);

  const deleteNote = useCallback(
    (id: string) => {
      soundFx.playClick(300, 0.04);
      setNotes((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((n) => n.id !== id);
        if (activeNoteId === id) setActiveNoteId(next[0].id);
        return next;
      });

      // Remove from cloud and global local cache
      try {
        supabase.from('student_notes').delete().eq('id', id).then(() => {});
        const rawAll = localStorage.getItem(ALL_STUDENT_NOTES_KEY);
        if (rawAll) {
          const parsed: StudentNote[] = JSON.parse(rawAll);
          const filtered = parsed.filter((n) => n.id !== id);
          localStorage.setItem(ALL_STUDENT_NOTES_KEY, JSON.stringify(filtered));
        }
      } catch {}
    },
    [activeNoteId]
  );

  const copyAll = useCallback(() => {
    soundFx.playPop();
    const cleanText = `${activeNote.title}\n\n${activeNote.content.replace(/<[^>]*>?/gm, '')}`;
    navigator.clipboard.writeText(cleanText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [activeNote]);

  const exportNote = useCallback(() => {
    soundFx.playPop();
    const cleanText = `${activeNote.title}\nالتاريخ: ${new Date(activeNote.updatedAt).toLocaleString('ar-EG')}\n\n${activeNote.content.replace(/<[^>]*>?/gm, '')}`;
    const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title || 'ملاحظة'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeNote]);

  const resetActiveNote = useCallback(() => {
    soundFx.playClick(400, 0.04);
    updateActiveNote({ title: 'صفحة بيضاء جديدة', content: '' });
  }, [updateActiveNote]);

  return {
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
  };
};

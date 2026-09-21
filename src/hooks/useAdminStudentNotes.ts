import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { StudentNoteRecord, StudentNoteRecordSchema } from '../types/notes';
import { ALL_STUDENT_NOTES_KEY } from './useStudentNotes';

export interface AdminNotesStats {
  totalNotes: number;
  uniqueStudents: number;
  rtlCount: number;
  ltrCount: number;
  latestUpdatedAt: string | null;
}

export function useAdminStudentNotes() {
  const [notes, setNotes] = useState<StudentNoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // Load from local storage cache if available
  const getLocalNotes = useCallback((): StudentNoteRecord[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(ALL_STUDENT_NOTES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.map((item: any) => ({
        id: item.id || `note-${Date.now()}`,
        user_id: item.userId || item.user_id || 'guest-student-001',
        student_name: item.studentName || item.student_name || 'طالب المنحة',
        student_email: item.studentEmail || item.student_email || 'student@almdrasa.community',
        student_track: item.studentTrack || item.student_track || 'General',
        title: item.title || 'ملاحظات اليوم',
        content: item.content || '',
        direction: (item.direction === 'ltr' ? 'ltr' : 'rtl') as 'rtl' | 'ltr',
        text_align: (item.textAlign || item.text_align || 'right') as any,
        created_at: item.createdAt || item.created_at || new Date().toISOString(),
        updated_at: item.updatedAt || item.updated_at || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('student_notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (sbError) {
        throw sbError;
      }

      const validRecords: StudentNoteRecord[] = [];
      const cloudMap = new Map<string, StudentNoteRecord>();

      if (Array.isArray(data)) {
        for (const item of data) {
          const parsed = StudentNoteRecordSchema.safeParse(item);
          if (parsed.success) {
            validRecords.push(parsed.data);
            cloudMap.set(parsed.data.id, parsed.data);
          }
        }
      }

      // Merge local notes that might not be synced yet
      const local = getLocalNotes();
      for (const l of local) {
        if (!cloudMap.has(l.id)) {
          validRecords.push(l);
        }
      }

      validRecords.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setNotes(validRecords);
    } catch (err: any) {
      // Fallback to local storage
      const local = getLocalNotes();
      if (local.length > 0) {
        setNotes(local);
      } else {
        setError(err?.message || 'تعذر جلب ملاحظات الطلاب من Supabase');
      }
    } finally {
      setIsLoading(false);
    }
  }, [getLocalNotes]);

  // Initial fetch and Realtime subscription
  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel('realtime_student_notes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_notes' },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotes]);

  // Delete note as admin
  const deleteNote = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await supabase.from('student_notes').delete().eq('id', id);
      setNotes((prev) => prev.filter((n) => n.id !== id));

      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(ALL_STUDENT_NOTES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const filtered = parsed.filter((n: any) => n.id !== id);
          localStorage.setItem(ALL_STUDENT_NOTES_KEY, JSON.stringify(filtered));
        }
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'تعذر حذف الملاحظة' };
    }
  }, []);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesTrack = selectedTrack === 'all' || n.student_track.toLowerCase() === selectedTrack.toLowerCase();
      if (!matchesTrack) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = n.title.toLowerCase().includes(q);
      const nameMatch = n.student_name.toLowerCase().includes(q);
      const emailMatch = n.student_email.toLowerCase().includes(q);
      const contentSnippet = n.content.replace(/<[^>]*>?/gm, '').toLowerCase();
      const contentMatch = contentSnippet.includes(q);

      return titleMatch || nameMatch || emailMatch || contentMatch;
    });
  }, [notes, searchQuery, selectedTrack]);

  // Statistics
  const stats: AdminNotesStats = useMemo(() => {
    const uniqueUsers = new Set(notes.map((n) => n.student_email || n.user_id));
    let rtl = 0;
    let ltr = 0;
    for (const n of notes) {
      if (n.direction === 'ltr') ltr++;
      else rtl++;
    }

    return {
      totalNotes: notes.length,
      uniqueStudents: uniqueUsers.size,
      rtlCount: rtl,
      ltrCount: ltr,
      latestUpdatedAt: notes[0]?.updated_at || null,
    };
  }, [notes]);

  return {
    notes: filteredNotes,
    allNotesCount: notes.length,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTrack,
    setSelectedTrack,
    stats,
    refreshNotes: fetchNotes,
    deleteNote,
  };
}

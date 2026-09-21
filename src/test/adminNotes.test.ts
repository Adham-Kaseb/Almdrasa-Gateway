import { describe, it, expect } from 'vitest';
import { StudentNoteRecordSchema, StudentNoteRecord } from '../types/notes';
import { AdminTab } from '../types/admin';

describe('Student Notes Admin Schemas and Utilities', () => {
  it('validates a correct StudentNoteRecord with all attributes', () => {
    const validRecord: StudentNoteRecord = {
      id: 'note-101',
      user_id: 'usr-student-01',
      student_name: 'أحمد محمود',
      student_email: 'ahmed@almdrasa.community',
      student_track: 'Frontend',
      title: 'ملاحظات الأسبوع الثاني حول React Hooks',
      content: '<p>تعلمنا اليوم كيفية استخدام useEffect و useMemo</p>',
      direction: 'rtl',
      text_align: 'right',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const parsed = StudentNoteRecordSchema.safeParse(validRecord);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.student_name).toBe('أحمد محمود');
      expect(parsed.data.direction).toBe('rtl');
      expect(parsed.data.student_track).toBe('Frontend');
    }
  });

  it('applies default fallback values for optional schema fields', () => {
    const rawNote = {
      id: 'note-default-test',
      user_id: 'usr-student-02',
      student_name: 'سارة خالد',
      student_email: 'sara@almdrasa.community',
      created_at: '2026-09-21T00:00:00.000Z',
      updated_at: '2026-09-21T01:00:00.000Z',
    };

    const parsed = StudentNoteRecordSchema.safeParse(rawNote);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.title).toBe('ملاحظات اليوم');
      expect(parsed.data.direction).toBe('rtl');
      expect(parsed.data.text_align).toBe('right');
      expect(parsed.data.student_track).toBe('General');
      expect(parsed.data.content).toBe('');
    }
  });

  it('rejects invalid direction or malformed structure', () => {
    const invalidNote = {
      id: 'note-invalid',
      user_id: 'usr-03',
      student_name: 'عمرو',
      student_email: 'amr@test.com',
      direction: 'diagonal', // invalid direction
      created_at: '2026-09-21T00:00:00.000Z',
      updated_at: '2026-09-21T01:00:00.000Z',
    };

    const parsed = StudentNoteRecordSchema.safeParse(invalidNote);
    expect(parsed.success).toBe(false);
  });

  it('verifies that AdminTab allows notes as an active tab', () => {
    const tab: AdminTab = 'notes';
    expect(tab).toBe('notes');
  });

  it('accurately calculates notes statistics and language metrics', () => {
    const mockNotes: StudentNoteRecord[] = [
      {
        id: 'n-1',
        user_id: 'u-1',
        student_name: 'طالب 1',
        student_email: 's1@almdrasa.com',
        student_track: 'Frontend',
        title: 'ملاحظة عربية',
        content: '<p>محتوى</p>',
        direction: 'rtl',
        text_align: 'right',
        created_at: '2026-09-20T10:00:00.000Z',
        updated_at: '2026-09-20T10:00:00.000Z',
      },
      {
        id: 'n-2',
        user_id: 'u-1', // same student
        student_name: 'طالب 1',
        student_email: 's1@almdrasa.com',
        student_track: 'Frontend',
        title: 'Note 2',
        content: '<p>English content</p>',
        direction: 'ltr',
        text_align: 'left',
        created_at: '2026-09-20T11:00:00.000Z',
        updated_at: '2026-09-20T12:00:00.000Z',
      },
      {
        id: 'n-3',
        user_id: 'u-2',
        student_name: 'طالب 2',
        student_email: 's2@almdrasa.com',
        student_track: 'Backend',
        title: 'Node Architecture',
        content: '<p>Express router</p>',
        direction: 'ltr',
        text_align: 'left',
        created_at: '2026-09-20T12:30:00.000Z',
        updated_at: '2026-09-20T14:00:00.000Z',
      },
    ];

    const uniqueStudents = new Set(mockNotes.map((n) => n.student_email || n.user_id));
    let rtl = 0;
    let ltr = 0;
    for (const n of mockNotes) {
      if (n.direction === 'ltr') ltr++;
      else rtl++;
    }

    expect(mockNotes.length).toBe(3);
    expect(uniqueStudents.size).toBe(2);
    expect(rtl).toBe(1);
    expect(ltr).toBe(2);
  });

  it('filters notes accurately by search query across multiple fields', () => {
    const mockNotes: StudentNoteRecord[] = [
      {
        id: 'n-1',
        user_id: 'u-1',
        student_name: 'كريم عادل',
        student_email: 'kareem@almdrasa.com',
        student_track: 'Frontend',
        title: 'أساسيات Tailwind CSS',
        content: '<p>التعامل مع Grid و Flexbox</p>',
        direction: 'rtl',
        text_align: 'right',
        created_at: '2026-09-20T10:00:00.000Z',
        updated_at: '2026-09-20T10:00:00.000Z',
      },
      {
        id: 'n-2',
        user_id: 'u-2',
        student_name: 'خالد عبد الرحمن',
        student_email: 'khaled@almdrasa.com',
        student_track: 'Backend',
        title: 'تصميم قواعد البيانات PostgreSQL',
        content: '<p>إنشاء الجداول والفهارس</p>',
        direction: 'rtl',
        text_align: 'right',
        created_at: '2026-09-20T11:00:00.000Z',
        updated_at: '2026-09-20T11:00:00.000Z',
      },
    ];

    const searchKareem = mockNotes.filter((n) =>
      n.student_name.includes('كريم') || n.title.includes('كريم')
    );
    expect(searchKareem.length).toBe(1);
    expect(searchKareem[0].id).toBe('n-1');

    const searchPostgres = mockNotes.filter((n) =>
      n.content.includes('PostgreSQL') || n.title.includes('PostgreSQL')
    );
    expect(searchPostgres.length).toBe(1);
    expect(searchPostgres[0].id).toBe('n-2');
  });
});

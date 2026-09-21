import { z } from 'zod';

export type TextDirection = 'rtl' | 'ltr';
export type TextAlign = 'right' | 'center' | 'left' | 'justify';

export interface StudentNote {
  id: string;
  title: string;
  content: string;
  direction: TextDirection;
  textAlign: TextAlign;
  updatedAt: string;
  createdAt: string;
  userId?: string;
  studentName?: string;
  studentEmail?: string;
  studentTrack?: string;
}

export const StudentNoteRecordSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  student_name: z.string(),
  student_email: z.string(),
  student_track: z.string().default('General'),
  title: z.string().default('ملاحظات اليوم'),
  content: z.string().default(''),
  direction: z.enum(['rtl', 'ltr']).default('rtl'),
  text_align: z.enum(['right', 'center', 'left', 'justify']).default('right'),
  created_at: z.string(),
  updated_at: z.string(),
});
export type StudentNoteRecord = z.infer<typeof StudentNoteRecordSchema>;

export interface HighlightColor {
  id: string;
  name: string;
  bgClass: string;
  colorHex: string;
}

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  { id: 'yellow', name: 'أصفر ذهبي', bgClass: 'bg-amber-200/70 text-amber-950', colorHex: '#fef08a' },
  { id: 'green', name: 'أخضر زمردي', bgClass: 'bg-emerald-200/70 text-emerald-950', colorHex: '#a7f3d0' },
  { id: 'blue', name: 'أزرق سماوي', bgClass: 'bg-sky-200/70 text-sky-950', colorHex: '#bae6fd' },
  { id: 'pink', name: 'وردي ناعم', bgClass: 'bg-rose-200/70 text-rose-950', colorHex: '#fecdd3' },
  { id: 'purple', name: 'بنفسجي هادئ', bgClass: 'bg-purple-200/70 text-purple-950', colorHex: '#e9d5ff' },
];

export const MAX_NOTE_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function validateNoteImageFile(file: { size: number; type: string }): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'نوع الملف غير مدعوم. يرجى اختيار ملف صورة صالح (PNG, JPG, WebP, GIF).',
    };
  }

  if (file.size > MAX_NOTE_IMAGE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `حجم الصورة (${sizeInMb} ميجابايت) يتجاوز الحد الأقصى المسموح به (2 ميجابايت). يرجى اختيار صورة أصغر.`,
    };
  }

  return { valid: true };
}


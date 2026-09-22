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

export interface YouTubeParseResult {
  valid: boolean;
  videoId?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

/**
 * Parses and validates YouTube URLs (supports watch, share link, shorts, embed, and timestamp).
 */
export function parseYouTubeUrl(rawUrl: string): YouTubeParseResult {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'يرجى إدخال رابط يوتيوب.' };
  }

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

    let videoId: string | null = null;
    let startTime: string | null = null;

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'youtube-nocookie.com') {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]?.split('/')[0] || null;
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/shorts/')[1]?.split('/')[0] || null;
      } else if (parsed.pathname.startsWith('/v/')) {
        videoId = parsed.pathname.split('/v/')[1]?.split('/')[0] || null;
      }

      // Check timestamp
      const t = parsed.searchParams.get('t') || parsed.searchParams.get('start');
      if (t) {
        startTime = t.replace('s', '');
      }
    } else if (hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1).split('/')[0] || null;
      const t = parsed.searchParams.get('t') || parsed.searchParams.get('start');
      if (t) {
        startTime = t.replace('s', '');
      }
    }

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        valid: false,
        error: 'رابط يوتيوب غير صالح. تأكد من نسخ رابط فيديو صحيح من YouTube.',
      };
    }

    let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    if (startTime && !Number.isNaN(Number(startTime))) {
      embedUrl += `?start=${encodeURIComponent(startTime)}`;
    }

    return {
      valid: true,
      videoId,
      embedUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  } catch {
    return {
      valid: false,
      error: 'الرابط غير صحيح. يرجى التأكد من كتابة الرابط بشكل سليم.',
    };
  }
}

/**
 * Generates responsive, clean embed HTML for notes document.
 */
export function generateYouTubeEmbedHtml(videoId: string, embedUrl: string, caption?: string): string {
  const safeCaption = caption ? caption.replace(/["<>]/g, '') : '';
  const captionHtml = safeCaption
    ? `<div style="margin-top:6px;font-size:12px;color:#78716c;text-align:center;font-weight:600;">${safeCaption}</div>`
    : '';

  return `<div class="note-youtube-embed" data-video-id="${videoId}" contenteditable="false" style="margin:16px auto;max-width:680px;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.12);background:#0f172a;border:1px solid #e2e8f0;user-select:none;"><div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="${embedUrl}" title="${safeCaption || 'YouTube Video'}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>${captionHtml}</div><p><br></p>`;
}

/**
 * Format raw seconds to mm:ss format.
 */
export function formatAudioDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generates a clean, accessible audio player embed card for notes.
 */
export function generateVoiceNoteEmbedHtml(
  audioDataUrl: string,
  durationSec: number,
  title?: string,
  isLtr: boolean = false
): string {
  const safeTitle = (title ? title.replace(/["<>]/g, '') : '').trim();
  const displayTitle = safeTitle || (isLtr ? 'Voice Note Recording' : 'ملاحظة صوتية مسجلة');
  const formattedDuration = formatAudioDuration(durationSec);

  const now = new Date();
  const timeStr = now.toLocaleTimeString(isLtr ? 'en-US' : 'ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateStr = now.toLocaleDateString(isLtr ? 'en-US' : 'ar-EG', {
    month: 'short',
    day: 'numeric',
  });

  return `<div class="note-voice-record" contenteditable="false" style="margin:16px auto;max-width:560px;background:#FAF8F5;border:1px solid #E2DCCE;border-radius:16px;padding:14px 16px;box-shadow:0 4px 16px rgba(0,0,0,0.06);user-select:none;font-family:sans-serif;" dir="${isLtr ? 'ltr' : 'rtl'}"><div style="display:flex;align-items:center;justify-content:between;gap:8px;margin-bottom:10px;"><div style="display:flex;align-items:center;gap:8px;"><div style="width:28px;height:28px;border-radius:8px;background:rgba(91,0,255,0.1);display:flex;align-items:center;justify-content:center;color:#5B00FF;font-size:14px;">🎙️</div><div><div style="font-size:13px;font-weight:700;color:#191816;line-height:1.2;">${displayTitle}</div><div style="font-size:11px;color:#756F66;margin-top:2px;">${dateStr} • ${timeStr}</div></div></div><div style="background:rgba(0,0,0,0.05);padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;color:#5B00FF;font-family:monospace;">${formattedDuration}</div></div><audio controls src="${audioDataUrl}" style="width:100%;height:38px;border-radius:8px;outline:none;accent-color:#5B00FF;"></audio></div><p><br></p>`;
}




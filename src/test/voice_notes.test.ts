import { describe, it, expect } from 'vitest';
import { generateVoiceNoteEmbedHtml, formatAudioDuration } from '../types/notes';

describe('Voice Notes Utilities', () => {
  it('formats audio seconds into mm:ss correctly', () => {
    expect(formatAudioDuration(0)).toBe('00:00');
    expect(formatAudioDuration(9)).toBe('00:09');
    expect(formatAudioDuration(65)).toBe('01:05');
    expect(formatAudioDuration(120)).toBe('02:00');
  });

  it('generates accessible, styled voice note embed HTML string', () => {
    const fakeDataUrl = 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwE=';
    const html = generateVoiceNoteEmbedHtml(fakeDataUrl, 35, 'ملاحظة درس الجافاسكريبت', false);

    expect(html).toContain('note-voice-record');
    expect(html).toContain('<audio');
    expect(html).toContain('controls');
    expect(html).toContain('00:35');
    expect(html).toContain('ملاحظة درس الجافاسكريبت');
  });

  it('handles empty caption gracefully and falls back to default title', () => {
    const fakeDataUrl = 'data:audio/webm;base64,AAAA';
    const html = generateVoiceNoteEmbedHtml(fakeDataUrl, 10, undefined, false);

    expect(html).toContain('<audio');
    expect(html).toContain('ملاحظة صوتية مسجلة');
  });
});

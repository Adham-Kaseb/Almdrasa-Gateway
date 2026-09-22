import { describe, it, expect } from 'vitest';
import { parseYouTubeUrl, generateYouTubeEmbedHtml } from '../types/notes';

describe('YouTube Note Embed Utilities', () => {
  it('parses standard youtube watch URLs', () => {
    const res = parseYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(res.valid).toBe(true);
    expect(res.videoId).toBe('dQw4w9WgXcQ');
    expect(res.embedUrl).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('parses short youtu.be URLs', () => {
    const res = parseYouTubeUrl('https://youtu.be/dQw4w9WgXcQ?t=42');
    expect(res.valid).toBe(true);
    expect(res.videoId).toBe('dQw4w9WgXcQ');
    expect(res.embedUrl).toContain('start=42');
  });

  it('parses youtube shorts URLs', () => {
    const res = parseYouTubeUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ');
    expect(res.valid).toBe(true);
    expect(res.videoId).toBe('dQw4w9WgXcQ');
  });

  it('parses existing embed URLs', () => {
    const res = parseYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(res.valid).toBe(true);
    expect(res.videoId).toBe('dQw4w9WgXcQ');
  });

  it('rejects invalid or non-youtube URLs', () => {
    const invalid = parseYouTubeUrl('https://example.com/video.mp4');
    expect(invalid.valid).toBe(false);
    expect(invalid.error).toBeDefined();

    const empty = parseYouTubeUrl('');
    expect(empty.valid).toBe(false);
  });

  it('generates secure, accessible embed HTML string', () => {
    const html = generateYouTubeEmbedHtml('dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'شرح الدرس');
    expect(html).toContain('iframe');
    expect(html).toContain('dQw4w9WgXcQ');
    expect(html).toContain('allowfullscreen');
    expect(html).toContain('شرح الدرس');
  });
});

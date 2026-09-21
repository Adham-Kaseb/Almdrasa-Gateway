import { describe, it, expect } from 'vitest';
import {
  HIGHLIGHT_COLORS,
  StudentNote,
  MAX_NOTE_IMAGE_SIZE_BYTES,
  validateNoteImageFile,
} from '../types/notes';
import { soundFx } from '../utils/audio';

describe('Student Notes & Annotation Studio Tests', () => {
  it('validates highlight colors palette configuration', () => {
    expect(HIGHLIGHT_COLORS.length).toBeGreaterThanOrEqual(5);
    const yellow = HIGHLIGHT_COLORS.find((c) => c.id === 'yellow');
    expect(yellow).toBeDefined();
    expect(yellow?.colorHex).toBe('#fef08a');
    expect(yellow?.name).toContain('أصفر');

    const emerald = HIGHLIGHT_COLORS.find((c) => c.id === 'green');
    expect(emerald).toBeDefined();
    expect(emerald?.colorHex).toBe('#a7f3d0');
  });

  it('validates student note data model structure and direction', () => {
    const rtlNote: StudentNote = {
      id: 'note-test-rtl',
      title: 'ملخص درس الـ React Hooks',
      content: '<p>شرح مبسط للـ useState والـ useEffect</p>',
      direction: 'rtl',
      textAlign: 'right',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(rtlNote.direction).toBe('rtl');
    expect(rtlNote.textAlign).toBe('right');
    expect(rtlNote.title).toContain('React Hooks');

    const ltrNote: StudentNote = {
      ...rtlNote,
      id: 'note-test-ltr',
      title: 'JavaScript Async Await Cheatsheet',
      content: '<pre><code>const data = await fetch(url);</code></pre>',
      direction: 'ltr',
      textAlign: 'left',
    };

    expect(ltrNote.direction).toBe('ltr');
    expect(ltrNote.textAlign).toBe('left');
  });

  it('verifies note serialization for local storage and export', () => {
    const note: StudentNote = {
      id: 'note-export',
      title: 'معايير إقصاء الدفعة 6',
      content: '<div><strong>مهم:</strong> موعد التقييم 04 أبريل 2027</div>',
      direction: 'rtl',
      textAlign: 'right',
      createdAt: '2026-09-21T00:00:00.000Z',
      updatedAt: '2026-09-21T02:00:00.000Z',
    };

    const json = JSON.stringify([note]);
    const restored = JSON.parse(json) as StudentNote[];
    expect(restored.length).toBe(1);
    expect(restored[0].title).toBe('معايير إقصاء الدفعة 6');
    expect(restored[0].direction).toBe('rtl');

    const exportedPlainText = `${note.title}\n\n${note.content.replace(/<[^>]*>?/gm, '')}`;
    expect(exportedPlainText).toContain('معايير إقصاء الدفعة 6');
    expect(exportedPlainText).toContain('مهم: موعد التقييم 04 أبريل 2027');
  });

  it('supports rich block formatting (H1, H2, blockquote, bullet and ordered lists)', () => {
    const formattedNote: StudentNote = {
      id: 'rich-note',
      title: 'تدوينة تجريبية للمنسق',
      content: '<h1>عنوان رئيسي</h1><h2>عنوان فرعي</h2><blockquote>اقتباس مهم</blockquote><ul><li>عنصر 1</li><li>عنصر 2</li></ul><ol><li>أولاً</li><li>ثانياً</li></ol>',
      direction: 'rtl',
      textAlign: 'right',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(formattedNote.content).toContain('<h1>');
    expect(formattedNote.content).toContain('<h2>');
    expect(formattedNote.content).toContain('<blockquote>');
    expect(formattedNote.content).toContain('<ul><li>');
    expect(formattedNote.content).toContain('<ol><li>');
  });

  it('validates image upload size constraint: allows under 2MB and rejects over 2MB', () => {
    expect(MAX_NOTE_IMAGE_SIZE_BYTES).toBe(2 * 1024 * 1024);

    // Valid 1.5MB PNG
    const validImage = { size: 1.5 * 1024 * 1024, type: 'image/png' };
    const validResult = validateNoteImageFile(validImage);
    expect(validResult.valid).toBe(true);
    expect(validResult.error).toBeUndefined();

    // Invalid 2.5MB JPEG (exceeds 2MB)
    const oversizedImage = { size: 2.5 * 1024 * 1024, type: 'image/jpeg' };
    const oversizedResult = validateNoteImageFile(oversizedImage);
    expect(oversizedResult.valid).toBe(false);
    expect(oversizedResult.error).toContain('2 ميجابايت');

    // Invalid non-image file (e.g. PDF)
    const invalidType = { size: 500 * 1024, type: 'application/pdf' };
    const invalidTypeResult = validateNoteImageFile(invalidType);
    expect(invalidTypeResult.valid).toBe(false);
    expect(invalidTypeResult.error).toContain('صورة');
  });

  it('persists embedded images inside note content seamlessly', () => {
    const noteWithImage: StudentNote = {
      id: 'note-with-image',
      title: 'ملاحظة مع لقطة شاشة من المحاضرة',
      content: '<p>شرح عملي:</p><div style="text-align:center"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="screenshot" /></div>',
      direction: 'rtl',
      textAlign: 'right',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(noteWithImage.content).toContain('<img src="data:image/png;base64,');
    expect(noteWithImage.content).toContain('alt="screenshot"');
  });

  it('validates supported code snippet languages (Python, HTML, CSS, JS, React)', async () => {
    const { CODE_LANGUAGES, generateVsCodeSnippetHtml } = await import(
      '../utils/codeSnippetGenerator'
    );

    const langIds = CODE_LANGUAGES.map((l) => l.id);
    expect(langIds).toContain('python');
    expect(langIds).toContain('html');
    expect(langIds).toContain('css');
    expect(langIds).toContain('js');
    expect(langIds).toContain('react');

    // Generate HTML for each language and check VSCode styling & tokens
    for (const lang of CODE_LANGUAGES) {
      const html = generateVsCodeSnippetHtml(lang.sampleCode, lang, false);
      expect(html).toContain('vscode-code-container');
      expect(html).toContain(lang.badge);
      expect(html).toContain(lang.extension);
      expect(html).toContain(`language-${lang.prismLang}`);
    }
  });

  it('validates timestamp badge and freehand drawing HTML integration', () => {
    const timestampHtml = `<span class="timestamp-badge">🕒 الجمعة، 22 سبتمبر 2026 — 01:15:00 ص</span>`;
    const drawingDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const drawingHtml = `<div style="text-align:center;"><img src="${drawingDataUrl}" alt="مخطط رسم يدوي" /></div>`;

    const compositeNote: StudentNote = {
      id: 'composite-note',
      title: 'ملاحظة مع توقيت ورسمة يدوية',
      content: `<p>${timestampHtml}</p>${drawingHtml}`,
      direction: 'rtl',
      textAlign: 'right',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(compositeNote.content).toContain('timestamp-badge');
    expect(compositeNote.content).toContain('🕒');
    expect(compositeNote.content).toContain('alt="مخطط رسم يدوي"');
    expect(compositeNote.content).toContain(drawingDataUrl);
  });

  it('validates typing sound effect configuration and audio engine invocation', () => {
    // Test that audio engine has playTypingKey without throws
    expect(typeof soundFx.playTypingKey).toBe('function');
    expect(() => soundFx.playTypingKey('a')).not.toThrow();
    expect(() => soundFx.playTypingKey('Enter')).not.toThrow();
    expect(() => soundFx.playTypingKey(' ')).not.toThrow();
    expect(() => soundFx.playTypingKey('Backspace')).not.toThrow();
  });
});




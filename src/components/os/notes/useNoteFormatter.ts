import { useCallback } from 'react';
import { validateNoteImageFile, StudentNote } from '../../../types/notes';
import { soundFx } from '../../../utils/audio';

interface UseNoteFormatterProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  updateActiveNote: (updates: Partial<StudentNote>) => void;
}

export const useNoteFormatter = ({ editorRef, updateActiveNote }: UseNoteFormatterProps) => {
  const ensureEditorFocus = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const sel = window.getSelection();
    const isInside = sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer);

    if (!isInside && editorRef.current) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editorRef]);

  const handleFormat = useCallback(
    (cmd: string, val?: string) => {
      ensureEditorFocus();
      const currentHtml = editorRef.current?.innerHTML.trim() || '';
      if (currentHtml === '' || currentHtml === '<br>') {
        if (cmd === 'formatBlock') {
          const tag = (val || 'p').replace(/[<>]/g, '').toLowerCase();
          document.execCommand('insertHTML', false, `<${tag}>اكتب هنا...</${tag}><p><br></p>`);
        } else if (cmd === 'insertUnorderedList') {
          document.execCommand('insertHTML', false, '<ul><li>عنصر القائمة...</li></ul><p><br></p>');
        } else if (cmd === 'insertOrderedList') {
          document.execCommand('insertHTML', false, '<ol><li>العنصر الأول...</li></ol><p><br></p>');
        } else {
          document.execCommand(cmd, false, val);
        }
      } else {
        if (cmd === 'formatBlock') {
          const clean = (val || 'p').replace(/[<>]/g, '');
          try {
            const ok = document.execCommand('formatBlock', false, `<${clean}>`);
            if (!ok) document.execCommand('formatBlock', false, clean);
          } catch {
            document.execCommand('formatBlock', false, clean);
          }
        } else if (cmd === 'hiliteColor') {
          try {
            const ok = document.execCommand('hiliteColor', false, val);
            if (!ok) document.execCommand('backColor', false, val);
          } catch {
            document.execCommand('backColor', false, val);
          }
        } else {
          document.execCommand(cmd, false, val);
        }
      }

      if (editorRef.current) {
        updateActiveNote({ content: editorRef.current.innerHTML });
      }
    },
    [editorRef, ensureEditorFocus, updateActiveNote]
  );

  const handleInsertCallout = useCallback(
    (type: 'tip' | 'warning' | 'question' | 'code') => {
      ensureEditorFocus();
      const templates = {
        tip: '<div style="background:#fef3c7;border:1px solid #fde68a;padding:12px 16px;border-radius:12px;margin:12px 0;color:#78350f"><strong>💡 فكرة / نصيحة:</strong> اكتب فكرتك أو ملحوظتك هنا...</div><p><br></p>',
        warning: '<div style="background:#ffe4e6;border:1px solid #fecdd3;padding:12px 16px;border-radius:12px;margin:12px 0;color:#881337"><strong>⚠️ تنبيه برمجي:</strong> انتبه لهذا الخطأ الشائع...</div><p><br></p>',
        question: '<div style="background:#e0f2fe;border:1px solid #bae6fd;padding:12px 16px;border-radius:12px;margin:12px 0;color:#075985"><strong>❓ سؤال للمراجعة في Google Meet:</strong> استفسار لمناقشته مع المينتور...</div><p><br></p>',
        code: '<pre style="background:#1c1917;color:#facc15;padding:14px;border-radius:10px;font-family:monospace;margin:12px 0;direction:ltr;text-align:left"><code>// اكتب الكود البرمجي هنا\nconst app = "Almdrasa Gateway";</code></pre><p><br></p>',
      };
      document.execCommand('insertHTML', false, templates[type]);
      if (editorRef.current) {
        updateActiveNote({ content: editorRef.current.innerHTML });
      }
    },
    [editorRef, ensureEditorFocus, updateActiveNote]
  );

  const handleInsertImage = useCallback(
    (file: File) => {
      const check = validateNoteImageFile(file);
      if (!check.valid) {
        soundFx.playClick(200, 0.05);
        alert(check.error || 'حجم الصورة يتجاوز الحد الأقصى المسموح به (2 ميجابايت).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        soundFx.playPop();
        ensureEditorFocus();

        const imgName = file.name.replace(/["<>]/g, '');
        const imgHtml = `<div style="margin:16px 0;text-align:center;"><img src="${dataUrl}" alt="${imgName}" style="max-width:100%;max-height:480px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.12);display:inline-block;object-fit:contain;" /><p><br></p></div>`;

        document.execCommand('insertHTML', false, imgHtml);

        if (editorRef.current) {
          updateActiveNote({ content: editorRef.current.innerHTML });
        }
      };
      reader.readAsDataURL(file);
    },
    [editorRef, ensureEditorFocus, updateActiveNote]
  );

  const handleInsertCodeSnippet = useCallback(
    (snippetHtml: string) => {
      ensureEditorFocus();
      document.execCommand('insertHTML', false, snippetHtml);
      if (editorRef.current) {
        updateActiveNote({ content: editorRef.current.innerHTML });
      }
    },
    [editorRef, ensureEditorFocus, updateActiveNote]
  );
  const handleInsertTimestamp = useCallback(
    (isLtr: boolean = false) => {
      ensureEditorFocus();
      const now = new Date();
      const timeStr = now.toLocaleTimeString(isLtr ? 'en-US' : 'ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const dateStr = now.toLocaleDateString(isLtr ? 'en-US' : 'ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const badgeHtml = `<span class="timestamp-badge" style="display:inline-flex;align-items:center;gap:5px;background:#F1EEE8;border:1px solid #D8D2C5;color:#4A453E;padding:2px 8px;border-radius:6px;font-size:11.5px;font-weight:600;margin:0 4px;user-select:all;vertical-align:middle;">🕒 ${dateStr} — ${timeStr}</span>&nbsp;`;
      document.execCommand('insertHTML', false, badgeHtml);
      if (editorRef.current) {
        updateActiveNote({ content: editorRef.current.innerHTML });
      }
    },
    [editorRef, ensureEditorFocus, updateActiveNote]
  );

  const handleInsertDrawing = useCallback(
    (dataUrl: string) => {
      ensureEditorFocus();
      const drawingHtml = `<div style="margin:16px 0;text-align:center;"><img src="${dataUrl}" alt="مخطط رسم يدوي" style="max-width:100%;max-height:480px;border-radius:12px;border:1px solid #E2DCCE;box-shadow:0 6px 20px rgba(0,0,0,0.08);display:inline-block;object-fit:contain;" /><p><br></p></div>`;
      document.execCommand('insertHTML', false, drawingHtml);
      if (editorRef.current) {
        updateActiveNote({ content: editorRef.current.innerHTML });
      }
    },
    [editorRef, ensureEditorFocus, updateActiveNote]
  );

  return {
    handleFormat,
    handleInsertCallout,
    handleInsertImage,
    handleInsertCodeSnippet,
    handleInsertTimestamp,
    handleInsertDrawing,
  };
};

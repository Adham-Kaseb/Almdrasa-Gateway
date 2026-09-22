import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Video, AlertCircle } from 'lucide-react';
import { parseYouTubeUrl } from '../../../types/notes';
import { soundFx } from '../../../utils/audio';

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface InsertYouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertYouTube: (url: string, caption?: string) => void;
  direction?: 'rtl' | 'ltr';
}

export const InsertYouTubeModal: React.FC<InsertYouTubeModalProps> = ({
  isOpen,
  onClose,
  onInsertYouTube,
  direction = 'rtl',
}) => {
  const isLtr = direction === 'ltr';
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setCaption('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const parsed = url.trim() ? parseYouTubeUrl(url.trim()) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError(isLtr ? 'Please enter a YouTube video URL.' : 'يرجى إدخال رابط فيديو يوتيوب.');
      return;
    }

    const res = parseYouTubeUrl(url.trim());
    if (!res.valid) {
      soundFx.playClick(200, 0.04);
      setError(res.error || (isLtr ? 'Invalid YouTube URL.' : 'رابط يوتيوب غير صالح.'));
      return;
    }

    soundFx.playPop();
    onInsertYouTube(url.trim(), caption.trim() || undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="youtube-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-3xl bg-[#FAF8F5] border border-[#E2DCCE] shadow-[0_24px_70px_rgba(0,0,0,0.35)] text-[#191816] overflow-hidden"
          dir={isLtr ? 'ltr' : 'rtl'}
        >
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-[#EAE5DC] flex items-center justify-between bg-white/70 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 border border-red-400/40 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)] shrink-0">
                <YouTubeIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 id="youtube-modal-title" className="text-sm font-bold text-[#191816] tracking-tight">
                  {isLtr ? 'Embed YouTube Video' : 'إدراج فيديو يوتيوب في الملاحظات'}
                </h3>
                <p className="text-[11px] text-[#756F66] mt-0.5">
                  {isLtr
                    ? 'Paste video URL, shorts, or share link to view directly in your notes'
                    : 'انسخ رابط الفيديو أو الشورتس أو رابط المشاركة لتشغيله داخل الملاحظة'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#8C857B] hover:text-[#191816] hover:bg-black/5 transition-colors cursor-pointer"
              aria-label={isLtr ? 'Close' : 'إغلاق'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4.5 bg-[#FAF8F5]">
            <div>
              <label htmlFor="youtube-video-url" className="block text-xs font-bold text-[#4B4741] mb-1.5">
                {isLtr ? 'YouTube Video URL *' : 'رابط فيديو يوتيوب *'}
              </label>
              <div className="relative">
                <input
                  id="youtube-video-url"
                  type="url"
                  autoFocus
                  required
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                  style={{ color: '#191816' }}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border ${
                    error ? 'border-rose-400 focus:ring-rose-200' : 'border-[#DCD6C9] focus:ring-purple-100'
                  } text-sm placeholder:text-[#A69F93] focus:outline-none focus:ring-3 transition-all font-mono shadow-2xs`}
                  dir="ltr"
                />
              </div>
              {error && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="youtube-video-caption" className="block text-xs font-bold text-[#4B4741] mb-1.5">
                {isLtr ? 'Caption / Title (Optional)' : 'وصف أو عنوان الفيديو (اختياري)'}
              </label>
              <input
                id="youtube-video-caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={isLtr ? 'e.g. CS50 Lesson 1 recap' : 'مثال: شرح درس الدوال في جافاسكريبت'}
                style={{ color: '#191816' }}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCD6C9] text-sm placeholder:text-[#A69F93] focus:outline-none focus:ring-3 focus:ring-purple-100 transition-all shadow-2xs"
              />
            </div>

            {/* Live Video Preview Box */}
            {parsed?.valid && parsed.thumbnailUrl && (
              <div className="rounded-2xl border border-[#E5E0D6] bg-white p-3 flex items-center gap-3.5 shadow-xs">
                <div className="relative w-24 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-black/10 shadow-inner">
                  <img
                    src={parsed.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <Video className="w-4 h-4 text-white drop-shadow" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isLtr ? 'Valid YouTube Video' : 'تم التحقق من رابط الفيديو بنجاح'}</span>
                  </div>
                  <p className="text-[11px] text-[#756F66] truncate font-mono mt-0.5" dir="ltr">
                    ID: {parsed.videoId}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE5DC]">
              <button
                type="button"
                onClick={onClose}
                className="px-4.5 py-2.5 rounded-xl text-xs font-bold text-[#68635C] hover:text-[#191816] hover:bg-black/5 border border-[#DCD6C9] transition-all cursor-pointer"
              >
                {isLtr ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="submit"
                disabled={!url.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-linear-to-r from-red-600 via-rose-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-[0_4px_14px_rgba(225,29,72,0.3)] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
                <span>{isLtr ? 'Embed Video' : 'إدراج الفيديو'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

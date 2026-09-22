import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Play, Pause, RotateCcw, X, Check, Volume2, AlertCircle } from 'lucide-react';
import { formatAudioDuration } from '../../../types/notes';
import { soundFx } from '../../../utils/audio';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertVoiceNote: (audioDataUrl: string, durationSec: number, title?: string) => void;
  direction?: 'rtl' | 'ltr';
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onInsertVoiceNote,
  direction = 'rtl',
}) => {
  const isLtr = direction === 'ltr';

  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupRecording = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
  }, []);

  const resetAll = useCallback(() => {
    cleanupRecording();
    setRecordingState('idle');
    setRecordingDuration(0);
    setAudioUrl(null);
    setNoteTitle('');
    setError(null);
  }, [cleanupRecording]);

  useEffect(() => {
    if (!isOpen) {
      resetAll();
    }
  }, [isOpen, resetAll]);

  // Start recording
  const startRecording = async () => {
    setError(null);
    try {
      soundFx.playPop();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setAudioUrl(base64);
          setRecordingState('recorded');
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start(200);
      setRecordingState('recording');
      setRecordingDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      setError(
        isLtr
          ? 'Microphone access denied or unavailable. Please enable microphone permissions.'
          : 'تعذر الوصول إلى الميكروفون. يرجى التأكد من منح الإذن للمتصفح.'
      );
    }
  };

  // Stop recording
  const stopRecording = () => {
    soundFx.playPop();
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Toggle preview playback
  const togglePlayPreview = () => {
    if (!audioUrl) return;
    if (!previewAudioRef.current) {
      const audio = new Audio(audioUrl);
      previewAudioRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.play();
      setIsPlayingPreview(true);
    } else if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  // Insert into note
  const handleConfirmInsert = () => {
    if (!audioUrl) return;
    soundFx.playPop();
    onInsertVoiceNote(audioUrl, recordingDuration || 1, noteTitle.trim() || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl bg-[#FAF8F5] border border-[#E2DCCE] shadow-[0_24px_70px_rgba(0,0,0,0.35)] text-[#191816] overflow-hidden"
          dir={isLtr ? 'ltr' : 'rtl'}
        >
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-[#EAE5DC] flex items-center justify-between bg-white/70 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#5B00FF] to-[#3B00B3] border border-[#5B00FF]/30 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(91,0,255,0.25)] shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 id="voice-modal-title" className="text-sm font-bold text-[#191816] tracking-tight">
                  {isLtr ? 'Record Voice Note' : 'تسجيل ملاحظة صوتية'}
                </h3>
                <p className="text-[11px] text-[#756F66] mt-0.5">
                  {isLtr
                    ? 'Speak and record audio notes to embed directly in your document'
                    : 'سجّل صوتك وتلخيصك الشفهي وأدرجه مباشرة في الملاحظة'}
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

          {/* Body */}
          <div className="p-6 flex flex-col items-center gap-5">
            {/* Visualizer / Center Area */}
            <div className="w-full flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-white border border-[#E5E0D6] shadow-xs relative overflow-hidden">
              {recordingState === 'recording' && (
                <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
              )}

              {/* Pulsing Mic Circle */}
              <div className="relative mb-3 flex items-center justify-center">
                {recordingState === 'recording' && (
                  <span className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
                )}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    recordingState === 'recording'
                      ? 'bg-red-500 text-white shadow-[0_0_24px_rgba(239,68,68,0.45)] scale-110'
                      : recordingState === 'recorded'
                      ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-[#5B00FF]/10 text-[#5B00FF] border border-[#5B00FF]/25'
                  }`}
                >
                  {recordingState === 'recording' ? (
                    <Mic className="w-8 h-8 animate-bounce" />
                  ) : recordingState === 'recorded' ? (
                    <Volume2 className="w-8 h-8" />
                  ) : (
                    <MicOff className="w-8 h-8 opacity-70" />
                  )}
                </div>
              </div>

              {/* Time display */}
              <div className="text-3xl font-mono font-black text-[#191816] tracking-widest mt-1">
                {formatAudioDuration(recordingDuration)}
              </div>

              <div className="text-xs font-semibold text-[#756F66] mt-1">
                {recordingState === 'recording'
                  ? isLtr
                    ? 'Recording in progress...'
                    : 'جارٍ التسجيل الصوتي الآن...'
                  : recordingState === 'recorded'
                  ? isLtr
                    ? 'Recording ready for insertion'
                    : 'تم التسجيل بنجاح، يمكنك المعاينة والإدراج'
                  : isLtr
                  ? 'Click Start to record'
                  : 'اضغط على زر البدء لبدء التسجيل'}
              </div>

              {/* Live Waveform Bars indicator */}
              {recordingState === 'recording' && (
                <div className="flex items-center gap-1 mt-4 h-6">
                  {[40, 70, 100, 60, 90, 45, 80, 55, 95, 65, 30].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDuration: `${0.3 + (i % 3) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="w-full flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Note title / Label input */}
            <div className="w-full">
              <label htmlFor="voice-note-title" className="block text-xs font-bold text-[#4B4741] mb-1.5">
                {isLtr ? 'Voice Note Label (Optional)' : 'عنوان الملاحظة الصوتية (اختياري)'}
              </label>
              <input
                id="voice-note-title"
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder={isLtr ? 'e.g. Mentor advice on useEffect' : 'مثال: نصيحة المينتور بخصوص الـ useEffect'}
                style={{ color: '#191816' }}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCD6C9] text-sm placeholder:text-[#A69F93] focus:outline-none focus:ring-3 focus:ring-purple-100 transition-all shadow-2xs"
              />
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center gap-3 w-full">
              {recordingState === 'idle' && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#5B00FF] hover:bg-[#4700D8] text-white shadow-[0_4px_14px_rgba(91,0,255,0.3)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>{isLtr ? 'Start Recording' : 'بدء التسجيل'}</span>
                </button>
              )}

              {recordingState === 'recording' && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_14px_rgba(239,68,68,0.35)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>{isLtr ? 'Stop Recording' : 'إيقاف وإنهاء'}</span>
                </button>
              )}

              {recordingState === 'recorded' && (
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={togglePlayPreview}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white text-[#191816] border border-[#DCD6C9] hover:bg-black/5 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isPlayingPreview ? (
                      <>
                        <Pause className="w-4 h-4 text-[#5B00FF]" />
                        <span>{isLtr ? 'Pause' : 'إيقاف مؤقت'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-[#5B00FF] fill-[#5B00FF]" />
                        <span>{isLtr ? 'Preview' : 'استماع للمعاينة'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#756F66] hover:text-[#191816] border border-[#DCD6C9] hover:bg-black/5 transition-all cursor-pointer flex items-center gap-1.5"
                    title={isLtr ? 'Re-record' : 'إعادة التسجيل'}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isLtr ? 'Reset' : 'إعادة'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-3.5 border-t border-[#EAE5DC] flex items-center justify-end gap-2.5 bg-white/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2 rounded-xl text-xs font-bold text-[#68635C] hover:text-[#191816] hover:bg-black/5 border border-[#DCD6C9] transition-all cursor-pointer"
            >
              {isLtr ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="button"
              onClick={handleConfirmInsert}
              disabled={recordingState !== 'recorded' || !audioUrl}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-linear-to-r from-[#5B00FF] to-[#4700D8] hover:from-[#4700D8] hover:to-[#3B00B3] text-white shadow-[0_4px_14px_rgba(91,0,255,0.3)] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isLtr ? 'Insert Voice Note' : 'إدراج الملاحظة الصوتية'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

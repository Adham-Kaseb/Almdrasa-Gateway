import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool,
  Check,
  X,
  RotateCcw,
  Eraser,
  Palette,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';

interface DrawingCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertDrawing: (dataUrl: string) => void;
  direction?: 'rtl' | 'ltr';
}

const PEN_COLORS = [
  { id: 'dark', hex: '#1C1B18', name: 'أسود فحمي', nameEn: 'Charcoal' },
  { id: 'gold', hex: '#CCA868', name: 'ذهبي مدرسي', nameEn: 'Gold' },
  { id: 'blue', hex: '#2563EB', name: 'أزرق هندسي', nameEn: 'Blue' },
  { id: 'red', hex: '#DC2626', name: 'أحمر مراجعة', nameEn: 'Red' },
  { id: 'emerald', hex: '#059669', name: 'أخضر تدقيق', nameEn: 'Green' },
  { id: 'purple', hex: '#7C3AED', name: 'بنفسجي توضيحي', nameEn: 'Purple' },
];

const STROKE_WIDTHS = [
  { id: 'fine', size: 2, label: 'رفيع', labelEn: 'Fine' },
  { id: 'medium', size: 4, label: 'متوسط', labelEn: 'Medium' },
  { id: 'thick', size: 8, label: 'عريض', labelEn: 'Thick' },
];

export const DrawingCanvasModal: React.FC<DrawingCanvasModalProps> = ({
  isOpen,
  onClose,
  onInsertDrawing,
  direction = 'rtl',
}) => {
  const isLtr = direction === 'ltr';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(PEN_COLORS[0].hex);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Default white paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw subtle dot grid for easy sketching
    ctx.fillStyle = '#EBE7DF';
    const spacing = 24;
    for (let x = 12; x < rect.width; x += spacing) {
      for (let y = 12; y < rect.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    soundFx.playClick(300, 0.04);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Re-draw subtle dot grid
    ctx.fillStyle = '#EBE7DF';
    const spacing = 24;
    for (let x = 12; x < rect.width; x += spacing) {
      for (let y = 12; y < rect.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    setHasDrawn(false);
  };

  const handleSaveAndInsert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundFx.playPop();
    const dataUrl = canvas.toDataURL('image/png');
    onInsertDrawing(dataUrl);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', damping: 26, stiffness: 360 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl rounded-2xl bg-[#181714] border border-white/12 shadow-[0_24px_64px_rgba(0,0,0,0.8)] text-[#F3EFE7] overflow-hidden flex flex-col"
          dir={isLtr ? 'ltr' : 'rtl'}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DFCA9F]/15 border border-[#DFCA9F]/30 flex items-center justify-center text-[#DFCA9F]">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F8F4EC]">
                  {isLtr ? 'Sketch & Freehand Drawing' : 'قلم الرسم والتخطيط الحر'}
                </h3>
                <p className="text-[11px] text-[#A69F93]">
                  {isLtr
                    ? 'Draw diagrams, arrows, or math formulas to insert into your note'
                    : 'ارسم مخططات، أسهم توضيحية، أو معادلات رياضية وأدرجها فوراً في ملاحظاتك'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Controls Bar */}
          <div className="p-3 border-b border-white/8 bg-[#1F1E1B] flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Colors */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8C857B] text-[11px] font-semibold flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                <span>{isLtr ? 'Color:' : 'اللون:'}</span>
              </span>
              <div className="flex items-center gap-1">
                {PEN_COLORS.map((c) => {
                  const isSelected = color === c.hex && !isEraser;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        soundFx.playClick(600, 0.02);
                        setColor(c.hex);
                        setIsEraser(false);
                      }}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'border-white scale-110 ring-2 ring-[#DFCA9F]'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      title={isLtr ? c.nameEn : c.name}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.id === 'gold' ? 'text-[#181714]' : 'text-white'
                          } stroke-3`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stroke Widths & Eraser */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/6 p-1 rounded-xl border border-white/10">
                {STROKE_WIDTHS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick(400, 0.02);
                      setStrokeWidth(w.size);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      strokeWidth === w.size
                        ? 'bg-[#DFCA9F] text-[#141310] shadow-xs'
                        : 'text-[#9E988F] hover:text-white'
                    }`}
                  >
                    {isLtr ? w.labelEn : w.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick(450, 0.02);
                  setIsEraser(!isEraser);
                }}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isEraser
                    ? 'bg-amber-400 text-[#141310] border-amber-300 shadow-xs'
                    : 'bg-white/6 text-[#C8C2B7] border-white/10 hover:bg-white/10'
                }`}
                title={isLtr ? 'Eraser' : 'ممحاة'}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isLtr ? 'Eraser' : 'ممحاة'}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl bg-white/6 hover:bg-red-500/20 text-[#C8C2B7] hover:text-red-300 border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title={isLtr ? 'Clear Canvas' : 'مسح اللوحة بالكامل'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isLtr ? 'Clear' : 'مسح'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Canvas Area */}
          <div className="p-4 bg-[#11100E] flex items-center justify-center">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-white cursor-crosshair">
              <canvas
                ref={canvasRef}
                style={{ width: '680px', height: '360px', touchAction: 'none' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-white/10 flex items-center justify-between bg-white/3">
            <span className="text-[11px] text-[#8C857B]">
              {isLtr
                ? 'Tip: Draw directly with mouse or stylus'
                : 'نصيحة: يمكنك الرسم بسهولة بالفأرة أو القلم اللوحي'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#C8C2B7] hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isLtr ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="button"
                disabled={!hasDrawn}
                onClick={handleSaveAndInsert}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-md shadow-[#DFCA9F]/15 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-3" />
                <span>{isLtr ? 'Insert Drawing' : 'إدراج الرسمة في الملاحظات'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { Copy, Check, Sliders, Eye } from 'lucide-react';
import { soundFx } from '../../../utils/audio';

export const RICodeAppWindow: React.FC = () => {
  const [radius, setRadius] = useState<number>(14);
  const [elevation, setElevation] = useState<'subtle' | 'medium' | 'strong'>('medium');
  const [accent, setAccent] = useState<'gold' | 'blue' | 'sage'>('gold');
  const [copied, setCopied] = useState(false);

  const shadowStyles = {
    subtle: '0px 1px 12px 0px rgba(0, 0, 0, 0.16)',
    medium: '0px 20px 55px 0px rgba(0, 0, 0, 0.34)',
    strong: '0px 48px 128px 0px rgba(11, 11, 10, 0.55)',
  };

  const accentColors = {
    gold: { bg: '#C5B79E', text: '#191816', border: '#D4CFC5', label: 'شامبانيا ذهبي' },
    blue: { bg: '#2F6FCE', text: '#FFFFFF', border: '#5B95E8', label: 'أزرق الإشارة' },
    sage: { bg: '#7E9185', text: '#FFFFFF', border: '#90A397', label: 'أخضر الميرمية' },
  };

  const currentAccent = accentColors[accent];

  const generatedCode = `<div className="ri-card" style={{
  borderRadius: '${radius}px',
  backgroundColor: '#141311',
  boxShadow: '${shadowStyles[elevation]}',
  border: '1px solid rgba(255, 255, 255, 0.12)'
}}>
  <button style={{
    backgroundColor: '${currentAccent.bg}',
    color: '${currentAccent.text}',
    borderRadius: '${Math.min(radius, 24)}px'
  }}>
    مكون Almdrasa Gateway التفاعلي
  </button>
</div>`;

  const handleCopy = () => {
    soundFx.playPop();
    navigator.clipboard?.writeText?.(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-[#191816] select-text">
      {/* Header */}
      <div className="border-b border-[#E5E0D6] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
            بيئة التصميم المرئي وبناء المكونات
          </span>
          <h2 className="font-serif text-[30px] font-bold leading-tight text-[#191816] mt-1">
            استوديو التصميم — RI Code
          </h2>
          <p className="text-[13px] text-[#504A43] mt-1">
            صمم وافحص المكونات التفاعلية باستخدام مفردات رموز التصميم الرسمية لنظام Almdrasa Gateway.
          </p>
        </div>
      </div>

      {/* Editor Grid: Controls on Right in RTL, Live Preview on Left */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Token Controls */}
        <div className="p-5 rounded-2xl bg-white/80 border border-[#E5E0D6] space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#76654D] font-semibold text-[13px] uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>معايير ورموز التصميم</span>
          </div>

          {/* Radius Slider */}
          <div>
            <div className="flex items-center justify-between text-[13px] font-medium text-[#191816]">
              <span>انحناء الحواف (Border Radius):</span>
              <span className="font-mono text-[#756F66]">{radius}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="40"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full mt-2 accent-[#292724]"
            />
          </div>

          {/* Elevation Selector */}
          <div>
            <span className="text-[13px] font-medium text-[#191816] block mb-2">مستوى الارتفاع والظلال (Elevation):</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'subtle', label: 'هادئ' },
                { key: 'medium', label: 'متوسط' },
                { key: 'strong', label: 'مرتفع' },
              ].map((elev) => (
                <button
                  key={elev.key}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setElevation(elev.key as any);
                  }}
                  className={`py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                    elevation === elev.key
                      ? 'bg-[#292724] text-[#F8F4EC] border-[#292724] shadow-sm'
                      : 'bg-[#F1EEE8] text-[#504A43] border-[#E5E0D6] hover:bg-[#E2DDD3]'
                  }`}
                >
                  {elev.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Palette */}
          <div>
            <span className="text-[13px] font-medium text-[#191816] block mb-2">نغمة التمييز اللوني:</span>
            <div className="flex items-center gap-3">
              {[
                { key: 'gold', label: 'شامبانيا', color: '#C5B79E' },
                { key: 'blue', label: 'أزرق', color: '#2F6FCE' },
                { key: 'sage', label: 'ميرمية', color: '#7E9185' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAccent(item.key as any);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all ${
                    accent === item.key
                      ? 'ring-2 ring-[#2F6FCE] border-transparent bg-white shadow-sm'
                      : 'border-[#D4CFC5] bg-[#F8F6F1] hover:bg-white'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="p-6 rounded-2xl bg-[#0B0B0A] border border-white/10 flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] font-mono text-[#8E887F]">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#9FA994]" />
              معاينة حية على الكانفاس
            </span>
            <span>محرك Almdrasa Gateway Engine</span>
          </div>

          {/* Rendered Preview Element */}
          <div className="py-6 flex items-center justify-center">
            <div
              style={{
                borderRadius: `${radius}px`,
                boxShadow: shadowStyles[elevation],
              }}
              className="p-5 w-64 bg-[#141311] border border-white/14 text-[#F3EFE7] text-center transition-all duration-300"
            >
              <div className="text-[11px] font-mono text-[#C5B79E] uppercase tracking-wider">
                رمز المكون #82
              </div>
              <h4 className="font-serif text-[18px] text-white mt-1">بوابة الوكلاء الأذكياء المستقلة</h4>
              <p className="text-[11px] text-[#A69F93] mt-1 leading-relaxed">
                مصادقة Zero-Trust وتدفق بيانات فائق السرعة.
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: currentAccent.bg,
                  color: currentAccent.text,
                  borderRadius: `${Math.min(radius, 24)}px`,
                }}
                className="mt-4 px-4 py-1.5 text-[12px] font-semibold transition-transform hover:scale-105 active:scale-95 shadow-sm"
              >
                فحص القياس عن بُعد
              </button>
            </div>
          </div>

          {/* Generated Code & Copy */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#756F66]">كود جاهز React / Tailwind</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F8F4EC] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#9FA994]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ بنجاح' : 'نسخ كود JSX'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

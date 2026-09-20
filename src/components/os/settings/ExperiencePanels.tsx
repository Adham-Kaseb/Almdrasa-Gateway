import React from 'react';
import {
  Volume2,
  VolumeX,
  LayoutGrid,
  Bot,
  Flame,
  Check,
  Eye,
  EyeOff,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { soundFx } from '../../../utils/audio';

// PANEL 1: Audio & Sound Effects
export const AudioSettingsPanel: React.FC = () => {
  const { appSettings, updateAppSettings, isMuted, toggleMute } = useOS();
  const audio = appSettings.audio;

  return (
    <div className="space-y-6 text-[#F3EFE7] animate-in fade-in duration-200">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-[#F8F4EC] flex items-center gap-2.5">
          <Volume2 className="w-5.5 h-5.5 text-[#DFCA9F]" />
          <span>الصوت والمؤثرات التفاعلية</span>
        </h2>
        <p className="text-xs text-[#9E988F] mt-3.5 leading-relaxed">
          تحكم في أصوات النظام، نقرات شريط المهام، وتنبيهات النوافذ
        </p>
      </div>

      {/* Master Mute & Volume */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-semibold text-[#F8F4EC]">تفعيل المؤثرات الصوتية العامة</h3>
            <p className="text-xs text-[#9E988F] leading-relaxed">تشغيل الأصوات التفاعلية عند فتح النوافذ والضغط على الأيقونات</p>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleMute();
              updateAppSettings({
                audio: { ...audio, soundEnabled: isMuted },
              });
              soundFx.playPop();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              !isMuted && audio.soundEnabled
                ? 'bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] font-bold shadow-lg shadow-[#DFCA9F]/15'
                : 'bg-white/10 text-[#9E988F]'
            }`}
          >
            {!isMuted && audio.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span>الصوت مفعل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>مكتوم</span>
              </>
            )}
          </button>
        </div>

        {/* Volume Level */}
        <div className="pt-2 space-y-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#9E988F]">مستوى الصوت العام</span>
            <span className="font-mono text-[#DFCA9F]">{audio.volume}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={audio.volume}
            onChange={(e) =>
              updateAppSettings({
                audio: { ...audio, volume: Number(e.target.value) },
              })
            }
            className="w-full accent-[#DFCA9F] cursor-pointer h-1.5 bg-white/10 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};



// PANEL 3: Dock & Desktop Experience
export const DockSettingsPanel: React.FC = () => {
  const { appSettings, updateAppSettings, setCompanionMessage } = useOS();
  const dock = appSettings.dock;

  const sizes: { id: 'compact' | 'normal' | 'large'; label: string; desc: string }[] = [
    { id: 'compact', label: 'مدمج (Compact)', desc: 'أيقونات أصغر بحجم 38px لمساحة عمل أوسع' },
    { id: 'normal', label: 'قياسي (Standard)', desc: 'الحجم الافتراضي الفاخر 44px متوازن ومريح' },
    { id: 'large', label: 'كبير (Large)', desc: 'أيقونات بارزة بحجم 52px مع تفاصيل أوضح' },
  ];

  return (
    <div className="space-y-6 text-[#F3EFE7] animate-in fade-in duration-200">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-[#F8F4EC] flex items-center gap-2.5">
          <LayoutGrid className="w-5.5 h-5.5 text-[#DFCA9F]" />
          <span>شريط المهام وسطح المكتب</span>
        </h2>
        <p className="text-xs text-[#9E988F] mt-3.5 leading-relaxed">
          تخصيص أبعاد شريط التطبيقات السفلي وسلوك النوافذ المفتوحة
        </p>
      </div>

      {/* Dock Size */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#F8F4EC]">حجم أيقونات شريط المهام (Dock Scale)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sizes.map((s) => {
            const isSelected = dock.size === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  soundFx.playClick(600, 0.03);
                  updateAppSettings({
                    dock: { ...dock, size: s.id },
                  });
                  setCompanionMessage(`تم تعديل حجم شريط المهام إلى "${s.label}".`);
                }}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'border-[#DFCA9F] bg-[#DFCA9F]/10 ring-1 ring-[#DFCA9F]'
                    : 'border-white/10 bg-[#171614] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#F8F4EC]">{s.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#DFCA9F]" />}
                </div>
                <p className="text-[11px] text-[#9E988F]">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto-Hide Dock */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#F8F4EC]">إخفاء شريط المهام عند تكبير النوافذ تلقائياً</h3>
          <p className="text-xs text-[#9E988F] max-w-md leading-relaxed">
            إخفاء الشريط السفلي بانسيابية عند تكبير أي نافذة لمنحك شاشة كاملة دون أي حواف.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            updateAppSettings({
              dock: { ...dock, autoHide: !dock.autoHide },
            });
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            dock.autoHide
              ? 'bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] font-bold shadow-lg shadow-[#DFCA9F]/15'
              : 'bg-white/10 text-[#9E988F]'
          }`}
        >
          {dock.autoHide ? 'مفعل' : 'معطل'}
        </button>
      </div>

      {/* Active Dot Indicators */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#F8F4EC]">مؤشرات التطبيقات المفتوحة (Active Pip Indicators)</h3>
          <p className="text-xs text-[#9E988F] max-w-md leading-relaxed">
            إظهار نقطة ضوئية تحت أيقونات التطبيقات النشطة قيد التشغيل في الخلفية.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            updateAppSettings({
              dock: { ...dock, showIndicators: !dock.showIndicators },
            });
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            dock.showIndicators
              ? 'bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] font-bold shadow-lg shadow-[#DFCA9F]/15'
              : 'bg-white/10 text-[#9E988F]'
          }`}
        >
          {dock.showIndicators ? 'مفعل' : 'معطل'}
        </button>
      </div>
    </div>
  );
};

// PANEL 4: AI Companion Settings
export const CompanionSettingsPanel: React.FC = () => {
  const { appSettings, updateAppSettings, setCompanionMessage } = useOS();
  const companion = appSettings.companion;

  return (
    <div className="space-y-6 text-[#F3EFE7] animate-in fade-in duration-200">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-[#F8F4EC] flex items-center gap-2.5">
          <Bot className="w-5.5 h-5.5 text-[#DFCA9F]" />
          <span>المساعد الذكي المقيم (AI Companion)</span>
        </h2>
        <p className="text-xs text-[#9E988F] mt-3.5 leading-relaxed">
          إدارة روبوت المحادثة المساعد في الزاوية السفلى وإرشاداته الأكاديمية
        </p>
      </div>

      {/* Bot Visibility */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
            {companion.botVisible ? <Eye className="w-4 h-4 text-[#DFCA9F]" /> : <EyeOff className="w-4 h-4 text-[#9E988F]" />}
            <span>إظهار المساعد المقيم في زاوية الشاشة</span>
          </h3>
          <p className="text-xs text-[#9E988F] max-w-md leading-relaxed">
            إظهار أيقونة الروبوت التفاعلي الذي يقدم المساعدة والإجابة عن المنحة والأسئلة الشائعة.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            const next = !companion.botVisible;
            updateAppSettings({
              companion: { ...companion, botVisible: next },
            });
            setCompanionMessage(next ? 'أنا هنا لمساعدتك دائماً!' : 'تم إخفاء المساعد.');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            companion.botVisible
              ? 'bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] font-bold shadow-lg shadow-[#DFCA9F]/15'
              : 'bg-white/10 text-[#9E988F]'
          }`}
        >
          {companion.botVisible ? 'ظاهر' : 'مخفي'}
        </button>
      </div>

      {/* Response Tone */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#F8F4EC]">أسلوب المحادثة والإجابات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'concise', name: 'موجز وسريع (Concise)', desc: 'إجابات مباشرة ومختصرة بأقل عدد من الكلمات' },
            { id: 'detailed', name: 'أكاديمي تنفيذي (Detailed)', desc: 'شروحات وافية مدعومة بالأمثلة والخطوات العملية' },
            { id: 'academic', name: 'توجيهي دقيق (Mentor)', desc: 'نصائح تدريبية وإرشادات مخصصة لطلاب المنحة' },
          ].map((tone) => {
            const isSelected = companion.responseTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => {
                  soundFx.playClick(550, 0.03);
                  updateAppSettings({
                    companion: { ...companion, responseTone: tone.id as any },
                  });
                }}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'border-[#DFCA9F] bg-[#DFCA9F]/10 ring-1 ring-[#DFCA9F]'
                    : 'border-white/10 bg-[#171614] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#F8F4EC]">{tone.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#DFCA9F]" />}
                </div>
                <p className="text-[11px] text-[#9E988F]">{tone.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// PANEL 5: Focus & Study Productivity
export const FocusSettingsPanel: React.FC = () => {
  const { appSettings, updateAppSettings, setCompanionMessage } = useOS();
  const focus = appSettings.focus;

  return (
    <div className="space-y-6 text-[#F3EFE7] animate-in fade-in duration-200">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-[#F8F4EC] flex items-center gap-2.5">
          <Flame className="w-5.5 h-5.5 text-[#DFCA9F]" />
          <span>بيئة التركيز والدراسة (Study Focus)</span>
        </h2>
        <p className="text-xs text-[#9E988F] mt-3.5 leading-relaxed">
          أدوات الإنتاجية لتعزيز التركيز الأكاديمي وإزالة المشتتات
        </p>
      </div>

      {/* Focus Mode */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DFCA9F]" />
            <span>نمط التركيز العميق (Deep Focus Mode)</span>
          </h3>
          <p className="text-xs text-[#9E988F] max-w-md leading-relaxed">
            تعتيم عناصر سطح المكتب المحيطة للتركيز الكامل على النافذة النشطة أثناء المذاكرة أو حل المهام.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            const next = !focus.focusModeEnabled;
            updateAppSettings({
              focus: { ...focus, focusModeEnabled: next },
            });
            setCompanionMessage(
              next ? 'تم تفعيل نمط التركيز! تمنياتنا لك بجلسة عمل مثمرة.' : 'تم إلغاء نمط التركيز.'
            );
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            focus.focusModeEnabled
              ? 'bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] font-bold shadow-lg shadow-[#DFCA9F]/15'
              : 'bg-white/10 text-[#9E988F]'
          }`}
        >
          {focus.focusModeEnabled ? 'مفعل' : 'معطل'}
        </button>
      </div>

      {/* 24h Clock format */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#DFCA9F]" />
            <span>تنسيق الوقت 24 ساعة</span>
          </h3>
          <p className="text-xs text-[#9E988F] max-w-md leading-relaxed">
            عرض الوقت بنظام 24 ساعة بدلاً من نظام 12 ساعة (ص/م).
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            updateAppSettings({
              focus: { ...focus, clockFormat24h: !focus.clockFormat24h },
            });
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            focus.clockFormat24h
              ? 'bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] font-bold shadow-lg shadow-[#DFCA9F]/15'
              : 'bg-white/10 text-[#9E988F]'
          }`}
        >
          {focus.clockFormat24h ? '24 ساعة' : '12 ساعة'}
        </button>
      </div>
    </div>
  );
};

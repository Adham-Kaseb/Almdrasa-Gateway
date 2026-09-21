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
  Palette,
  Sparkles,
  GraduationCap,
  CalendarDays,
  FileText,
  Settings,
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { soundFx } from '../../../utils/audio';
import { DOCK_THEME_PRESETS, resolveDockThemeStyle } from '../../../data/dockThemes';
import { DockThemePresetId } from '../../../types/os';

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
      </div>

      {/* Master Mute & Volume */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-[#F8F4EC]">تفعيل المؤثرات الصوتية العامة</h3>
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

  const sizes: { id: 'compact' | 'normal' | 'large'; label: string }[] = [
    { id: 'compact', label: 'مدمج (Compact)' },
    { id: 'normal', label: 'قياسي (Standard)' },
    { id: 'large', label: 'كبير (Large)' },
  ];

  return (
    <div className="space-y-6 text-[#F3EFE7] animate-in fade-in duration-200">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-[#F8F4EC] flex items-center gap-2.5">
          <LayoutGrid className="w-5.5 h-5.5 text-[#DFCA9F]" />
          <span>شريط المهام وسطح المكتب</span>
        </h2>
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
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#DFCA9F] bg-[#DFCA9F]/10 ring-1 ring-[#DFCA9F]'
                    : 'border-white/10 bg-[#171614] hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold text-[#F8F4EC]">{s.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#DFCA9F]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto-Hide Dock */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#F8F4EC]">إخفاء شريط المهام عند تكبير النوافذ تلقائياً</h3>
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
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#F8F4EC]">مؤشرات التطبيقات المفتوحة (Active Pip Indicators)</h3>
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

      {/* Dock Themes & Color Customization */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#DFCA9F]" />
            <h3 className="text-sm font-semibold text-[#F8F4EC]">مظهر وألوان أيقونات شريط المهام (Dock Themes)</h3>
          </div>
          <span className="text-[11px] text-[#DFCA9F] font-mono">
            {dock.theme?.preset === 'custom' ? 'تخصيص حر' : DOCK_THEME_PRESETS.find(p => p.id === dock.theme?.preset)?.name || 'الذهب الملكي'}
          </span>
        </div>

        {/* Live Mini Dock Preview */}
        <div className="p-4 rounded-2xl bg-[#0B0B0A]/80 border border-white/10 flex flex-col items-center gap-2">
          <span className="text-[10px] text-[#9E988F] uppercase tracking-wider font-mono">معاينة حية لشريط المهام</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#141311]/90 border border-white/10 shadow-lg">
            {/* Settings Preview */}
            <div
              style={{
                borderColor: resolveDockThemeStyle(dock.theme).borderColor,
                backgroundColor: resolveDockThemeStyle(dock.theme).customBg,
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${resolveDockThemeStyle(dock.theme).bgClass}`}
            >
              <Settings className="w-4.5 h-4.5 stroke-[2.2]" style={{ color: resolveDockThemeStyle(dock.theme).iconColor }} />
            </div>
            <div className="w-px h-5 bg-white/15 mx-0.5" />
            {/* App 1 Preview */}
            <div
              style={{
                borderColor: resolveDockThemeStyle(dock.theme).borderColor,
                backgroundColor: resolveDockThemeStyle(dock.theme).customBg,
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${resolveDockThemeStyle(dock.theme).bgClass}`}
            >
              <GraduationCap className="w-4.5 h-4.5 stroke-[2.2]" style={{ color: resolveDockThemeStyle(dock.theme).iconColor }} />
            </div>
            {/* App 2 Preview */}
            <div
              style={{
                borderColor: resolveDockThemeStyle(dock.theme).borderColor,
                backgroundColor: resolveDockThemeStyle(dock.theme).customBg,
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${resolveDockThemeStyle(dock.theme).bgClass}`}
            >
              <CalendarDays className="w-4.5 h-4.5 stroke-[2.2]" style={{ color: resolveDockThemeStyle(dock.theme).iconColor }} />
            </div>
            {/* App 3 Preview */}
            <div
              style={{
                borderColor: resolveDockThemeStyle(dock.theme).borderColor,
                backgroundColor: resolveDockThemeStyle(dock.theme).customBg,
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${resolveDockThemeStyle(dock.theme).bgClass}`}
            >
              <FileText className="w-4.5 h-4.5 stroke-[2.2]" style={{ color: resolveDockThemeStyle(dock.theme).iconColor }} />
            </div>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOCK_THEME_PRESETS.map((preset) => {
            const isSelected = dock.theme?.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  soundFx.playClick(600, 0.03);
                  updateAppSettings({
                    dock: {
                      ...dock,
                      theme: {
                        preset: preset.id as DockThemePresetId,
                        customIconColor: preset.iconColor,
                        customBgColor: preset.previewBg,
                        customBorderColor: preset.borderHoverColor,
                      },
                    },
                  });
                  setCompanionMessage(`تم تفعيل سمة شريط المهام: "${preset.name}".`);
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#DFCA9F] bg-[#DFCA9F]/10 ring-1 ring-[#DFCA9F]'
                    : 'border-white/10 bg-[#171614] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Preset Swatch Icon */}
                  <div
                    style={{
                      borderColor: preset.borderColor,
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${preset.bgGradient} shadow-md shrink-0`}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: preset.iconColor }} />
                  </div>
                  <span className="text-xs font-bold text-[#F8F4EC]">{preset.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#DFCA9F] shrink-0" />}
              </button>
            );
          })}

          {/* Custom Theme Card */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick(600, 0.03);
              updateAppSettings({
                dock: {
                  ...dock,
                  theme: {
                    preset: 'custom',
                    customIconColor: dock.theme?.customIconColor || '#DFCA9F',
                    customBgColor: dock.theme?.customBgColor || '#1C1B18',
                    customBorderColor: dock.theme?.customBorderColor || '#DFCA9F',
                  },
                },
              });
              setCompanionMessage('تم تفعيل نمط التخصيص الحر لأيقونات شريط المهام.');
            }}
            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
              dock.theme?.preset === 'custom'
                ? 'border-[#DFCA9F] bg-[#DFCA9F]/10 ring-1 ring-[#DFCA9F]'
                : 'border-white/10 bg-[#171614] hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  borderColor: dock.theme?.customBorderColor || '#DFCA9F',
                  backgroundColor: dock.theme?.customBgColor || '#1C1B18',
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-md shrink-0"
              >
                <Palette className="w-4 h-4" style={{ color: dock.theme?.customIconColor || '#DFCA9F' }} />
              </div>
              <span className="text-xs font-bold text-[#F8F4EC]">نمط مخصص بالكامل (Custom)</span>
            </div>
            {dock.theme?.preset === 'custom' && <Check className="w-4 h-4 text-[#DFCA9F] shrink-0" />}
          </button>
        </div>

        {/* Custom Color Controls (when custom is active) */}
        {dock.theme?.preset === 'custom' && (
          <div className="p-4 rounded-2xl bg-[#171614] border border-[#DFCA9F]/30 space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-semibold text-[#DFCA9F] flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>محدد الألوان المتقدم</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1. Icon Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#C8C2B7] font-medium block">لون الأيقونات</label>
                <div className="flex items-center gap-2 bg-[#0B0B0A] p-1.5 rounded-xl border border-white/10">
                  <input
                    type="color"
                    value={dock.theme?.customIconColor || '#DFCA9F'}
                    onChange={(e) =>
                      updateAppSettings({
                        dock: {
                          ...dock,
                          theme: {
                            ...dock.theme,
                            preset: 'custom',
                            customIconColor: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={dock.theme?.customIconColor || '#DFCA9F'}
                    onChange={(e) =>
                      updateAppSettings({
                        dock: {
                          ...dock,
                          theme: {
                            ...dock.theme,
                            preset: 'custom',
                            customIconColor: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full bg-transparent text-xs text-[#F8F4EC] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Container Background Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#C8C2B7] font-medium block">لون خلفية الأيقونة</label>
                <div className="flex items-center gap-2 bg-[#0B0B0A] p-1.5 rounded-xl border border-white/10">
                  <input
                    type="color"
                    value={dock.theme?.customBgColor || '#1C1B18'}
                    onChange={(e) =>
                      updateAppSettings({
                        dock: {
                          ...dock,
                          theme: {
                            ...dock.theme,
                            preset: 'custom',
                            customBgColor: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={dock.theme?.customBgColor || '#1C1B18'}
                    onChange={(e) =>
                      updateAppSettings({
                        dock: {
                          ...dock,
                          theme: {
                            ...dock.theme,
                            preset: 'custom',
                            customBgColor: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full bg-transparent text-xs text-[#F8F4EC] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Border & Glow Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#C8C2B7] font-medium block">لون الإطار والتوهج</label>
                <div className="flex items-center gap-2 bg-[#0B0B0A] p-1.5 rounded-xl border border-white/10">
                  <input
                    type="color"
                    value={dock.theme?.customBorderColor || '#DFCA9F'}
                    onChange={(e) =>
                      updateAppSettings({
                        dock: {
                          ...dock,
                          theme: {
                            ...dock.theme,
                            preset: 'custom',
                            customBorderColor: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={dock.theme?.customBorderColor || '#DFCA9F'}
                    onChange={(e) =>
                      updateAppSettings({
                        dock: {
                          ...dock,
                          theme: {
                            ...dock.theme,
                            preset: 'custom',
                            customBorderColor: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full bg-transparent text-xs text-[#F8F4EC] font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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
      </div>

      {/* Bot Visibility */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
            {companion.botVisible ? <Eye className="w-4 h-4 text-[#DFCA9F]" /> : <EyeOff className="w-4 h-4 text-[#9E988F]" />}
            <span>إظهار المساعد المقيم في زاوية الشاشة</span>
          </h3>
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
            { id: 'concise', name: 'موجز وسريع (Concise)' },
            { id: 'detailed', name: 'أكاديمي تنفيذي (Detailed)' },
            { id: 'academic', name: 'توجيهي دقيق (Mentor)' },
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
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#DFCA9F] bg-[#DFCA9F]/10 ring-1 ring-[#DFCA9F]'
                    : 'border-white/10 bg-[#171614] hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold text-[#F8F4EC]">{tone.name}</span>
                {isSelected && <Check className="w-4 h-4 text-[#DFCA9F]" />}
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
      </div>

      {/* Focus Mode */}
      <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DFCA9F]" />
            <span>نمط التركيز العميق (Deep Focus Mode)</span>
          </h3>
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
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#DFCA9F]" />
            <span>تنسيق الوقت 24 ساعة</span>
          </h3>
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

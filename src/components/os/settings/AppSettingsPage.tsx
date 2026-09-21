import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  LayoutGrid,
  Bot,
  Flame,
  Palette,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { useAuth } from '../../../context/AuthContext';
import { soundFx } from '../../../utils/audio';
import { DEFAULT_APP_SETTINGS } from '../../../types/os';
import { BackgroundSettingsPanel } from './BackgroundSettingsPanel';
import {
  AudioSettingsPanel,
  DockSettingsPanel,
  CompanionSettingsPanel,
  FocusSettingsPanel,
} from './ExperiencePanels';

export type SettingsTabId =
  | 'background'
  | 'audio'
  | 'dock'
  | 'companion'
  | 'focus';

interface SettingsTab {
  id: SettingsTabId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    id: 'background',
    label: 'خيارات ومظهر الخلفية',
    sublabel: 'الخلفيات الثابتة وتدرجات الشيدر الحية',
    icon: <Palette className="w-4.5 h-4.5" />,
  },
  {
    id: 'audio',
    label: 'الصوت والمؤثرات',
    sublabel: 'أصوات النوافذ وشريط المهام والمستوى',
    icon: <Volume2 className="w-4.5 h-4.5" />,
  },
  {
    id: 'dock',
    label: 'شريط المهام وسطح المكتب',
    sublabel: 'حجم الأيقونات، الإخفاء، والمؤشرات',
    icon: <LayoutGrid className="w-4.5 h-4.5" />,
  },
  {
    id: 'companion',
    label: 'المساعد الذكي المقيم',
    sublabel: 'روبوت المساعدة، التلميحات، ونبرة الرد',
    icon: <Bot className="w-4.5 h-4.5" />,
  },
  {
    id: 'focus',
    label: 'بيئة التركيز والدراسة',
    sublabel: 'وضع الدراسة المفرغ وتنسيق الوقت',
    icon: <Flame className="w-4.5 h-4.5" />,
  },
];

export const AppSettingsPage: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, updateAppSettings, setCompanionMessage } = useOS();
  const { student, signOut, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTabId>('background');

  // Close on Escape key
  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        soundFx.playClick(300, 0.03);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    soundFx.playClick(350, 0.03);
    setIsSettingsOpen(false);
  };

  const handleResetAll = () => {
    if (window.confirm('هل تريد استعادة جميع إعدادات النظام إلى الوضع الافتراضي؟')) {
      updateAppSettings(DEFAULT_APP_SETTINGS);
      soundFx.playPop();
      setCompanionMessage('تمت استعادة كافة إعدادات النظام الافتراضية.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0E0D0C]/95 backdrop-blur-3xl text-[#F3EFE7] overflow-hidden select-none"
      dir="rtl"
    >
      {/* Top Navigation Bar */}
      <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-[#141311]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F8F4EC] hover:text-[#DFCA9F] transition-all cursor-pointer group shadow-xs"
            title="العودة إلى سطح المكتب (Esc)"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <span>العودة إلى سطح المكتب</span>
            <span className="text-[10px] text-[#9E988F] font-mono">(Esc)</span>
          </button>

          <div className="h-4 w-px bg-white/15 mx-1" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#DFCA9F]/20 to-[#CCA868]/10 border border-[#DFCA9F]/30 flex items-center justify-center text-[#DFCA9F]">
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-[#F8F4EC] tracking-tight">
                إعدادات النظام والتخصيص
              </h1>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Student Profile Info */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-[#DFCA9F]/20 text-[#DFCA9F] flex items-center justify-center">
              {student?.avatar_url ? (
                <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-[#F8F4EC] leading-tight">
                {student?.full_name || (isGuest ? 'طالب زائر' : 'طالب المنحة')}
              </span>
              <span className="text-[10px] text-[#9E988F]">
                {student?.email || (isGuest ? 'وضع الاستعراض' : '')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#9E988F] hover:text-[#DFCA9F] hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
            title="استعادة الإعدادات الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">استعادة الضبط</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              if (window.confirm('هل ترغب في تسجيل الخروج والعودة لصفحة الدخول؟')) {
                await signOut();
                setIsSettingsOpen(false);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-300 hover:text-red-200 bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 transition-all cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      {/* Main Settings Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs List */}
        <aside className="w-64 sm:w-72 border-l border-white/10 bg-[#12110F]/60 p-4 flex flex-col gap-1.5 shrink-0 overflow-y-auto no-scrollbar">
          <div className="text-[11px] font-bold text-[#9E988F] px-3 py-1 uppercase tracking-wider mb-1">
            أقسام التحكم والتخصيص
          </div>

          {SETTINGS_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundFx.playClick(500, 0.02);
                  setActiveTab(tab.id);
                }}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl text-right transition-all cursor-pointer relative group ${
                  isActive
                    ? 'bg-linear-to-r from-[#DFCA9F]/15 to-[#DFCA9F]/5 border border-[#DFCA9F]/30 text-[#F8F4EC] shadow-sm'
                    : 'text-[#9E988F] hover:text-[#F3EFE7] hover:bg-white/5 border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#DFCA9F] text-[#141310] shadow-md shadow-[#DFCA9F]/20'
                      : 'bg-white/5 text-[#9E988F] group-hover:text-[#F8F4EC]'
                  }`}
                >
                  {tab.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-bold truncate block ${
                      isActive ? 'text-[#DFCA9F]' : 'text-[#F8F4EC]'
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Content Panel Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl mx-auto w-full no-scrollbar">
          {activeTab === 'background' && <BackgroundSettingsPanel />}
          {activeTab === 'audio' && <AudioSettingsPanel />}
          {activeTab === 'dock' && <DockSettingsPanel />}
          {activeTab === 'companion' && <CompanionSettingsPanel />}
          {activeTab === 'focus' && <FocusSettingsPanel />}
        </main>
      </div>
    </motion.div>
  );
};

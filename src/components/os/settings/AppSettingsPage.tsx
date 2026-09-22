import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  LayoutGrid,
  Bot,
  Flame,
  Palette,
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { soundFx } from '../../../utils/audio';
import { DEFAULT_APP_SETTINGS } from '../../../types/os';
import { SettingsHeader } from './SettingsHeader';
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
      {/* Top Luxury Navigation Bar */}
      <SettingsHeader
        onClose={handleClose}
        onResetAll={handleResetAll}
      />

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

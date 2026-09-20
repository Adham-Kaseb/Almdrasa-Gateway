import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  User,
  FolderGit2,
  Terminal,
  BookOpen,
  Volume2,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { soundFx } from '../../utils/audio';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  action: () => void;
  icon: React.ReactNode;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    openWindow,
    toggleMute,
    profile,
    setCompanionMessage,
  } = useOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    {
      id: 'app-scholarship',
      title: 'تفاصيل ومميزات منحة المدرسة',
      category: 'المنحة',
      action: () => openWindow('scholarship'),
      icon: <GraduationCap className="w-4 h-4 text-[#D8BC88]" />,
    },
    {
      id: 'app-faqs',
      title: 'الأسئلة الأكثر شيوعاً حول المنحة (FAQs)',
      category: 'المنحة',
      action: () => openWindow('faqs'),
      icon: <HelpCircle className="w-4 h-4 text-[#D8BC88]" />,
    },
    {
      id: 'app-elimination',
      title: 'نظام الإقصاء الخاص بالمنحة (الضوابط والمراحل)',
      category: 'المنحة',
      action: () => openWindow('elimination'),
      icon: <ShieldAlert className="w-4 h-4 text-[#D8BC88]" />,
    },
    {
      id: 'app-home',
      title: 'فتح النافذة الرئيسية',
      category: 'تنقل',
      action: () => openWindow('home'),
      icon: <Command className="w-4 h-4 text-[#C5B79E]" />,
    },
    {
      id: 'app-about',
      title: 'الملف التعريفي والشهادات المهنية (CV)',
      category: 'تنقل',
      action: () => openWindow('about'),
      icon: <User className="w-4 h-4 text-[#C5B79E]" />,
    },
    {
      id: 'app-projects',
      title: 'استعراض المشاريع والأنظمة الهندسية',
      category: 'تنقل',
      action: () => openWindow('projects'),
      icon: <FolderGit2 className="w-4 h-4 text-[#C5B79E]" />,
    },
    {
      id: 'app-terminal',
      title: 'تشغيل الطرفية التفاعلية (Terminal)',
      category: 'مطورين',
      action: () => openWindow('terminal'),
      icon: <Terminal className="w-4 h-4 text-[#C5B79E]" />,
    },
    {
      id: 'app-notes',
      title: 'فتح الملاحظات وسجل القيادة المعمارية',
      category: 'تنقل',
      action: () => openWindow('notes'),
      icon: <BookOpen className="w-4 h-4 text-[#C5B79E]" />,
    },
    {
      id: 'action-mute',
      title: 'كتم / تفعيل المؤثرات الصوتية اللمسية',
      category: 'تفضيلات',
      action: () => toggleMute(),
      icon: <Volume2 className="w-4 h-4 text-[#C5B79E]" />,
    },
    {
      id: 'action-copy',
      title: 'نسخ ملخص السيرة الذاتية التنفيذية',
      category: 'إجراءات',
      action: () => {
        navigator.clipboard?.writeText?.(profile.bioSummary);
        setCompanionMessage('تم نسخ السيرة الذاتية إلى الحافظة بنجاح!');
      },
      icon: <Sparkles className="w-4 h-4 text-[#C5B79E]" />,
    },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        soundFx.playPop();
        filteredItems[selectedIndex].action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-2147483647 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setCommandPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="لوحة الأوامر والبحث الفوري"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#141311] border border-white/14 shadow-[0_36px_100px_rgba(0,0,0,0.8)] overflow-hidden text-[#F3EFE7]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-[#8E887F]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في التطبيقات أو اكتب أمراً..."
            style={{ color: '#F8F4EC' }}
            className="flex-1 bg-transparent text-[14px] placeholder:text-[#756F66] focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#8E887F]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#756F66]">
              لا توجد نتائج مطابقة لأمر البحث.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-right transition-colors ${
                    isSelected
                      ? 'bg-[#2F6FCE] text-white'
                      : 'hover:bg-white/6 text-[#F3EFE7]/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-1 rounded-md ${isSelected ? 'text-white' : 'text-[#C5B79E]'}`}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-[13px] font-medium">{item.title}</div>
                      <div className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#756F66]'}`}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowLeft className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 border-t border-white/8 bg-[#0B0B0A] flex items-center justify-between text-[11px] text-[#756F66]">
          <div className="flex items-center gap-3">
            <span>التنقل <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↓</kbd></span>
            <span>الاختيار <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↵</kbd></span>
          </div>
          <span>البحث الفوري Spotlight</span>
        </div>
      </div>
    </div>
  );
};

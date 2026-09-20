import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Sun,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { soundFx } from '../../utils/audio';

export const TopMenuBar: React.FC = () => {
  const {
    openWindow,
    setCommandPaletteOpen,
    profile,
    setCompanionMessage,
  } = useOS();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [lang, setLang] = useState<'AR' | 'EN'>('AR');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Real-time clock in Arabic: e.g. "السبت، 19 سبتمبر 01:31 م"
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const dayNum = now.getDate();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'م' : 'ص';
      hours = hours % 12 || 12;
      const hoursStr = String(hours).padStart(2, '0');
      setCurrentTime(`${dayName}، ${dayNum} ${monthName} ${hoursStr}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    soundFx.playPop();
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const menuItems: Record<string, { label: string; action: () => void; shortcut?: string }[]> = {
    'نظام Almdrasa Gateway': [
      { label: 'حول نظام Almdrasa Gateway', action: () => openWindow('about'), shortcut: '⌥A' },
      { label: 'الملف التنفيذي الشامل', action: () => openWindow('home'), shortcut: '⌘H' },
      { label: 'لوحة الأوامر والبحث', action: () => setCommandPaletteOpen(true), shortcut: '⌘K' },
      { label: 'حالة الأمان السيبراني', action: () => setCompanionMessage('النظام مشفر بالكامل وجميع المؤشرات طبيعية.'), shortcut: '⇧S' },
    ],
    ملف: [
      { label: 'فتح سجل المشاريع', action: () => openWindow('projects'), shortcut: '⌘P' },
      { label: 'الملاحظات المعمارية', action: () => openWindow('notes'), shortcut: '⌘N' },
      { label: 'تشغيل الطرفية الذكية', action: () => openWindow('terminal'), shortcut: '⌘T' },
    ],
    تعديل: [
      {
        label: 'نسخ السيرة الذاتية',
        action: () => {
          navigator.clipboard?.writeText?.(profile.bioSummary);
          setCompanionMessage('تم نسخ السيرة الذاتية إلى الحافظة بنجاح!');
        },
      },
      { label: 'تحديد كافة العقد السحابية', action: () => setCompanionMessage('تم تحديد كافة العقد السحابية العالمية (عقدتان نشطتان).') },
    ],
    عرض: [
      {
        label: 'ملء الشاشة',
        action: () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        },
        shortcut: 'F11',
      },
      { label: 'إعادة تعيين ترتيب النوافذ', action: () => window.location.reload() },
    ],
    نوافذ: [
      { label: 'إظهار النافذة الرئيسية', action: () => openWindow('home') },
      { label: 'إظهار المشاريع الهندسية', action: () => openWindow('projects') },
      { label: 'إظهار قائمة العملاء والشركاء', action: () => openWindow('clients') },
      { label: 'إظهار طرفية الاستوديو', action: () => openWindow('terminal') },
    ],
    مساعدة: [
      { label: 'جولة تفاعلية في النظام', action: () => setCompanionMessage('اسحب أي نافذة من شريط العنوان، أو انقر نقراً مزدوجاً على الأيقونات الجانبية!') },
      { label: 'اختصارات لوحة المفاتيح (⌘K)', action: () => setCommandPaletteOpen(true) },
    ],
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-9 z-2147483647 flex items-center justify-between px-3.5 select-none text-[13px] font-medium text-[#F3EFE7] bg-[#0B0B0A]/90 backdrop-blur-md border-b border-white/8"
      role="banner"
    >
      {/* Right Menu Section (In RTL, this is the start/right side) */}
      <div className="flex items-center gap-4" ref={menuRef}>
        {/* Monogram Badge (RI) */}
        <button
          type="button"
          onClick={() => handleMenuClick('نظام Almdrasa Gateway')}
          className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center text-[9px] font-serif font-bold text-[#F8F4EC] bg-[#0B0B0A] hover:border-white transition-all hover:scale-105"
          aria-label="قائمة النظام الرئيسية"
        >
          RI
        </button>

        {/* System Dropdown Menus */}
        <nav className="flex items-center gap-2">
          {Object.keys(menuItems).map((menu) => (
            <div key={menu} className="relative">
              <button
                type="button"
                onClick={() => handleMenuClick(menu)}
                className={`px-1.5 py-0.5 rounded transition-colors text-[13px] ${
                  menu === 'نظام Almdrasa Gateway'
                    ? 'font-bold text-white'
                    : activeMenu === menu
                    ? 'bg-white/10 text-white'
                    : 'text-[#F3EFE7]/80 hover:text-white'
                }`}
                aria-haspopup="true"
                aria-expanded={activeMenu === menu}
              >
                {menu}
              </button>

              {/* Dropdown Menu */}
              {activeMenu === menu && (
                <div
                  className="absolute right-0 mt-1.5 w-60 rounded-xl bg-[#141311]/95 backdrop-blur-xl border border-white/12 py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-2147483647 text-right"
                  role="menu"
                >
                  {menuItems[menu].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        item.action();
                        setActiveMenu(null);
                      }}
                      className="w-full text-right px-3.5 py-1.5 text-[13px] text-[#F3EFE7]/90 hover:bg-[#2F6FCE] hover:text-white flex items-center justify-between transition-colors"
                      role="menuitem"
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[11px] opacity-60 font-mono dir-ltr">{item.shortcut}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Left Controls Section (In RTL, this is the end/left side) */}
      <div className="flex items-center gap-3">
        {/* Live Chat / Status indicator: • محادثة مباشرة 👤 7 */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#F3EFE7]/90">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FCE] animate-pulse" />
          <span className="font-medium">محادثة مباشرة</span>
          <span className="text-[#8e887f] flex items-center gap-0.5 mr-0.5">
            <span className="text-[11px]">👤</span> 7
          </span>
        </div>

        {/* Language selector */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setLang((prev) => (prev === 'AR' ? 'EN' : 'AR'));
          }}
          className="hover:text-white text-[12px] font-medium text-[#F3EFE7]/85 transition-colors px-1"
          aria-label="تبديل اللغة"
        >
          {lang === 'AR' ? 'عربي' : 'EN'}
        </button>

        {/* Brightness / Sun toggle icon */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setCompanionMessage('تم ضبط الإضاءة المحيطية بنجاح.');
          }}
          className="p-0.5 hover:text-white text-[#F3EFE7]/80 transition-colors"
          aria-label="تبديل وضع الإضاءة"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              setShowNotificationToast((p) => !p);
            }}
            className="p-0.5 hover:text-white text-[#F3EFE7]/80 transition-colors"
            aria-label="عرض الإشعارات"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {showNotificationToast && (
            <div className="absolute left-0 mt-2 w-72 p-3 rounded-xl bg-[#141311]/95 backdrop-blur-xl border border-white/12 shadow-2xl z-2147483647 text-right">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/8 text-[11px] font-semibold text-[#c5b79e]">
                <span>إشعارات النظام</span>
                <span className="text-[#9fa994]">طبيعية ومؤمنة</span>
              </div>
              <p className="text-[12px] text-[#F3EFE7] mt-2 font-medium">
                نظام Almdrasa Gateway جاهز ويعمل بكفاءة
              </p>
              <p className="text-[11px] text-[#756f66] mt-0.5 leading-relaxed">
                كافة العقد التقنية متصلة ومزامنة عبر القياس عن بُعد.
              </p>
            </div>
          )}
        </div>

        {/* Search magnifying glass icon */}
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            setCommandPaletteOpen(true);
          }}
          className="p-0.5 hover:text-white text-[#F3EFE7]/80 transition-colors"
          aria-label="فتح شريط البحث الفوري (⌘K)"
          title="بحث فوري (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Profile Avatar thumbnail */}
        <button
          type="button"
          onClick={() => openWindow('about')}
          className="w-5 h-5 rounded-full overflow-hidden border border-white/30 hover:border-white transition-all mr-0.5"
          aria-label="عرض الملف التعريفي"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </button>

        {/* Live Clock */}
        <div className="pr-1 font-medium text-[12px] tracking-tight text-[#F3EFE7]/90">
          {currentTime || 'السبت، 19 سبتمبر 01:31 م'}
        </div>
      </div>
    </header>
  );
};

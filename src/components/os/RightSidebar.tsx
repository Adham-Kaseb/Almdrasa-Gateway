import React, { useEffect } from 'react';
import {
  ExternalLink,
  Shield,
  Code2,
  FileText,
  BrainCircuit,
  Globe,
  Briefcase,
  FolderArchive,
  BookOpen,
  Terminal,
  Bot,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { INITIAL_ACTIVITY_POSTS, INITIAL_SHORTCUTS, INITIAL_TIPS } from '../../data/osData';
import { soundFx } from '../../utils/audio';

export const RightSidebar: React.FC = () => {
  const {
    openWindow,
    activeTipIndex,
    setActiveTipIndex,
    telemetryLogs,
    locationNodes,
    profile,
  } = useOS();

  // Auto-advance tips every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % INITIAL_TIPS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [setActiveTipIndex]);

  const currentTip = INITIAL_TIPS[activeTipIndex] || INITIAL_TIPS[0];

  const getShortcutIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderArchive':
        return <FolderArchive className="w-4 h-4 text-[#F8F4EC]" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-[#F8F4EC]" />;
      case 'CodeXml':
        return <Code2 className="w-4 h-4 text-[#F8F4EC]" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-4 h-4 text-[#F8F4EC]" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-[#F8F4EC]" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-[#F8F4EC]" />;
      default:
        return <FileText className="w-4 h-4 text-[#F8F4EC]" />;
    }
  };

  return (
    <aside
      className="hidden xl:flex flex-col gap-3.5 w-71.25 shrink-0 select-none pb-24 z-20 overflow-y-auto max-h-[calc(100vh-60px)] pr-1"
      aria-label="Desktop Widgets"
    >
      {/* Widget 1: ON LINKEDIN / RECENT INSIGHTS */}
      <section className="p-4 rounded-[20px] bg-[#141311]/90 backdrop-blur-xl border border-white/11 shadow-[0_20px_55px_0_rgba(0,0,0,0.34)]">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider pb-2.5 border-b border-white/8">
          <span className="text-[#B8B1A5]">على لينكد إن</span>
          <a
            href={profile.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="text-[#2F6FCE] hover:text-[#5B95E8] flex items-center gap-1 transition-colors font-normal"
          >
            <span>الملف الشخصي</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="mt-3 space-y-3">
          {INITIAL_ACTIVITY_POSTS.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-2.5 group cursor-pointer"
              onClick={() => {
                soundFx.playClick();
                window.open(profile.linkedInUrl, '_blank');
              }}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:border-white/30 transition-colors">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] leading-snug text-[#F3EFE7]/90 font-medium line-clamp-2 group-hover:text-white transition-colors">
                  {post.snippet}
                </p>
                <span className="text-[9px] font-mono text-[#756F66] tracking-wider uppercase mt-1 block">
                  {post.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Widget 2: TIPS CAROUSEL */}
      <section className="p-4 rounded-[20px] bg-[#141311]/90 backdrop-blur-xl border border-white/11 shadow-[0_20px_55px_0_rgba(0,0,0,0.34)] flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B8B1A5] pb-2 border-b border-white/8">
            {currentTip.tag}
          </div>

          <div className="mt-3 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#292724] border border-white/10 flex items-center justify-center text-[#C5B79E] shrink-0 mt-0.5">
              {currentTip.actionWindowId === 'terminal' ? (
                <Terminal className="w-3.5 h-3.5" />
              ) : currentTip.id === 'tip-5' ? (
                <Bot className="w-3.5 h-3.5" />
              ) : (
                <Code2 className="w-3.5 h-3.5" />
              )}
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-[#F3EFE7]">
                {currentTip.title}
              </h4>
              <p className="text-[11px] text-[#A69F93] mt-1 leading-snug">
                {currentTip.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              openWindow(currentTip.actionWindowId);
            }}
            className="mt-3 text-[12px] font-medium text-[#2F6FCE] hover:text-[#5B95E8] flex items-center gap-1 transition-colors"
          >
            <span>{currentTip.actionText}</span>
          </button>
        </div>

        {/* Carousel Pagination Dots matching design tokens: active button width 22px */}
        <div className="mt-4 pt-2 border-t border-white/8 flex items-center justify-center gap-1.5 mobile-applications-pagination">
          {INITIAL_TIPS.map((_, idx) => {
            const isActive = idx === activeTipIndex;
            return (
              <button
                key={idx}
                type="button"
                aria-label={`الانتقال إلى الإرشاد ${idx + 1}`}
                aria-current={isActive ? 'true' : 'false'}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTipIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-5.5 bg-[#F8F4EC]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* Widget 3: SHORTCUTS (2x3 Grid) */}
      <section className="p-4 rounded-[20px] bg-[#141311]/90 backdrop-blur-xl border border-white/11 shadow-[0_20px_55px_0_rgba(0,0,0,0.34)]">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B8B1A5] pb-2 border-b border-white/8">
          اختصارات سريعة
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {INITIAL_SHORTCUTS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                soundFx.playPop();
                openWindow(sc.targetWindow);
              }}
              className="p-2 rounded-xl bg-[#1B1A18] hover:bg-[#262421] border border-white/8 hover:border-white/20 transition-all flex items-center gap-2 text-right group hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <div className="w-6 h-6 rounded-lg bg-[#292724] group-hover:bg-[#34312B] flex items-center justify-center shrink-0 border border-white/10">
                {getShortcutIcon(sc.icon)}
              </div>
              <span className="text-[11px] font-medium text-[#F3EFE7]/90 group-hover:text-white truncate">
                {sc.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Widget 4: Security system / TELEMETRY STREAM */}
      <section className="p-4 rounded-[20px] bg-[#141311]/90 backdrop-blur-xl border border-white/11 shadow-[0_20px_55px_0_rgba(0,0,0,0.34)]">
        <div className="flex items-center gap-2 pb-2 border-b border-white/8">
          <Shield className="w-3.5 h-3.5 text-[#2F6FCE]" />
          <span className="text-[12px] font-semibold text-[#F3EFE7]">
            نظام الأمان السيبراني
          </span>
        </div>

        {/* Active Node Locations: Dusseldorf · Dehra Dun */}
        <div className="flex items-center gap-2 mt-2.5 text-[11px]">
          {locationNodes.map((node) => (
            <div
              key={node.city}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/6 border border-white/8 text-[#D4CFC5]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9FA994] animate-pulse" />
              <span className="font-medium text-[10.5px]">{node.city}</span>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-mono text-[#756F66] mt-1.5">
          عقدتان نشطتان الآن
        </div>

        {/* Live Event Stream */}
        <div className="mt-2.5 p-2 rounded-xl bg-[#080807] border border-white/6 font-mono text-[10px] space-y-1 text-[#8E887F] max-h-24 overflow-hidden">
          {telemetryLogs.slice(-4).map((log) => (
            <div key={log.id} className="flex items-center justify-between">
              <span className="text-[#5A554E]">{log.timeStr}</span>
              <span className={log.type === 'key' ? 'text-[#C5B79E]' : 'text-[#A69F93]'}>
                {log.event}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

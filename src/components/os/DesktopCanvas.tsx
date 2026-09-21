import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Building2,
  FolderGit2,
  Scan,
  Folder,
  Globe,
  Sparkles,
  BookOpen,
  Terminal,
  CodeXml,
  Mail,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { soundFx } from '../../utils/audio';
import { DesktopItem } from '../../types/os';
import { WindowFrame } from './WindowFrame';
import { HomeAppWindow } from './windows/HomeAppWindow';
import { AboutAppWindow } from './windows/AboutAppWindow';
import { ProjectsAppWindow } from './windows/ProjectsAppWindow';
import { ClientsAppWindow } from './windows/ClientsAppWindow';
import { TerminalAppWindow } from './windows/TerminalAppWindow';
import { NotesAppWindow } from './windows/NotesAppWindow';
import { RICodeAppWindow } from './windows/RICodeAppWindow';
import { ContactAppWindow } from './windows/ContactAppWindow';
import { ScholarshipAppWindow } from './windows/ScholarshipAppWindow';
import { BatchScheduleAppWindow } from './windows/BatchScheduleAppWindow';
import { CurriculumPdfAppWindow } from './windows/CurriculumPdfAppWindow';
import { WeeklyMeetingsAppWindow } from './windows/WeeklyMeetingsAppWindow';
import { EliminationAppWindow } from './windows/EliminationAppWindow';
import { FaqsAppWindow } from './windows/FaqsAppWindow';
import { FolderViewerWindow } from './windows/FolderViewerWindow';


import { RIResidentModal } from './RIResidentModal';
import { DesktopClockWidget } from './DesktopClockWidget';

export const DesktopCanvas: React.FC = () => {
  const {
    windows,
    openWindow,
    residentModalOpen,
    setResidentModalOpen,
    desktopItems,
    removeDesktopItem,
    activeFolderId,
    setActiveFolderId,
  } = useOS();

  const handleItemClick = (item: DesktopItem) => {
    soundFx.playPop();
    if (item.type === 'folder') {
      setActiveFolderId(item.id);
    } else if (item.targetWindowId) {
      openWindow(item.targetWindowId);
    } else if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const renderItemIcon = (item: DesktopItem) => {
    if (item.type === 'folder') {
      const hasWhiteText = item.bgClass?.includes('text-white') || item.bgClass?.includes('text-[#F8F4EC]');
      return (
        <Folder
          className={`w-7 h-7 ${hasWhiteText ? 'text-white fill-white/20' : 'text-[#191816] fill-[#191816]/20'} stroke-[1.8]`}
        />
      );
    }
    if (item.icon === 'RI') {
      return (
        <div className="w-8 h-8 rounded-full border border-[#191816]/70 flex items-center justify-center">
          <span className="font-serif font-bold text-[13px] text-[#191816]">RI</span>
        </div>
      );
    }
    if (item.icon === 'Scan' || item.targetWindowId === 'about') {
      return <Scan className="w-6 h-6 text-[#191816] stroke-[2.2]" />;
    }
    if (item.icon === 'Building2' || item.targetWindowId === 'clients') {
      return <Building2 className="w-6 h-6 text-white stroke-2" />;
    }
    if (item.icon === 'FolderGit2' || item.targetWindowId === 'projects') {
      return <FolderGit2 className="w-6 h-6 text-[#191816] stroke-2" />;
    }
    if (item.icon === 'notes' || item.targetWindowId === 'notes') {
      const isGold = item.bgClass?.includes('text-[#DFCA9F]');
      return <BookOpen className={`w-6 h-6 ${isGold ? 'text-[#DFCA9F]' : 'text-[#191816]'} stroke-[2.2]`} />;
    }
    if (item.icon === 'terminal' || item.targetWindowId === 'terminal') {
      return <Terminal className="w-6 h-6 text-[#F8F4EC] stroke-2" />;
    }
    if (item.icon === 'ricode' || item.targetWindowId === 'ricode') {
      return <CodeXml className="w-6 h-6 text-[#76654D] stroke-2" />;
    }
    if (item.icon === 'contact' || item.targetWindowId === 'contact') {
      return <Mail className="w-6 h-6 text-[#191816] stroke-2" />;
    }
    if (item.icon === 'GraduationCap' || item.targetWindowId === 'scholarship') {
      const hasWhiteText = item.bgClass?.includes('text-white') || item.bgClass?.includes('text-[#F8F4EC]');
      return <GraduationCap className={`w-6 h-6 ${hasWhiteText ? 'text-[#F8F4EC]' : 'text-[#191816]'} stroke-2`} />;
    }
    if (item.url) {
      return <Globe className="w-6 h-6 text-[#F8F4EC] stroke-2" />;
    }
    return <Sparkles className="w-6 h-6 text-[#F8F4EC] stroke-2" />;
  };

  return (
    <div className="flex-1 relative w-full h-full overflow-hidden">
      {/* Top Center Digital Clock & Calendar Widget */}
      <DesktopClockWidget />

      {/* Desktop Icons (RTL Native Position on the Right) */}
      <div
        className="absolute top-6 right-6 z-20 flex flex-col flex-wrap items-center gap-5 select-none"
        style={{
          maxHeight: 'calc(100vh - 150px)',
          minWidth: '88px',
        }}
      >
        {desktopItems.map((item) => {
          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center group w-20"
            >
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleItemClick(item);
                  }
                }}
                className="w-full flex flex-col items-center focus:outline-none transition-all duration-200 cursor-pointer"
                aria-label={`فتح ${item.title}`}
              >
                {/* Tactile Rounded Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.55)] border transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95 ${
                    item.bgClass || 'bg-[#292724] text-[#F8F4EC] border-white/10'
                  }`}
                >
                  {renderItemIcon(item)}
                </div>

                {/* Icon Label */}
                <span
                  className="mt-1.5 text-[12px] font-medium tracking-tight text-center line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] px-1.5 py-0.5 rounded-md text-[#F3EFE7]/90 group-hover:text-white transition-colors"
                >
                  {item.title}
                </span>

                {/* Badge for folder item counts */}
                {item.type === 'folder' && item.files && (
                  <span className="text-[10px] text-[#C5B79E]/85 -mt-0.5 font-mono">
                    {item.files.length} ملف
                  </span>
                )}
              </button>

              {/* Delete button on hover for custom added items */}
              {item.id !== 'dt-home' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDesktopItem(item.id);
                  }}
                  className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-md cursor-pointer z-30"
                  title="حذف من سطح المكتب"
                  aria-label={`حذف ${item.title}`}
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Folder Viewer Window */}
      <AnimatePresence>
        {activeFolderId && (
          <FolderViewerWindow
            key={activeFolderId}
            folderId={activeFolderId}
            onClose={() => setActiveFolderId(null)}
          />
        )}
      </AnimatePresence>

      {/* Render All Open Windows with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {windows.home.isOpen && !windows.home.isMinimized && (
          <WindowFrame
            key="home"
            windowState={windows.home}
            theme="ivory"
          >
            <HomeAppWindow />
          </WindowFrame>
        )}

        {windows.about.isOpen && !windows.about.isMinimized && (
          <WindowFrame key="about" windowState={windows.about} theme="ivory">
            <AboutAppWindow />
          </WindowFrame>
        )}

        {windows.projects.isOpen && !windows.projects.isMinimized && (
          <WindowFrame key="projects" windowState={windows.projects} theme="ivory">
            <ProjectsAppWindow />
          </WindowFrame>
        )}

        {windows.clients.isOpen && !windows.clients.isMinimized && (
          <WindowFrame key="clients" windowState={windows.clients} theme="ivory">
            <ClientsAppWindow />
          </WindowFrame>
        )}

        {windows.terminal.isOpen && !windows.terminal.isMinimized && (
          <WindowFrame key="terminal" windowState={windows.terminal} theme="noir">
            <TerminalAppWindow />
          </WindowFrame>
        )}

        {windows.notes.isOpen && !windows.notes.isMinimized && (
          <WindowFrame key="notes" windowState={windows.notes} theme="ivory">
            <NotesAppWindow />
          </WindowFrame>
        )}

        {windows.ricode.isOpen && !windows.ricode.isMinimized && (
          <WindowFrame key="ricode" windowState={windows.ricode} theme="ivory">
            <RICodeAppWindow />
          </WindowFrame>
        )}

        {windows.contact.isOpen && !windows.contact.isMinimized && (
          <WindowFrame key="contact" windowState={windows.contact} theme="ivory">
            <ContactAppWindow />
          </WindowFrame>
        )}

        {windows.scholarship?.isOpen && !windows.scholarship?.isMinimized && (
          <WindowFrame key="scholarship" windowState={windows.scholarship} theme="ivory">
            <ScholarshipAppWindow />
          </WindowFrame>
        )}

        {windows.schedule?.isOpen && !windows.schedule?.isMinimized && (
          <WindowFrame key="schedule" windowState={windows.schedule} theme="ivory">
            <BatchScheduleAppWindow />
          </WindowFrame>
        )}

        {windows.curriculum?.isOpen && !windows.curriculum?.isMinimized && (
          <WindowFrame key="curriculum" windowState={windows.curriculum} theme="noir">
            <CurriculumPdfAppWindow />
          </WindowFrame>
        )}

        {windows.meetings?.isOpen && !windows.meetings?.isMinimized && (
          <WindowFrame key="meetings" windowState={windows.meetings} theme="ivory">
            <WeeklyMeetingsAppWindow />
          </WindowFrame>
        )}

        {windows.elimination?.isOpen && !windows.elimination?.isMinimized && (
          <WindowFrame key="elimination" windowState={windows.elimination} theme="ivory">
            <EliminationAppWindow />
          </WindowFrame>
        )}

        {windows.faqs?.isOpen && !windows.faqs?.isMinimized && (
          <WindowFrame key="faqs" windowState={windows.faqs} theme="ivory">
            <FaqsAppWindow />
          </WindowFrame>
        )}
      </AnimatePresence>



      {/* Interactive RI Resident Virtual Assistant Dialog */}
      <RIResidentModal
        isOpen={residentModalOpen}
        onClose={() => setResidentModalOpen(false)}
      />
    </div>
  );
};

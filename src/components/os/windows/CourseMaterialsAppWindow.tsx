import React, { useState, useCallback } from 'react';
import {
  FolderDown,
  Download,
  ChevronDown,
  BookOpen,
  Layers,
  FileArchive,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';
import { useSmoothScroll } from '../../../hooks/useSmoothScroll';

interface CourseMaterial {
  id: string;
  courseName: string;
  downloadUrl: string;
}

interface TrackData {
  id: string;
  trackName: string;
  courses: CourseMaterial[];
}

const TRACKS_DATA: TrackData[] = [
  {
    id: 'track-fundamentals',
    trackName: 'مسار الأساسيات',
    courses: [
      {
        id: 'cm-python-1',
        courseName: 'أساسيات البرمجة باستخدام لغة بايثون 1',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2022/07/fundamentals-2.zip',
      },
      {
        id: 'cm-python-2',
        courseName: 'أساسيات البرمجة باستخدام لغة بايثون 2',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2022/10/Beyond-Fundementals-3.zip',
      },
      {
        id: 'cm-ai-intro',
        courseName: 'مدخل إلى الذكاء الاصطناعي',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2025/09/Material.zip',
      },
      {
        id: 'cm-python-projects',
        courseName: 'مشاريع تطبيقية باستخدام بايثون',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/02/%D9%85%D8%B4%D8%A7%D8%B1%D9%8A%D8%B9-%D8%A8%D8%A7%D9%8A%D8%AB%D9%88%D9%86.zip',
      },
      {
        id: 'cm-git-github',
        courseName: 'دورة تعليم Git وجيت هب GitHub',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/09/%D8%A7%D9%84%D9%85%D8%AE%D8%AA%D8%B5%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D8%A8%D9%8A%D8%A9.zip',
      },
      {
        id: 'cm-data-structures',
        courseName: 'هياكل البيانات الأساسية',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/10/%D9%85%D9%88%D8%A7%D8%AF-%D8%A7%D9%84%D8%AF%D9%88%D8%B1%D8%A9.zip',
      },
      {
        id: 'cm-data-challenges',
        courseName: 'تحديات وحلول هياكل البيانات الأساسية',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/02/%D8%AA%D8%AD%D8%AF%D9%8A%D8%A7%D8%AA-%D8%A7%D9%84%D8%AF%D9%88%D8%B1%D8%A9-1.zip',
      },
      {
        id: 'cm-linkedin',
        courseName: 'ملفك الاحترافي على لينكيد إن',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/12/build-professional-linkedin-profile-1.zip',
      },
    ],
  },
  {
    id: 'track-interactive-websites',
    trackName: 'مسار بناء المواقع التفاعلية',
    courses: [
      {
        id: 'cm-html-fundamentals',
        courseName: 'أساسيات HTML',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/07/HTML-Fundamentals-2.zip',
      },
      {
        id: 'cm-css-fundamentals',
        courseName: 'أساسيات CSS',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/06/CSS-Fundamentals-2.zip',
      },
      {
        id: 'cm-css-layouts',
        courseName: 'CSS Layouts',
        downloadUrl: '/assignmentSS_Layouts_Challenges.zip',
      },
      {
        id: 'cm-advanced-css',
        courseName: 'Advanced CSS',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/03/Advanced-CSS-Project.zip',
      },
      {
        id: 'cm-html-css-projects',
        courseName: 'مشاريع HTML and CSS',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/10/html-css-projects-1.zip',
      },
      {
        id: 'cm-css-animations',
        courseName: 'CSS Animations',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2024/09/%D9%85%D9%88%D8%A7%D8%AF-%D8%A7%D9%84%D8%AF%D9%88%D8%B1%D8%A9.zip',
      },
      {
        id: 'cm-css-responsive',
        courseName: 'CSS Responsive Design',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2024/09/%D9%85%D9%88%D8%A7%D8%AF-%D8%AF%D9%88%D8%B1%D8%A9-CSS-Responsive-2.zip',
      },
    ],
  },
  {
    id: 'track-javascript',
    trackName: 'مسار تعلم JavaScript',
    courses: [
      {
        id: 'cm-js-fundamentals',
        courseName: 'أساسيات JavaScript',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/05/Assets-1.zip',
      },
      {
        id: 'cm-js-intermediate',
        courseName: 'Javascript Intermediate',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/05/Assets-2.zip',
      },
      {
        id: 'cm-js-projects-1',
        courseName: 'مشاريع JavaScript I',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/06/Javascript-Projects-1.zip',
      },
      {
        id: 'cm-js-advanced',
        courseName: 'Advanced JavaScript',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/09/Assets-2-1.zip',
      },
      {
        id: 'cm-js-projects-2',
        courseName: 'مشاريع JavaScript II',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/11/Assets-4.zip',
      },
    ],
  },
  {
    id: 'track-react',
    trackName: 'مسار الدليل الشامل لتعلم React',
    courses: [
      {
        id: 'cm-react-fundamentals',
        courseName: 'أساسيات React',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2024/04/React-fundamentals.zip',
      },
      {
        id: 'cm-react-deep-dive',
        courseName: 'React Deep Dive',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2023/09/React-Deep-Dive.zip',
      },
      {
        id: 'cm-react-projects',
        courseName: 'مشاريع React',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2024/01/%D9%85%D9%88%D8%A7%D8%AF-%D8%AF%D9%88%D8%B1%D8%A9-%D9%85%D8%B4%D8%A7%D8%B1%D9%8A%D8%B9-%D8%B1%D9%8A%D8%A3%D9%83%D8%AA.zip',
      },
      {
        id: 'cm-typescript',
        courseName: 'تعلم TypeScript من الصفر',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2024/12/TypeScript.zip',
      },
      {
        id: 'cm-react-typescript',
        courseName: 'React with Typescript',
        downloadUrl:
          'https://almdrasa.com/wp-content/uploads/2025/05/Course-materials.zip',
      },
    ],
  },
];

type DownloadState = 'idle' | 'downloading' | 'done';

export const CourseMaterialsAppWindow: React.FC = () => {
  const { containerRef } = useSmoothScroll();
  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(
    () => new Set(TRACKS_DATA.map((t) => t.id)),
  );
  const [downloadStates, setDownloadStates] = useState<
    Record<string, DownloadState>
  >({});

  const toggleTrack = useCallback((trackId: string) => {
    soundFx.playClick(400, 0.03);
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const handleDownload = useCallback((course: CourseMaterial) => {
    soundFx.playPop();
    setDownloadStates((prev) => ({ ...prev, [course.id]: 'downloading' }));

    const link = document.createElement('a');
    link.href = course.downloadUrl;
    link.download = '';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadStates((prev) => ({ ...prev, [course.id]: 'done' }));
      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [course.id]: 'idle' }));
      }, 3000);
    }, 1200);
  }, []);

  const totalCourses = TRACKS_DATA.reduce(
    (sum, t) => sum + t.courses.length,
    0,
  );

  return (
    <div className="h-full flex flex-col bg-[#4700D8] text-[#1E1D1A] overflow-hidden select-text font-sans relative">
      {/* Dynamic Background matching signature royal purple gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#4700D8] via-[#5B00FF] to-[#3B00B3] pointer-events-none" />

      {/* Subtle Asterisk SVG Watermark matching Almdrasa brand */}
      <svg
        className="absolute top-4 left-1/2 -translate-x-1/2 w-96 h-96 text-white/5 pointer-events-none"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M45 0h10v100H45z" />
        <path d="M0 45h100v10H0z" />
        <path d="M18.2 11.1l7.1-7.1 70.7 70.7-7.1 7.1z" />
        <path d="M81.8 11.1l7.1 7.1-70.7 70.7-7.1-7.1z" />
      </svg>

      {/* Glassmorphic Top Header Bar */}
      <header className="relative z-10 px-6 py-3.5 flex items-center justify-between border-b border-white/10 bg-black/15 backdrop-blur-md text-white shrink-0">
        <div>
          <div className="text-xs sm:text-sm font-extrabold tracking-wide">مواد الدورات التدريبية</div>
          <div className="text-[10px] sm:text-[11px] text-[#D0C0FF]">
            حمّل المواد التعليمية والملفات المرفقة لكل دورة في مسارات المنحة
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white">
            <Layers className="w-3.5 h-3.5 text-[#D0C0FF]" />
            <span>{TRACKS_DATA.length} مسار</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white">
            <BookOpen className="w-3.5 h-3.5 text-[#D0C0FF]" />
            <span>{totalCourses} دورة</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white">
            <FileArchive className="w-3.5 h-3.5 text-[#D0C0FF]" />
            <span>ملفات ZIP</span>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <div
        ref={containerRef}
        className="flex-1 relative z-10 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 custom-scrollbar"
      >
        {/* Main Luxurious White Card Container */}
        <div className="max-w-5xl mx-auto rounded-4xl bg-white p-6 sm:p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.3)] border border-white/60 space-y-7 relative">

          {/* 1. Hero / Materials Overview Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-[#2E0080] via-[#4700D8] to-[#5B00FF] text-white shadow-lg border border-purple-400/30 relative overflow-hidden">
            {/* Decorative subtle glow orbs */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-56 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#E6DCFF] text-xs font-bold border border-white/20">
                المواد التعليمية • ملفات الدورات
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <FolderDown className="w-7 h-7 text-[#D3BEFF] shrink-0" />
                <span>مواد الدورات التدريبية — تحميل ملفات المنهج</span>
              </h2>

              <p className="text-xs sm:text-sm md:text-[15px] text-[#E5DCFF] leading-relaxed max-w-3xl">
                حمّل المواد التعليمية والملفات المرفقة لكل دورة في مسارات المنحة. اضغط على زر التحميل للحصول على الملفات مباشرة على جهازك.
              </p>
            </div>
          </div>

          {/* 2. Track Sections */}
          <div className="space-y-5">
            {TRACKS_DATA.map((track) => {
              const isExpanded = expandedTracks.has(track.id);
              return (
                <section
                  key={track.id}
                  className="rounded-2xl border border-[#DCD0FF] bg-white overflow-hidden shadow-2xs"
                >
                  {/* Track Header */}
                  <button
                    type="button"
                    onClick={() => toggleTrack(track.id)}
                    className="w-full flex items-center justify-between px-5 py-4 cursor-pointer group transition-colors hover:bg-[#FAF8FF] focus:outline-none bg-[#F6F1FF] border-b border-[#DCD0FF]"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'طي' : 'توسيع'} ${track.trackName}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#5B00FF] flex items-center justify-center shadow-sm">
                        <Layers className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="text-right">
                        <h3 className="text-[14px] font-extrabold text-[#4700D8] group-hover:text-[#5B00FF] transition-colors">
                          {track.trackName}
                        </h3>
                        <span className="text-[11.5px] text-[#6B655B] font-medium">
                          {track.courses.length} دورة تحتوي على مواد تعليمية
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#5B00FF] transition-all duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Courses List */}
                  {isExpanded && (
                    <div className="divide-y divide-[#EFE8FF]">
                      {track.courses.map((course, courseIndex) => {
                        const dlState = downloadStates[course.id] ?? 'idle';
                        return (
                          <div
                            key={course.id}
                            className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-[#FAF8FF] group/card"
                          >
                            {/* Course Info */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-lg bg-[#F4EFFF] border border-[#DDD0FF] flex items-center justify-center shrink-0">
                                <span className="text-[12px] font-extrabold text-[#5B00FF] tabular-nums">
                                  {String(courseIndex + 1).padStart(2, '0')}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[13.5px] font-bold text-[#1E1D1A] truncate group-hover/card:text-[#5B00FF] transition-colors">
                                  {course.courseName}
                                </h4>
                                <span className="text-[11px] text-[#8A80A8] flex items-center gap-1 mt-0.5">
                                  <FileArchive className="w-3 h-3" />
                                  ملف مضغوط ZIP
                                </span>
                              </div>
                            </div>

                            {/* Download Button */}
                            <DownloadButton
                              state={dlState}
                              onDownload={() => handleDownload(course)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* 3. Footer Note */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#F4EFFF] border border-[#DDD0FF] text-[12px] text-[#6B655B]">
            <FileArchive className="w-4 h-4 text-[#5B00FF]/50 shrink-0" />
            <span>
              جميع الملفات بصيغة ZIP. تأكد من وجود برنامج لفك الضغط على جهازك قبل التحميل.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Download Button Sub-component ─── */

interface DownloadButtonProps {
  state: DownloadState;
  onDownload: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  state,
  onDownload,
}) => {
  if (state === 'done') {
    return (
      <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[12px] font-bold shrink-0">
        <CheckCircle2 className="w-4 h-4" />
        <span>تم التحميل</span>
      </div>
    );
  }

  if (state === 'downloading') {
    return (
      <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4EFFF] border border-[#DDD0FF] text-[#5B00FF] text-[12px] font-bold shrink-0">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>جارٍ التحميل...</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onDownload}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5B00FF] text-white text-[12px] font-bold hover:bg-[#4700D8] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer shrink-0 focus:outline-none shadow-xs"
      aria-label="تحميل المواد"
    >
      <Download className="w-4 h-4" />
      <span>تحميل المواد</span>
    </button>
  );
};

import React, { useState } from 'react';
import {
  Download,
  ExternalLink,
  Printer,
  FileText,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../../../utils/audio';
import curriculumPdf from '../../../Corriculumn/منهج دبلومة تعلم البرمجة والفـرونت إنـد مـن الصـفـر.pdf';

export const CurriculumPdfAppWindow: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pdfUrl = curriculumPdf || '/curriculum.pdf';


  const handleDownload = () => {
    soundFx.playClick(600, 0.03);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'منهج_دبلومة_تعلم_البرمجة_والفرونت_إند_من_الصفر_المدرسة.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    soundFx.playClick(620, 0.03);
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    soundFx.playClick(580, 0.03);
    const iframe = document.getElementById('curriculum-pdf-frame') as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.print();
        return;
      } catch {
        // Fallback for cross-origin or sandboxed iframes
      }
    }
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#141311] text-[#F3EFE7] overflow-hidden select-none">
      {/* Top Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#1A1917] border-b border-white/10 shrink-0">
        {/* Document Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#E05638] via-[#C93B1D] to-[#99220A] flex items-center justify-center text-white shadow-sm border border-red-400/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[14px] font-bold text-[#F3EFE7]">
                منهج دبلومة المدرسة - (المنحة)
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#23211D] border border-white/10 text-[10px] text-[#DFCA9F] font-medium">
                <Sparkles className="w-2.5 h-2.5" />
                <span>النسخة الرسمية</span>
              </span>
            </div>
            <p className="text-[11px] text-[#8E877D] mt-0.5">
              دبلومة تعلم البرمجة والفرونت إند من الصفر • مستند PDF رسمي (4.0 ميجابايت)
            </p>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25231F] hover:bg-[#2F2C27] border border-white/10 text-[#E5DFD5] hover:text-white text-[12px] font-medium transition-all cursor-pointer shadow-xs active:scale-95"
            title="تحميل ملف الـ PDF إلى جهازك"
          >
            <Download className="w-3.5 h-3.5 text-[#DFCA9F]" />
            <span>تحميل</span>
          </button>

          {/* Open in New Tab */}
          <button
            type="button"
            onClick={handleOpenExternal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25231F] hover:bg-[#2F2C27] border border-white/10 text-[#E5DFD5] hover:text-white text-[12px] font-medium transition-all cursor-pointer shadow-xs active:scale-95"
            title="فتح المستند في صفحة متصفح مستقلة"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#DFCA9F]" />
            <span className="hidden sm:inline">نافذة جديدة</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#25231F] hover:bg-[#2F2C27] border border-white/10 text-[#E5DFD5] hover:text-white text-[12px] font-medium transition-all cursor-pointer shadow-xs active:scale-95"
            title="طباعة المستند"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="relative flex-1 w-full h-full bg-[#1E1D1B] overflow-hidden">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141311] z-10 gap-3">
            <Loader2 className="w-8 h-8 text-[#DFCA9F] animate-spin" />
            <p className="text-[13px] text-[#A8A196]">جاري تحميل منهج الدبلومة...</p>
          </div>
        )}

        {/* Embedded Native Browser PDF Engine */}
        <iframe
          id="curriculum-pdf-frame"
          src={`${pdfUrl}#toolbar=1&navpanes=1`}
          title="منهج دبلومة المدرسة - (المنحة)"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 block select-text"
        />
      </div>
    </div>
  );
};

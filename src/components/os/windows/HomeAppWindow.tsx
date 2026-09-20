import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { soundFx } from '../../../utils/audio';

export const HomeAppWindow: React.FC = () => {
  const { openWindow, profile } = useOS();

  return (
    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 text-[#191816] select-text">
      {/* Right Column in RTL: Executive Profile */}
      <div className="flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-[#E5E0D6] pb-6 lg:pb-0 lg:pl-8">
        <div>
          {/* Eyebrow */}
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
            {profile.eyebrow}
          </span>

          {/* Profile Header (Avatar + Name) */}
          <div className="flex items-center gap-4 mt-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4CFC5] shadow-sm shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-serif text-[30px] md:text-[34px] font-bold leading-tight text-[#191816]">
              {profile.name}
            </h1>
          </div>

          {/* Subtitle Roles */}
          <div className="flex items-center gap-3 mt-3.5 text-[15px] font-medium text-[#76654D]">
            <span>{profile.primaryRole}</span>
            <span className="w-1 h-1 rounded-full bg-[#B8B1A5]" />
            <span>{profile.secondaryRole}</span>
          </div>

          {/* Narrative Bio */}
          <p className="mt-4 text-[14px] leading-relaxed text-[#4B4741] max-w-md">
            {profile.bioSummary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-8 pt-4">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              openWindow('about');
            }}
            className="px-5 py-2.5 rounded-lg bg-[#292724] text-[#F8F4EC] text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1B1A18] hover:-translate-y-0.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FCE] focus:ring-offset-2"
          >
            <span>فتح الملف التعريفي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <a
            href={profile.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="px-5 py-2.5 rounded-lg border border-[#D4CFC5] bg-transparent text-[#191816] text-[13px] font-semibold flex items-center gap-1.5 hover:bg-[#EEEAE2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6FCE] focus:ring-offset-2"
          >
            <span>لينكد إن</span>
            <ExternalLink className="w-3 h-3 text-[#756F66]" />
          </a>
        </div>
      </div>

      {/* Left Column in RTL: Welcome & OS Guide */}
      <div className="flex flex-col justify-between">
        <div>
          {/* Eyebrow */}
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
            مرحباً بك
          </span>

          {/* Main Welcome Headline */}
          <h2 className="font-serif text-[32px] md:text-[36px] font-bold leading-snug text-[#191816] mt-2">
            أهلاً بك في نظام Almdrasa Gateway.
          </h2>

          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#504A43]">
            تجمع بيئة العمل الرقمية هذه ملفي المهني، خبراتي، العملاء والمشاريع الاستراتيجية كتطبيقات حية داخل نظام تشغيل متكامل.
          </p>

          {/* Numbered Feature Cards */}
          <div className="mt-6 space-y-4">
            {/* 01 Dock */}
            <div className="pt-3.5 border-t border-[#E5E0D6] grid grid-cols-[36px_1fr] gap-2 items-baseline">
              <span className="text-[12px] font-mono text-[#756F66]">01</span>
              <div>
                <span className="text-[13px] font-semibold text-[#191816]">شريط المهام (Dock)</span>
                <p className="text-[12px] text-[#68635C] mt-0.5 leading-normal">
                  افتح أي تطبيق بنقرة واحدة من الشريط السفلي الانسيابي.
                </p>
              </div>
            </div>

            {/* 02 Desktop */}
            <div className="pt-3.5 border-t border-[#E5E0D6] grid grid-cols-[36px_1fr] gap-2 items-baseline">
              <span className="text-[12px] font-mono text-[#756F66]">02</span>
              <div>
                <span className="text-[13px] font-semibold text-[#191816]">سطح المكتب (Desktop)</span>
                <p className="text-[12px] text-[#68635C] mt-0.5 leading-normal">
                  انقر نقراً مزدوجاً على الأيقونات الجانبية لتشغيل التطبيقات المميّزة.
                </p>
              </div>
            </div>

            {/* 03 Windows */}
            <div className="pt-3.5 border-t border-[#E5E0D6] grid grid-cols-[36px_1fr] gap-2 items-baseline">
              <span className="text-[12px] font-mono text-[#756F66]">03</span>
              <div>
                <span className="text-[13px] font-semibold text-[#191816]">إدارة النوافذ (Windows)</span>
                <p className="text-[12px] text-[#68635C] mt-0.5 leading-normal">
                  حرّك النوافذ بحرية، وتحكّم بأحجامها، وتنقّل بين مهامك بكل مرونة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info pill */}
        <div className="mt-6 pt-4 border-t border-[#E5E0D6] flex items-center justify-between text-[11px] text-[#756F66]">
          <span>إصدار الاستوديو Studio OS v2.4</span>
          <span className="font-mono">جاهز · تشغيل مباشر 100%</span>
        </div>
      </div>
    </div>
  );
};

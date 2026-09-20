import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { INITIAL_PROJECTS } from '../../../data/osData';
import { soundFx } from '../../../utils/audio';

export const ProjectsAppWindow: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const categories = ['الكل', 'البنية التحتية الأساسية', 'الذكاء الاصطناعي والتنظيم', 'الهندسة الأمنية والسيبرانية'];

  const filteredProjects = selectedCategory === 'الكل'
    ? INITIAL_PROJECTS
    : INITIAL_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="p-6 md:p-8 space-y-6 text-[#191816] select-text">
      {/* Header */}
      <div className="border-b border-[#E5E0D6] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
            معرض الأنظمة والمعمارية البرمجية
          </span>
          <h2 className="font-serif text-[30px] font-bold leading-tight text-[#191816] mt-1">
            الأنظمة والمنصات الاستراتيجية
          </h2>
          <p className="text-[13px] text-[#504A43] mt-1">
            محركات إنتاجية وسجلات موزعة وشبكات حوكمة مصممة لضمان استمرارية العمل وصفر توقف.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-[50px] text-[12px] font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#292724] text-[#F8F4EC] shadow-sm'
                  : 'bg-[#F1EEE8] text-[#504A43] hover:bg-[#E5E0D6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-white/80 border border-[#E5E0D6] shadow-sm hover:border-[#B8B1A5] transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#76654D] bg-[#F1EEE8] px-2 py-0.5 rounded-md">
                    {proj.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#756F66]">{proj.year}</span>
                </div>
                <h3 className="font-serif text-[22px] font-bold text-[#191816] mt-2">
                  {proj.title}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#9FA994]/20 text-[#47523f]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{proj.status === 'Featured' ? 'مميّز' : proj.status === 'Active' ? 'نشط' : 'مكتمل'}</span>
              </div>
            </div>

            <p className="text-[13px] text-[#4B4741] mt-2.5 leading-relaxed">
              {proj.summary}
            </p>

            {/* Metrics Callout */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D6] flex items-center justify-between text-[12px]">
              <span className="text-[#756F66] font-medium">الأثر المقاس والنتائج:</span>
              <span className="font-semibold text-[#191816] font-mono">{proj.metrics}</span>
            </div>

            {/* Tech Stack Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#F1EEE8]">
              {proj.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#EFECE6] text-[#4B4741]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

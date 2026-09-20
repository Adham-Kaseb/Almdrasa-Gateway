import React from 'react';
import { Award, Briefcase, Zap } from 'lucide-react';
import { useOS } from '../../../context/OSContext';

export const AboutAppWindow: React.FC = () => {
  const { profile } = useOS();

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#191816] select-text">
      {/* Header section */}
      <div className="border-b border-[#E5E0D6] pb-6">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
          السيرة الذاتية والمسار المهني
        </span>
        <h2 className="font-serif text-[30px] md:text-[34px] font-bold leading-tight text-[#191816] mt-1">
          {profile.name} — القيادة المعمارية وهندسة المنتجات
        </h2>
        <p className="text-[14px] text-[#504A43] mt-2 max-w-2xl leading-relaxed">
          أكثر من 14 عاماً متخصصة في الأنظمة الموزعة فائقة السرعة، البنية التحتية السحابية القائمة على Zero-Trust، وبناء فرق هندسية استثنائية تقود التوسع من مرحلة التأسيس حتى المؤسسات العالمية.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(profile.stats || {}).map(([key, val]) => (
          <div key={key} className="p-4 rounded-xl bg-[#F1EEE8] border border-[#E5E0D6]">
            <div className="font-serif text-[26px] font-bold text-[#191816]">{val}</div>
            <div className="text-[11px] font-medium tracking-wide text-[#756F66] mt-0.5">{key}</div>
          </div>
        ))}
      </div>

      {/* Core Competencies & Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white/70 border border-[#E5E0D6] shadow-sm">
          <div className="flex items-center gap-2 text-[#76654D] font-semibold text-[13px] uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>الكفاءات والقدرات الجوهرية</span>
          </div>
          <ul className="mt-3 space-y-2.5 text-[13px] text-[#4B4741]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FCE] shrink-0" />
              <span>التوافق الموزع وتدفق البيانات الفوري (Kafka, Rust)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FCE] shrink-0" />
              <span>بوابات وكلاء الذكاء الاصطناعي وتنسيق النماذج والضوابط</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FCE] shrink-0" />
              <span>إدارة الهوية العالمية Zero-Trust والحوكمة التشفيرية</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FCE] shrink-0" />
              <span>اقتصاديات السحابة فائقة الأداء وتحسين تكاليف FinOps</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 border border-[#E5E0D6] shadow-sm">
          <div className="flex items-center gap-2 text-[#76654D] font-semibold text-[13px] uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>الاعتمادات ومجالس الإدارة</span>
          </div>
          <div className="mt-3 space-y-2.5">
            {profile.credentials.map((cred) => (
              <div key={cred} className="flex items-center justify-between text-[13px] text-[#4B4741] pb-1.5 border-[#F1EEE8] not-last:border-b">
                <span className="font-medium text-[#191816]">{cred}</span>
                <span className="text-[11px] text-[#9FA994] font-semibold">نشط · معتمد</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Timeline */}
      <div>
        <div className="flex items-center gap-2 text-[#76654D] font-semibold text-[13px] uppercase tracking-wider mb-4">
          <Briefcase className="w-4 h-4" />
          <span>المسار القيادي التنفيذي</span>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#F1EEE8]/80 border border-[#E5E0D6]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#191816]">المدير التنفيذي للتقنية (CTO) · هورايزون سيستمز</span>
              <span className="text-[12px] font-mono text-[#756F66]">2022 — حتى الآن</span>
            </div>
            <p className="text-[12.5px] text-[#504A43] mt-1.5 leading-relaxed">
              قيادة منظومة هندسية تضم 85 مهندساً عبر البنية التحتية السحابية، الأمن السيبراني، وخطوط معالجة التداول الخوارزمي، مع تحقيق نسبة جاهزية 99.999% عبر مراكز بيانات متعددة.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F1EEE8]/80 border border-[#E5E0D6]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#191816]">نائب رئيس المنتجات والمنصات · كوانتم إيدج</span>
              <span className="text-[12px] font-mono text-[#756F66]">2018 — 2022</span>
            </div>
            <p className="text-[12.5px] text-[#504A43] mt-1.5 leading-relaxed">
              توجيه معمارية البوابات الرقمية وتوسيع قاعدة المطورين النشطين شهرياً من 12k إلى 480k مطور، ودفع حجم التبادلات الرقمية لتجاوز 2.5 مليار دولار.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

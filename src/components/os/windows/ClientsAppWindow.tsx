import React from 'react';
import { Building2 } from 'lucide-react';

export const ClientsAppWindow: React.FC = () => {
  const clients = [
    {
      name: 'أبكس كابيتال بارتنرز (Apex Capital Partners)',
      industry: 'التمويل الكمي والأسواق المالية العالمية',
      work: 'هندسة شبكة محاكاة مخاطر فورية قلصت زمن الاستجابة من 420ms إلى 8ms.',
      impact: 'تأمين تسويات مالية يومية بقيمة $1.4B.',
    },
    {
      name: 'فانغارد للحلول الصحية (Vanguard Health Telemetry)',
      industry: 'إنترنت الأشياء الطبي الموزع',
      work: 'تصميم خط تدفق بيانات خاضع لمعايير HIPAA و SOC2 Zero-Trust عبر 18,000 طرفية طبية بمستشفيات كبرى.',
      impact: 'صفر حوادث أمنية طوال 3 سنوات من التدقيق المستمر.',
    },
    {
      name: 'أوربت للخدمات اللوجستية العالمية (Orbit Logistics)',
      industry: 'سلاسل الإمداد والخدمات اللوجستية الذكية',
      work: 'تطوير محرك تحسين مسارات طرفي (Edge) يعالج 1.2 مليون نقطة جغرافية في الدقيقة.',
      impact: 'خفض استهلاك الوقود والانبعاثات الكربونية للأسطول بنسبة 14.8%.',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 text-[#191816] select-text">
      <div className="border-b border-[#E5E0D6] pb-4">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
          الشراكات والاستشارات التنفيذية
        </span>
        <h2 className="font-serif text-[30px] font-bold leading-tight text-[#191816] mt-1">
          الاستشارات الاستراتيجية والشراكات المؤسسية
        </h2>
        <p className="text-[13px] text-[#504A43] mt-1">
          استشارات فنية ومعمارية لمجالس إدارات الشركات الكبرى، المؤسسات المالية، ومشغلي البنى التحتية الحيوية.
        </p>
      </div>

      <div className="space-y-4">
        {clients.map((c, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white/80 border border-[#E5E0D6] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#76654D]" />
                <h3 className="font-semibold text-[16px] text-[#191816]">{c.name}</h3>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F1EEE8] text-[#756F66]">
                {c.industry}
              </span>
            </div>
            <p className="text-[13px] text-[#4B4741] mt-2.5 leading-relaxed">{c.work}</p>
            <div className="mt-3 text-[12px] font-semibold text-[#2F6FCE] bg-[#F8F6F1] p-2.5 rounded-lg border border-[#E5E0D6]">
              النتيجة المحققة: {c.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

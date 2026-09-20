import React from 'react';

export const NotesAppWindow: React.FC = () => {
  const notes = [
    {
      title: 'مبادئ الأنظمة الموزعة فائقة المرونة',
      date: 'أغسطس 2025',
      readTime: 'قراءة 4 دقائق',
      excerpt:
        'الأعطال حتمية في الشبكات الموزعة. تكمن البراعة المعمارية الحقيقية ليس في محاولة منع الأعطال، بل في حصر نطاق تأثيرها بدقة عبر العزل الخلوي (Cell-based Isolation) والعمليات المتطابقة النتيجة (Idempotency).',
    },
    {
      title: 'التعاون بين الإنسان والذكاء الاصطناعي في هندسة النظم',
      date: 'يونيو 2025',
      readTime: 'قراءة 6 دقائق',
      excerpt:
        'يبرع الوكلاء الأذكياء في المهام الميكانيكية الشاملة وتدقيق الأكواد؛ بينما يتفوق الإنسان في التقدير الاستراتيجي والحكمة الأخلاقية. الفرق الهندسية الرائدة تصمم طبقات تنسيق تكاملية تستثمر الميزتين معاً.',
    },
    {
      title: 'فلسفة التصميم الأحادي الفاخر (Monochrome Design)',
      date: 'مايو 2025',
      readTime: 'قراءة 3 دقائق',
      excerpt:
        'حين تجرد الواجهة من الضجيج اللوني، يعتمد التسلسل البصري كلياً على تباين الأسطح، وإيقاع الخطوط، وتوازن المسافات، والارتفاعات الهادئة. التباين هو جوهر الوضوح والأناقة.',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 text-[#191816] select-text">
      <div className="border-b border-[#E5E0D6] pb-4">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
          الملاحظات المعمارية والمقالات الهندسية
        </span>
        <h2 className="font-serif text-[30px] font-bold leading-tight text-[#191816] mt-1">
          مبادئ المعمارية وسجل الخبرات القيادية
        </h2>
        <p className="text-[13px] text-[#504A43] mt-1">
          تأملات ورؤى حول هندسة البرمجيات الموزعة، وبيئات العمل المتقدمة، وفلسفة المنتجات الرقمية.
        </p>
      </div>

      <div className="space-y-4">
        {notes.map((note, idx) => (
          <article
            key={idx}
            className="p-5 rounded-2xl bg-white/80 border border-[#E5E0D6] shadow-sm hover:border-[#B8B1A5] transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-[#756F66]">
              <span>{note.date}</span>
              <span>{note.readTime}</span>
            </div>
            <h3 className="font-serif text-[20px] font-bold text-[#191816] mt-2">
              {note.title}
            </h3>
            <p className="text-[13px] text-[#4B4741] mt-2 leading-relaxed">
              {note.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { soundFx } from '../../../utils/audio';

interface TermLine {
  text: string;
  type: 'cmd' | 'output' | 'error' | 'success' | 'info';
}

export const TerminalAppWindow: React.FC = () => {
  const { profile, locationNodes, closeWindow, openWindow } = useOS();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TermLine[]>([
    { text: 'طرفية Almdrasa Gateway التفاعلية v2.4.0 (x86_64-studio-mesh)', type: 'info' },
    { text: 'اكتب "help" أو "مساعدة" لعرض الأوامر المتاحة. اضغط Tab للإكمال التلقائي.', type: 'info' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    soundFx.playClick(600, 0.03);
    const newHistory: TermLine[] = [...history, { text: `gateway@almdrasa:~$ ${cmd}`, type: 'cmd' }];

    const [action, ...args] = cmd.toLowerCase().split(' ');

    switch (action) {
      case 'help':
      case 'مساعدة':
        newHistory.push(
          { text: 'سجل أوامر طرفية Almdrasa Gateway المتاحة:', type: 'success' },
          { text: '  about / نبذة        طباعة ملخص السيرة الذاتية والبيانات التنفيذية', type: 'output' },
          { text: '  projects / مشاريع   استعراض الأنظمة المعمارية المنشورة', type: 'output' },
          { text: '  nodes / عقد         فحص حالة العقد السحابية وزمن الاستجابة', type: 'output' },
          { text: '  neofetch            عرض مواصفات النظام والعتاد والبيانات الفنية', type: 'output' },
          { text: '  matrix              تفعيل وضع تدفق الكود الرقمي الأخضر', type: 'output' },
          { text: '  curiosities / حقائق استكشاف المفاجآت التفاعلية لنظام Almdrasa Gateway', type: 'output' },
          { text: '  tokens / ألوان       عرض لوحة الألوان الأحادية ونظام التصميم', type: 'output' },
          { text: '  clear / مسح         مسح سجل شاشة الطرفية', type: 'output' },
          { text: '  exit / خروج         إغلاق نافذة الطرفية', type: 'output' }
        );
        break;

      case 'neofetch':
        newHistory.push(
          { text: '       .---.        نظام التشغيل: Almdrasa Gateway v2.4 (x86_64)', type: 'info' },
          { text: '      /     \\       المضيف: منصة بوابة المدرسة (Almdrasa Gateway)', type: 'info' },
          { text: '     | () () |      النواة: 6.12.0-almdrasa-production', type: 'info' },
          { text: '      \\  _  /       الجاهزية: 99.999% SLA (14 سنة خبرة)', type: 'info' },
          { text: '       `---\'        الصدفة: gateway-sh 2.4.0', type: 'info' },
          { text: '                    الدقة: 3840x2160 (HiDPI)', type: 'output' },
          { text: '                    السمة: أحادية فاخرة (#0B0B0A / #F8F6F1)', type: 'output' },
          { text: '                    العقد: دوسلدورف (18ms) · أتلانتا (42ms)', type: 'output' }
        );
        break;

      case 'matrix':
        newHistory.push(
          { text: '01001001 01101110 01101001 01110100 01101001 01100001 01110100 01101001 01101110 01100111', type: 'success' },
          { text: '01010011 01111001 01110011 01110100 01100101 01101101 00100000 01000011 01101111 01110010 01100101', type: 'success' },
          { text: 'تم تفعيل وضع Matrix الرقمي: مرحباً بك في البناء الهندسي.', type: 'output' }
        );
        break;

      case 'curiosities':
      case 'easteregg':
      case 'حقائق':
        newHistory.push(
          { text: 'حقائق وأسرار نظام Almdrasa Gateway التفاعلي:', type: 'success' },
          { text: '1. راقب روبوت المساعد: عند إغلاق أو تصغير النافذة الرئيسية، يستقر تلقائياً فوق شريط المهام!', type: 'output' },
          { text: '2. ودجت نظام الأمان يسجل حركات الفأرة وحالة نشاط التبويب في الوقت الفعلي.', type: 'output' },
          { text: '3. اضغط ⌘K أو Ctrl+K في أي وقت لتشغيل لوحة الأوامر والبحث الفوري.', type: 'output' },
          { text: '4. يعتمد نظام التصميم على إيقاع 4px شبكي متقن مع خطوط عربية فائقة الدقة.', type: 'output' }
        );
        break;

      case 'about':
      case 'نبذة':
        newHistory.push(
          { text: `الملف: ${profile.name} — ${profile.primaryRole} و ${profile.secondaryRole}`, type: 'success' },
          { text: profile.bioSummary, type: 'output' },
          { text: `الاعتمادات المهنية: ${profile.credentials.join(' · ')}`, type: 'info' }
        );
        break;

      case 'projects':
      case 'مشاريع':
        newHistory.push(
          { text: 'سجل الأنظمة الإنتاجية المنشورة:', type: 'success' },
          { text: '1. سجل Aura المالي [Rust/Kafka] — معالجة 80,000 عملية/ثانية، حجم $4.2B', type: 'output' },
          { text: '2. منصة Nexus لحوكمة الذكاء الاصطناعي [Python/VectorDB] — 45k مستخدم، خفض زمن الاستجابة 70%', type: 'output' },
          { text: '3. شبكة Zero-Trust للهوية العالمية [Go/eBPF] — متوافقة مع SOC2 Type II', type: 'output' }
        );
        break;

      case 'nodes':
      case 'عقد':
        newHistory.push({ text: 'العقد السحابية العالمية النشطة:', type: 'info' });
        locationNodes.forEach((node) => {
          newHistory.push({
            text: `  [نشط] ${node.city} (${node.country}) — استجابة ${node.pingMs}ms · الحالة طبيعية`,
            type: 'success',
          });
        });
        break;

      case 'tokens':
      case 'ألوان':
        newHistory.push(
          { text: 'لوحة ألوان نظام Almdrasa Gateway الأحادية الفاخرة:', type: 'info' },
          { text: '  السطح الداكن: #0B0B0A · السطح الفاتح: #F8F6F1 · المرتفع: #292724', type: 'output' },
          { text: '  النصوص الفاتحة: #191816 · النصوص الداكنة: #F3EFE7 · لون التمييز: #2F6FCE', type: 'output' },
          { text: '  الإيقاع: شبكة 4px · حواف النوافذ: 20px · حواف الأزرار: 8px', type: 'output' }
        );
        break;

      case 'open':
      case 'فتح':
        if (args[0] && ['home', 'about', 'projects', 'notes'].includes(args[0])) {
          openWindow(args[0] as any);
          newHistory.push({ text: `تم فتح النافذة: ${args[0]}`, type: 'success' });
        } else {
          newHistory.push({ text: 'طريقة الاستخدام: open <home|about|projects|notes>', type: 'error' });
        }
        break;

      case 'clear':
      case 'مسح':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
      case 'خروج':
        closeWindow('terminal');
        return;

      default:
        newHistory.push({
          text: `أمر غير معروف: "${cmd}". اكتب "help" أو "مساعدة" لعرض قائمة الأوامر.`,
          type: 'error',
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="h-full bg-[#0B0B0A] text-[#F3EFE7] p-4 font-mono text-[13px] flex flex-col justify-between overflow-y-auto min-h-90 text-right">
      <div className="space-y-1.5 leading-relaxed">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.type === 'cmd'
                ? 'text-[#C5B79E] font-semibold dir-ltr text-left'
                : line.type === 'error'
                ? 'text-[#CC675B]'
                : line.type === 'success'
                ? 'text-[#9FA994]'
                : line.type === 'info'
                ? 'text-[#2F6FCE]'
                : 'text-[#D4CFC5]'
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Prompt Input */}
      <form onSubmit={handleCommand} className="mt-4 flex items-center gap-2 pt-2 border-t border-white/10 dir-ltr">
        <span className="text-[#9FA994] font-semibold">gateway@almdrasa:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type a command (e.g. help, about, nodes, neofetch)..."
          style={{ color: '#F8F4EC' }}
          className="flex-1 bg-transparent focus:outline-none border-none placeholder:text-white/20 font-mono text-[13px]"
          autoFocus
        />
        <button
          type="submit"
          className="p-1 rounded text-white/40 hover:text-white transition-colors"
          aria-label="تنفيذ الأمر"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

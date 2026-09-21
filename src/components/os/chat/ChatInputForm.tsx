import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronUp } from 'lucide-react';

const COMMANDS = [
  {
    id: 'customer-service',
    label: '📞 التواصل مع خدمة العملاء',
    message: 'لو سمحت محتاج أتواصل مع خدمة عملاء منصة المدرسة',
  },
  {
    id: 'elimination',
    label: '🛡️ نظام الإقصاء وضوابط المنحة',
    message: 'عايز أعرف تفاصيل ونظام الإقصاء والتقييم في الدفعة السادسة',
  },
  {
    id: 'pricing',
    label: '💳 أسعار وأنظمة سداد المنحة',
    message: 'إيه هي أسعار المنحة وتفاصيل التقسيط والدفع؟',
  },
  {
    id: 'curriculum',
    label: '📚 منهج المنحة والتقنيات والمشاريع',
    message: 'إيه هو المنهج والتقنيات اللي هندرسها والمشاريع العملية؟',
  },
  {
    id: 'timeline',
    label: '🗓️ الجدول الزمني ومواعيد التخرج',
    message: 'إيه هي مواعيد المنحة والجدول الزمني وميعاد التخرج؟',
  },
  {
    id: 'internship',
    label: '💼 تدريب وفرص توظيف homains',
    message: 'عايز أعرف تفاصيل تدريب شركة homains وفرص التوظيف',
  },
  {
    id: 'mentors',
    label: '👥 الميتنج الأسبوعي ومراجعة الكود',
    message: 'إزاي بنحضر الاجتماعات الأسبوعية والدعم المباشر ومراجعة الكود؟',
  },
];

interface ChatInputFormProps {
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  studentName: string;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  onSendMessage,
  isProcessing,
  studentName,
}) => {
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside (ignoring clicks on the toggle trigger button)
  useEffect(() => {
    if (!showCommands) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setShowCommands(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCommands]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  const handleCommand = (message: string) => {
    setShowCommands(false);
    if (isProcessing) return;
    onSendMessage(message);
  };

  return (
    <div className="relative border-t border-white/10 bg-[#161513] chat-input-in">
      {/* Commands pop-up menu */}
      {showCommands && (
        <div
          ref={menuRef}
          className="absolute bottom-full left-0 right-0 mx-3 mb-2 rounded-xl bg-[#1C1B18] border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-150 max-h-64 overflow-y-auto"
          role="menu"
          aria-label="قائمة الأوامر"
        >
          <p className="px-3.5 pt-2.5 pb-1.5 text-[11px] text-white/40 font-medium tracking-wide">
            الأوامر المتاحة
          </p>
          <div className="divide-y divide-white/5">
            {COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                role="menuitem"
                onClick={() => handleCommand(cmd.message)}
                className="w-full text-right px-3.5 py-2.5 text-[13px] text-[#F3EFE7] hover:bg-[#DFCA9F]/10 hover:text-[#DFCA9F] transition-colors cursor-pointer flex items-center gap-2"
              >
                {cmd.label}
              </button>
            ))}
          </div>
          <div className="h-1.5" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-3 flex items-center gap-2"
      >
        {/* Commands trigger button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setShowCommands((v) => !v)}
          aria-label="الأوامر"
          aria-expanded={showCommands}
          aria-haspopup="menu"
          className={`p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
            showCommands
              ? 'bg-[#DFCA9F]/15 border-[#DFCA9F]/40 text-[#DFCA9F]'
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-200 ${showCommands ? 'rotate-180' : ''}`}
          />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          placeholder={`اكتب سؤالك هنا يا ${studentName}...`}
          style={{ color: '#F8F4EC' }}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-[#DFCA9F] text-right disabled:opacity-50 transition-all"
        />

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] font-bold hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer disabled:pointer-events-none shadow-xs shrink-0"

          aria-label="إرسال الرسالة"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
};

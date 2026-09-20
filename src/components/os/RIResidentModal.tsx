import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { soundFx } from '../../utils/audio';

import { WindowId } from '../../types/os';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionText?: string;
  actionWindow?: WindowId;
}

interface RIResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RIResidentModal: React.FC<RIResidentModalProps> = ({ isOpen, onClose }) => {
  const { openWindow, profile } = useOS();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `أهلاً بك! أنا المساعد الذكي المقيم لنظام Almdrasa Gateway. كيف يمكنني مساعدتك اليوم في استكشاف المسيرة المهنية والمشاريع الهندسية؟`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'تفاصيل المنحة', query: 'ما هي تفاصيل ومميزات منحة المدرسة؟' },
    { label: 'القيادة التنفيذية', query: 'أخبرني عن خبرات روبرتو القيادية والتنفيذية' },
    { label: 'البنية والتقنيات', query: 'ما هي البنية التحتية والتقنيات التي يتخصص بها روبرتو؟' },
    { label: 'مفاجآت الطرفية', query: 'ما هي الأوامر والمفاجآت المخفية في طرفية النظام؟' },
    { label: 'التواصل والاستشارات', query: 'كيف يمكنني التواصل مع روبرتو للأدوار الاستشارية والقيادية؟' },
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;
    soundFx.playClick(600, 0.03);

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      soundFx.playPop();
      setIsTyping(false);
      const lower = userText.toLowerCase();

      let botReply: ChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: "يسعدني جداً مساعدتك في استكشاف ذلك! يمكنك الاستفسار عن تفاصيل المشاريع أو استعراض التطبيقات المتاحة في شريط المهام.",
      };

      if (
        lower.includes('منح') ||
        lower.includes('دبلوم') ||
        lower.includes('تدريب') ||
        lower.includes('homains') ||
        lower.includes('خصم') ||
        lower.includes('قسط') ||
        lower.includes('كاش') ||
        lower.includes('scholarship')
      ) {
        botReply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `منحة المدرسة هي دبلومة الواجهة الأمامية الشاملة بتخفيض 87% (4500ج بدلاً من 34000ج). تتميز بتدريب ميداني مدفوع الثمن للأوائل لمدة شهرين في شركة homains بمصر، مع إشراف ومتابعة مجانية طوال الـ 12 شهراً.`,
          actionText: 'استعراض تفاصيل المنحة الكاملة ←',
          actionWindow: 'scholarship',
        };
      } else if (
        lower.includes('قيا') ||
        lower.includes('خبر') ||
        lower.includes('نبذ') ||
        lower.includes('leader') ||
        lower.includes('experience') ||
        lower.includes('about')
      ) {
        botReply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `${profile.name} هو قائد تقني ومدير تنفيذي للمنتجات حاصل على ماجستير إدارة الأعمال (MBA) وشهادات PMP® و ITIL® المعتمدة، مع خبرة تتجاوز 14 عاماً في ربط الاستراتيجيات بالتقنيات الموزعة الحديثة.`,
          actionText: 'فتح السيرة الذاتية الكاملة ←',
          actionWindow: 'about',
        };
      } else if (
        lower.includes('تقني') ||
        lower.includes('بني') ||
        lower.includes('مشاريع') ||
        lower.includes('tech') ||
        lower.includes('stack') ||
        lower.includes('architecture')
      ) {
        botReply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `يتخصص روبرتو في البنية التحتية السحابية فائقة الأداء، وحوكمة الأمن السيبراني (SOC2، Zero-Trust)، وبوابات تنسيق وكلاء الذكاء الاصطناعي، ومعالجة البيانات المتدفقة (Rust, Go, Kafka, Kubernetes).`,
          actionText: 'استعراض المشاريع الهندسية ←',
          actionWindow: 'projects',
        };
      } else if (
        lower.includes('مفاج') ||
        lower.includes('طرفي') ||
        lower.includes('سر') ||
        lower.includes('egg') ||
        lower.includes('terminal') ||
        lower.includes('curiosities')
      ) {
        botReply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `اكتشفت سراً تفاعلياً! افتح طرفية Almdrasa Gateway واكتب 'matrix' أو 'neofetch' أو 'curiosities' لكشف سجلات النظام والمفاجآت المخفية.`,
          actionText: 'تشغيل طرفية الاستوديو ←',
          actionWindow: 'terminal',
        };
      } else if (
        lower.includes('تواصل') ||
        lower.includes('بريد') ||
        lower.includes('استشار') ||
        lower.includes('contact') ||
        lower.includes('reach') ||
        lower.includes('email') ||
        lower.includes('hire')
      ) {
        botReply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `يمكنك التواصل مع روبرتو مباشرة عبر شبكة LinkedIn أو إرسال مراسلة رسمية للاستشارات والأدوار القيادية التنفيذية ومجالس الإدارة.`,
          actionText: 'فتح نافذة التواصل التنفيذي ←',
          actionWindow: 'contact',
        };
      }

      setMessages((prev) => [...prev, botReply]);
    }, 650);
  };

  return (
    <div
      className="fixed inset-0 z-2147483647 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="المساعد الذكي المقيم"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#141311] border border-white/14 shadow-[0_36px_100px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#F3EFE7] h-130 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#1B1A18]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#C5B79E] text-[#191816] flex items-center justify-center font-bold text-[12px] shadow-sm">
              RI
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#F8F4EC] flex items-center gap-1.5">
                <span>المساعد المقيم (RI Resident)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#9FA994] animate-pulse" />
              </div>
              <div className="text-[11px] text-[#A69F93]">المساعد الذكي للملف التعريفي</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="إغلاق المساعد الذكي"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#2F6FCE] text-white rounded-br-none text-right'
                    : 'bg-[#1E1C1A] text-[#F3EFE7] border border-white/10 rounded-bl-none text-right'
                }`}
              >
                <p>{msg.text}</p>
                {msg.actionText && msg.actionWindow && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      openWindow(msg.actionWindow!);
                      onClose();
                    }}
                    className="mt-2 text-[12px] font-medium text-[#C5B79E] hover:text-[#F8F4EC] flex items-center gap-1 transition-colors"
                  >
                    <span>{msg.actionText}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1E1C1A] border border-white/10 w-16">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5B79E] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5B79E] animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5B79E] animate-bounce [animation-delay:0.3s]" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-3 py-2 border-t border-white/8 bg-[#0E0D0C] flex flex-wrap gap-1.5">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip.query)}
              className="px-2.5 py-1 rounded-full text-[11px] bg-white/6 hover:bg-white/10 border border-white/10 text-[#D4CFC5] transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 border-t border-white/10 bg-[#141311] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل المساعد المقيم أي سؤال عن روبرتو والأنظمة..."
            style={{ color: '#F8F4EC' }}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-[13px] placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#2F6FCE] text-right"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-[#292724] text-[#F8F4EC] hover:bg-[#38342F] disabled:opacity-40 transition-all border border-white/10"
            aria-label="إرسال الرسالة"
          >
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

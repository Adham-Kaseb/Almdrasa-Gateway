import React, { useState } from 'react';
import { Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { useOS } from '../../../context/OSContext';
import { soundFx } from '../../../utils/audio';

export const ContactAppWindow: React.FC = () => {
  const { profile } = useOS();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    soundFx.playPop();
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-[#191816] select-text">
      {/* Header */}
      <div className="border-b border-[#E5E0D6] pb-4">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#756F66]">
          المراسلات والاستفسارات الرسمية
        </span>
        <h2 className="font-serif text-[30px] font-bold leading-tight text-[#191816] mt-1">
          التواصل التنفيذي وبدء التعاون
        </h2>
        <p className="text-[13px] text-[#504A43] mt-1">
          تواصل مباشرة للاستشارات التقنية القيادية، أو أدوار مجالس الإدارة، أو الاستشارات الاستراتيجية.
        </p>
      </div>

      {isSent ? (
        <div className="p-8 rounded-2xl bg-[#9FA994]/20 border border-[#9FA994]/40 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#47523F] mx-auto" />
          <h3 className="font-serif text-[22px] font-bold text-[#191816]">تم إرسال المراسلة بنجاح</h3>
          <p className="text-[13px] text-[#504A43]">
            شكراً لتواصلك. تم إرسال رسالتك مباشرة إلى صندوق المراسلات التنفيذية لروبرتو وسيتم الرد قريباً.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#756F66] mb-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: د. طارق المنصور"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4CFC5] bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2F6FCE]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#756F66] mb-1">
                البريد الإلكتروني المهني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="مثال: tarek@enterprise.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4CFC5] bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2F6FCE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#756F66] mb-1">
              نص الرسالة أو تفاصيل التعاون
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="قدم ملخصاً موجزاً عن موضوع الاستشارة أو التعاون المقترح..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4CFC5] bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2F6FCE]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href={profile.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#2F6FCE] hover:text-[#5B95E8] flex items-center gap-1 font-medium"
            >
              <span>التواصل عبر LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#292724] text-[#F8F4EC] text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1B1A18] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FCE]"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
              <span>إرسال المراسلة</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

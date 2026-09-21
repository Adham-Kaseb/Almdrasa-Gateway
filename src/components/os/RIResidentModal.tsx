import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { useAuth } from '../../context/AuthContext';
import { soundFx } from '../../utils/audio';
import { WindowId } from '../../types/os';
import { queryAlmdrasaKnowledge, getFriendlyStudentName } from '../../utils/botKnowledgeEngine';
import { ChatHeader } from './chat/ChatHeader';
import { ChatThinkingIndicator } from './chat/ChatThinkingIndicator';
import { ChatMessageList, ChatMessage } from './chat/ChatMessageList';
import { ChatInputForm } from './chat/ChatInputForm';
import { WhatsAppRedirectOverlay } from './chat/WhatsAppRedirectOverlay';

const CUSTOMER_SERVICE_TRIGGER = 'لو سمحت محتاج أتواصل مع خدمة عملاء منصة المدرسة';
const CUSTOMER_SERVICE_REPLY = 'جار تحويلكم لمسؤول خدمة العملاء';
const WHATSAPP_NUMBER = '201000240033';
const WHATSAPP_TEXT = encodeURIComponent(
  'السلام عليكم، بتواصل مع حضراتكم من داخل Almdrasa Gateway، عندي استفسار بخصوص الآتي:'
);

interface RIResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Animated chat modal. Uses a two-phase mount/unmount approach:
 *  - `mounted` controls whether the DOM node exists
 *  - `visible` drives the CSS animation class (in vs out)
 */
export const RIResidentModal: React.FC<RIResidentModalProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useOS();
  const { student, user } = useAuth();
  const studentName = getFriendlyStudentName(student?.full_name || user?.user_metadata?.full_name);

  // ── Animation state ──────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // allow paint before triggering animation class
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      // wait for exit animation before unmounting (200ms)
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Messages state ───────────────────────────────────────────────────────
  const makeWelcome = (name: string): ChatMessage => ({
    id: 'welcome',
    sender: 'bot',
    text:
      `السلام عليكم ورحمة الله وبركاته يا ${name}! منوّر منصة مدرسة Almdrasa يا بطل.\n\n` +
      `أنا المساعد الذكي بتاعك هنا عشان أجاوبك على أي حاجة محتاجها وتخص المنحة، المنهج، نظام الإقصاء وفترة الأمان، والاجتماعات الأسبوعية.\n\n` +
      `قول لي، حابب تسأل عن إيه النهاردة؟`,
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => [makeWelcome(studentName)]);
  const [isThinking, setIsThinking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [makeWelcome(studentName)];
      }
      return prev;
    });
  }, [studentName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!mounted) return null;

  // ── Customer-service flow ────────────────────────────────────────────────
  const triggerCustomerServiceFlow = () => {
    setTimeout(() => {
      setIsThinking(true);
      setTimeout(() => {
        soundFx.playPop();
        setIsThinking(false);
        setIsProcessing(false);
        setMessages((prev) => [
          ...prev,
          { id: Math.random().toString(), sender: 'bot', text: CUSTOMER_SERVICE_REPLY },
        ]);
        setTimeout(() => setShowRedirect(true), 600);
      }, 2000);
    }, 1000);
  };

  const handleSend = (userText: string) => {
    if (!userText.trim() || isProcessing) return;
    soundFx.playClick(600, 0.03);

    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: userText.trim() },
    ]);
    setIsProcessing(true);

    if (userText.trim() === CUSTOMER_SERVICE_TRIGGER) {
      triggerCustomerServiceFlow();
      return;
    }

    setTimeout(() => {
      setIsThinking(true);
      setTimeout(() => {
        soundFx.playPop();
        setIsThinking(false);
        setIsProcessing(false);
        const reply = queryAlmdrasaKnowledge(userText, studentName);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: reply.text,
            actionText: reply.actionText,
            actionWindow: reply.actionWindow,
          },
        ]);
      }, 2000);
    }, 1000);
  };

  const handleOpenWindow = (windowId: WindowId) => {
    openWindow(windowId);
    onClose();
  };

  const handleRedirectComplete = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`, '_blank');
    setShowRedirect(false);
  };

  return (
    /* Backdrop */
    <div
      className={`fixed inset-0 z-2147483647 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md ${
        visible ? 'chat-backdrop-in' : 'chat-backdrop-out'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="المساعد الأكاديمي الذكي"
    >
      {/* Panel */}
      <div
        className={`w-full max-w-lg rounded-2xl bg-[#141311] border border-white/14 shadow-[0_36px_100px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#F3EFE7] h-135 text-right relative ${
          visible ? 'chat-panel-in' : 'chat-panel-out'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {showRedirect && <WhatsAppRedirectOverlay onComplete={handleRedirectComplete} />}

        <ChatHeader onClose={onClose} studentName={studentName} />
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <ChatMessageList messages={messages} onOpenWindow={handleOpenWindow} />
          {isThinking && <ChatThinkingIndicator />}
          <div ref={bottomRef} />
        </div>
        <ChatInputForm
          onSendMessage={handleSend}
          isProcessing={isProcessing}
          studentName={studentName}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { WindowId } from '../../../types/os';
import { soundFx } from '../../../utils/audio';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionText?: string;
  actionWindow?: WindowId;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  onOpenWindow: (windowId: WindowId) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  onOpenWindow,
}) => {
  return (
    <div className="space-y-3.5">
      {messages.map((msg, idx) => {
        const isUser = msg.sender === 'user';
        return (
          <div
            key={msg.id}
            // Each message slides from its side with a subtle stagger based on index
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${
              isUser ? 'chat-msg-user' : 'chat-msg-bot'
            }`}
            style={{ animationDelay: `${Math.min(idx * 40, 200)}ms` }}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm text-right select-text ${
                isUser
                  ? 'bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] font-medium rounded-br-xs shadow-md shadow-black/30'
                  : 'bg-[#1C1B18] text-[#F3EFE7] border border-white/10 rounded-bl-xs shadow-md shadow-black/40'
              }`}
            >
              <div className="space-y-3">
                {(() => {
                  // Format text so numbered items and bullet points have clear empty space between them
                  const formattedText = msg.text
                    .replace(/([^\n])\n(\s*(\d+[\.\)-]|•|\*|-)\s+)/g, '$1\n\n$2')
                    .trim();

                  return formattedText.split(/\n\n+/).map((paragraph, pIdx) => (
                    <p key={pIdx} className="whitespace-pre-line leading-relaxed">
                      {paragraph}
                    </p>
                  ));
                })()}
              </div>
              {msg.actionText && msg.actionWindow && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    onOpenWindow(msg.actionWindow!);
                  }}
                  className="mt-2.5 px-3 py-1.5 rounded-xl bg-white/6 hover:bg-[#DFCA9F]/15 border border-[#DFCA9F]/30 text-[#DFCA9F] hover:text-[#FFF9EE] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{msg.actionText}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

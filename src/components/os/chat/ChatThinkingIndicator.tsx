import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Animated "thinking" indicator shown while the bot is preparing its reply.
 * Slides in from the bottom-left. Dots animate with a continuous wave via
 * the `.chat-dot-wave` CSS utility class defined in index.css.
 */
export const ChatThinkingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start chat-msg-bot">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-bl-xs bg-[#1E1C1A] border border-[#DFCA9F]/20 shadow-md">
        {/* Pulsing sparkle icon */}
        <div className="w-5 h-5 rounded-lg bg-[#DFCA9F]/15 flex items-center justify-center text-[#DFCA9F] animate-pulse shrink-0">
          <Sparkles className="w-3 h-3" />
        </div>

        {/* Wave dots */}
        <div className="flex items-center gap-1.25" aria-label="جاري التفكير">
          <span className="w-2 h-2 rounded-full bg-[#DFCA9F] chat-dot-wave" />
          <span className="w-2 h-2 rounded-full bg-[#DFCA9F] chat-dot-wave" />
          <span className="w-2 h-2 rounded-full bg-[#DFCA9F] chat-dot-wave" />
        </div>

        <span className="text-[11.5px] font-medium text-[#C5B79E] select-none pr-1">
          ثواني بفكّر وبجهّزلك الإجابة...
        </span>
      </div>
    </div>
  );
};

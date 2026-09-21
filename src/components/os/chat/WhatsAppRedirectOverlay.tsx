import React, { useEffect, useState } from 'react';

interface WhatsAppRedirectOverlayProps {
  /** Called when the loading animation completes — caller should open WhatsApp */
  onComplete: () => void;
}

/**
 * Full-overlay loading animation shown after the bot says it's redirecting to customer service.
 * Auto-completes after ~2.8 s and calls `onComplete`.
 */
export const WhatsAppRedirectOverlay: React.FC<WhatsAppRedirectOverlayProps> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const DURATION = 2800; // ms
    const INTERVAL = 40;   // ms
    const step = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 150);
          return 100;
        }
        return next;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 rounded-2xl bg-[#141311]/95 backdrop-blur-sm animate-in fade-in duration-300"
      aria-live="polite"
      aria-label="جاري التحويل لخدمة العملاء"
    >
      {/* WhatsApp icon */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring */}
        <span className="absolute w-20 h-20 rounded-full bg-[#25D366]/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_40px_rgba(37,211,102,0.35)]">
          {/* WhatsApp SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-9 h-9 fill-white"
            aria-hidden="true"
          >
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.47 2.027 7.77L0 32l8.436-2.01A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.277 13.277 0 0 1-6.764-1.843l-.485-.288-5.005 1.193 1.215-4.87-.316-.5A13.244 13.244 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.29-9.9c-.4-.2-2.364-1.166-2.73-1.3-.366-.133-.633-.2-.9.2-.266.4-1.033 1.3-1.266 1.566-.233.267-.467.3-.867.1-.4-.2-1.688-.622-3.216-1.984-1.188-1.061-1.99-2.372-2.224-2.772-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.266-.4.4-.666.133-.267.066-.5-.034-.7-.1-.2-.9-2.167-1.233-2.967-.325-.78-.655-.674-.9-.686l-.766-.013c-.267 0-.7.1-1.067.5-.366.4-1.4 1.367-1.4 3.334 0 1.967 1.433 3.867 1.633 4.133.2.267 2.82 4.307 6.832 6.034.955.412 1.7.658 2.282.842.958.305 1.831.262 2.52.159.769-.115 2.364-.966 2.697-1.9.333-.933.333-1.733.233-1.9-.1-.167-.366-.267-.766-.467z" />
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-1.5 px-6">
        <p className="text-[15px] font-semibold text-[#F3EFE7]">
          جار التحويل لخدمة العملاء…
        </p>
        <p className="text-[12px] text-white/45">
          سيتم فتح واتساب خلال لحظات
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#25D366] transition-[width] duration-75"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

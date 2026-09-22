import React from 'react';

interface AlmdrasaLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const AlmdrasaLogo: React.FC<AlmdrasaLogoProps> = ({
  className = '',
  size = 32,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/app-logo.png"
        alt="Almdrasa Gateway Logo"
        width={size}
        height={size}
        className="shrink-0 drop-shadow-md rounded-xl object-contain"
      />
      {showText && (
        <div className="flex flex-col text-right leading-tight">
          <span className="font-bold text-sm tracking-wide text-white">
            بوابة المدرسة
          </span>
          <span className="text-[10px] text-[#DFCA9F] font-mono tracking-wider">
            Almdrasa Gateway
          </span>
        </div>
      )}
    </div>
  );
};

import React from 'react';

interface AdminProfileBadgeProps {
  displayName: string;
  avatarUrl?: string | null;
}

export const AdminProfileBadge: React.FC<AdminProfileBadgeProps> = ({
  displayName,
  avatarUrl,
}) => {
  const safeDisplayName =
    displayName && displayName !== 'مدير المنصة الرئيسي'
      ? displayName
      : 'مدير المنصة';
  const safeAvatarUrl =
    avatarUrl && !avatarUrl.includes('unsplash') ? avatarUrl : null;

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-linear-to-b from-white/7 to-white/3 border border-white/10 shadow-xs">
      <div className="relative">
        <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#24221C] border border-[#DFCA9F]/40 shrink-0 flex items-center justify-center font-extrabold text-[#DFCA9F] text-xs shadow-xs">
          {safeAvatarUrl ? (
            <img src={safeAvatarUrl} alt={safeDisplayName} className="w-full h-full object-cover" />
          ) : (
            safeDisplayName.charAt(0)
          )}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#11100E]" />
      </div>
      <div className="text-right leading-tight max-w-32.5 sm:max-w-40">
        <div className="text-xs font-bold text-[#F8F4EC] truncate">{safeDisplayName}</div>
        <div className="text-[10px] text-[#DFCA9F] font-semibold truncate flex items-center gap-1">
          <span>مدير المنصة</span>
        </div>
      </div>
    </div>
  );
};

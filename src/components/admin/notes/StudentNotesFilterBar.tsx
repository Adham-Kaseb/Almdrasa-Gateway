import React from 'react';
import { Search, RefreshCw, Filter, X } from 'lucide-react';

interface StudentNotesFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTrack: string;
  onSelectTrack: (track: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const StudentNotesFilterBar: React.FC<StudentNotesFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTrack,
  onSelectTrack,
  onRefresh,
  isLoading,
}) => {
  const tracks = [
    { id: 'all', label: 'كافة المسارات' },
    { id: 'General', label: 'المسار العام' },
    { id: 'Frontend', label: 'Frontend React' },
    { id: 'Backend', label: 'Backend Node' },
    { id: 'Fullstack', label: 'Fullstack Web' },
    { id: 'Mobile', label: 'Mobile Flutter' },
  ];

  return (
    <div className="p-3 rounded-2xl bg-[#141311]/90 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C857B] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم الطالب، بريده، أو عنوان الملاحظة وكلمات المحتوى..."
          aria-label="البحث في ملاحظات الطلاب"
          className="admin-input pl-9 pr-10 py-2 placeholder:text-[#7A746B]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="مسح البحث"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C857B] hover:text-[#F8F4EC] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Track Filter & Refresh Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1C1B17] border border-white/10">
          <Filter className="w-3.5 h-3.5 text-[#8C857B] shrink-0" />
          <select
            value={selectedTrack}
            onChange={(e) => onSelectTrack(e.target.value)}
            aria-label="تصفية الملاحظات حسب المسار"
            className="bg-transparent text-xs text-[#DFCA9F] font-medium focus:outline-hidden cursor-pointer"
          >
            {tracks.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#1C1B17] text-[#F8F4EC]">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="تحديث الملاحظات"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1C1B17] hover:bg-white/5 border border-white/10 text-xs text-[#C8C2B7] hover:text-[#F8F4EC] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#DFCA9F]' : ''}`} />
          <span className="hidden sm:inline">تحديث</span>
        </button>
      </div>
    </div>
  );
};

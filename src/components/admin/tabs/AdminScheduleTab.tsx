import React, { useState } from 'react';
import { Video, Globe, Save } from 'lucide-react';

export const AdminScheduleTab: React.FC = () => {
  const [meetingTitle, setMeetingTitle] = useState('جلسة المراجعة والـ Live Coding الأسبوعية');
  const [meetingTime, setMeetingTime] = useState('السبت 08:00 مساءً (توقيت القاهرة)');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/alm-dras-gw6');
  const [savedNotice, setSavedNotice] = useState(false);

  const arabCities = [
    { city: 'القاهرة', flag: '🇪🇬', diff: '00:00 (التوقيت المرجعي)' },
    { city: 'مكة المكرمة / الرياض', flag: '🇸🇦', diff: '+01:00 ساعة' },
    { city: 'دبي / أبوظبي', flag: '🇦🇪', diff: '+02:00 ساعة' },
    { city: 'عمان / بيروت', flag: '🇯🇴', diff: '+01:00 ساعة' },
    { city: 'الرباط / الدار البيضاء', flag: '🇲🇦', diff: '-01:00 ساعة' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Live Mentoring Meeting Settings */}
      <div className="p-6 rounded-3xl bg-[#141311]/90 border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F8F4EC]">إعدادات اللقاء الأسبوعي المباشر</h2>
            <p className="text-xs text-[#8C857B]">يتم تحديث هذه البيانات فورياً في نافذة اللقاءات الأسبوعية لدى الطلاب</p>
          </div>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            تم حفظ ونشر إعدادات اللقاء المباشر بنجاح لجميع الطلاب!
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[#C8C2B7] mb-1 font-semibold">عنوان اللقاء الأسبوعي</label>
            <input type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-[#C8C2B7] mb-1 font-semibold">موعد البث الأسبوعي</label>
            <input type="text" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-[#C8C2B7] mb-1 font-semibold">رابط جلسة البث (Google Meet / Zoom)</label>
            <input type="url" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className="admin-input" />
          </div>
          <div className="sm:col-span-3 flex justify-end pt-2">
            <button type="submit" className="px-5 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold flex items-center gap-1.5 hover:brightness-105 cursor-pointer">
              <Save className="w-4 h-4" />
              <span>حفظ وتحديث رابط اللقاء</span>
            </button>
          </div>
        </form>
      </div>

      {/* Arab Timezones Table */}
      <div className="p-6 rounded-3xl bg-[#141311]/90 border border-white/10">
        <div className="flex items-center gap-2.5 mb-4">
          <Globe className="w-4 h-4 text-[#DFCA9F]" />
          <h3 className="text-xs font-bold text-[#F8F4EC] uppercase tracking-wider">توقيتات العواصم العربية المعتمدة</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {arabCities.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#1C1B17] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.flag}</span>
                <span className="font-semibold text-[#F8F4EC]">{item.city}</span>
              </div>
              <span className="text-[11px] text-[#8C857B]">{item.diff}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

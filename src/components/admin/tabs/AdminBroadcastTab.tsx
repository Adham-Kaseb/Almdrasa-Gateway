import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Check, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import { AdminAnnouncement, AdminPlatformConfig } from '../../../types/admin';

interface AdminBroadcastTabProps {
  announcements: AdminAnnouncement[];
  platformConfig: AdminPlatformConfig;
  onAddAnnouncement: (ann: Omit<AdminAnnouncement, 'id' | 'created_at'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onToggleAnnouncement: (id: string) => void;
  onUpdateConfig: (updates: Partial<AdminPlatformConfig>) => void;
}

export const AdminBroadcastTab: React.FC<AdminBroadcastTabProps> = ({
  announcements,
  platformConfig,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncement,
  onUpdateConfig,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'urgent'>('info');
  const [urgentText, setUrgentText] = useState(platformConfig.urgent_banner_text);
  const [bannerEnabled, setBannerEnabled] = useState(platformConfig.urgent_banner_enabled);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    onAddAnnouncement({
      title: title.trim(),
      message: message.trim(),
      severity,
      is_active: true,
      is_pinned: false,
      target_track: 'all',
    });
    setTitle('');
    setMessage('');
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      urgent_banner_text: urgentText,
      urgent_banner_enabled: bannerEnabled,
    });
  };

  return (
    <div className="space-y-6">
      {/* Live Urgent Banner Editor */}
      <form onSubmit={handleSaveBanner} className="p-6 rounded-3xl bg-[#141311]/90 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#DFCA9F]">
            <Bell className="w-5 h-5" />
            <h2 className="text-sm font-bold text-[#F8F4EC]">شريط الإعلانات العاجل المباشر (Top Ticker)</h2>
          </div>
          <button
            type="button"
            onClick={() => setBannerEnabled(!bannerEnabled)}
            className="flex items-center gap-1.5 text-xs text-[#C8C2B7] cursor-pointer"
          >
            {bannerEnabled ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-[#7A746B]" />}
            <span>{bannerEnabled ? 'الشريط مفعل' : 'معطل'}</span>
          </button>
        </div>
        <p className="text-xs text-[#8C857B]">يظهر هذا الشريط في أعلى سطح مكتب جميع الطلاب بشكل مباشر وفوري.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={urgentText}
            onChange={(e) => setUrgentText(e.target.value)}
            placeholder="اكتب نص الإشعار العاجل هنا..."
            className="admin-input flex-1"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold hover:brightness-105 cursor-pointer">
            حفظ وتحديث الشريط
          </button>
        </div>
      </form>

      {/* New Announcement Form */}
      <form onSubmit={handleCreateAnnouncement} className="p-6 rounded-3xl bg-[#141311]/90 border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-[#F8F4EC] flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#DFCA9F]" />
          <span>نشر إعلان أكاديمي جديد</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-[#C8C2B7] mb-1">عنوان الإعلان</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: تسليم مشروع التخرج" className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]" />
          </div>
          <div>
            <label className="block text-[#C8C2B7] mb-1">درجة الأهمية</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} className="w-full bg-[#1C1B17] border border-white/10 rounded-xl px-3 py-2 text-[#F8F4EC]">
              <option value="info">إرشادي (Info)</option>
              <option value="warning">تنبيه هام (Warning)</option>
              <option value="urgent">عاجل جداً (Urgent)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-[#C8C2B7] mb-1">تفاصيل الإعلان</label>
          <textarea rows={2} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب نص الإعلان الموجه للطلاب..." className="w-full bg-[#1C1B17] border border-white/10 rounded-xl p-3 text-xs text-[#F8F4EC]" />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-5 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold flex items-center gap-1.5 hover:brightness-105 cursor-pointer">
            <Megaphone className="w-4 h-4 stroke-2" />
            <span>بث الإعلان الآن</span>
          </button>
        </div>
      </form>

      {/* Announcements List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#8C857B] uppercase tracking-wider">الإعلانات المنشورة حالياً ({announcements.length})</h4>
        {announcements.map((ann) => (
          <div key={ann.id} className="p-4 rounded-2xl bg-[#141311]/90 border border-white/10 flex items-start justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  ann.severity === 'urgent' ? 'bg-red-500/20 text-red-300' : ann.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {ann.severity}
                </span>
                <span className="font-bold text-[#F8F4EC]">{ann.title}</span>
              </div>
              <p className="text-xs text-[#C8C2B7] mt-1.5 leading-relaxed">{ann.message}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button type="button" onClick={() => onToggleAnnouncement(ann.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C8C2B7] cursor-pointer">
                {ann.is_active ? <Check className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-[#7A746B]" />}
              </button>
              <button type="button" onClick={() => onDeleteAnnouncement(ann.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

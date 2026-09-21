import React from 'react';
import {
  LayoutDashboard,
  Users,
  StickyNote,
  Calendar,
  ShieldAlert,
  Activity,
} from 'lucide-react';
import { AdminTab } from '../../types/admin';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  usersCount: number;
  notesCount?: number;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  usersCount,
  notesCount,
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'نظرة عامة وإحصائيات', icon: LayoutDashboard },
    { id: 'users', label: 'إدارة الطلاب والحسابات', icon: Users, badge: usersCount },
    { id: 'notes', label: 'ملاحظات الطلاب', icon: StickyNote, badge: notesCount },
    { id: 'schedule', label: 'الجدول واللقاءات', icon: Calendar },
    { id: 'elimination', label: 'ضوابط ومعايير الإقصاء', icon: ShieldAlert },
    { id: 'audit', label: 'سجل الأنشطة وقاعدة البيانات', icon: Activity },
  ];

  return (
    <aside className="w-64 border-l border-white/10 bg-[#141311]/95 p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
      <nav aria-label="أقسام لوحة الإدارة" className="space-y-1">
        <div className="px-3 py-2 text-[10px] uppercase font-bold text-[#8C857B] tracking-wider">
          وحدات التحكم والتشغيل
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-linear-to-r from-[#DFCA9F]/20 to-[#CCA868]/10 text-[#DFCA9F] border border-[#DFCA9F]/30 shadow-xs'
                  : 'text-[#9E988F] hover:text-[#F8F4EC] hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#DFCA9F]' : 'text-[#8C857B]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#DFCA9F] text-[#141311]'
                      : 'bg-white/10 text-[#C8C2B7]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

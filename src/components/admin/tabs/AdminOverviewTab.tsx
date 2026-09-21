import React from 'react';
import { Megaphone, Radio } from 'lucide-react';
import { AdminUser, AdminPlatformConfig } from '../../../types/admin';
import { AdminOverviewKPIs } from '../overview/AdminOverviewKPIs';
import { AdminOverviewQuickActions } from '../overview/AdminOverviewQuickActions';
import { AdminRecentStudentsCard } from '../overview/AdminRecentStudentsCard';
import { AdminCohortSummaryCard } from '../overview/AdminCohortSummaryCard';

interface AdminOverviewTabProps {
  users: AdminUser[];
  platformConfig: AdminPlatformConfig;
  onOpenAddUser: () => void;
  onOpenBroadcast: () => void;
  onExportExcel: () => void;
  onRunEliminationCheck: () => void;
  onNavigateUsers?: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  users,
  platformConfig,
  onOpenAddUser,
  onOpenBroadcast,
  onExportExcel,
  onRunEliminationCheck,
  onNavigateUsers,
}) => {
  const handleViewAllUsers = onNavigateUsers || onOpenAddUser;

  return (
    <div className="space-y-5">
      {/* Top Banner Ticker Alert if enabled */}
      {platformConfig.urgent_banner_enabled && platformConfig.urgent_banner_text && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-linear-to-r from-amber-500/15 via-[#DFCA9F]/10 to-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between shadow-lg shadow-amber-500/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Megaphone className="w-4 h-4 animate-bounce" />
            </div>
            <span className="font-semibold text-[13px]">{platformConfig.urgent_banner_text}</span>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5 shrink-0">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>شريط مباشر نشط</span>
          </span>
        </div>
      )}

      {/* KPI Metrics Grid */}
      <AdminOverviewKPIs users={users} />

      {/* Quick Action Shortcuts */}
      <AdminOverviewQuickActions
        onOpenAddUser={onOpenAddUser}
        onOpenBroadcast={onOpenBroadcast}
        onExportExcel={onExportExcel}
        onRunEliminationCheck={onRunEliminationCheck}
      />

      {/* Dynamic Data Panel (2-column layout to eliminate empty void) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AdminRecentStudentsCard
            users={users.filter((u) => u.role !== 'admin')}
            onViewAll={handleViewAllUsers}
          />
        </div>
        <div className="lg:col-span-1">
          <AdminCohortSummaryCard users={users} />
        </div>
      </div>
    </div>
  );
};

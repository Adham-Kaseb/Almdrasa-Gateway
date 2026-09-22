import React from 'react';
import { AdminUser, AdminPlatformConfig } from '../../../types/admin';
import { AdminOverviewKPIs } from '../overview/AdminOverviewKPIs';
import { AdminOverviewQuickActions } from '../overview/AdminOverviewQuickActions';
import { AdminRecentStudentsCard } from '../overview/AdminRecentStudentsCard';
import { AdminCohortSummaryCard } from '../overview/AdminCohortSummaryCard';

interface AdminOverviewTabProps {
  users: AdminUser[];
  platformConfig: AdminPlatformConfig;
  onOpenAddUser: () => void;
  onExportExcel: () => void;
  onRunEliminationCheck: () => void;
  onNavigateUsers?: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  users,
  platformConfig: _platformConfig,
  onOpenAddUser,
  onExportExcel,
  onRunEliminationCheck,
  onNavigateUsers,
}) => {
  const handleViewAllUsers = onNavigateUsers || onOpenAddUser;

  return (
    <div className="space-y-5">
      {/* KPI Metrics Grid */}
      <AdminOverviewKPIs users={users} />

      {/* Quick Action Shortcuts */}
      <AdminOverviewQuickActions
        onOpenAddUser={onOpenAddUser}
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

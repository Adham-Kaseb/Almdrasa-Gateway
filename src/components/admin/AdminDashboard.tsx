import React, { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import { AdminTab } from '../../types/admin';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminUsersTab } from './tabs/AdminUsersTab';
import { AdminScheduleTab } from './tabs/AdminScheduleTab';
import { AdminEliminationTab } from './tabs/AdminEliminationTab';
import { AdminBroadcastTab } from './tabs/AdminBroadcastTab';
import { AdminAuditTab } from './tabs/AdminAuditTab';
import { AdminStudentNotesTab } from './tabs/AdminStudentNotesTab';

interface AdminDashboardProps {
  onEnterStudentPreview: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onEnterStudentPreview,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const adminData = useAdminData();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0B0A] text-[#F3EFE7] overflow-hidden select-none font-sans" dir="rtl">
      {/* Executive Admin Header */}
      <AdminHeader
        onEnterPreview={onEnterStudentPreview}
        onRefresh={adminData.fetchAllData}
        isLoading={adminData.isLoading}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          usersCount={adminData.users.length}
        />

        {/* Content View Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-radial from-[#1A1916]/40 via-[#0E0D0C] to-[#0B0B0A]">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              users={adminData.users}
              platformConfig={adminData.platformConfig}
              onOpenAddUser={() => setActiveTab('users')}
              onOpenBroadcast={() => setActiveTab('broadcast')}
              onExportExcel={adminData.exportUsersToExcel}
              onRunEliminationCheck={() => {
                adminData.autoDetectAtRiskStudents();
                setActiveTab('elimination');
              }}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab
              users={adminData.users}
              onUpdateUser={adminData.updateUser}
              onAddUser={adminData.addUser}
              onDeleteUser={adminData.deleteUser}
              onExportExcel={adminData.exportUsersToExcel}
              onRefresh={adminData.fetchAllData}
              isLoading={adminData.isLoading}
            />
          )}

          {activeTab === 'notes' && <AdminStudentNotesTab />}

          {activeTab === 'schedule' && <AdminScheduleTab />}

          {activeTab === 'elimination' && (
            <AdminEliminationTab
              users={adminData.users}
              platformConfig={adminData.platformConfig}
              onUpdateConfig={adminData.updatePlatformConfig}
              onRunEliminationCheck={adminData.autoDetectAtRiskStudents}
              onUpdateUserStatus={(id, st) => adminData.updateUser(id, { status: st })}
            />
          )}

          {activeTab === 'broadcast' && (
            <AdminBroadcastTab
              announcements={adminData.announcements}
              platformConfig={adminData.platformConfig}
              onAddAnnouncement={adminData.addAnnouncement}
              onDeleteAnnouncement={adminData.deleteAnnouncement}
              onToggleAnnouncement={adminData.toggleAnnouncement}
              onUpdateConfig={adminData.updatePlatformConfig}
            />
          )}

          {activeTab === 'audit' && (
            <AdminAuditTab
              auditLogs={adminData.auditLogs}
              usersCount={adminData.users.length}
              coursesCount={adminData.courses.length}
            />
          )}
        </main>
      </div>
    </div>
  );
};

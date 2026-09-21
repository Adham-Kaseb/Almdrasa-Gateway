import React, { useState, useMemo } from 'react';
import { AdminUser, AdminUserUpdate, AdminNewUser } from '../../../types/admin';
import { AdminUsersFilterBar } from '../users/AdminUsersFilterBar';
import { AdminUsersTable } from '../users/AdminUsersTable';
import { AdminEditUserModal } from '../users/AdminEditUserModal';
import { AdminAddUserModal } from '../users/AdminAddUserModal';
import { AdminUserDeleteDialog } from '../users/AdminUserDeleteDialog';
import { AdminUserDetailsModal } from '../users/AdminUserDetailsModal';

interface AdminUsersTabProps {
  users: AdminUser[];
  onUpdateUser: (userId: string, data: Partial<AdminUserUpdate>) => Promise<{ success: boolean; error?: string }>;
  onAddUser: (data: AdminNewUser) => Promise<{ success: boolean; error?: string }>;
  onDeleteUser: (userId: string, hardDelete: boolean) => Promise<{ success: boolean; error?: string }>;
  onExportExcel: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onUpdateUser,
  onAddUser,
  onDeleteUser,
  onExportExcel,
  onRefresh,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      const nameMatch = u.full_name.toLowerCase().includes(q);
      const emailMatch = u.email.toLowerCase().includes(q);
      const phoneMatch = u.phone?.toLowerCase().includes(q) || false;
      const countryMatch = u.country?.toLowerCase().includes(q) || false;
      return nameMatch || emailMatch || phoneMatch || countryMatch;
    });
  }, [users, searchQuery]);

  return (
    <div className="space-y-4">
      <AdminUsersFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddUser={() => setIsAddModalOpen(true)}
        onExportExcel={onExportExcel}
        onRefresh={onRefresh}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-between text-xs text-[#8C857B] px-1">
        <span>عرض {filteredUsers.length} من أصل {users.length} حساب موجود في Supabase</span>
        <span className="text-[#DFCA9F]/90 font-medium">الدفعة السادسة 2026</span>
      </div>

      <AdminUsersTable
        users={filteredUsers}
        onViewUser={(u) => setViewingUser(u)}
        onEditUser={(u) => setEditingUser(u)}
        onDeleteUser={(id) => {
          const u = users.find((item) => item.id === id);
          if (u) setDeletingUser(u);
        }}
        onToggleStatus={async (user) => {
          const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
          await onUpdateUser(user.id, { status: nextStatus });
        }}
      />

      <AdminUserDetailsModal
        user={viewingUser}
        isOpen={Boolean(viewingUser)}
        onClose={() => setViewingUser(null)}
        onEdit={(u) => setEditingUser(u)}
      />

      <AdminEditUserModal
        user={editingUser}
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSave={onUpdateUser}
      />

      <AdminAddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddUser}
      />

      <AdminUserDeleteDialog
        user={deletingUser}
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={onDeleteUser}
      />
    </div>
  );
};

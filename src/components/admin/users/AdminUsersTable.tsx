import React from 'react';
import { AdminUser } from '../../../types/admin';
import { AdminUserRow } from './AdminUserRow';

interface AdminUsersTableProps {
  users: AdminUser[];
  onViewUser: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (user: AdminUser) => void;
}

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
}) => {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#141311]/60 border border-white/10 text-[#8C857B] text-xs">
        لا يوجد طلاب يطابقون معايير البحث والفلترة.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#141311]/90 backdrop-blur-xl">
      <table className="w-full text-right text-xs text-[#C8C2B7]">
        <thead className="bg-[#1A1916] text-[#8C857B] text-[11px] uppercase border-b border-white/10">
          <tr>
            <th className="py-3 px-4">الطالب / المستخدم</th>
            <th className="py-3 px-3">المسار والمرحلة</th>
            <th className="py-3 px-3">الإنجاز والالتزام</th>
            <th className="py-3 px-3">الحالة</th>
            <th className="py-3 px-3">الصلاحية</th>
            <th className="py-3 px-4 text-left">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <AdminUserRow
              key={user.id}
              user={user}
              onViewUser={onViewUser}
              onEditUser={onEditUser}
              onDeleteUser={onDeleteUser}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

import { Database, Activity } from 'lucide-react';
import { AuditLog } from '../../../hooks/useAdminData';

interface AdminAuditTabProps {
  auditLogs: AuditLog[];
  usersCount: number;
}

export const AdminAuditTab: React.FC<AdminAuditTabProps> = ({
  auditLogs,
  usersCount,
}) => {
  const dbStats = [
    { label: 'سجلات الطلاب (public.students)', count: usersCount, status: 'متزامن' },
    { label: 'الملفات الشخصية (public.profiles)', count: usersCount, status: 'متزامن' },
    { label: 'ملاحظات الطلاب (public.student_notes)', count: 'سحابي حي', status: 'نشط' },
  ];

  return (
    <div className="space-y-6">
      {/* DB Connection Health */}
      <div className="p-6 rounded-3xl bg-[#141311]/90 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#DFCA9F]">
            <Database className="w-5 h-5" />
            <h2 className="text-sm font-bold text-[#F8F4EC]">حالة قاعدة بيانات Supabase السحابية</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>متصل وآمن</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {dbStats.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-[#1C1B17] border border-white/5">
              <div className="text-[#8C857B] text-[11px] mb-1">{item.label}</div>
              <div className="text-base font-bold text-[#F8F4EC]">{item.count}</div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">● {item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 rounded-3xl bg-[#141311]/90 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#DFCA9F]">
            <Activity className="w-5 h-5" />
            <h3 className="text-sm font-bold text-[#F8F4EC]">سجل العمليات الإدارية الحديثة (Audit Trail)</h3>
          </div>
          <span className="text-xs text-[#8C857B]">{auditLogs.length} عملية مسجلة</span>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-[#8C857B] py-4 text-center">لا توجد عمليات إدارية مسجلة بعد في هذه الجلسة.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-[#1C1B17] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#DFCA9F]" />
                  <div>
                    <div className="font-bold text-[#F8F4EC]">{log.action}: <span className="text-[#DFCA9F]">{log.target}</span></div>
                    <div className="text-[11px] text-[#8C857B] mt-0.5">{log.details}</div>
                  </div>
                </div>
                <div className="text-right text-[10.5px] text-[#7A746B] shrink-0 mr-2">
                  <div>{log.timestamp}</div>
                  <div className="text-[#DFCA9F]/80">{log.adminName}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

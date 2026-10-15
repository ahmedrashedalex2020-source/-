import React from 'react';
import { AuditLog } from '../../types/menu';
import { History, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

interface AdminAuditLogsProps {
  logs: AuditLog[];
  lang: 'ar' | 'en';
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ logs, lang }) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5]">
        <h2 className="text-xl font-black text-[#392A23] flex items-center gap-2">
          <History className="w-5 h-5 text-[#A1312E]" />
          <span>{isAr ? 'سجل العمليات الإدارية وتاريخ التعديلات' : 'Audit Trail & Activity Log'}</span>
        </h2>
        <p className="text-xs text-[#755947] mt-0.5">
          {isAr
            ? 'سجل غير قابل للتعديل يوثق كافة التغييرات على الأسعار والمنتجات وإعدادات المطعم في Firestore'
            : 'Immutable log of administrative operations, price modifications, and settings updates'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8D8B5] overflow-hidden shadow-2xs">
        <div className="divide-y divide-[#E8D8B5]/50">
          {logs.map((log) => {
            const dateStr = new Date(log.timestamp).toLocaleString(isAr ? 'ar-OM' : 'en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div key={log.id} className="p-4 hover:bg-[#FFF9EF]/40 transition flex items-start gap-3 text-xs">
                <div className="p-2 rounded-xl bg-[#FFF9EF] border border-[#E8D8B5] text-[#A1312E] shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#392A23] font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {dateStr}
                    </span>
                  </div>

                  <p className="text-xs text-[#392A23] mt-1 font-medium">
                    {log.details}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[10px] text-[#755947]">
                    <span>بواسطة: {log.actorEmail}</span>
                    <span>•</span>
                    <span>النوع: {log.entityType}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {logs.length === 0 && (
            <div className="text-center py-12 text-[#755947]">
              <History className="w-8 h-8 mx-auto text-[#C58D38] mb-2 opacity-50" />
              <p className="font-bold">{isAr ? 'لا توجد سجلات نشاط مسجلة بعد' : 'No audit records found'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

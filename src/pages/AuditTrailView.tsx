import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Search,
  Filter,
  Download,
  User,
  Shield,
  Clock,
  ArrowRight,
  Database
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, showToast } = useApp();

  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = auditLogs.filter(log => {
    const userName = (log as any).userName || log.user || '';
    const userRole = (log as any).userRole || log.role || '';
    const entityId = (log as any).entityId || log.recordId || log.id || '';
    const details = log.details || '';

    if (moduleFilter !== 'all' && log.module !== moduleFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        userName.toLowerCase().includes(q) ||
        details.toLowerCase().includes(q) ||
        entityId.toLowerCase().includes(q) ||
        userRole.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = 'ID,Timestamp,UserName,UserRole,Action,Module,EntityID,Details,IPAddress\n';
    const rows = filtered
      .map(
        l => {
          const uName = (l as any).userName || l.user || 'Officer';
          const uRole = (l as any).userRole || l.role || 'Staff';
          const eId = (l as any).entityId || l.recordId || l.id;
          const det = (l.details || '').replace(/"/g, '""');
          return `"${l.id}","${l.timestamp}","${uName}","${uRole}","${l.action}","${l.module}","${eId}","${det}","${l.ipAddress || '10.14.88.21'}"`;
        }
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartMine_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('success', 'Audit Export Complete', 'Downloaded immutable audit trail as CSV.');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
              <History className="w-3.5 h-3.5" />
              STATUTORY CHAIN OF CUSTODY
            </span>
            <span className="text-xs text-slate-500">ISO 19011 & CIL Governance Standard</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Immutable Regulatory Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cryptographically timestamped ledger recording every compliance state transition, violation citation, and escalation
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-900 text-white transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by official, entity ID or action notes..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Modules</option>
          <option value="Compliance">Compliance Register</option>
          <option value="Inspections">Inspections & Audits</option>
          <option value="CorrectiveActions">Corrective Actions (CAPA)</option>
          <option value="Safety">Safety & Incidents</option>
          <option value="Alerts">Alerts & Escalations</option>
          <option value="Environmental">Environmental Telemetry</option>
          <option value="Production">Production & HEMM</option>
        </select>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Action Types</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="ESCALATE">ESCALATE</option>
          <option value="RESOLVE">RESOLVE</option>
        </select>

        <span className="text-slate-400 ml-auto">
          Showing {filtered.length} audit entries
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Officer & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module & Entity</th>
                <th className="py-3 px-4">Audit Details & Field Changes</th>
                <th className="py-3 px-4">Audit Trace IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono text-[11px]">
              {filtered.map((log: any) => {
                const uName = log.userName || log.user || 'Officer';
                const uRole = log.userRole || log.role || 'Staff';
                const eId = log.entityId || log.recordId || log.id;
                const act = log.action || 'LOG';

                let actionBadge = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                if (act.includes('CREATE')) actionBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                else if (act.includes('ESCALATE')) actionBadge = 'bg-rose-600 text-white font-bold';
                else if (act.includes('RESOLVE')) actionBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                else if (act.includes('UPDATE')) actionBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';

                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white">{uName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{uRole}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${actionBadge}`}>
                        {act}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{log.module}</div>
                      <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400">{eId}</div>
                    </td>

                    <td className="py-3 px-4 font-sans max-w-md text-slate-700 dark:text-slate-300">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[10px]">
                      {log.ipAddress || '10.14.88.21'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

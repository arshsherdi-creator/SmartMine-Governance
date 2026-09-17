import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertItem } from '../types';
import {
  Radio,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Check,
  Building2,
  Clock,
  Send,
  Layers
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { alerts, refreshData, showToast, currentUser, setActiveTab } = useApp();

  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = alerts.filter(a => {
    if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleAlertAction = async (alertId: string, action: 'acknowledge' | 'escalate' | 'resolve') => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userName: currentUser.name
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          action === 'resolve' ? 'success' : 'info',
          `Alert ${action === 'acknowledge' ? 'Acknowledged' : action === 'escalate' ? 'Escalated' : 'Resolved'}`,
          `Status updated for "${data.data.title}"`
        );
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Action Failed', 'Could not update alert status.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              CENTRALIZED ESCALATION INBOX
            </span>
            <span className="text-xs text-slate-500">DGMS Section 22 & CIL Protocol</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Real-Time Alerts & Statutory Escalations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated threshold exceedances, safety stop-work notices, and regulatory notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-rose-600 text-white flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            {alerts.filter(a => a.status === 'Active' && a.priority === 'Critical').length} Critical Active
          </span>
        </div>
      </div>

      {/* Escalation Hierarchy Architecture Banner (Step 7 in Demo) */}
      <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>Statutory 3-Tier Escalation Matrix</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded bg-slate-800/70 border border-slate-700/60">
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>Tier 1: Mine Level</span>
              <span className="text-[10px] text-slate-400">0 - 24 Hours</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Mine Safety Officer & Colliery Manager inspects site, initiates local cordon.
            </p>
          </div>
          <div className="p-2.5 rounded bg-slate-800/70 border border-slate-700/60">
            <div className="font-bold text-amber-400 flex items-center justify-between">
              <span>Tier 2: Subsidiary Level</span>
              <span className="text-[10px] text-slate-400">24 - 48 Hours</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Escalates to Area GM & Director Technical (ECL/BCCL). Technical review of CAPA.
            </p>
          </div>
          <div className="p-2.5 rounded bg-slate-800/70 border border-slate-700/60">
            <div className="font-bold text-rose-400 flex items-center justify-between">
              <span>Tier 3: Statutory Authority</span>
              <span className="text-[10px] text-slate-400">&gt; 48 Hours</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Direct notification to DGMS Zonal Dy. Director; Section 22 stoppage inquiry.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Alerts:</span>
        </div>

        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical Only</option>
          <option value="High">High Only</option>
          <option value="Medium">Medium Only</option>
          <option value="Low">Low Only</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Alert Statuses</option>
          <option value="Active">Active Alerts</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Escalated">Escalated to Corporate</option>
          <option value="Resolved">Resolved</option>
        </select>

        <span className="text-slate-400 ml-auto">
          Showing {filtered.length} of {alerts.length} registered events
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map(alert => {
          let priorityClass = 'bg-rose-600 text-white';
          let borderClass = 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20';

          if (alert.priority === 'High') {
            priorityClass = 'bg-amber-500 text-white';
            borderClass = 'border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20';
          } else if (alert.priority === 'Medium') {
            priorityClass = 'bg-blue-600 text-white';
            borderClass = 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20';
          } else if (alert.priority === 'Low') {
            priorityClass = 'bg-slate-500 text-white';
            borderClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20';
          }

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${borderClass}`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${priorityClass}`}>
                    {alert.priority}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {alert.type}
                  </span>
                  <span className="text-xs text-slate-400">• {alert.createdAt}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {alert.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {alert.description}
                </p>

                <div className="text-[11px] text-slate-500 font-medium">
                  Leasehold: <span className="text-slate-800 dark:text-slate-200 font-semibold">{alert.mineName}</span>
                  {alert.escalationPath && (
                    <span className="ml-3 text-rose-600 font-semibold">
                      Escalation Chain: {alert.escalationPath.join(' → ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {alert.status === 'Active' && (
                  <>
                    <button
                      onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => handleAlertAction(alert.id, 'escalate')}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-rose-700 hover:bg-rose-800 text-white transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Escalate Tier</span>
                    </button>
                  </>
                )}

                {alert.status === 'Acknowledged' && (
                  <>
                    <button
                      onClick={() => handleAlertAction(alert.id, 'escalate')}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-rose-700 hover:bg-rose-800 text-white transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Escalate</span>
                    </button>
                    <button
                      onClick={() => handleAlertAction(alert.id, 'resolve')}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                    >
                      Resolve Alert
                    </button>
                  </>
                )}

                {alert.status === 'Escalated' && (
                  <button
                    onClick={() => handleAlertAction(alert.id, 'resolve')}
                    className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                  >
                    Resolve Alert
                  </button>
                )}

                {alert.status === 'Resolved' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded">
                    <Check className="w-3.5 h-3.5" />
                    Resolved
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

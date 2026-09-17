import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SafetyIncident } from '../types';
import {
  AlertOctagon,
  Plus,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  Clock,
  CheckCircle2,
  X,
  Camera
} from 'lucide-react';

export const SafetyView: React.FC = () => {
  const { incidents, mines, refreshData, showToast, currentUser } = useApp();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [type, setType] = useState('Near Miss');
  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Major' | 'Critical'>('Moderate');
  const [location, setLocation] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState(0);
  const [description, setDescription] = useState('');
  const [immediateAction, setImmediateAction] = useState('');

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          mineId,
          severity,
          location,
          peopleInvolved,
          description,
          immediateAction,
          reportedBy: currentUser.name
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('warning', 'Safety Incident Logged', `Registered incident ${data.data.code} with automatic escalation.`);
        setIsReportOpen(false);
        setDescription('');
        setImmediateAction('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Logging Failed', 'Could not record safety incident.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              DGMS SAFETY OVERSIGHT
            </span>
            <span className="text-xs text-slate-500">Mines Act 1952 Mandatory Incident Registry</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Safety Incidents & Near-Miss Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated statutory incident notification, severity classification, and root cause logging
          </p>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-rose-700 hover:bg-rose-800 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Report Safety Incident</span>
        </button>
      </div>

      {/* Incidents Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Registered Safety & Near-Miss Records ({incidents.length})
          </span>
          <span className="text-xs text-slate-400">DGMS Format IV Statutory Logging</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Incident Code & Classification</th>
                <th className="py-3 px-4">Mine & Location</th>
                <th className="py-3 px-4">Reported Date & Reporter</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Personnel Affected</th>
                <th className="py-3 px-4">Investigation Status</th>
                <th className="py-3 px-4">Immediate Remediation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {incidents.map(inc => {
                let sevBadge = 'bg-slate-100 text-slate-700';
                if (inc.severity === 'Critical') sevBadge = 'bg-rose-600 text-white font-bold';
                else if (inc.severity === 'Major') sevBadge = 'bg-amber-500 text-white font-bold';
                else if (inc.severity === 'Moderate') sevBadge = 'bg-blue-600 text-white';

                return (
                  <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        {inc.code}
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                        {inc.type}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {inc.description}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{inc.mineName}</div>
                      <div className="text-[10px] text-slate-500">{inc.location}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{inc.reportedDate}</div>
                      <div className="text-[10px] text-slate-500">{inc.reportedBy}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${sevBadge}`}>
                        {inc.severity}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">
                      {inc.peopleInvolved > 0 ? (
                        <span className="text-rose-600">{inc.peopleInvolved} Personnel</span>
                      ) : (
                        <span className="text-slate-500 font-normal">None (Near-Miss)</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px] max-w-xs truncate">
                      {inc.immediateAction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Incident Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-50 dark:bg-rose-950/40">
              <h3 className="font-bold text-rose-900 dark:text-rose-100 text-base flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                Report Safety Incident / Near-Miss
              </h3>
              <button onClick={() => setIsReportOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Incident Classification *</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                  >
                    <option value="Near Miss">Near Miss (Hazard Pre-empted)</option>
                    <option value="Tension Crack / Highwall Spall">Tension Crack / Highwall Spall</option>
                    <option value="Machinery Failure / Haulage">Machinery Failure / Haulage</option>
                    <option value="Gas Influx / Telemetry Alert">Gas Influx / Telemetry Alert</option>
                    <option value="PPE Non-Compliance Cluster">PPE Non-Compliance Cluster</option>
                    <option value="Electrical Trip / Substation">Electrical Trip / Substation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Operational Mine *</label>
                  <select
                    value={mineId}
                    onChange={e => setMineId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  >
                    {mines.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Severity Level</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold"
                  >
                    <option value="Critical">Critical (Immediate Evacuation)</option>
                    <option value="Major">Major (Operation Halted)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Personnel Involved</label>
                  <input
                    type="number"
                    min={0}
                    value={peopleInvolved}
                    onChange={e => setPeopleInvolved(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Pit Location / Seam Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramp 3, Switchback 4 or Seam XV Timber Gang Area"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Factual Incident Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe observations, equipment involved, and environmental factors..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Immediate Action Enforced *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Shift stopped, danger cordon erected, power isolated, men evacuated..."
                  value={immediateAction}
                  onChange={e => setImmediateAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-rose-700 hover:bg-rose-800 text-white font-semibold flex items-center gap-1.5"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Submit Incident Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

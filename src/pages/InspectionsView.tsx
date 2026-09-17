import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Inspection, InspectionFinding } from '../types';
import {
  SearchCheck,
  Plus,
  AlertTriangle,
  FileCheck,
  Calendar,
  User,
  MapPin,
  Clock,
  Shield,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const InspectionsView: React.FC = () => {
  const { inspections, mines, refreshData, showToast, currentUser, setActiveTab } = useApp();

  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [capaFinding, setCapaFinding] = useState<{ finding: InspectionFinding; inspection: Inspection } | null>(null);

  // Schedule modal form
  const [title, setTitle] = useState('');
  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [inspectorName, setInspectorName] = useState(currentUser.name);
  const [inspectorRole, setInspectorRole] = useState(currentUser.roleTitle);
  const [type, setType] = useState('DGMS Statutory');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationDetails, setLocationDetails] = useState('');

  // CAPA Creation Form from violation (Step 6)
  const [capaTitle, setCapaTitle] = useState('');
  const [capaResponsible, setCapaResponsible] = useState('Er. Arvind Mukhopadhyay');
  const [capaPriority, setCapaPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Critical');
  const [capaDueDate, setCapaDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [capaDescription, setCapaDescription] = useState('');

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          mineId,
          inspectorName,
          inspectorRole,
          type,
          scheduledDate,
          locationDetails,
          status: 'Scheduled',
          riskLevel: 'Medium'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Inspection Scheduled', `Scheduled ${data.data.code} for ${data.data.mineName}`);
        setIsScheduleModalOpen(false);
        setTitle('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Scheduling Failed', 'Could not record scheduled inspection.');
    }
  };

  const handleCreateCAPA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!capaFinding) return;

    try {
      const res = await fetch('/api/corrective-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: capaTitle || `Rectify: ${capaFinding.finding.observation}`,
          source: 'Inspection',
          sourceId: capaFinding.inspection.code,
          mineId: capaFinding.inspection.mineId,
          violationCategory: capaFinding.finding.statutoryClause || 'Operational Safety',
          description: capaDescription || capaFinding.finding.observation,
          responsiblePerson: capaResponsible,
          priority: capaPriority,
          dueDate: capaDueDate,
          status: 'Assigned',
          userName: currentUser.name,
          userRole: currentUser.roleTitle
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Corrective Action Created (CAPA)', `Created ${data.data.code} and linked to ${capaFinding.inspection.code}`);
        setCapaFinding(null);
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'CAPA Creation Failed', 'Failed to create corrective action.');
    }
  };

  const openCAPAFromFinding = (finding: InspectionFinding, inspection: Inspection) => {
    setCapaFinding({ finding, inspection });
    setCapaTitle(`Rectify: ${finding.observation}`);
    setCapaDescription(`Statutory Violation observed under ${finding.statutoryClause || 'CMR 2017'}: ${finding.observation}`);
    setCapaPriority(finding.severity === 'Critical' ? 'Critical' : finding.severity === 'Major' ? 'High' : 'Medium');
  };

  return (
    <div className="space-y-5">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              DGMS & INTERNAL SAFETY AUDITS
            </span>
            <span className="text-xs text-slate-500">CMR 2017 Statutory Inspection Modules</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Mine Inspections & Statutory Audits
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Field audits, geotechnical slope checks, gas telemetry testing, and violation registers
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Inspection</span>
        </button>
      </div>

      {/* Inspections Table & List */}
      <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recorded Regulatory Inspections ({inspections.length})
          </div>
          <span className="text-xs text-slate-400">Click any inspection to view findings and convert violations into CAPA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Inspection Code & Title</th>
                <th className="py-3 px-4">Mine & Location</th>
                <th className="py-3 px-4">Inspector & Role</th>
                <th className="py-3 px-4">Audit Type</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Violations Observed</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {inspections.map(insp => {
                const hasViolations = insp.violationsCount > 0;

                return (
                  <tr
                    key={insp.id}
                    onClick={() => setSelectedInspection(insp)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                        {insp.code}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                        {insp.title}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{insp.mineName}</div>
                      <div className="text-[10px] text-slate-500">{insp.locationDetails}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{insp.inspectorName}</div>
                      <div className="text-[10px] text-slate-500">{insp.inspectorRole}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {insp.type}
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {insp.date}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        insp.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        insp.status === 'Non-Compliant' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}>
                        {insp.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {hasViolations ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          {insp.violationsCount} Violations
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Zero Violations</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInspection(insp);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600"
                      >
                        Inspect Findings →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Detail Modal (Step 5 in Demo Flow) */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedInspection.code}: {selectedInspection.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    selectedInspection.violationsCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedInspection.violationsCount > 0 ? `${selectedInspection.violationsCount} VIOLATIONS` : 'COMPLIANT'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedInspection.mineName} • {selectedInspection.date} • Inspector: {selectedInspection.inspectorName}
                </p>
              </div>
              <button onClick={() => setSelectedInspection(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Findings List */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="text-slate-700 dark:text-slate-300">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                  Inspector Findings & Statutory Citations
                </h4>

                {selectedInspection.findings.length === 0 ? (
                  <p className="text-slate-500 py-4">No specific line-item findings recorded for this routine inspection.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedInspection.findings.map(finding => (
                      <div
                        key={finding.id}
                        className={`p-3.5 rounded-lg border ${
                          finding.hasViolation
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            {finding.hasViolation ? (
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {finding.observation}
                              </div>
                              {finding.statutoryClause && (
                                <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 mt-0.5">
                                  Statutory Rule: {finding.statutoryClause}
                                </div>
                              )}
                              {finding.evidenceNote && (
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                  Inspector Note: {finding.evidenceNote}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Severity & Action button */}
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            {finding.severity && (
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                finding.severity === 'Critical' ? 'bg-rose-600 text-white' :
                                finding.severity === 'Major' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-800'
                              }`}>
                                {finding.severity}
                              </span>
                            )}

                            {finding.hasViolation && (
                              <button
                                onClick={() => openCAPAFromFinding(finding, selectedInspection)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-[11px] transition-colors shadow-xs"
                              >
                                <span>Create CAPA</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end">
              <button
                onClick={() => setSelectedInspection(null)}
                className="px-4 py-1.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Violation into Corrective Action Modal (Step 6 of Demo Flow) */}
      {capaFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-100 text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Convert Violation to Corrective Action (CAPA)
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Origin: {capaFinding.inspection.code} • {capaFinding.inspection.mineName}
                </p>
              </div>
              <button onClick={() => setCapaFinding(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCAPA} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">CAPA Title *</label>
                <input
                  type="text"
                  required
                  value={capaTitle}
                  onChange={e => setCapaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Priority Level</label>
                  <select
                    value={capaPriority}
                    onChange={e => setCapaPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                  >
                    <option value="Critical">Critical (Statutory Notice)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Compliance Deadline</label>
                  <input
                    type="date"
                    required
                    value={capaDueDate}
                    onChange={e => setCapaDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Responsible Official</label>
                <input
                  type="text"
                  required
                  value={capaResponsible}
                  onChange={e => setCapaResponsible(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Mandated Corrective Action Plan</label>
                <textarea
                  rows={3}
                  required
                  value={capaDescription}
                  onChange={e => setCapaDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCapaFinding(null)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Enforce CAPA & Trigger Alerts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Schedule Statutory Inspection
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Inspection Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly Geotechnical Highwall & Dump Stability Audit"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Mine Leasehold *</label>
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

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Audit Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  >
                    <option value="DGMS Statutory">DGMS Statutory</option>
                    <option value="Routine Safety">Routine Safety</option>
                    <option value="Geotechnical Slope Audit">Geotechnical Slope Audit</option>
                    <option value="Environmental Compliance">Environmental Compliance</option>
                    <option value="Electrical Substation">Electrical Substation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Inspector Official</label>
                  <input
                    type="text"
                    required
                    value={inspectorName}
                    onChange={e => setInspectorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Pit Location Details</label>
                <input
                  type="text"
                  placeholder="e.g. Overburden Dump Bench 4, North-Western Sector"
                  value={locationDetails}
                  onChange={e => setLocationDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Schedule Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

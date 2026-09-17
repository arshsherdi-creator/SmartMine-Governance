import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CorrectiveAction } from '../types';
import {
  AlertOctagon,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  User,
  Building,
  X,
  Filter
} from 'lucide-react';

export const CorrectiveActionsView: React.FC = () => {
  const { correctiveActions, mines, refreshData, showToast, currentUser } = useApp();

  const [selectedMine, setSelectedMine] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingAction, setUpdatingAction] = useState<CorrectiveAction | null>(null);
  const [newStatus, setNewStatus] = useState<string>('In Progress');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  // Create new modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [category, setCategory] = useState('Statutory Safety Violation');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [responsible, setResponsible] = useState('Er. Arvind Mukhopadhyay');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const filtered = correctiveActions.filter(ca => {
    if (selectedMine !== 'all' && ca.mineId !== selectedMine) return false;
    if (selectedPriority !== 'all' && ca.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && ca.status !== selectedStatus) return false;
    return true;
  });

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingAction) return;

    try {
      const res = await fetch(`/api/corrective-actions/${updatingAction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolutionNotes: resolutionNotes ? `${new Date().toISOString().split('T')[0]} - ${currentUser.name}: ${resolutionNotes}` : undefined,
          userName: currentUser.name,
          userRole: currentUser.roleTitle
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'CAPA Updated', `Transitioned ${updatingAction.code} to ${newStatus}`);
        setUpdatingAction(null);
        setResolutionNotes('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Update Failed', 'Could not transition corrective action.');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/corrective-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          mineId,
          violationCategory: category,
          priority,
          responsiblePerson: responsible,
          dueDate,
          description,
          source: 'Internal Audit',
          sourceId: 'manual',
          userName: currentUser.name,
          userRole: currentUser.roleTitle
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Corrective Action Registered', `Created ${data.data.code}`);
        setIsCreateOpen(false);
        setTitle('');
        setDescription('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Creation Failed', 'Could not create corrective action.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              CORRECTIVE & PREVENTIVE ACTION (CAPA)
            </span>
            <span className="text-xs text-slate-500">DGMS Section 22 Enforcement Workflow</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Corrective Actions Management Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lifecycle enforcement: Created → Assigned → In Progress → Escalated → Resolved → Verified → Closed
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Corrective Action</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Board:</span>
        </div>

        <select
          value={selectedMine}
          onChange={e => setSelectedMine(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Operational Mines</option>
          {mines.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={e => setSelectedPriority(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical Priority (Escalated)</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Workflow Stages</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Overdue">Overdue</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
          <option value="Verified">Verified</option>
          <option value="Closed">Closed</option>
        </select>

        <span className="text-xs text-slate-400 ml-auto">
          Showing {filtered.length} of {correctiveActions.length} actions
        </span>
      </div>

      {/* CAPA Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ca => {
          let priorityClass = 'bg-slate-100 text-slate-700';
          if (ca.priority === 'Critical') priorityClass = 'bg-rose-600 text-white font-bold';
          else if (ca.priority === 'High') priorityClass = 'bg-amber-500 text-white font-bold';
          else if (ca.priority === 'Medium') priorityClass = 'bg-blue-600 text-white';

          const isOverdue = ca.status === 'Overdue';

          return (
            <div
              key={ca.id}
              className={`bg-white dark:bg-slate-800/80 rounded-lg border p-4 shadow-xs flex flex-col justify-between transition-all ${
                isOverdue
                  ? 'border-rose-400 dark:border-rose-800 ring-1 ring-rose-400'
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-blue-700 dark:text-blue-400">
                    {ca.code}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${priorityClass}`}>
                    {ca.priority}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {ca.title}
                </h3>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {ca.mineName} • <span className="text-slate-700 dark:text-slate-300">{ca.violationCategory}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {ca.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Assigned: {ca.responsiblePerson}</span>
                  <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    Due: {ca.dueDate}
                  </span>
                </div>

                {ca.escalationLevel > 1 && (
                  <div className="text-[10px] text-rose-600 font-bold flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded border border-rose-200 dark:border-rose-900">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Level {ca.escalationLevel} Corporate Safety Escalation Active</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    ca.status === 'Resolved' || ca.status === 'Verified' || ca.status === 'Closed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : ca.status === 'Overdue'
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {ca.status}
                  </span>

                  <button
                    onClick={() => {
                      setUpdatingAction(ca);
                      setNewStatus(ca.status);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 transition-colors"
                  >
                    Transition Status →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transition Status Modal */}
      {updatingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Transition Corrective Action Workflow
                </h3>
                <p className="text-xs text-slate-500">{updatingAction.code}: {updatingAction.title}</p>
              </div>
              <button onClick={() => setUpdatingAction(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Workflow Status *</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold"
                >
                  <option value="Assigned">Assigned (Initial Allocation)</option>
                  <option value="In Progress">In Progress (Field Operations)</option>
                  <option value="Overdue">Overdue (Trigger Statutory Notice)</option>
                  <option value="Escalated">Escalated (Sent to Director Technical)</option>
                  <option value="Resolved">Resolved (Work Completed in Field)</option>
                  <option value="Verified">Verified (Inspector Sign-off)</option>
                  <option value="Closed">Closed (Archived in DGMS Portal)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Resolution / Verification Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail actions taken, engineering drawings updated, or sensor recalibration results..."
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUpdatingAction(null)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Update CAPA Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Corrective Action Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Create New Corrective Action (CAPA)
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">CAPA Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bench OB-4 Crest De-stressing & Tension Crack Backfilling"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Mine Location *</label>
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
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold"
                  >
                    <option value="Critical">Critical (Immediate Stoppage)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Statutory Deadline *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Official *</label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={e => setResponsible(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Violation Category / Rule Reference</label>
                <input
                  type="text"
                  placeholder="e.g. CMR 2017 Reg 106 - Slope Stability Standards"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Required Engineering / Corrective Plan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed instructions for field crews..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Create & Assign Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

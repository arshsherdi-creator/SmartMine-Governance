import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplianceRequirement } from '../types';
import {
  FileCheck,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Shield,
  Clock,
  X,
  CheckCircle2,
  FileText,
  Building
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const { compliance, mines, refreshData, showToast, currentUser } = useApp();

  // Filters
  const [selectedMine, setSelectedMine] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ComplianceRequirement | null>(null);

  // Form states for Add Requirement
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newMineId, setNewMineId] = useState(mines[0]?.id || '');
  const [newCategory, setNewCategory] = useState('Safety');
  const [newAuthority, setNewAuthority] = useState('DGMS');
  const [newFrequency, setNewFrequency] = useState('Monthly');
  const [newDueDate, setNewDueDate] = useState('');
  const [newRisk, setNewRisk] = useState('High');
  const [newResponsible, setNewResponsible] = useState('');
  const [newDept, setNewDept] = useState('Mine Safety Wing');
  const [newDesc, setNewDesc] = useState('');

  // Form states for Edit / Update Status
  const [updateStatus, setUpdateStatus] = useState<string>('In Progress');
  const [updateNotes, setUpdateNotes] = useState<string>('');

  const filtered = compliance.filter(item => {
    if (selectedMine !== 'all' && item.mineId !== selectedMine) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (selectedRisk !== 'all' && item.risk !== selectedRisk) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.responsiblePerson.toLowerCase().includes(q) ||
        item.mineName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('error', 'Validation Error', 'Requirement title is mandatory.');
      return;
    }

    try {
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          code: newCode,
          mineId: newMineId,
          category: newCategory,
          regulatoryAuthority: newAuthority,
          frequency: newFrequency,
          dueDate: newDueDate,
          risk: newRisk,
          responsiblePerson: newResponsible || currentUser.name,
          responsibleDept: newDept,
          description: newDesc,
          userName: currentUser.name,
          userRole: currentUser.roleTitle
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Statutory Requirement Added', `Registered ${data.data.code}: ${data.data.title}`);
        setIsAddModalOpen(false);
        // Reset form
        setNewTitle('');
        setNewCode('');
        setNewDesc('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Creation Failed', 'Could not save compliance requirement.');
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/compliance/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateStatus,
          notes: updateNotes ? `${new Date().toISOString().split('T')[0]} - ${currentUser.name}: ${updateNotes}` : undefined,
          userName: currentUser.name,
          userRole: currentUser.roleTitle
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Status Updated', `Requirement ${editingItem.code} transitioned to ${updateStatus}`);
        setEditingItem(null);
        setUpdateNotes('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Update Failed', 'Could not update compliance status.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              DGMS & CPCB STATUTORY AUDIT
            </span>
            <span className="text-xs text-slate-500">Mines Act 1952 / CMR 2017</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Statutory Compliance Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring mandatory filings, safety provisions, and environmental clearances
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick filter shortcut button for step 4 of demo */}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'Overdue' ? 'all' : 'Overdue')}
            className={`px-3 py-2 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
              selectedStatus === 'Overdue'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Overdue Only ({compliance.filter(c => c.status === 'Overdue').length})</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Statutory Requirement</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search clause or title..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Mine selector */}
          <select
            value={selectedMine}
            onChange={e => setSelectedMine(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Operational Mines ({mines.length})</option>
            {mines.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Regulatory Categories</option>
            <option value="Safety">Safety & Geotechnical</option>
            <option value="Environmental">Environmental & Forestry</option>
            <option value="DGMS Statutory">DGMS Statutory Clearances</option>
            <option value="Labour Welfare">Labour & Workforce</option>
            <option value="Production & Machinery">Production & Machinery</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Compliance Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="In Progress">In Progress</option>
            <option value="At Risk">At Risk</option>
            <option value="Non-Compliant">Non-Compliant</option>
            <option value="Overdue">Overdue (Statutory Breach)</option>
          </select>

          {/* Risk Level */}
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Results summary count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing {filtered.length} of {compliance.length} statutory mandates</span>
          {(selectedMine !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedRisk !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMine('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedRisk('all');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Compliance Register Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Statutory Code & Title</th>
                <th className="py-3 px-4">Mine & Authority</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Responsible Person</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map(item => {
                let statusBadge = 'bg-slate-100 text-slate-700';
                if (item.status === 'Compliant') statusBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
                else if (item.status === 'Overdue') statusBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold';
                else if (item.status === 'Non-Compliant') statusBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
                else if (item.status === 'At Risk') statusBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
                else if (item.status === 'In Progress') statusBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-blue-700 dark:text-blue-400">{item.code}</span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.description}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.mineName}</div>
                      <div className="text-[10px] text-slate-500">{item.regulatoryAuthority} ({item.category})</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {item.frequency}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`font-semibold ${item.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {item.dueDate}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusBadge}`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.risk === 'Critical' ? 'bg-rose-600 text-white' :
                        item.risk === 'High' ? 'bg-amber-500 text-white' :
                        item.risk === 'Medium' ? 'bg-blue-600 text-white' : 'bg-slate-500 text-white'
                      }`}>
                        {item.risk}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{item.responsiblePerson}</div>
                      <div className="text-[10px] text-slate-500">{item.responsibleDept}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setUpdateStatus(item.status);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-600 transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Statutory Requirement Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Register Statutory Compliance Requirement
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Requirement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Continuous Real-Time Methane Tele-monitoring Calibration"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Statutory Clause / Code</label>
                  <input
                    type="text"
                    placeholder="e.g. DGMS-CMR-2017-R153"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Operational Mine *</label>
                  <select
                    value={newMineId}
                    onChange={e => setNewMineId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  >
                    {mines.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Authority</label>
                  <select
                    value={newAuthority}
                    onChange={e => setNewAuthority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  >
                    <option value="DGMS">DGMS</option>
                    <option value="CPCB">CPCB</option>
                    <option value="SPCB">SPCB</option>
                    <option value="MoEFCC">MoEFCC</option>
                    <option value="CCO">Coal Controller</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Environmental">Environmental</option>
                    <option value="DGMS Statutory">DGMS Statutory</option>
                    <option value="Labour Welfare">Labour Welfare</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Risk Priority</label>
                  <select
                    value={newRisk}
                    onChange={e => setNewRisk(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Statutory Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Responsible Official</label>
                  <input
                    type="text"
                    placeholder="e.g. Mine Safety Officer"
                    value={newResponsible}
                    onChange={e => setNewResponsible(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Description & Statutory Rule Reference</label>
                <textarea
                  rows={3}
                  placeholder="Specific statutory mandate according to Coal Mines Regulations 2017..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Register Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Transition Status Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Update Compliance Status
                </h3>
                <p className="text-xs text-slate-500">{editingItem.code}: {editingItem.title}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Current Status:</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{editingItem.status}</div>
                <div className="text-[11px] text-slate-500 mt-1">Due Date: {editingItem.dueDate} • Assigned: {editingItem.responsiblePerson}</div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">New Compliance Status *</label>
                <select
                  value={updateStatus}
                  onChange={e => setUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                >
                  <option value="In Progress">In Progress (Action Underway)</option>
                  <option value="Compliant">Compliant (Audit Verified)</option>
                  <option value="At Risk">At Risk (Action Delayed)</option>
                  <option value="Non-Compliant">Non-Compliant (Inspection Breach)</option>
                  <option value="Overdue">Overdue (Statutory Notice Triggered)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Verification & Audit Log Note</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record verification details, calibration certificate number, or field audit findings..."
                  value={updateNotes}
                  onChange={e => setUpdateNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Save Status & Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

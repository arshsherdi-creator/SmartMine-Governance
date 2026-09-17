import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GrievanceRecord } from '../types';
import {
  MessageSquare,
  Plus,
  User,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Filter
} from 'lucide-react';

export const GrievancesView: React.FC = () => {
  const { grievances, mines, refreshData, showToast, currentUser } = useApp();

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [category, setCategory] = useState('Safety & PPE Availability');
  const [complainantName, setComplainantName] = useState('Rameshwar Tudu');
  const [complainantType, setComplainantType] = useState('Contractual Worker');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mineId,
          category,
          title,
          description,
          complainantName: anonymous ? 'Confidential Worker' : complainantName,
          complainantType,
          isAnonymous: anonymous
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Grievance Registered', `Filed grievance ${data.data.code} under Welfare Committee.`);
        setIsSubmitOpen(false);
        setTitle('');
        setDescription('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Filing Error', 'Could not record grievance.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              MINES LABOUR WELFARE
            </span>
            <span className="text-xs text-slate-500">Joint Consultative Committee & Grievance Cell</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Workforce Grievance & Redressal Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Confidential worker feedback on safety gear, pit working conditions, welfare amenities, and statutory wages
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Grievance</span>
        </button>
      </div>

      {/* Grievance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grievances.map((g: any) => {
          const compName = g.complainantName || g.submittedBy || 'Colliery Worker';
          const compType = g.complainantType || 'Workforce Representative';
          const dateLodged = g.submittedDate || g.createdAt || '2026-09-01';
          const gTitle = g.title || g.category || 'Workplace Grievance';
          const gStatus = g.status || 'Under Review';

          return (
            <div
              key={g.id}
              className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-blue-700 dark:text-blue-400">
                    {g.code}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    gStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {gStatus}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {gTitle}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {g.category} • {g.mineName}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Complainant:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{compName} ({compType})</span>
                </div>
                <div className="flex justify-between">
                  <span>Date Lodged:</span>
                  <span>{dateLodged}</span>
                </div>
                {g.resolutionNotes && (
                  <div className="text-emerald-600 dark:text-emerald-400 mt-1 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded">
                    Action: {g.resolutionNotes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Grievance Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Lodge Worker Grievance
              </h3>
              <button onClick={() => setIsSubmitOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Colliery Leasehold *</label>
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
                <label className="font-semibold text-slate-700 dark:text-slate-300">Grievance Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                >
                  <option value="Safety & PPE Availability">Safety & PPE Availability</option>
                  <option value="Pit Working Conditions & Dust">Pit Working Conditions & Dust</option>
                  <option value="Statutory Wages & Overtime">Statutory Wages & Overtime</option>
                  <option value="Drinking Water & Canteen Amenities">Drinking Water & Canteen Amenities</option>
                  <option value="Colony Housing & Sanitation">Colony Housing & Sanitation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Title / Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Non-supply of dust masks for haul road watering gang"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Detailed Statement *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe location, duration of issue, and names of supervisor notified..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anon"
                  checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="anon" className="text-slate-700 dark:text-slate-300 text-xs">
                  Submit anonymously to Welfare Committee
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

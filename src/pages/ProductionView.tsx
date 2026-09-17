import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductionRecord } from '../types';
import {
  Pickaxe,
  Plus,
  TrendingUp,
  TrendingDown,
  Truck,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';

export const ProductionView: React.FC = () => {
  const { productionRecords, production, mines, refreshData, showToast, currentUser } = useApp() as any;
  const records: any[] = (productionRecords && productionRecords.length > 0) 
    ? productionRecords 
    : (production || []);

  const [isLogOpen, setIsLogOpen] = useState(false);
  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [shift, setShift] = useState('Shift 1 (Day)');
  const [coalTonnage, setCoalTonnage] = useState(4200);
  const [obVolume, setObVolume] = useState(12500);
  const [equipmentAvail, setEquipmentAvail] = useState(88);
  const [notes, setNotes] = useState('');

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mineId,
          shift,
          coalExtractedMT: Number(coalTonnage),
          actualTonnage: Number(coalTonnage),
          overburdenRemovedCuM: Number(obVolume),
          equipmentAvailabilityPct: Number(equipmentAvail),
          equipmentAvailabilityPercent: Number(equipmentAvail),
          notes,
          operationalNotes: notes,
          loggedBy: currentUser.name
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Production Logged', `Recorded ${coalTonnage} MT coal output for ${data.data.mineName}`);
        setIsLogOpen(false);
        setNotes('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Log Error', 'Could not record production shift output.');
    }
  };

  const totalCoal = records.reduce((acc, r) => acc + (r.coalExtractedMT ?? r.actualTonnage ?? 0), 0);
  const totalOB = records.reduce((acc, r) => acc + (r.overburdenRemovedCuM ?? Math.round((r.actualTonnage || 3200) * 2.8)), 0);
  const avgAvailability = Math.round(
    records.reduce((acc, r) => acc + (r.equipmentAvailabilityPct ?? r.equipmentAvailabilityPercent ?? 85), 0) / (records.length || 1)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              MINISTRY OF COAL DASHBOARD
            </span>
            <span className="text-xs text-slate-500">HEMM Operations & Extraction Logistics</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Production & Heavy Earth Moving Machinery (HEMM)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shift-wise coal dispatch, overburden stripping ratios, and equipment availability
          </p>
        </div>

        <button
          onClick={() => setIsLogOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Shift Output</span>
        </button>
      </div>

      {/* KPI Aggregate Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Coal Extracted (Monitored Shifts)</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalCoal.toLocaleString()} <span className="text-xs font-normal text-slate-500">Metric Tonnes</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+4.2% versus quarterly benchmark</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Overburden (OB) Stripping</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalOB.toLocaleString()} <span className="text-xs font-normal text-slate-500">Cubic Meters</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Stripping Ratio: {(totalOB / (totalCoal || 1)).toFixed(2)} m³/MT
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">HEMM Equipment Availability</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {avgAvailability}% <span className="text-xs font-normal text-slate-500">Fleet Active</span>
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            <span>4 Shovels currently in scheduled maintenance</span>
          </div>
        </div>
      </div>

      {/* Production Records Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Shift Extraction Logs ({records.length})
          </span>
          <span className="text-xs text-slate-400">DGMS & CIL Production Portal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date & Shift</th>
                <th className="py-3 px-4">Operational Mine</th>
                <th className="py-3 px-4">Coal Extracted</th>
                <th className="py-3 px-4">Overburden Stripped</th>
                <th className="py-3 px-4">Equipment Fleet Availability</th>
                <th className="py-3 px-4">Shift In-Charge</th>
                <th className="py-3 px-4">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {records.map((rec: any) => {
                const coalAmt = rec.coalExtractedMT ?? rec.actualTonnage ?? 0;
                const obAmt = rec.overburdenRemovedCuM ?? Math.round((rec.actualTonnage || 3200) * 2.8);
                const availPct = rec.equipmentAvailabilityPct ?? rec.equipmentAvailabilityPercent ?? 85;

                return (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{rec.date}</div>
                      <div className="text-[10px] text-blue-600 font-semibold">{rec.shift || 'General Shift'}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {rec.mineName}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {coalAmt.toLocaleString()} MT
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {obAmt.toLocaleString()} m³
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{availPct}%</span>
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${availPct < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${availPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {rec.loggedBy || 'Shift Official'}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 truncate max-w-xs">
                      {rec.notes || rec.operationalNotes || 'Normal operational cycle'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Shift Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Log Shift Production Output
              </h3>
              <button onClick={() => setIsLogOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-6 space-y-4 text-xs">
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

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Shift *</label>
                <select
                  value={shift}
                  onChange={e => setShift(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                >
                  <option value="Shift 1 (Day - 06:00 to 14:00)">Shift 1 (Day - 06:00 to 14:00)</option>
                  <option value="Shift 2 (Evening - 14:00 to 22:00)">Shift 2 (Evening - 14:00 to 22:00)</option>
                  <option value="Shift 3 (Night - 22:00 to 06:00)">Shift 3 (Night - 22:00 to 06:00)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Coal Extracted (MT) *</label>
                  <input
                    type="number"
                    required
                    value={coalTonnage}
                    onChange={e => setCoalTonnage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Overburden (m³) *</label>
                  <input
                    type="number"
                    required
                    value={obVolume}
                    onChange={e => setObVolume(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Equipment Availability (% Fleet Active)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={equipmentAvail}
                  onChange={e => setEquipmentAvail(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Operational Log Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dumper haulage cycle normal, bench 3 blasting conducted safely at 13:00..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Submit Shift Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

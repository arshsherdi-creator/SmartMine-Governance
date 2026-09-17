import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EnvironmentalReading } from '../types';
import {
  Leaf,
  Plus,
  Wind,
  Droplets,
  Volume2,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';

export const EnvironmentalView: React.FC = () => {
  const { environmentalReadings, environmental, mines = [], refreshData, showToast, currentUser } = useApp() as any;
  const readings: any[] = (environmentalReadings && environmentalReadings.length > 0)
    ? environmentalReadings
    : (environmental || []);

  const [selectedMine, setSelectedMine] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Form states
  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [paramType, setParamType] = useState<'PM10' | 'PM2.5' | 'SO2' | 'NOx' | 'Water_pH' | 'Noise_dB' | 'Dust'>('PM10');
  const [value, setValue] = useState(85);
  const [location, setLocation] = useState('');

  const filtered = readings.filter((r: any) => {
    const itemType = r.type || r.parameter;
    if (selectedMine !== 'all' && r.mineId !== selectedMine) return false;
    if (selectedType !== 'all' && itemType !== selectedType) return false;
    return true;
  });

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/environmental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mineId,
          type: paramType,
          value: Number(value),
          location: location || 'Continuous Monitoring Station 1',
          recordedBy: currentUser.name
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.data.status === 'Critical') {
          showToast('error', 'Threshold Exceeded!', `Recorded ${paramType} = ${value} (Statutory Limit: ${data.data.statutoryLimit}). Automatic alert generated.`);
        } else {
          showToast('success', 'Reading Recorded', `Logged ${paramType} = ${value} ${data.data.unit}`);
        }
        setIsLogOpen(false);
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Logging Error', 'Could not record environmental sensor telemetry.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              CPCB & SPCB TELEMETRY
            </span>
            <span className="text-xs text-slate-500">Continuous Ambient Air Quality Monitoring (CAAQMS)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Environmental Clearances & Sensor Streams
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time PM10, PM2.5, SO2, noise levels, and mine discharge effluent water quality
          </p>
        </div>

        <button
          onClick={() => setIsLogOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Environmental Reading</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedMine}
          onChange={e => setSelectedMine(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Operational Mines</option>
          {mines.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Environmental Parameters</option>
          <option value="PM10">PM10 (Respirable Particulate)</option>
          <option value="PM2.5">PM2.5 (Fine Particulate)</option>
          <option value="Water_pH">Effluent Water pH</option>
          <option value="Noise_dB">Ambient Noise (dB)</option>
          <option value="Dust">Fugitive Dust</option>
        </select>

        <span className="text-slate-400 ml-auto">
          Showing {filtered.length} sensor stations
        </span>
      </div>

      {/* Readings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((read: any) => {
          const typeStr = read.type || read.parameter || 'Air Quality';
          const statLimit = read.statutoryLimit ?? read.threshold ?? 100;
          const unitStr = read.unit || (typeStr === 'Water_pH' ? 'pH' : typeStr === 'Noise_dB' ? 'dB' : 'µg/m³');
          const statusStr = read.status || 'Normal';

          let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let borderHighlight = 'border-slate-200 dark:border-slate-700/80';
          let barColor = 'bg-emerald-500';

          if (statusStr === 'Critical' || statusStr === 'Exceeded') {
            statusBadge = 'bg-rose-600 text-white border-rose-600 font-bold';
            borderHighlight = 'border-rose-400 dark:border-rose-900 ring-1 ring-rose-400';
            barColor = 'bg-rose-500';
          } else if (statusStr === 'Warning' || statusStr === 'Advisory') {
            statusBadge = 'bg-amber-500 text-white border-amber-500 font-bold';
            borderHighlight = 'border-amber-400 dark:border-amber-900';
            barColor = 'bg-amber-500';
          }

          const pctOfLimit = Math.min(100, Math.round(((read.value || 0) / (statLimit || 1)) * 100));

          return (
            <div
              key={read.id}
              className={`bg-white dark:bg-slate-800/80 rounded-lg border p-4 shadow-xs flex flex-col justify-between transition-all ${borderHighlight}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                    {typeStr === 'Water_pH' ? <Droplets className="w-4 h-4 text-cyan-600" /> :
                     typeStr === 'Noise_dB' ? <Volume2 className="w-4 h-4 text-purple-600" /> :
                     <Wind className="w-4 h-4 text-blue-600" />}
                    <span>{typeStr}</span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase border ${statusBadge}`}>
                    {statusStr}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {read.value} <span className="text-xs font-semibold text-slate-500">{unitStr}</span>
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Statutory Limit: <span className="font-semibold text-slate-700 dark:text-slate-300">{statLimit} {unitStr}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${pctOfLimit}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{read.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mine:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{read.mineName}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Logged by {read.recordedBy}</span>
                  <span>{read.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Reading Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Log Environmental Telemetry
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
                <label className="font-semibold text-slate-700 dark:text-slate-300">Environmental Parameter *</label>
                <select
                  value={paramType}
                  onChange={e => setParamType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                >
                  <option value="PM10">PM10 (CPCB 24hr Limit: 100 ug/m3)</option>
                  <option value="PM2.5">PM2.5 (CPCB 24hr Limit: 60 ug/m3)</option>
                  <option value="SO2">SO2 (CPCB Limit: 80 ug/m3)</option>
                  <option value="NOx">NOx (CPCB Limit: 80 ug/m3)</option>
                  <option value="Water_pH">Discharge Water pH (Statutory: 6.5 - 8.5)</option>
                  <option value="Noise_dB">Ambient Noise dB (Industrial Day Limit: 75 dB)</option>
                  <option value="Dust">Fugitive Dust (Limit: 500 ug/m3)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Observed Value *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Station / Monitoring Point Location</label>
                <input
                  type="text"
                  placeholder="e.g. CAAQMS Sensor Station East Pit Perimeter"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
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
                  className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                >
                  Record Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

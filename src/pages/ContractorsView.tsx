import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Contractor } from '../types';
import {
  Users,
  Plus,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Calendar,
  Building2,
  HardHat,
  X
} from 'lucide-react';

export const ContractorsView: React.FC = () => {
  const { contractors, mines, refreshData, showToast } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [vendorCode, setVendorCode] = useState('');
  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [serviceType, setServiceType] = useState('Overburden Removal & Haulage');
  const [workforceCount, setWorkforceCount] = useState(240);
  const [licenseExpiry, setLicenseExpiry] = useState(
    new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
  );
  const [safetyRating, setSafetyRating] = useState(4.2);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          vendorCode,
          mineId,
          serviceType,
          workforceCount: Number(workforceCount),
          licenseExpiryDate: licenseExpiry,
          safetyRating: Number(safetyRating),
          complianceScore: 88,
          status: 'Compliant'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Contractor Enrolled', `Registered vendor ${data.data.name} (${data.data.vendorCode})`);
        setIsAddOpen(false);
        setName('');
        setVendorCode('');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Enrollment Error', 'Failed to register contractor.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              CONTRACT LABOUR REGULATION ACT 1970
            </span>
            <span className="text-xs text-slate-500">DGMS Vocational Training & Safety Clearance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Contractor & Outsourced Workforce Governance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring vendor statutory licenses, safety induction compliance, and field audit scores
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Outsourced Vendor</span>
        </button>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contractors.map(c => {
          let badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          if (c.status === 'License Expiring') badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold';
          else if (c.status === 'Suspended') badgeClass = 'bg-rose-600 text-white font-bold';

          return (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-blue-700 dark:text-blue-400">
                    {c.vendorCode}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${badgeClass}`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {c.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {c.serviceType}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Compliance</span>
                    <div className="font-extrabold text-sm text-slate-800 dark:text-white">
                      {c.complianceScore}%
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Workforce</span>
                    <div className="font-extrabold text-sm text-slate-800 dark:text-white">
                      {c.workforceCount} Persons
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Assigned Mine:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{c.mineName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statutory License Expiry:</span>
                  <span className={`font-semibold ${c.status === 'License Expiring' ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {c.licenseExpiryDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Audit Rating:</span>
                  <span className="font-bold text-emerald-600">★ {c.safetyRating} / 5.0</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Contractor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Register Outsourced Contractor
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adani Enterprises Mining Division"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">CIL Vendor Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VEN-CIL-908"
                    value={vendorCode}
                    onChange={e => setVendorCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Allocated Mine</label>
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

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Contract Scope / Service *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overburden Stripping, Dumper Haulage, Dragline Maintenance"
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Deployed Workforce</label>
                  <input
                    type="number"
                    required
                    value={workforceCount}
                    onChange={e => setWorkforceCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">DGMS License Expiry</label>
                  <input
                    type="date"
                    required
                    value={licenseExpiry}
                    onChange={e => setLicenseExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

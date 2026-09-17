import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  RotateCcw,
  Sparkles,
  Server,
  Database,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Info
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { showToast, refreshData, mines, compliance, inspections, correctiveActions } = useApp();
  const [resetting, setResetting] = useState(false);

  const handleResetDemoData = async () => {
    setResetting(true);
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Demo Baseline Restored', 'All statutory seed datasets, inspections, and violations refreshed.');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Reset Failed', 'Could not reset demo data.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" />
            SYSTEM INFRASTRUCTURE & DIAGNOSTICS
          </span>
          <span className="text-xs text-slate-500">CIL Central Governance Cloud</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          System Settings & Demonstration Controls
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Backend server status, AI model diagnostics, and one-click demo data reset
        </p>
      </div>

      {/* System Health Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Express API Server</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-500">Port 3000 • Ingress Active</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Gemini 3.8 Flash</span>
              <span className="text-[10px] text-blue-600 font-bold">READY</span>
            </div>
            <div className="text-[11px] text-slate-500">Server-Side Proxy Active</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Data Store (6 Mines)
            </div>
            <div className="text-[11px] text-slate-500">{compliance.length} Compliance Items • {inspections.length} Audits</div>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Reset Demonstration State to Seed Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              If during the demo walkthrough you updated compliance records or added test CAPAs, you can restore all coal mines, statutory items, violations, and sensor readings back to the verified initial state.
            </p>
          </div>

          <button
            onClick={handleResetDemoData}
            disabled={resetting}
            className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0 shadow-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Restoring Baseline...' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Statutory Architecture Reference */}
      <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" />
          Statutory Standards Architecture Reference
        </span>
        <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
          <li><strong>Mines Act 1952:</strong> Sections 22 & 22(1) Prohibitive Orders and Safety Governance.</li>
          <li><strong>Coal Mines Regulations 2017 (CMR 2017):</strong> Reg 106 (Stability of Open Cast Highwalls & Spoil Benches), Reg 153 (Continuous Tele-monitoring of Inflammable Gas).</li>
          <li><strong>Environment (Protection) Act 1986:</strong> CPCB & SPCB Ambient Air Quality & Zero Liquid Discharge standards.</li>
          <li><strong>ISO 19011:</strong> Management Systems Auditing & Statutory Chain of Custody.</li>
        </ul>
      </div>
    </div>
  );
};

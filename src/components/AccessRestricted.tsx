import React from 'react';
import { ShieldAlert, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLE_ALLOWED_TABS } from '../types';

interface AccessRestrictedProps {
  attemptedTab?: string;
  onGoDashboard?: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({
  attemptedTab,
  onGoDashboard
}) => {
  const { currentUser, setActiveTab, setIsGuideOpen } = useApp();

  const allowedTabs = ROLE_ALLOWED_TABS[currentUser.role] || ['dashboard'];

  const getRoleFriendlyName = () => {
    switch (currentUser.role) {
      case 'admin':
        return 'System Administrator';
      case 'mine_official':
        return 'Mine Official (General Manager)';
      case 'inspector':
        return 'Field Officer / Inspector';
      case 'corporate':
        return 'Corporate Management';
      case 'regulatory':
        return 'Regulatory Authority';
      case 'contractor':
        return 'Contractor Representative';
      default:
        return currentUser.role;
    }
  };

  const formatTabName = (tab?: string) => {
    if (!tab) return 'Requested Module';
    return tab
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto my-8">
      <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 p-8 shadow-sm space-y-6">
        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/60">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40">
              <Lock className="w-3 h-3" />
              Role-Based Access Control (RBAC)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Access Restricted
            </h1>
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
              You do not have permission to access this module.
            </p>
          </div>
        </div>

        {/* Diagnostic Context Card */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700/60 p-4 text-xs space-y-2 text-slate-600 dark:text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-slate-500 dark:text-slate-400">Attempted Module:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
              {formatTabName(attemptedTab)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-slate-500 dark:text-slate-400">Authenticated Persona:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {currentUser.name}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-500 dark:text-slate-400">Current Role:</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              {getRoleFriendlyName()}
            </span>
          </div>
        </div>

        {/* Statutory Justification Note */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Under statutory guidelines (Mines Act 1952, DGMS CMR 2017 & SmartMine IT Security Governance), module access is strictly segregated by operational responsibility. Your authenticated role is authorized only for designated statutory workflows.
        </p>

        {/* Authorized Modules for this Role */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Authorized Modules For Your Persona:
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{formatTabName(tab)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              if (onGoDashboard) {
                onGoDashboard();
              } else {
                setActiveTab('dashboard');
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Dashboard</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            Switch Role via Header Menu
          </button>
        </div>
      </div>
    </div>
  );
};

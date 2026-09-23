import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mine } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Clock,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  SearchCheck,
  Radio,
  Building2,
  ChevronRight,
  Info,
  Calendar,
  X,
  Shield,
  History,
  Settings,
  Users,
  Smartphone,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Pickaxe,
  Leaf,
  Cpu,
  AlertOctagon
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    metrics,
    mines,
    alerts,
    inspections,
    correctiveActions,
    currentUser,
    auditLogs,
    environmental,
    contractors,
    setActiveTab,
    setSelectedMineId,
    selectedMineId,
    showToast
  } = useApp();

  const [deepDiveMine, setDeepDiveMine] = useState<Mine | null>(null);

  if (!metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading SmartMine enterprise records...</p>
        </div>
      </div>
    );
  }

  const highRiskMinesList = mines.filter(m => m.riskLevel === 'Critical' || m.riskLevel === 'High');

  // Role-specific descriptions
  const getRoleDashboardDescription = () => {
    switch (currentUser.role) {
      case 'admin':
        return 'System health, immutable audit trails, and role-based access management across SmartMine Governance';
      case 'mine_official':
        return `Operational monitoring, compliance tracking, and pithead risk oversight for ${currentUser.mineName || 'Assigned Mine Lease'}`;
      case 'inspector':
        return 'Statutory field inspection oversight, DGMS Section 22 notices, and CAPA verification registry';
      case 'corporate':
        return 'Multi-subsidiary governance, aggregate production performance, and high-level enterprise risk metrics';
      case 'regulatory':
        return 'Statutory compliance audits, environmental exceedances, and mandatory regulatory enforcement records';
      case 'contractor':
        return 'Contractor fleet compliance, heavy machinery safety audits, and assigned corrective actions';
      default:
        return 'Real-time multi-tier statutory oversight across operational coal mining leases';
    }
  };

  // Render role-specific 4 KPI cards
  const renderRoleKpis = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">System Health</span>
                <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
                <span className="text-xs text-emerald-600 font-semibold">Services Online</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Database, telemetry bus & auth proxies active
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Active Roles / Users</span>
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">6 Roles</span>
                <span className="text-xs text-slate-500">24 Provisioned</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Granular RBAC boundaries enforced
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Audit Trail Entries</span>
                <div className="w-8 h-8 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                  {auditLogs.length || 28}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">Immutable</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                SHA-256 cryptographic verification ready
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Security Incidents</span>
                <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-600">0 Breaches</span>
                <span className="text-xs text-slate-500">Last 30 Days</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Zero unauthorized privilege elevations
              </p>
            </div>
          </div>
        );

      case 'inspector':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Assigned Inspections</span>
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <SearchCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  {inspections.length}
                </span>
                <span className="text-xs text-slate-500">Scheduled / Completed</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                DGMS statutory compliance inspections
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Overdue Audits</span>
                <div className="w-8 h-8 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                  {inspections.filter(i => i.status === 'Overdue' || i.status === 'Scheduled').length || 2}
                </span>
                <span className="text-xs text-rose-600 font-semibold">Priority Follow-up</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Eastern Valley pithead audit pending
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Open Violations</span>
                <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {metrics.openViolations}
                </span>
                <span className="text-xs text-slate-500">Citations</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                1 Section 22(3) prohibitive notice active
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">CAPA Verification</span>
                <div className="w-8 h-8 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                  {correctiveActions.filter(ca => ca.status === 'In Progress' || ca.status === 'Under Review').length}
                </span>
                <span className="text-xs text-slate-500">Awaiting Signoff</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Field verification visits required
              </p>
            </div>
          </div>
        );

      case 'contractor':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Contractor Compliance</span>
                <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-600">92.4%</span>
                <span className="text-xs text-emerald-600 font-semibold">Tier 1 Rating</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Statutory wage & safety adherence certified
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Assigned Contracts</span>
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {contractors.length || 6}
                </span>
                <span className="text-xs text-slate-500">Active Work Orders</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Overburden removal & heavy transport
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Expiring Permits / Docs</span>
                <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-600">1</span>
                <span className="text-xs text-amber-600 font-semibold">14 Days Left</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                HEMM Fitness Certificate due for renewal
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Assigned CAPA</span>
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <AlertOctagon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-blue-600">2 Actions</span>
                <span className="text-xs text-emerald-600 font-semibold">In Progress</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Dust suppression water bowser deployment
              </p>
            </div>
          </div>
        );

      case 'regulatory':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Statutory Compliance</span>
                <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {metrics.complianceRate}%
                </span>
                <span className="text-xs text-amber-600 font-semibold">Threshold: 90%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Statutory acts, MMR 1961 & CPCB guidelines
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Overdue Statutory Items</span>
                <div className="w-8 h-8 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-rose-600">
                  {metrics.overdueComplianceItems}
                </span>
                <span className="text-xs text-rose-600 font-semibold">Citations Pending</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Immediate regulatory notices issued
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Environmental Exceedances</span>
                <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-600">
                  {environmental.filter(e => e.status === 'Critical' || e.status === 'Warning').length || 4}
                </span>
                <span className="text-xs text-amber-600 font-semibold">PM10 / Effluent</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                CPCB regional air quality standards
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Prohibitive Orders</span>
                <div className="w-8 h-8 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-rose-600">1 Active</span>
                <span className="text-xs text-rose-600 font-semibold">DGMS Sec 22(3)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Eastern Valley Open Cast Pit 4 ceased
              </p>
            </div>
          </div>
        );

      case 'corporate':
      case 'mine_official':
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Compliance Rate */}
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Overall Compliance</span>
                <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {metrics.complianceRate}%
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  Target: 95.0%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    metrics.complianceRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${metrics.complianceRate}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {metrics.complianceDistribution.compliant} of {mines.length * 6} statutory parameters compliant
              </p>
            </div>

            {/* High Risk Mines */}
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">High / Critical Leases</span>
                <div className="w-8 h-8 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                  {metrics.highRiskMines}
                </span>
                <span className="text-xs text-slate-500">of {metrics.totalMines} leases</span>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                  1 Critical (Eastern Valley)
                </span>
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                  1 High (Alpha)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Section 22(3) prohibitive notice active
              </p>
            </div>

            {/* Open Violations */}
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Open Violations</span>
                <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {metrics.openViolations}
                </span>
                <span className="text-xs text-slate-500">regulatory citations</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                10 DGMS Safety, 4 Environmental, 3 Operational
              </p>
            </div>

            {/* Pending Corrective Actions (CAPA) */}
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Pending CAPA Actions</span>
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  {metrics.pendingCorrectiveActions}
                </span>
                <span className="text-xs text-rose-600 font-semibold">
                  ({metrics.overdueComplianceItems} overdue)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                3 escalated to Corporate Safety Directorate
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Status and Role-Specific Identification */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry & Compliance Active
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              Role: {currentUser.roleTitle}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {getRoleDashboardDescription()}
          </p>
        </div>

        {/* Quick actions tailored to the role */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentUser.role === 'admin' ? (
            <>
              <button
                onClick={() => setActiveTab('users-roles')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Users & Roles (RBAC)</span>
              </button>
              <button
                onClick={() => setActiveTab('audit-trail')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-blue-600" />
                <span>Audit Trail ({auditLogs.length})</span>
              </button>
            </>
          ) : currentUser.role === 'inspector' ? (
            <>
              <button
                onClick={() => setActiveTab('inspections')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
              >
                <SearchCheck className="w-3.5 h-3.5" />
                <span>Field Inspections</span>
              </button>
              <button
                onClick={() => setActiveTab('field-reports')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Field Reports</span>
              </button>
            </>
          ) : currentUser.role === 'contractor' ? (
            <>
              <button
                onClick={() => setActiveTab('contractors')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>My Contracts & Fleet</span>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Documents</span>
              </button>
            </>
          ) : currentUser.role === 'regulatory' ? (
            <>
              <button
                onClick={() => setActiveTab('compliance')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Statutory Compliance</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                <span>Regulatory Reports</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask SmartMine AI</span>
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Inspect Overdue ({metrics.overdueComplianceItems})</span>
              </button>
              <button
                onClick={() => setActiveTab('gis-map')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                <span>GIS Mine Risk Map</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards Grid tailored to current role */}
      {renderRoleKpis()}

      {/* Main Grid: Mine Rankings & Visual Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mine Risk Rankings (Step 3 in Demo) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Operational Mine Risk Hierarchy
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                  AI-Weighted
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any mine to inspect detailed risk breakdown and statutory factors
              </p>
            </div>
            <button
              onClick={() => setActiveTab('ai-risk')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Risk Center Details <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 flex-1">
            {mines.map(mine => {
              let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
              let barColor = 'bg-emerald-500';
              if (mine.riskLevel === 'Critical') {
                badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
                barColor = 'bg-rose-500';
              } else if (mine.riskLevel === 'High') {
                badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
                barColor = 'bg-amber-500';
              } else if (mine.riskLevel === 'Medium') {
                badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
                barColor = 'bg-blue-500';
              }

              return (
                <div
                  key={mine.id}
                  onClick={() => setDeepDiveMine(mine)}
                  className="p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-extrabold text-slate-700 dark:text-slate-200 shrink-0 text-xs border border-slate-200 dark:border-slate-600">
                      {mine.code.slice(0, 4)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {mine.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${badgeColor}`}>
                          {mine.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {mine.subsidiaryName} • {mine.state} • {mine.type} Mine
                      </div>
                    </div>
                  </div>

                  {/* Score & Metrics */}
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div className="hidden sm:block">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {mine.complianceRate}% Adherence
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {mine.activeViolations} Active Violations • {mine.openCorrectiveActions} CAPAs
                      </div>
                    </div>

                    <div className="w-20 sm:w-24">
                      <div className="flex justify-between text-xs font-extrabold mb-1">
                        <span className="text-[10px] text-slate-400 font-normal">Risk</span>
                        <span className={mine.riskLevel === 'Critical' ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>
                          {mine.riskScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${mine.riskScore}%` }} />
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Distribution & Risk Matrix */}
        <div className="space-y-6">
          {/* Statutory Breakdown Card */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Statutory Compliance Breakdown
            </h2>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Fully Compliant</span>
                  <span className="font-bold text-emerald-600">{metrics.complianceDistribution.compliant}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(metrics.complianceDistribution.compliant / (metrics.complianceDistribution.compliant + metrics.complianceDistribution.inProgress + metrics.complianceDistribution.atRisk + metrics.complianceDistribution.overdue)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">In Progress (Within Due Date)</span>
                  <span className="font-bold text-blue-600">{metrics.complianceDistribution.inProgress}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">At Risk (Due &lt; 7 Days)</span>
                  <span className="font-bold text-amber-600">{metrics.complianceDistribution.atRisk}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Overdue (Statutory Breach)</span>
                  <span className="font-bold text-rose-600">{metrics.complianceDistribution.overdue}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="text-slate-500">DGMS & SPCB Monitored</span>
              <button
                onClick={() => setActiveTab('compliance')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Open Compliance Register →
              </button>
            </div>
          </div>

          {/* Critical Alerts Banner (Step 7 in Demo) */}
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Active Safety & Statutory Alerts</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-600 text-white">
                {alerts.filter(a => a.status === 'Active').length} Active
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {alerts.slice(0, 3).map(alt => (
                <div
                  key={alt.id}
                  onClick={() => setActiveTab('alerts')}
                  className="p-2.5 rounded bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-xs hover:border-rose-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                    <span className="truncate">{alt.title}</span>
                    <span className="text-[10px] text-rose-600 shrink-0 font-bold ml-1">{alt.priority}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-2">
                    {alt.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('alerts')}
              className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded transition-colors"
            >
              View All Alerts & Escalations →
            </button>
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Inspections & Active CAPA Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inspections (Step 5 in Demo) */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Regulatory Inspections
              </h2>
              <p className="text-xs text-slate-500">DGMS and internal audit findings</p>
            </div>
            <button
              onClick={() => setActiveTab('inspections')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View All ({inspections.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
            {inspections.slice(0, 4).map(insp => (
              <div key={insp.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{insp.code}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      insp.status === 'Non-Compliant' ? 'bg-rose-100 text-rose-700' :
                      insp.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {insp.status}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {insp.title} • <span className="font-medium">{insp.mineName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Inspector: {insp.inspectorName} ({insp.date})
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {insp.violationsCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      {insp.violationsCount} Violations
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      0 Violations
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corrective Actions Status Board (Step 6 in Demo) */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Corrective Action Tracking (CAPA)
              </h2>
              <p className="text-xs text-slate-500">Statutory resolution and escalation workflow</p>
            </div>
            <button
              onClick={() => setActiveTab('corrective-actions')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              CAPA Workflow Board →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
            {correctiveActions.slice(0, 4).map(ca => (
              <div key={ca.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{ca.code}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      ca.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                      ca.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ca.priority}
                    </span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                    {ca.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {ca.mineName} • Due: {ca.dueDate} • Assigned: {ca.responsiblePerson}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    ca.status === 'Overdue' ? 'bg-rose-600 text-white' :
                    ca.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ca.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mine Deep-Dive Modal (Step 3: Show why it is high-risk) */}
      {deepDiveMine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {deepDiveMine.name}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    deepDiveMine.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800' :
                    deepDiveMine.riskLevel === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {deepDiveMine.riskLevel.toUpperCase()} RISK ({deepDiveMine.riskScore}/100)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {deepDiveMine.subsidiaryName} • Lease Code: {deepDiveMine.code}
                </p>
              </div>
              <button
                onClick={() => setDeepDiveMine(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Primary Risk Drivers Callout */}
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-md">
                <h4 className="font-bold text-rose-800 dark:text-rose-200 text-sm mb-1.5 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Primary Drivers of Elevated Risk
                </h4>
                <ul className="space-y-1 text-rose-700 dark:text-rose-300 list-disc list-inside">
                  {deepDiveMine.riskLevel === 'Critical' ? (
                    <>
                      <li>Active DGMS Section 22(3) prohibitive order on Bench OB-4</li>
                      <li>Geotechnical highwall tension cracks progressing at 18mm</li>
                      <li>Overdue statutory Slope Stability Radar (SSR) quarterly audit (CMR 106)</li>
                      <li>Effluent siltation outfall at 168 mg/l exceeding CPCB 100 mg/l ceiling</li>
                    </>
                  ) : deepDiveMine.riskLevel === 'High' ? (
                    <>
                      <li>Degree III gassy seam telemetry interlock disconnection (CMR 153)</li>
                      <li>Overdue quarterly methane tele-monitoring audit</li>
                      <li>Cluster of toxic gas PPE violations in Seam XV timber gang</li>
                      <li>2 critical corrective actions pending corporate escalation</li>
                    </>
                  ) : (
                    <>
                      <li>Routine operational safety inspections maintained on schedule</li>
                      <li>Zero prohibitive statutory orders in force</li>
                      <li>Contractor statutory compliance score above 90%</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Compliance Adherence</div>
                  <div className="text-lg font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {deepDiveMine.complianceRate}%
                  </div>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Active Violations</div>
                  <div className="text-lg font-extrabold text-rose-600 mt-0.5">
                    {deepDiveMine.activeViolations}
                  </div>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Pending Actions</div>
                  <div className="text-lg font-extrabold text-amber-600 mt-0.5">
                    {deepDiveMine.openCorrectiveActions}
                  </div>
                </div>
              </div>

              {/* Statutory Action Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setDeepDiveMine(null);
                    setActiveTab('compliance');
                  }}
                  className="px-3 py-1.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold"
                >
                  View Mine Compliance List
                </button>
                <button
                  onClick={() => {
                    setDeepDiveMine(null);
                    setActiveTab('corrective-actions');
                  }}
                  className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Create Emergency CAPA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

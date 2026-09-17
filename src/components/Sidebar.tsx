import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Pickaxe,
  Smartphone,
  FileCheck,
  SearchCheck,
  AlertOctagon,
  Leaf,
  Users,
  MessageSquareWarning,
  Sparkles,
  Radio,
  Map,
  FileText,
  FileSpreadsheet,
  Shield,
  History,
  Settings,
  X,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, compliance, alerts, correctiveActions } = useApp();
  const navRef = React.useRef<HTMLElement>(null);

  const overdueCount = compliance.filter(c => c.status === 'Overdue').length;
  const criticalAlertsCount = alerts.filter(a => a.priority === 'Critical' && a.status === 'Active').length;
  const pendingActionsCount = correctiveActions.filter(ca => !['Resolved', 'Closed'].includes(ca.status)).length;

  const NAV_GROUPS: NavGroup[] = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Governance Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      groupTitle: 'OPERATIONS',
      items: [
        { id: 'production', label: 'Production & Operations', icon: Pickaxe },
        { id: 'field-reports', label: 'Field Reporting (Mobile)', icon: Smartphone }
      ]
    },
    {
      groupTitle: 'GOVERNANCE',
      items: [
        {
          id: 'compliance',
          label: 'Statutory Compliance',
          icon: FileCheck,
          badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined,
          badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400'
        },
        { id: 'inspections', label: 'Inspections & Audits', icon: SearchCheck },
        {
          id: 'corrective-actions',
          label: 'Corrective Actions (CAPA)',
          icon: AlertOctagon,
          badge: pendingActionsCount > 0 ? pendingActionsCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400'
        },
        { id: 'safety', label: 'Safety & Incidents', icon: AlertOctagon },
        { id: 'environmental', label: 'Environmental Monitoring', icon: Leaf },
        { id: 'contractors', label: 'Contractor Management', icon: Users },
        { id: 'grievances', label: 'Grievance Redressal', icon: MessageSquareWarning },
        {
          id: 'alerts',
          label: 'Alerts & Escalations',
          icon: Radio,
          badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
          badgeColor: 'bg-rose-600 text-white'
        }
      ]
    },
    {
      groupTitle: 'INTELLIGENCE',
      items: [
        { id: 'ai-risk', label: 'AI Risk Center', icon: Sparkles },
        { id: 'ai-assistant', label: 'SmartMine AI Assistant', icon: Sparkles },
        { id: 'anomalies', label: 'Anomaly Detection', icon: TrendingDown },
        { id: 'gis-map', label: 'GIS Mine Map', icon: Map }
      ]
    },
    {
      groupTitle: 'DOCUMENTS & OCR',
      items: [
        { id: 'documents', label: 'Document Center & OCR', icon: FileText }
      ]
    },
    {
      groupTitle: 'REPORTS & REGULATORY',
      items: [
        { id: 'reports', label: 'Statutory & CIL Reports', icon: FileSpreadsheet }
      ]
    },
    {
      groupTitle: 'ADMINISTRATION',
      items: [
        { id: 'users-roles', label: 'Users & Roles (RBAC)', icon: Shield },
        { id: 'audit-trail', label: 'Immutable Audit Trail', icon: History },
        { id: 'system-settings', label: 'System & Demo Reset', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        onWheel={(e) => {
          // If cursor is over sidebar header or footer, forward scroll to nav
          if (navRef.current && !navRef.current.contains(e.target as Node)) {
            navRef.current.scrollTop += e.deltaY;
          }
        }}
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 h-full min-h-0 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out shrink-0 overflow-hidden overscroll-y-contain ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile close button in sidebar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav
          ref={navRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-3 py-4 space-y-5 select-none scrollbar-thin"
        >
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {group.groupTitle}
              </div>

              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ml-1.5 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer PSU info & disclaimer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-400 space-y-1 shrink-0">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>COAL INDIA / DGMS</span>
            <span className="text-emerald-400">OPERATIONAL</span>
          </div>
          <div className="text-[9px] text-slate-400 leading-tight">
            Smart Automation Hackathon Platform
          </div>
        </div>
      </aside>
    </>
  );
};

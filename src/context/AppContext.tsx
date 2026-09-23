import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  Mine,
  ComplianceRequirement,
  Inspection,
  CorrectiveAction,
  SafetyIncident,
  EnvironmentalReading,
  ProductionReport,
  Contractor,
  AlertItem,
  NotificationItem,
  DashboardMetrics,
  AuditLogItem,
  GrievanceItem,
  DocumentItem,
  FieldReport,
  DEMO_ACCOUNTS,
  ROLE_ALLOWED_TABS
} from '../types';
import {
  INITIAL_METRICS,
  SEED_MINES,
  SEED_COMPLIANCE_REQUIREMENTS,
  SEED_INSPECTIONS,
  SEED_CORRECTIVE_ACTIONS,
  SEED_SAFETY_INCIDENTS,
  SEED_ENVIRONMENTAL_READINGS,
  SEED_PRODUCTION_REPORTS,
  SEED_CONTRACTORS,
  SEED_ALERTS,
  SEED_NOTIFICATIONS,
  SEED_GRIEVANCES,
  SEED_DOCUMENTS,
  SEED_FIELD_REPORTS,
  SEED_AUDIT_LOGS
} from '../data/initialData';

// Helper to safely fetch JSON without throwing when non-JSON (like HTML) is returned
async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Returned HTML or other non-JSON response (e.g. 502/404)
      return { success: false, message: `Non-JSON response (${res.status} ${contentType})` };
    }
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network request failed' };
  }
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Auth / User
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  setCurrentRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedMineId: string | null;
  setSelectedMineId: (mineId: string | null) => void;

  // Global Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Guide modal for judges
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;

  // Data
  metrics: DashboardMetrics | null;
  mines: Mine[];
  compliance: ComplianceRequirement[];
  inspections: Inspection[];
  correctiveActions: CorrectiveAction[];
  incidents: SafetyIncident[];
  environmental: EnvironmentalReading[];
  environmentalReadings: EnvironmentalReading[];
  production: ProductionReport[];
  productionRecords: ProductionReport[];
  contractors: Contractor[];
  alerts: AlertItem[];
  notifications: NotificationItem[];
  grievances: GrievanceItem[];
  documents: DocumentItem[];
  fieldReports: FieldReport[];
  auditLogs: AuditLogItem[];

  // Loading & Actions
  loading: boolean;
  refreshData: () => Promise<void>;
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  resetDemoData: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_mine_01',
  name: 'Er. Arvind Mukhopadhyay',
  email: 'mine.official@smartmine.gov.in',
  role: 'mine_official',
  roleTitle: 'General Manager (Mining & Operations)',
  department: 'Bharat Coal Mine Alpha / BCCL Area IX',
  mineId: 'mine_alpha',
  mineName: 'Bharat Coal Mine Alpha',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
};

const ROLE_PRESETS: Record<UserRole, Partial<UserProfile>> = {
  admin: {
    id: 'usr_admin_01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'admin.gov@smartmine.gov.in',
    roleTitle: 'Chief Technical Director & System Admin',
    department: 'Ministry of Coal / IT & Digital Governance Cell',
    mineId: undefined,
    mineName: undefined
  },
  mine_official: {
    id: 'usr_mine_01',
    name: 'Er. Arvind Mukhopadhyay',
    email: 'mine.official@smartmine.gov.in',
    roleTitle: 'General Manager (Mining & Operations)',
    department: 'Bharat Coal Mine Alpha / BCCL Area IX',
    mineId: 'mine_alpha',
    mineName: 'Bharat Coal Mine Alpha'
  },
  inspector: {
    id: 'usr_insp_01',
    name: 'Smt. Priya Sundaram',
    email: 'inspector.dgms@smartmine.gov.in',
    roleTitle: 'Senior Dy. Director of Mines Safety',
    department: 'Directorate General of Mines Safety (DGMS), Eastern Zone',
    mineId: undefined,
    mineName: undefined
  },
  corporate: {
    id: 'usr_corp_01',
    name: 'Shri Vikramaditya Das',
    email: 'corporate.exec@smartmine.gov.in',
    roleTitle: 'Executive Director (Safety & Production Monitoring)',
    department: 'Coal India Limited Corporate HQ, Kolkata',
    mineId: undefined,
    mineName: undefined
  },
  regulatory: {
    id: 'usr_reg_01',
    name: 'Dr. Anurag Sengupta',
    email: 'regulatory.cpcb@smartmine.gov.in',
    roleTitle: 'Zonal Joint Secretary / Compliance Auditor',
    department: 'Central Pollution Control Board & CCO Regional Directorate',
    mineId: undefined,
    mineName: undefined
  },
  contractor: {
    id: 'usr_cont_01',
    name: 'K. S. Narayanan',
    email: 'contractor.rep@smartmine.gov.in',
    roleTitle: 'Lead Contractor Project Engineer',
    department: 'Apex Earthmovers & Heavy Haulage Pvt. Ltd.',
    mineId: 'mine_eastern',
    mineName: 'Eastern Valley Open Cast'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartmine_theme');
    if (saved) return saved === 'dark';
    return false; // Default to professional light enterprise mode
  });

  // Apply dark class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('smartmine_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('smartmine_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Auth state initialized from localStorage for persistent session
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('smartmine_auth_session') !== null;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('smartmine_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      } catch (e) {
        // fallback
      }
    }
    const adminDemo = DEMO_ACCOUNTS.find(a => a.role === 'admin') || DEMO_ACCOUNTS[0];
    return {
      id: adminDemo.id,
      name: adminDemo.name,
      email: adminDemo.demoEmail,
      role: adminDemo.role,
      roleTitle: adminDemo.roleTitle,
      department: adminDemo.department,
      avatarUrl: DEFAULT_USER.avatarUrl
    };
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMineId, setSelectedMineId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Data states initialized with seed baseline data for instantaneous hydration
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(INITIAL_METRICS);
  const [mines, setMines] = useState<Mine[]>(SEED_MINES);
  const [compliance, setCompliance] = useState<ComplianceRequirement[]>(SEED_COMPLIANCE_REQUIREMENTS);
  const [inspections, setInspections] = useState<Inspection[]>(SEED_INSPECTIONS);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(SEED_CORRECTIVE_ACTIONS);
  const [incidents, setIncidents] = useState<SafetyIncident[]>(SEED_SAFETY_INCIDENTS);
  const [environmental, setEnvironmental] = useState<EnvironmentalReading[]>(SEED_ENVIRONMENTAL_READINGS);
  const [production, setProduction] = useState<ProductionReport[]>(SEED_PRODUCTION_REPORTS);
  const [contractors, setContractors] = useState<Contractor[]>(SEED_CONTRACTORS);
  const [alerts, setAlerts] = useState<AlertItem[]>(SEED_ALERTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [grievances, setGrievances] = useState<GrievanceItem[]>(SEED_GRIEVANCES);
  const [documents, setDocuments] = useState<DocumentItem[]>(SEED_DOCUMENTS);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>(SEED_FIELD_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(SEED_AUDIT_LOGS);
  const [loading, setLoading] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setCurrentRole = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS.find(a => a.role === role);
    const preset = ROLE_PRESETS[role];
    const updated: UserProfile = {
      ...currentUser,
      id: demo?.id || preset.id || `usr_${role}_01`,
      name: demo?.name || preset.name || 'Statutory Official',
      email: demo?.demoEmail || preset.email || `${role}@smartmine.demo`,
      roleTitle: demo?.roleTitle || preset.roleTitle || role.toUpperCase(),
      department: demo?.department || preset.department || 'Statutory Authority',
      mineId: demo?.mineId || preset.mineId,
      mineName: demo?.mineName || preset.mineName,
      role
    };
    setCurrentUser(updated);
    if (isLoggedIn) {
      localStorage.setItem('smartmine_auth_session', JSON.stringify(updated));
    }

    // Role-based route guard check: if current tab is not allowed, route to dashboard
    const allowed = ROLE_ALLOWED_TABS[role] || ['dashboard'];
    if (!allowed.includes(activeTab)) {
      setActiveTab('dashboard');
    }

    showToast('info', 'Role Switched', `Active perspective: ${updated.roleTitle} (${role.toUpperCase()})`);
  };

  const login = (email: string, role?: UserRole) => {
    const targetRole = role || 'mine_official';
    const demo = DEMO_ACCOUNTS.find(a => a.role === targetRole);
    const preset = ROLE_PRESETS[targetRole];
    const userProfile: UserProfile = {
      id: demo?.id || preset.id || `usr_${targetRole}_01`,
      name: demo?.name || preset.name || 'Statutory Official',
      email: demo?.demoEmail || email,
      role: targetRole,
      roleTitle: demo?.roleTitle || preset.roleTitle || targetRole.toUpperCase(),
      department: demo?.department || preset.department || 'Statutory Authority',
      mineId: demo?.mineId || preset.mineId,
      mineName: demo?.mineName || preset.mineName,
      avatarUrl: DEFAULT_USER.avatarUrl
    };

    setCurrentUser(userProfile);
    setIsLoggedIn(true);
    localStorage.setItem('smartmine_auth_session', JSON.stringify(userProfile));
    setActiveTab('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('smartmine_auth_session');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    showToast('info', 'Signed Out', 'Signed out of SmartMine Governance session.');
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const headers = {
        'Content-Type': 'application/json',
        'x-user-role': currentUser.role,
        'x-user-id': currentUser.id,
        'x-user-mine-id': currentUser.mineId || '',
        'authorization': `Bearer demo_token_${currentUser.id}`
      };

      const [
        dashRes,
        minesRes,
        compRes,
        inspRes,
        caRes,
        incRes,
        envRes,
        prodRes,
        contRes,
        altRes,
        notifRes,
        grvRes,
        docRes,
        fldRes,
        audRes
      ] = await Promise.all([
        safeFetchJson('/api/dashboard', { headers }),
        safeFetchJson('/api/mines', { headers }),
        safeFetchJson('/api/compliance', { headers }),
        safeFetchJson('/api/inspections', { headers }),
        safeFetchJson('/api/corrective-actions', { headers }),
        safeFetchJson('/api/incidents', { headers }),
        safeFetchJson('/api/environmental', { headers }),
        safeFetchJson('/api/production', { headers }),
        safeFetchJson('/api/contractors', { headers }),
        safeFetchJson('/api/alerts', { headers }),
        safeFetchJson('/api/notifications', { headers }),
        safeFetchJson('/api/grievances', { headers }),
        safeFetchJson('/api/documents', { headers }),
        safeFetchJson('/api/field-reports', { headers }),
        safeFetchJson('/api/audit-logs', { headers })
      ]);

      if (dashRes?.success && dashRes.data) setMetrics(dashRes.data);
      if (minesRes?.success && Array.isArray(minesRes.data)) setMines(minesRes.data);
      if (compRes?.success && Array.isArray(compRes.data)) setCompliance(compRes.data);
      if (inspRes?.success && Array.isArray(inspRes.data)) setInspections(inspRes.data);
      if (caRes?.success && Array.isArray(caRes.data)) setCorrectiveActions(caRes.data);
      if (incRes?.success && Array.isArray(incRes.data)) setIncidents(incRes.data);
      if (envRes?.success && Array.isArray(envRes.data)) setEnvironmental(envRes.data);
      if (prodRes?.success && Array.isArray(prodRes.data)) setProduction(prodRes.data);
      if (contRes?.success && Array.isArray(contRes.data)) setContractors(contRes.data);
      if (altRes?.success && Array.isArray(altRes.data)) setAlerts(altRes.data);
      if (notifRes?.success && Array.isArray(notifRes.data)) setNotifications(notifRes.data);
      if (grvRes?.success && Array.isArray(grvRes.data)) setGrievances(grvRes.data);
      if (docRes?.success && Array.isArray(docRes.data)) setDocuments(docRes.data);
      if (fldRes?.success && Array.isArray(fldRes.data)) setFieldReports(fldRes.data);
      if (audRes?.success && Array.isArray(audRes.data)) setAuditLogs(audRes.data);
    } catch (err: any) {
      console.warn('Network sync notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetDemoData = async () => {
    try {
      const res = await safeFetchJson('/api/demo/reset', { method: 'POST' });
      if (res?.success) {
        showToast('success', 'Demo Reset Complete', 'Database restored to initial baseline demonstration records.');
        await refreshData();
      }
    } catch (err) {
      showToast('error', 'Reset Failed', 'Failed to reset demonstration database.');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currentUser,
        setCurrentUser,
        setCurrentRole,
        isLoggedIn,
        login,
        logout,
        activeTab,
        setActiveTab,
        selectedMineId,
        setSelectedMineId,
        isSearchOpen,
        setIsSearchOpen,
        isGuideOpen,
        setIsGuideOpen,
        metrics,
        mines,
        compliance,
        inspections,
        correctiveActions,
        incidents,
        environmental,
        environmentalReadings: environmental,
        production,
        productionRecords: production,
        contractors,
        alerts,
        notifications,
        grievances,
        documents,
        fieldReports,
        auditLogs,
        loading,
        refreshData,
        showToast,
        toasts,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

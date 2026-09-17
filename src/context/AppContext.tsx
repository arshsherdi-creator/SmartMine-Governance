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
  FieldReport
} from '../types';

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

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMineId, setSelectedMineId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Data states
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [mines, setMines] = useState<Mine[]>([]);
  const [compliance, setCompliance] = useState<ComplianceRequirement[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [environmental, setEnvironmental] = useState<EnvironmentalReading[]>([]);
  const [production, setProduction] = useState<ProductionReport[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    const preset = ROLE_PRESETS[role];
    const updated: UserProfile = {
      ...currentUser,
      ...preset,
      role
    };
    setCurrentUser(updated);
    showToast('info', 'Role Switched', `Switched active perspective to ${updated.roleTitle} (${role.toUpperCase()})`);
  };

  const login = (email: string, role?: UserRole) => {
    setIsLoggedIn(true);
    if (role && ROLE_PRESETS[role]) {
      setCurrentRole(role);
    }
    showToast('success', 'Logged In', `Authenticated as ${currentUser.name}`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('info', 'Signed Out', 'Signed out of SmartMine Governance session.');
  };

  const refreshData = async () => {
    try {
      setLoading(true);
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
        fetch('/api/dashboard').then(r => r.json()),
        fetch('/api/mines').then(r => r.json()),
        fetch('/api/compliance').then(r => r.json()),
        fetch('/api/inspections').then(r => r.json()),
        fetch('/api/corrective-actions').then(r => r.json()),
        fetch('/api/incidents').then(r => r.json()),
        fetch('/api/environmental').then(r => r.json()),
        fetch('/api/production').then(r => r.json()),
        fetch('/api/contractors').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json()),
        fetch('/api/grievances').then(r => r.json()),
        fetch('/api/documents').then(r => r.json()),
        fetch('/api/field-reports').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json())
      ]);

      if (dashRes.success) setMetrics(dashRes.data);
      if (minesRes.success) setMines(minesRes.data);
      if (compRes.success) setCompliance(compRes.data);
      if (inspRes.success) setInspections(inspRes.data);
      if (caRes.success) setCorrectiveActions(caRes.data);
      if (incRes.success) setIncidents(incRes.data);
      if (envRes.success) setEnvironmental(envRes.data);
      if (prodRes.success) setProduction(prodRes.data);
      if (contRes.success) setContractors(contRes.data);
      if (altRes.success) setAlerts(altRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
      if (grvRes.success) setGrievances(grvRes.data);
      if (docRes.success) setDocuments(docRes.data);
      if (fldRes.success) setFieldReports(fldRes.data);
      if (audRes.success) setAuditLogs(audRes.data);
    } catch (err: any) {
      console.error('Failed to load application data:', err);
      showToast('error', 'Network Notice', 'Unable to sync latest records from server. Using local cache.');
    } finally {
      setLoading(false);
    }
  };

  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
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

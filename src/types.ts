export type UserRole = 
  | 'admin'            // System Administrator
  | 'mine_official'    // Mine Official
  | 'inspector'        // Field Officer / Inspector
  | 'corporate'        // Corporate Management
  | 'regulatory'       // Regulatory Authority
  | 'contractor';      // Contractor

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  mineId?: string;
  mineName?: string;
  avatarUrl?: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplianceStatus = 'Compliant' | 'In Progress' | 'At Risk' | 'Non-Compliant' | 'Overdue';

export type ComplianceCategory = 
  | 'Safety' 
  | 'Environmental' 
  | 'DGMS Statutory' 
  | 'Labour Regulations' 
  | 'Production / Mining Plan' 
  | 'Explosives & Blasting';

export interface Mine {
  id: string;
  code: string;
  name: string;
  subsidiaryId: string;
  subsidiaryName: string;
  state: string;
  district: string;
  type: 'Open Cast' | 'Underground' | 'Mixed';
  coordinates: { lat: number; lng: number };
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  complianceRate: number; // percentage
  activeViolations: number;
  openCorrectiveActions: number;
  monthlyProductionTarget: number; // Metric Tonnes
  monthlyProductionActual: number; // Metric Tonnes
  managerName: string;
  contactPhone: string;
  status: 'Operational' | 'Inspection Underway' | 'Notice Issued' | 'Production Advisory';
  lastInspectionDate: string;
  environmentalIndex: number; // 0-100 (higher is better)
  safetyIncidentCount: number;
}

export interface Subsidiary {
  id: string;
  name: string;
  code: string;
  state: string;
  headquarters: string;
  totalMines: number;
  complianceAvg: number;
}

export interface ComplianceRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ComplianceCategory;
  mineId: string;
  mineName: string;
  subsidiaryId: string;
  regulatoryAuthority: 'DGMS' | 'CPCB / SPCB' | 'MoEFCC' | 'Ministry of Labour' | 'Coal Controller Org (CCO)';
  frequency: 'Annual' | 'Quarterly' | 'Monthly' | 'Bi-Annual' | 'Continuous';
  dueDate: string;
  status: ComplianceStatus;
  risk: RiskLevel;
  responsiblePerson: string;
  responsibleDept: string;
  requiredDocuments: string[];
  notes: string[];
  lastUpdated: string;
  escalationLevel?: number;
}

export interface InspectionFinding {
  id: string;
  category: string;
  severity: 'Critical' | 'Major' | 'Moderate' | 'Minor';
  clause?: string;
  statutoryClause?: string;
  description?: string;
  observation?: string;
  immediateActionTaken?: string;
  hasViolation?: boolean;
  correctiveActionId?: string;
}

export interface Inspection {
  id: string;
  code: string;
  title: string;
  mineId: string;
  mineName: string;
  inspectorName: string;
  inspectorRole: string;
  type: 'Statutory DGMS' | 'Routine Safety' | 'Environmental Audit' | 'Special Surprise Inspection' | 'Contractor Audit';
  scheduledDate: string;
  date: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Requires Action' | 'Closed';
  riskLevel: RiskLevel;
  locationDetails: string;
  coordinates: { lat: number; lng: number };
  findingsCount: number;
  violationsCount: number;
  observations: string[];
  findings: InspectionFinding[];
}

export interface SafetyIncident {
  id: string;
  code: string;
  type: 'Near Miss' | 'PPE Violation' | 'Hazard Report' | 'Equipment Incident' | 'Slope Stability Warning' | 'Gas Influx / Ventilation' | 'Blasting Misfire';
  mineId: string;
  mineName: string;
  location: string;
  reportedBy: string;
  reportedDate: string;
  severity: 'Critical' | 'Major' | 'Moderate' | 'Minor';
  peopleInvolved: number;
  description: string;
  immediateAction: string;
  status: 'Open' | 'Investigating' | 'Action Assigned' | 'Resolved';
  coordinates?: { lat: number; lng: number };
  photoUrl?: string;
  calculatedRisk: RiskLevel;
}

export interface EnvironmentalReading {
  id: string;
  mineId: string;
  mineName: string;
  date: string;
  parameter: 'PM10' | 'PM2.5' | 'SO2' | 'NOx' | 'Noise Level' | 'Water pH' | 'Effluent TSS' | 'Overburden Dust';
  value: number;
  unit: string;
  threshold: number;
  status: 'Normal' | 'Advisory' | 'Exceeded';
  location: string;
}

export interface ProductionReport {
  id: string;
  mineId: string;
  mineName: string;
  date: string;
  targetTonnage: number;
  actualTonnage: number;
  variance: number; // percentage (-5% etc.)
  equipmentAvailabilityPercent: number;
  operationalNotes: string;
  anomalyDetected: boolean;
  anomalyReason?: string;
}

export interface Contractor {
  id: string;
  code?: string;
  vendorCode?: string;
  name?: string;
  companyName?: string;
  mineId: string;
  mineName?: string;
  contractType?: 'Overburden Removal' | 'Coal Transportation' | 'Machinery Maintenance' | 'Security & Surveillance' | 'Explosives Handling' | string;
  serviceType?: string;
  startDate?: string;
  endDate?: string;
  licenseExpiryDate?: string;
  status: 'Active' | 'Review Required' | 'Blacklisted' | 'Expired Notice' | 'Compliant' | 'License Expiring' | 'Suspended' | string;
  workforceCount: number;
  complianceScore: number; // 0-100
  safetyRating?: 'A' | 'B' | 'C' | 'D' | number;
  expiringDocsCount?: number;
  documents?: {
    title: string;
    expiryDate: string;
    isExpired: boolean;
  }[];
}

export interface FieldReport {
  id: string;
  code: string;
  mineId: string;
  mineName: string;
  category: string;
  observation: string;
  reporterName: string;
  reporterId: string;
  timestamp: string;
  geoCoordinates: { lat: number; lng: number };
  isGeoTagged: boolean;
  isTimeStamped: boolean;
  photoUrl?: string;
  status: 'Synced' | 'Pending Sync';
}

export type CorrectiveActionStatus = 
  | 'Created' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Overdue' 
  | 'Escalated' 
  | 'Resolved' 
  | 'Verified' 
  | 'Closed';

export interface CorrectiveAction {
  id: string;
  code: string;
  title: string;
  source: 'Inspection' | 'Safety Incident' | 'Environmental Exceedance' | 'Grievance' | 'Audit';
  sourceId: string;
  mineId: string;
  mineName: string;
  violationCategory: string;
  description: string;
  responsiblePerson: string;
  responsibleDept: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: CorrectiveActionStatus;
  resolutionNotes?: string;
  escalationLevel?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface AlertItem {
  id: string;
  type: 
    | 'Compliance Deadline' 
    | 'Overdue Compliance' 
    | 'Safety Incident' 
    | 'Critical Violation' 
    | 'Environmental Breach' 
    | 'Contractor Document Expiry' 
    | 'Corrective Action Overdue' 
    | 'AI Risk Escalation' 
    | 'Production Anomaly';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  mineId: string;
  mineName: string;
  createdAt: string;
  status: 'Active' | 'Acknowledged' | 'Escalated' | 'Resolved';
  escalationPath?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  timestamp: string;
  read: boolean;
  linkTarget: string;
}

export interface AIRiskAssessment {
  id: string;
  mineId: string;
  mineName: string;
  riskLevel: RiskLevel;
  riskScore: number;
  factors: string[];
  recommendedAction: string;
  confidence: number;
  explanation: string;
  generatedAt: string;
  isFallback?: boolean;
}

export interface AnomalyItem {
  id: string;
  title: string;
  mineId: string;
  mineName: string;
  date: string;
  severity: 'Critical' | 'High' | 'Medium';
  category: 'Production' | 'Safety' | 'Environmental' | 'Inspection Gap' | 'Compliance Lag';
  description: string;
  explanation: string;
  recommendedInvestigation: string;
}

export interface GrievanceItem {
  id: string;
  code: string;
  category: 'Safety Equipment / PPE' | 'Wages & Compensation' | 'Working Conditions' | 'Environmental / Dust' | 'Contractor Misconduct';
  submittedBy: string;
  mineId: string;
  mineName: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assignedDept: string;
  status: 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  dueDate: string;
  resolution?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Compliance Certificate' | 'Inspection Report' | 'Contractor Document' | 'Safety Document' | 'Environmental Report' | 'Regulatory Document' | 'Other';
  mineId: string;
  mineName: string;
  uploadDate: string;
  expiryDate: string;
  uploadedBy: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Verification';
  fileSize: string;
  extractedMetadata?: {
    docType?: string;
    refNo?: string;
    issuingAuth?: string;
    issueDate?: string;
    expiryDate?: string;
    keyClause?: string;
    summary?: string;
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  recordId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
}

// Aliases and extended interfaces for rich modular views
export type ProductionRecord = ProductionReport;

export interface AnomalyReport {
  id: string;
  title: string;
  mineId?: string;
  mineName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  description: string;
  detectedAt?: string;
  metrics: Record<string, any>;
  recommendedAction: string;
}

export interface StatutoryDocument {
  id: string;
  referenceNumber: string;
  title: string;
  issuingAuthority: string;
  mineId: string;
  mineName: string;
  effectiveDate: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  extractedClauses?: string[];
  fileUrl?: string;
  status?: string;
}

export interface GrievanceRecord {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  mineId: string;
  mineName: string;
  complainantName: string;
  complainantType: string;
  submittedDate: string;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';
  resolutionNotes?: string;
}

export const PREDEFINED_USERS = [
  {
    id: 'usr_admin_01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'admin.gov@smartmine.gov.in',
    role: 'admin' as UserRole,
    roleTitle: 'Chief Technical Director & System Admin',
    department: 'Ministry of Coal / IT & Digital Governance Cell',
    permissions: ['System Admin', 'National Oversight', 'Audit All', 'Configure Alerts']
  },
  {
    id: 'usr_mine_01',
    name: 'Er. Arvind Mukhopadhyay',
    email: 'mine.official@smartmine.gov.in',
    role: 'mine_official' as UserRole,
    roleTitle: 'General Manager (Mining & Operations)',
    department: 'Bharat Coal Mine Alpha / BCCL Area IX',
    permissions: ['Pit Operations', 'Daily Shift Log', 'File Incidents', 'Manage CAPA']
  },
  {
    id: 'usr_insp_01',
    name: 'Smt. Priya Sundaram',
    email: 'inspector.dgms@smartmine.gov.in',
    role: 'inspector' as UserRole,
    roleTitle: 'Senior Dy. Director of Mines Safety',
    department: 'Directorate General of Mines Safety (DGMS), Eastern Zone',
    permissions: ['Statutory Inspections', 'Issue Section 22 Orders', 'DGMS Form VI Clearance']
  },
  {
    id: 'usr_corp_01',
    name: 'Shri Vikramaditya Das',
    email: 'corporate.exec@smartmine.gov.in',
    role: 'corporate' as UserRole,
    roleTitle: 'Executive Director (Safety & Production Monitoring)',
    department: 'Coal India Limited Corporate HQ, Kolkata',
    permissions: ['Subsidiary Review', 'Production Allocations', 'Tier-2 Escalations']
  },
  {
    id: 'usr_reg_01',
    name: 'Dr. Anurag Sengupta',
    email: 'regulatory.cpcb@smartmine.gov.in',
    role: 'regulatory' as UserRole,
    roleTitle: 'Zonal Joint Secretary / Compliance Auditor',
    department: 'Central Pollution Control Board & CCO Regional Directorate',
    permissions: ['Environmental Audits', 'Effluent Verification', 'MoEFCC Clearances']
  },
  {
    id: 'usr_cont_01',
    name: 'K. S. Narayanan',
    email: 'contractor.rep@smartmine.gov.in',
    role: 'contractor' as UserRole,
    roleTitle: 'Lead Contractor Project Engineer',
    department: 'Apex Earthmovers & Heavy Haulage Pvt. Ltd.',
    permissions: ['Vendor Clearance', 'Machinery Safety Records', 'Vocational Training']
  }
];

export interface DashboardMetrics {
  totalMines: number;
  complianceRate: number;
  openViolations: number;
  highRiskMines: number;
  pendingCorrectiveActions: number;
  overdueComplianceItems: number;
  monthlyProductionTarget: number;
  monthlyProductionActual: number;
  overallComplianceRate?: number;
  overdueComplianceCount?: number;
  openCapaCount?: number;
  criticalMinesCount?: number;
  complianceDistribution: {
    compliant: number;
    inProgress: number;
    atRisk: number;
    nonCompliant: number;
    overdue: number;
  };
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  productionTrend: {
    date: string;
    target: number;
    actual: number;
  }[];
}

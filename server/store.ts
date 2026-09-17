import {
  Mine,
  Subsidiary,
  ComplianceRequirement,
  Inspection,
  SafetyIncident,
  EnvironmentalReading,
  ProductionReport,
  Contractor,
  FieldReport,
  CorrectiveAction,
  AlertItem,
  NotificationItem,
  AIRiskAssessment,
  AnomalyItem,
  GrievanceItem,
  DocumentItem,
  AuditLogItem,
  DashboardMetrics,
  UserProfile
} from '../src/types';
import {
  SEED_USERS,
  SEED_SUBSIDIARIES,
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
} from './seedData';

class SmartMineStore {
  public users: UserProfile[] = [];
  public subsidiaries: Subsidiary[] = [];
  public mines: Mine[] = [];
  public compliance: ComplianceRequirement[] = [];
  public inspections: Inspection[] = [];
  public correctiveActions: CorrectiveAction[] = [];
  public incidents: SafetyIncident[] = [];
  public environmentalReadings: EnvironmentalReading[] = [];
  public productionReports: ProductionReport[] = [];
  public contractors: Contractor[] = [];
  public alerts: AlertItem[] = [];
  public notifications: NotificationItem[] = [];
  public grievances: GrievanceItem[] = [];
  public documents: DocumentItem[] = [];
  public fieldReports: FieldReport[] = [];
  public auditLogs: AuditLogItem[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.users = JSON.parse(JSON.stringify(SEED_USERS));
    this.subsidiaries = JSON.parse(JSON.stringify(SEED_SUBSIDIARIES));
    this.mines = JSON.parse(JSON.stringify(SEED_MINES));
    this.compliance = JSON.parse(JSON.stringify(SEED_COMPLIANCE_REQUIREMENTS));
    this.inspections = JSON.parse(JSON.stringify(SEED_INSPECTIONS));
    this.correctiveActions = JSON.parse(JSON.stringify(SEED_CORRECTIVE_ACTIONS));
    this.incidents = JSON.parse(JSON.stringify(SEED_SAFETY_INCIDENTS));
    this.environmentalReadings = JSON.parse(JSON.stringify(SEED_ENVIRONMENTAL_READINGS));
    this.productionReports = JSON.parse(JSON.stringify(SEED_PRODUCTION_REPORTS));
    this.contractors = JSON.parse(JSON.stringify(SEED_CONTRACTORS));
    this.alerts = JSON.parse(JSON.stringify(SEED_ALERTS));
    this.notifications = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));
    this.grievances = JSON.parse(JSON.stringify(SEED_GRIEVANCES));
    this.documents = JSON.parse(JSON.stringify(SEED_DOCUMENTS));
    this.fieldReports = JSON.parse(JSON.stringify(SEED_FIELD_REPORTS));
    this.auditLogs = JSON.parse(JSON.stringify(SEED_AUDIT_LOGS));
    this.recalculateMineRiskScores();
  }

  public addAuditLog(entry: {
    user?: string;
    role?: string;
    action: string;
    module: string;
    recordId: string;
    details: string;
    previousValue?: string;
    newValue?: string;
  }) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const log: AuditLogItem = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: now,
      user: entry.user || 'Er. Arvind Mukhopadhyay',
      role: entry.role || 'Mine Official',
      action: entry.action,
      module: entry.module,
      recordId: entry.recordId,
      details: entry.details,
      previousValue: entry.previousValue,
      newValue: entry.newValue,
      ipAddress: '10.14.22.81'
    };
    this.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    return log;
  }

  public recalculateMineRiskScores() {
    for (const mine of this.mines) {
      const mineCompliance = this.compliance.filter(c => c.mineId === mine.id);
      const overdueCount = mineCompliance.filter(c => c.status === 'Overdue').length;
      const nonCompliantCount = mineCompliance.filter(c => c.status === 'Non-Compliant').length;
      const atRiskCount = mineCompliance.filter(c => c.status === 'At Risk').length;
      const compliantCount = mineCompliance.filter(c => c.status === 'Compliant').length;
      
      const totalComp = mineCompliance.length || 1;
      mine.complianceRate = Math.round((compliantCount / totalComp) * 100 * 10) / 10;

      const openActions = this.correctiveActions.filter(
        ca => ca.mineId === mine.id && !['Resolved', 'Verified', 'Closed'].includes(ca.status)
      ).length;
      mine.openCorrectiveActions = openActions;

      const openViolations = this.inspections
        .filter(i => i.mineId === mine.id)
        .reduce((sum, i) => sum + (i.findings.filter(f => f.hasViolation && !f.correctiveActionId).length || 0), 0)
        + this.incidents.filter(inc => inc.mineId === mine.id && inc.status !== 'Resolved').length;
      mine.activeViolations = openViolations;

      // Calculate explainable score (0 - 100):
      // Overdue items (+18 each), Non-compliant (+12 each), Open actions (+8 each), Violations (+10 each)
      let score = 10 + (overdueCount * 18) + (nonCompliantCount * 12) + (atRiskCount * 6) + (openActions * 8) + (openViolations * 10);
      
      // Environmental factor: if any recent reading exceeded threshold (+15)
      const envExceeded = this.environmentalReadings.some(e => e.mineId === mine.id && e.status === 'Exceeded');
      if (envExceeded) score += 15;

      mine.riskScore = Math.min(99, Math.max(12, score));
      if (mine.riskScore >= 80) {
        mine.riskLevel = 'Critical';
      } else if (mine.riskScore >= 65) {
        mine.riskLevel = 'High';
      } else if (mine.riskScore >= 35) {
        mine.riskLevel = 'Medium';
      } else {
        mine.riskLevel = 'Low';
      }
    }
  }

  public getDashboardMetrics(): DashboardMetrics {
    this.recalculateMineRiskScores();

    const totalMines = this.mines.length;
    const allCompliance = this.compliance;
    const compliantCount = allCompliance.filter(c => c.status === 'Compliant').length;
    const overallRate = allCompliance.length ? Math.round((compliantCount / allCompliance.length) * 100 * 10) / 10 : 100;

    const openViolations = this.mines.reduce((acc, m) => acc + m.activeViolations, 0);
    const highRiskMines = this.mines.filter(m => m.riskLevel === 'High' || m.riskLevel === 'Critical').length;
    const pendingCorrectiveActions = this.correctiveActions.filter(
      ca => !['Resolved', 'Verified', 'Closed'].includes(ca.status)
    ).length;
    const overdueComplianceItems = allCompliance.filter(c => c.status === 'Overdue').length;

    const totalTarget = this.mines.reduce((acc, m) => acc + m.monthlyProductionTarget, 0);
    const totalActual = this.mines.reduce((acc, m) => acc + m.monthlyProductionActual, 0);

    const complianceDistribution = {
      compliant: allCompliance.filter(c => c.status === 'Compliant').length,
      inProgress: allCompliance.filter(c => c.status === 'In Progress').length,
      atRisk: allCompliance.filter(c => c.status === 'At Risk').length,
      nonCompliant: allCompliance.filter(c => c.status === 'Non-Compliant').length,
      overdue: allCompliance.filter(c => c.status === 'Overdue').length,
    };

    const riskDistribution = {
      critical: this.mines.filter(m => m.riskLevel === 'Critical').length,
      high: this.mines.filter(m => m.riskLevel === 'High').length,
      medium: this.mines.filter(m => m.riskLevel === 'Medium').length,
      low: this.mines.filter(m => m.riskLevel === 'Low').length,
    };

    const productionTrend = [
      { date: 'Sep 05', target: 67200, actual: 64100 },
      { date: 'Sep 06', target: 67200, actual: 65800 },
      { date: 'Sep 07', target: 67200, actual: 63200 },
      { date: 'Sep 08', target: 67200, actual: 59400 },
      { date: 'Sep 09', target: 67200, actual: 56900 },
      { date: 'Sep 10', target: 67200, actual: 57400 },
      { date: 'Sep 11', target: 67200, actual: 60270 },
    ];

    return {
      totalMines,
      complianceRate: overallRate,
      openViolations,
      highRiskMines,
      pendingCorrectiveActions,
      overdueComplianceItems,
      monthlyProductionTarget: totalTarget,
      monthlyProductionActual: totalActual,
      complianceDistribution,
      riskDistribution,
      productionTrend
    };
  }
}

export const store = new SmartMineStore();

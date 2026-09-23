import { DashboardMetrics } from '../types';
import {
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
} from '../../server/seedData';

export const INITIAL_METRICS: DashboardMetrics = {
  totalMines: 6,
  complianceRate: 40,
  openViolations: 2,
  highRiskMines: 2,
  pendingCorrectiveActions: 7,
  overdueComplianceItems: 3,
  monthlyProductionTarget: 2610000,
  monthlyProductionActual: 2471500,
  complianceDistribution: {
    compliant: 6,
    inProgress: 2,
    atRisk: 2,
    nonCompliant: 2,
    overdue: 3
  },
  riskDistribution: {
    critical: 1,
    high: 1,
    medium: 1,
    low: 3
  },
  productionTrend: [
    { date: 'Sep 05', target: 67200, actual: 64100 },
    { date: 'Sep 06', target: 67200, actual: 65800 },
    { date: 'Sep 07', target: 67200, actual: 63200 },
    { date: 'Sep 08', target: 67200, actual: 59400 },
    { date: 'Sep 09', target: 67200, actual: 56900 },
    { date: 'Sep 10', target: 67200, actual: 57400 },
    { date: 'Sep 11', target: 67200, actual: 60270 }
  ]
};

export {
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
};

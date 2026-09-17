import express from 'express';
import { store } from './store';
import {
  askSmartMineAssistant,
  generateAIRiskAssessments,
  detectOperationalAnomalies,
  extractDocumentMetadataWithGemini
} from './geminiService';
import { ComplianceRequirement, CorrectiveAction, Inspection, SafetyIncident, FieldReport } from '../src/types';

export const apiRouter = express.Router();

// Dashboard Overview
apiRouter.get('/dashboard', (req, res) => {
  try {
    const metrics = store.getDashboardMetrics();
    res.json({
      success: true,
      data: metrics,
      recentAlerts: store.alerts.slice(0, 5),
      recentInspections: store.inspections.slice(0, 5),
      topRiskMines: [...store.mines].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
      recentCorrectiveActions: store.correctiveActions.slice(0, 6)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mines & Subsidiaries
apiRouter.get('/mines', (req, res) => {
  store.recalculateMineRiskScores();
  res.json({ success: true, data: store.mines });
});

apiRouter.get('/mines/:id', (req, res) => {
  const mine = store.mines.find(m => m.id === req.params.id);
  if (!mine) {
    return res.status(404).json({ success: false, message: 'Mine not found' });
  }
  const mineCompliance = store.compliance.filter(c => c.mineId === mine.id);
  const mineInspections = store.inspections.filter(i => i.mineId === mine.id);
  const mineActions = store.correctiveActions.filter(ca => ca.mineId === mine.id);
  const mineIncidents = store.incidents.filter(inc => inc.mineId === mine.id);
  const mineReadings = store.environmentalReadings.filter(e => e.mineId === mine.id);
  const mineContractors = store.contractors.filter(ct => ct.mineId === mine.id);
  const mineProduction = store.productionReports.filter(p => p.mineId === mine.id);

  res.json({
    success: true,
    data: {
      ...mine,
      compliance: mineCompliance,
      inspections: mineInspections,
      correctiveActions: mineActions,
      incidents: mineIncidents,
      environmentalReadings: mineReadings,
      contractors: mineContractors,
      productionReports: mineProduction
    }
  });
});

apiRouter.get('/subsidiaries', (req, res) => {
  res.json({ success: true, data: store.subsidiaries });
});

// Compliance Management
apiRouter.get('/compliance', (req, res) => {
  let list = [...store.compliance];
  const { mineId, category, status, risk, search } = req.query;

  if (mineId && typeof mineId === 'string' && mineId !== 'all') {
    list = list.filter(c => c.mineId === mineId);
  }
  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter(c => c.category === category);
  }
  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter(c => c.status === status);
  }
  if (risk && typeof risk === 'string' && risk !== 'all') {
    list = list.filter(c => c.risk === risk);
  }
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.responsiblePerson.toLowerCase().includes(q) ||
      c.mineName.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: list });
});

apiRouter.post('/compliance', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const newRequirement: ComplianceRequirement = {
      id: `comp_${Date.now()}`,
      code: body.code || `DGMS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: body.title,
      description: body.description || '',
      category: body.category || 'Safety',
      mineId: mine.id,
      mineName: mine.name,
      subsidiaryId: mine.subsidiaryId,
      regulatoryAuthority: body.regulatoryAuthority || 'DGMS',
      frequency: body.frequency || 'Monthly',
      dueDate: body.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: body.status || 'In Progress',
      risk: body.risk || 'Medium',
      responsiblePerson: body.responsiblePerson || 'Mine Safety Officer',
      responsibleDept: body.responsibleDept || 'Safety Directorate',
      requiredDocuments: body.requiredDocuments || ['Compliance Verification Report'],
      notes: body.notes ? [body.notes] : ['Requirement newly created in system.'],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    store.compliance.unshift(newRequirement);
    store.recalculateMineRiskScores();

    store.addAuditLog({
      user: req.body.userName || 'Er. Arvind Mukhopadhyay',
      role: req.body.userRole || 'Mine Official',
      action: 'CREATE_COMPLIANCE_REQUIREMENT',
      module: 'Compliance',
      recordId: newRequirement.id,
      details: `Created requirement ${newRequirement.code}: ${newRequirement.title} for ${newRequirement.mineName}`
    });

    res.status(201).json({ success: true, data: newRequirement });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/compliance/:id', (req, res) => {
  const item = store.compliance.find(c => c.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Compliance requirement not found' });
  }

  const previousStatus = item.status;
  if (req.body.status) item.status = req.body.status;
  if (req.body.risk) item.risk = req.body.risk;
  if (req.body.responsiblePerson) item.responsiblePerson = req.body.responsiblePerson;
  if (req.body.dueDate) item.dueDate = req.body.dueDate;
  if (req.body.notes) item.notes.unshift(req.body.notes);
  item.lastUpdated = new Date().toISOString().split('T')[0];

  store.recalculateMineRiskScores();

  store.addAuditLog({
    user: req.body.userName || 'Er. Arvind Mukhopadhyay',
    role: req.body.userRole || 'Mine Official',
    action: 'UPDATE_COMPLIANCE_STATUS',
    module: 'Compliance',
    recordId: item.id,
    details: `Updated compliance ${item.code} status from ${previousStatus} to ${item.status}`,
    previousValue: previousStatus,
    newValue: item.status
  });

  res.json({ success: true, data: item });
});

// Inspections
apiRouter.get('/inspections', (req, res) => {
  res.json({ success: true, data: store.inspections });
});

apiRouter.post('/inspections', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const newInspection: Inspection = {
      id: `insp_${Date.now()}`,
      code: `INSP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      title: body.title,
      mineId: mine.id,
      mineName: mine.name,
      inspectorName: body.inspectorName || 'Smt. Priya Sundaram',
      inspectorRole: body.inspectorRole || 'Senior Dy. Director of Mines Safety',
      type: body.type || 'Routine Safety',
      scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      status: body.status || 'In Progress',
      riskLevel: body.riskLevel || 'Medium',
      locationDetails: body.locationDetails || 'Operational Pithead Area',
      coordinates: body.coordinates || mine.coordinates,
      findingsCount: body.findings ? body.findings.length : 0,
      violationsCount: body.findings ? body.findings.filter((f: any) => f.hasViolation).length : 0,
      observations: body.observations || ['General mine pit inspection in progress.'],
      findings: body.findings || []
    };

    store.inspections.unshift(newInspection);
    store.recalculateMineRiskScores();

    store.addAuditLog({
      user: newInspection.inspectorName,
      role: 'Inspector',
      action: 'CREATE_INSPECTION',
      module: 'Inspections',
      recordId: newInspection.id,
      details: `Scheduled inspection ${newInspection.code} at ${newInspection.mineName}`
    });

    res.status(201).json({ success: true, data: newInspection });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/inspections/:id', (req, res) => {
  const item = store.inspections.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Inspection not found' });
  }
  if (req.body.status) item.status = req.body.status;
  if (req.body.observations) item.observations = req.body.observations;
  if (req.body.findings) {
    item.findings = req.body.findings;
    item.findingsCount = item.findings.length;
    item.violationsCount = item.findings.filter(f => f.hasViolation).length;
  }
  store.recalculateMineRiskScores();

  store.addAuditLog({
    user: req.body.userName || item.inspectorName,
    role: 'Inspector',
    action: 'UPDATE_INSPECTION',
    module: 'Inspections',
    recordId: item.id,
    details: `Updated inspection ${item.code} status to ${item.status}`
  });

  res.json({ success: true, data: item });
});

// Corrective Actions (CAPA Workflow)
apiRouter.get('/corrective-actions', (req, res) => {
  res.json({ success: true, data: store.correctiveActions });
});

apiRouter.post('/corrective-actions', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const newCAPA: CorrectiveAction = {
      id: `ca_${Date.now()}`,
      code: `CAPA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: body.title,
      source: body.source || 'Inspection',
      sourceId: body.sourceId || 'manual',
      mineId: mine.id,
      mineName: mine.name,
      violationCategory: body.violationCategory || 'Operational Safety',
      description: body.description,
      responsiblePerson: body.responsiblePerson || 'Mine Safety Officer',
      responsibleDept: body.responsibleDept || 'Mining Operations',
      priority: body.priority || 'High',
      dueDate: body.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: body.status || 'Assigned',
      escalationLevel: body.priority === 'Critical' ? 2 : 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    store.correctiveActions.unshift(newCAPA);
    store.recalculateMineRiskScores();

    // Generate Alert if Critical
    if (newCAPA.priority === 'Critical') {
      store.alerts.unshift({
        id: `alt_${Date.now()}`,
        type: 'Corrective Action Overdue',
        priority: 'Critical',
        title: `Critical Corrective Action Assigned: ${newCAPA.code}`,
        description: `${newCAPA.title} at ${newCAPA.mineName}`,
        mineId: mine.id,
        mineName: mine.name,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Active',
        escalationPath: ['Mine Official', 'Director Technical', 'DGMS']
      });
    }

    store.addAuditLog({
      user: req.body.userName || 'Er. Arvind Mukhopadhyay',
      role: req.body.userRole || 'Mine Official',
      action: 'CREATE_CORRECTIVE_ACTION',
      module: 'Corrective Actions',
      recordId: newCAPA.id,
      details: `Created Corrective Action ${newCAPA.code}: ${newCAPA.title}`
    });

    res.status(201).json({ success: true, data: newCAPA });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/corrective-actions/:id', (req, res) => {
  const item = store.correctiveActions.find(ca => ca.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Corrective action not found' });
  }

  const prevStatus = item.status;
  if (req.body.status) item.status = req.body.status;
  if (req.body.resolutionNotes) item.resolutionNotes = req.body.resolutionNotes;
  if (req.body.responsiblePerson) item.responsiblePerson = req.body.responsiblePerson;
  if (req.body.priority) item.priority = req.body.priority;
  if (req.body.dueDate) item.dueDate = req.body.dueDate;
  if (item.status === 'Resolved' && !item.resolvedAt) {
    item.resolvedAt = new Date().toISOString().split('T')[0];
  }

  store.recalculateMineRiskScores();

  store.addAuditLog({
    user: req.body.userName || 'Er. Arvind Mukhopadhyay',
    role: req.body.userRole || 'Mine Official',
    action: 'TRANSITION_CORRECTIVE_ACTION',
    module: 'Corrective Actions',
    recordId: item.id,
    details: `Transitioned CAPA ${item.code} status from ${prevStatus} to ${item.status}`,
    previousValue: prevStatus,
    newValue: item.status
  });

  res.json({ success: true, data: item });
});

// Safety Incidents
apiRouter.get('/incidents', (req, res) => {
  res.json({ success: true, data: store.incidents });
});

apiRouter.post('/incidents', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    
    // Auto calculate initial risk
    let calcRisk = 'Medium';
    if (body.severity === 'Critical') calcRisk = 'Critical';
    else if (body.severity === 'Major') calcRisk = 'High';
    else if (body.severity === 'Minor') calcRisk = 'Low';

    const newIncident: SafetyIncident = {
      id: `inc_${Date.now()}`,
      code: `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      type: body.type || 'Near Miss',
      mineId: mine.id,
      mineName: mine.name,
      location: body.location || 'Mine Leasehold',
      reportedBy: body.reportedBy || 'Field Safety Officer',
      reportedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      severity: body.severity || 'Moderate',
      peopleInvolved: Number(body.peopleInvolved) || 0,
      description: body.description,
      immediateAction: body.immediateAction || 'Immediate safety perimeter established.',
      status: body.status || 'Investigating',
      coordinates: body.coordinates || mine.coordinates,
      calculatedRisk: calcRisk as any
    };

    store.incidents.unshift(newIncident);
    mine.safetyIncidentCount += 1;
    store.recalculateMineRiskScores();

    // Trigger alert if Major or Critical
    if (newIncident.severity === 'Critical' || newIncident.severity === 'Major') {
      store.alerts.unshift({
        id: `alt_${Date.now()}`,
        type: 'Safety Incident',
        priority: newIncident.severity === 'Critical' ? 'Critical' : 'High',
        title: `Safety Incident Logged: ${newIncident.type} (${newIncident.code})`,
        description: `${newIncident.description.substring(0, 120)}... at ${newIncident.mineName}`,
        mineId: mine.id,
        mineName: mine.name,
        createdAt: newIncident.reportedDate,
        status: 'Active'
      });
    }

    store.addAuditLog({
      user: newIncident.reportedBy,
      role: 'Inspector',
      action: 'LOG_SAFETY_INCIDENT',
      module: 'Safety & Incidents',
      recordId: newIncident.id,
      details: `Logged ${newIncident.severity} incident ${newIncident.code} at ${newIncident.mineName}`
    });

    res.status(201).json({ success: true, data: newIncident });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Environmental Monitoring
apiRouter.get('/environmental', (req, res) => {
  res.json({ success: true, data: store.environmentalReadings });
});

apiRouter.post('/environmental', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const val = Number(body.value);
    const threshold = Number(body.threshold) || 100;
    const status: 'Normal' | 'Advisory' | 'Exceeded' = val > threshold ? 'Exceeded' : val > threshold * 0.85 ? 'Advisory' : 'Normal';

    const newReading = {
      id: `env_${Date.now()}`,
      mineId: mine.id,
      mineName: mine.name,
      date: new Date().toISOString().split('T')[0],
      parameter: body.parameter,
      value: val,
      unit: body.unit || 'µg/m³',
      threshold,
      status,
      location: body.location || 'Mine Ambient Monitoring Station'
    };

    store.environmentalReadings.unshift(newReading);

    if (status === 'Exceeded') {
      store.alerts.unshift({
        id: `alt_${Date.now()}`,
        type: 'Environmental Breach',
        priority: 'High',
        title: `Environmental Exceedance: ${body.parameter} at ${mine.name}`,
        description: `Reading of ${val} ${newReading.unit} exceeded statutory threshold of ${threshold} ${newReading.unit}`,
        mineId: mine.id,
        mineName: mine.name,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Active'
      });
    }

    store.recalculateMineRiskScores();

    store.addAuditLog({
      user: req.body.userName || 'Er. Arvind Mukhopadhyay',
      role: 'Mine Official',
      action: 'RECORD_ENVIRONMENTAL_READING',
      module: 'Environmental',
      recordId: newReading.id,
      details: `Recorded ${body.parameter}: ${val} ${newReading.unit} (Status: ${status}) for ${mine.name}`
    });

    res.status(201).json({ success: true, data: newReading });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Production Reports
apiRouter.get('/production', (req, res) => {
  res.json({ success: true, data: store.productionReports });
});

apiRouter.post('/production', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const target = Number(body.targetTonnage);
    const actual = Number(body.actualTonnage);
    const variance = target > 0 ? Math.round(((actual - target) / target) * 100 * 10) / 10 : 0;
    const anomalyDetected = variance < -15;

    const newReport = {
      id: `prod_${Date.now()}`,
      mineId: mine.id,
      mineName: mine.name,
      date: body.date || new Date().toISOString().split('T')[0],
      targetTonnage: target,
      actualTonnage: actual,
      variance,
      equipmentAvailabilityPercent: Number(body.equipmentAvailabilityPercent) || 85,
      operationalNotes: body.operationalNotes || 'Daily shift reporting log.',
      anomalyDetected,
      anomalyReason: anomalyDetected ? `Production deficit of ${Math.abs(variance)}% against statutory target` : undefined
    };

    store.productionReports.unshift(newReport);
    mine.monthlyProductionActual += actual;

    if (anomalyDetected) {
      store.alerts.unshift({
        id: `alt_${Date.now()}`,
        type: 'Production Anomaly',
        priority: 'Medium',
        title: `Production Deviation Alert at ${mine.name}`,
        description: `Daily extraction deviated by ${variance}% (Target: ${target} MT, Actual: ${actual} MT)`,
        mineId: mine.id,
        mineName: mine.name,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Active'
      });
    }

    store.addAuditLog({
      user: req.body.userName || 'Er. Arvind Mukhopadhyay',
      role: 'Mine Official',
      action: 'LOG_PRODUCTION_REPORT',
      module: 'Production',
      recordId: newReport.id,
      details: `Logged production for ${mine.name}: ${actual} MT against target ${target} MT (Variance: ${variance}%)`
    });

    res.status(201).json({ success: true, data: newReport });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Contractors
apiRouter.get('/contractors', (req, res) => {
  res.json({ success: true, data: store.contractors });
});

apiRouter.post('/contractors', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const newContractor = {
      id: `cont_${Date.now()}`,
      code: `CNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      companyName: body.companyName,
      mineId: mine.id,
      mineName: mine.name,
      contractType: body.contractType || 'Overburden Removal',
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      status: body.status || 'Active',
      workforceCount: Number(body.workforceCount) || 50,
      complianceScore: Number(body.complianceScore) || 85,
      safetyRating: body.safetyRating || 'B',
      expiringDocsCount: 0,
      documents: body.documents || [
        { title: 'Contract Labour R&A License Form VI', expiryDate: '2027-03-31', isExpired: false },
        { title: 'Workmen Compensation Statutory Cover', expiryDate: '2027-03-31', isExpired: false }
      ]
    };

    store.contractors.unshift(newContractor);

    store.addAuditLog({
      user: req.body.userName || 'Er. Arvind Mukhopadhyay',
      role: 'Mine Official',
      action: 'REGISTER_CONTRACTOR',
      module: 'Contractor Management',
      recordId: newContractor.id,
      details: `Registered contractor ${newContractor.companyName} at ${mine.name}`
    });

    res.status(201).json({ success: true, data: newContractor });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Field Reports
apiRouter.get('/field-reports', (req, res) => {
  res.json({ success: true, data: store.fieldReports });
});

apiRouter.post('/field-reports', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const newReport: FieldReport = {
      id: `fld_${Date.now()}`,
      code: `FLD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      mineId: mine.id,
      mineName: mine.name,
      category: body.category || 'General Safety Observation',
      observation: body.observation,
      reporterName: body.reporterName || 'Smt. Priya Sundaram',
      reporterId: body.reporterId || 'usr_insp_01',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      geoCoordinates: body.geoCoordinates || mine.coordinates,
      isGeoTagged: true,
      isTimeStamped: true,
      photoUrl: body.photoUrl,
      status: 'Synced'
    };

    store.fieldReports.unshift(newReport);

    store.addAuditLog({
      user: newReport.reporterName,
      role: 'Inspector',
      action: 'SUBMIT_FIELD_REPORT',
      module: 'Field Reporting',
      recordId: newReport.id,
      details: `Submitted geo-tagged and time-stamped field report ${newReport.code} at ${mine.name}`
    });

    res.status(201).json({ success: true, data: newReport });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Alerts & Escalations
apiRouter.get('/alerts', (req, res) => {
  res.json({ success: true, data: store.alerts });
});

apiRouter.post('/alerts/:id/action', (req, res) => {
  const alert = store.alerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  const { action, userName } = req.body; // 'acknowledge' | 'escalate' | 'resolve'
  const prevStatus = alert.status;

  if (action === 'acknowledge') {
    alert.status = 'Acknowledged';
  } else if (action === 'escalate') {
    alert.status = 'Escalated';
    if (!alert.escalationPath) alert.escalationPath = [];
    alert.escalationPath.push('Corporate Management / Regulatory Oversight Cell');
  } else if (action === 'resolve') {
    alert.status = 'Resolved';
  }

  store.addAuditLog({
    user: userName || 'Er. Arvind Mukhopadhyay',
    role: 'Mine Official',
    action: `ALERT_${action.toUpperCase()}`,
    module: 'Alerts',
    recordId: alert.id,
    details: `${action} alert "${alert.title}" (Status: ${alert.status})`,
    previousValue: prevStatus,
    newValue: alert.status
  });

  res.json({ success: true, data: alert });
});

// Notifications
apiRouter.get('/notifications', (req, res) => {
  res.json({ success: true, data: store.notifications });
});

apiRouter.post('/notifications/:id/read', (req, res) => {
  const notif = store.notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true, data: notif });
});

// Grievances
apiRouter.get('/grievances', (req, res) => {
  res.json({ success: true, data: store.grievances });
});

apiRouter.post('/grievances', (req, res) => {
  try {
    const body = req.body;
    const mine = store.mines.find(m => m.id === body.mineId) || store.mines[0];
    const newGrievance = {
      id: `grv_${Date.now()}`,
      code: `GRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      category: body.category || 'Working Conditions',
      submittedBy: body.submittedBy || 'Anonymous Mine Worker',
      mineId: mine.id,
      mineName: mine.name,
      description: body.description,
      priority: body.priority || 'Medium',
      assignedDept: body.assignedDept || 'Labour Welfare Wing',
      status: 'Submitted' as any,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    };

    store.grievances.unshift(newGrievance);

    store.addAuditLog({
      user: newGrievance.submittedBy,
      role: 'Contractor',
      action: 'SUBMIT_GRIEVANCE',
      module: 'Grievance Management',
      recordId: newGrievance.id,
      details: `Submitted grievance ${newGrievance.code}: ${newGrievance.category} for ${mine.name}`
    });

    res.status(201).json({ success: true, data: newGrievance });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/grievances/:id', (req, res) => {
  const grv = store.grievances.find(g => g.id === req.params.id);
  if (!grv) {
    return res.status(404).json({ success: false, message: 'Grievance not found' });
  }
  if (req.body.status) grv.status = req.body.status;
  if (req.body.resolution) grv.resolution = req.body.resolution;

  store.addAuditLog({
    user: req.body.userName || 'Er. Arvind Mukhopadhyay',
    role: 'Mine Official',
    action: 'UPDATE_GRIEVANCE',
    module: 'Grievance Management',
    recordId: grv.id,
    details: `Updated grievance ${grv.code} status to ${grv.status}`
  });

  res.json({ success: true, data: grv });
});

// Documents & OCR
apiRouter.get('/documents', (req, res) => {
  res.json({ success: true, data: store.documents });
});

apiRouter.post('/documents', async (req, res) => {
  try {
    const { title, category, mineId, contentText } = req.body;
    const mine = store.mines.find(m => m.id === mineId) || store.mines[0];

    const extracted = await extractDocumentMetadataWithGemini(title, contentText);

    const newDoc = {
      id: `doc_${Date.now()}`,
      title,
      category: category || 'Compliance Certificate',
      mineId: mine.id,
      mineName: mine.name,
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: extracted.expiryDate || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      uploadedBy: req.body.userName || 'Er. Arvind Mukhopadhyay',
      status: 'Valid' as const,
      fileSize: '3.2 MB',
      extractedMetadata: extracted
    };

    store.documents.unshift(newDoc);

    store.addAuditLog({
      user: newDoc.uploadedBy,
      role: 'Mine Official',
      action: 'UPLOAD_STATUTORY_DOCUMENT',
      module: 'Document Center',
      recordId: newDoc.id,
      details: `Uploaded and OCR-analyzed document "${newDoc.title}" (Ref: ${extracted.refNo})`
    });

    res.status(201).json({ success: true, data: newDoc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Audit Logs
apiRouter.get('/audit-logs', (req, res) => {
  res.json({ success: true, data: store.auditLogs });
});

// AI Risk Center
apiRouter.get('/ai/risk-assessment', async (req, res) => {
  try {
    const assessments = await generateAIRiskAssessments();
    res.json({ success: true, data: assessments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/ai/anomalies', (req, res) => {
  try {
    const anomalies = detectOperationalAnomalies();
    res.json({ success: true, data: anomalies });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SmartMine AI Conversational Assistant
apiRouter.post('/ai/assistant', async (req, res) => {
  try {
    const textQuery = req.body.query || req.body.message || req.body.prompt;
    const role = req.body.role || 'mine_official';
    if (!textQuery || typeof textQuery !== 'string') {
      return res.status(400).json({ success: false, message: 'Query string required' });
    }

    const response = await askSmartMineAssistant(textQuery, role);
    res.json({ success: true, data: response });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Statutory OCR & Clause Extraction
apiRouter.post('/ai/extract-document', async (req, res) => {
  try {
    const { documentText, title, mineId } = req.body;
    const mine = store.mines.find(m => m.id === mineId) || store.mines[0];
    const docTitle = title || 'DGMS Statutory Order';
    const extracted = await extractDocumentMetadataWithGemini(docTitle, documentText || '');

    const newDoc = {
      id: `doc_${Date.now()}`,
      referenceNumber: extracted.refNo || `DGMS/STAT/${Date.now()}`,
      title: docTitle,
      category: extracted.docType || 'Compliance Certificate',
      mineId: mine.id,
      mineName: mine.name,
      issuingAuthority: extracted.issuingAuth || 'Directorate General of Mines Safety',
      effectiveDate: extracted.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: extracted.expiryDate || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      riskLevel: (docTitle.includes('22(1)') || docTitle.includes('Prohibitive')) ? 'Critical' : 'Medium',
      extractedClauses: [extracted.keyClause, extracted.summary].filter(Boolean),
      uploadedBy: req.body.userName || 'Mine Safety Officer',
      status: 'Valid',
      fileSize: '2.8 MB',
      fileUrl: documentText,
      extractedMetadata: extracted
    };

    store.documents.unshift(newDoc as any);

    store.addAuditLog({
      user: newDoc.uploadedBy,
      role: 'Mine Official',
      action: 'EXTRACT_STATUTORY_DOCUMENT',
      module: 'Document Center',
      recordId: newDoc.id,
      details: `Gemini 3.8 Flash parsed and registered document "${docTitle}" (Ref: ${newDoc.referenceNumber})`
    });

    res.json({ success: true, data: newDoc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Report Generation
apiRouter.post('/reports/generate', (req, res) => {
  try {
    const { reportType, mineId, dateRange } = req.body;
    const mine = store.mines.find(m => m.id === mineId);
    const metrics = store.getDashboardMetrics();

    const reportData = {
      reportId: `REP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      reportType: reportType || 'Monthly Statutory Compliance Report',
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      generatedBy: req.body.userName || 'Er. Arvind Mukhopadhyay',
      mineName: mine ? mine.name : 'All Monitored Operational Mines',
      dateRange: dateRange || 'Current Audit Period (August - September 2026)',
      overallComplianceRate: `${metrics.complianceRate}%`,
      activeViolationsCount: metrics.openViolations,
      overdueItemsCount: metrics.overdueComplianceItems,
      highRiskMinesCount: metrics.highRiskMines,
      statutorySummary: 'Official compliance and safety audit generated in accordance with DGMS Coal Mines Regulations 2017, Mines Act 1952, and CPCB Environmental Guidelines.',
      itemsAudited: store.compliance.length,
      inspectionsAudited: store.inspections.length,
      correctiveActionsEnforced: store.correctiveActions.length
    };

    store.addAuditLog({
      user: reportData.generatedBy,
      role: 'Mine Official',
      action: 'GENERATE_STATUTORY_REPORT',
      module: 'Reports',
      recordId: reportData.reportId,
      details: `Generated official report ${reportData.reportId}: ${reportData.reportType}`
    });

    res.json({ success: true, data: reportData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset Demo Data
apiRouter.post('/demo/reset', (req, res) => {
  store.reset();
  store.addAuditLog({
    user: 'Authorized Judge / System Admin',
    role: 'System Administrator',
    action: 'RESET_DEMO_DATA',
    module: 'System Settings',
    recordId: 'demo_reset',
    details: 'Reset system database to baseline demonstration seed records.'
  });
  res.json({ success: true, message: 'Demonstration environment successfully reset to baseline.' });
});

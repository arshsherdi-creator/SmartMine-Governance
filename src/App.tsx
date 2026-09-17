import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { JudgeGuideModal } from './components/JudgeGuideModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Module View Pages
import { DashboardView } from './pages/DashboardView';
import { ComplianceView } from './pages/ComplianceView';
import { InspectionsView } from './pages/InspectionsView';
import { CorrectiveActionsView } from './pages/CorrectiveActionsView';
import { AlertsView } from './pages/AlertsView';
import { AiRiskCenterView } from './pages/AiRiskCenterView';
import { AiAssistantView } from './pages/AiAssistantView';
import { GisMapView } from './pages/GisMapView';
import { SafetyView } from './pages/SafetyView';
import { EnvironmentalView } from './pages/EnvironmentalView';
import { ProductionView } from './pages/ProductionView';
import { ContractorsView } from './pages/ContractorsView';
import { FieldReportView } from './pages/FieldReportView';
import { AnomalyDetectionView } from './pages/AnomalyDetectionView';
import { DocumentsView } from './pages/DocumentsView';
import { ReportsView } from './pages/ReportsView';
import { GrievancesView } from './pages/GrievancesView';
import { AuditTrailView } from './pages/AuditTrailView';
import { UsersRolesView } from './pages/UsersRolesView';
import { SystemSettingsView } from './pages/SystemSettingsView';
import { LoginView } from './pages/LoginView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (showLogin) {
    return <LoginView onLoginSuccess={() => setShowLogin(false)} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'compliance':
        return <ComplianceView />;
      case 'inspections':
        return <InspectionsView />;
      case 'corrective-actions':
        return <CorrectiveActionsView />;
      case 'alerts':
        return <AlertsView />;
      case 'ai-risk':
      case 'ai-risk-center':
        return <AiRiskCenterView />;
      case 'ai-assistant':
        return <AiAssistantView />;
      case 'gis-map':
        return <GisMapView />;
      case 'safety':
        return <SafetyView />;
      case 'environmental':
        return <EnvironmentalView />;
      case 'production':
        return <ProductionView />;
      case 'contractors':
        return <ContractorsView />;
      case 'field-reports':
      case 'field-report':
        return <FieldReportView />;
      case 'anomalies':
      case 'anomaly-detection':
        return <AnomalyDetectionView />;
      case 'documents':
        return <DocumentsView />;
      case 'reports':
        return <ReportsView />;
      case 'grievances':
        return <GrievancesView />;
      case 'audit-trail':
        return <AuditTrailView />;
      case 'users-roles':
        return <UsersRolesView />;
      case 'system-settings':
      case 'settings':
        return <SystemSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen h-[100dvh] bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-hidden">
      <Header
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onOpenLogin={() => setShowLogin(true)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
          <div className="p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      <ToastContainer />
      <JudgeGuideModal />
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

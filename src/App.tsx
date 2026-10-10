import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { WorkspaceSubNav } from './components/layout/WorkspaceSubNav';
import { ToastContainer } from './components/layout/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadManagementView } from './components/leads/LeadManagementView';
import { AIAssistantView } from './components/assistant/AIAssistantView';
import { FollowUpManagerView } from './components/followups/FollowUpManagerView';
import { AppointmentSetterView } from './components/appointments/AppointmentSetterView';
import { GuidedDemoView } from './components/guided_demo/GuidedDemoView';
import { BusinessSettingsView } from './components/settings/BusinessSettingsView';
import { IntegrationsHubView } from './components/integrations/IntegrationsHubView';
import { SolutionsPage } from './components/pages/SolutionsPage';
import { CapabilitiesPage } from './components/pages/CapabilitiesPage';
import { RoiCalculatorPage } from './components/pages/RoiCalculatorPage';
import { FaqPage } from './components/pages/FaqPage';
import { CompliancePage } from './components/pages/CompliancePage';
import { AddLeadModal } from './components/leads/AddLeadModal';
import { BookAppointmentModal } from './components/appointments/BookAppointmentModal';
import { Lead } from './types';
import { ShieldCheck, Database, Sparkles, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentPage, setCurrentPage, activeTab, setActiveTab } = useApp();

  // Modals
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [targetLeadForAppt, setTargetLeadForAppt] = useState<Lead | null>(null);
  const [isBookApptModalOpen, setIsBookApptModalOpen] = useState(false);

  const handleOpenBookAppointment = (lead?: Lead) => {
    setTargetLeadForAppt(lead || null);
    setIsBookApptModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Workspace Page */}
        {currentPage === 'workspace' && (
          <div className="space-y-4">
            <WorkspaceSubNav />

            {activeTab === 'dashboard' && (
              <DashboardView onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)} />
            )}

            {activeTab === 'leads' && (
              <LeadManagementView onOpenBookAppointment={handleOpenBookAppointment} />
            )}

            {activeTab === 'assistant' && (
              <AIAssistantView onOpenBookAppointment={handleOpenBookAppointment} />
            )}

            {activeTab === 'followups' && <FollowUpManagerView />}

            {activeTab === 'appointments' && (
              <AppointmentSetterView onOpenBookAppointment={handleOpenBookAppointment} />
            )}

            {activeTab === 'settings' && <BusinessSettingsView />}

            {activeTab === 'integrations' && <IntegrationsHubView />}
          </div>
        )}

        {/* Dedicated Full Pages */}
        {currentPage === 'solutions' && <SolutionsPage />}

        {currentPage === 'capabilities' && <CapabilitiesPage />}

        {currentPage === 'roi_calculator' && <RoiCalculatorPage />}

        {currentPage === 'guided_demo' && <GuidedDemoView />}

        {currentPage === 'faq' && <FaqPage />}

        {currentPage === 'compliance' && <CompliancePage />}

        {/* Global Footer */}
        <footer className="mt-16 border-t border-slate-200/80 pt-8 pb-6 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
            <button
              onClick={() => setCurrentPage('workspace')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Workspace
            </button>
            <button
              onClick={() => setCurrentPage('solutions')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Industry Solutions
            </button>
            <button
              onClick={() => setCurrentPage('capabilities')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Capabilities
            </button>
            <button
              onClick={() => setCurrentPage('roi_calculator')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ROI Calculator
            </button>
            <button
              onClick={() => setCurrentPage('guided_demo')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Guided Demo
            </button>
            <button
              onClick={() => setCurrentPage('faq')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              FAQ &amp; Docs
            </button>
            <button
              onClick={() => setCurrentPage('compliance')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Privacy &amp; Compliance
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              LeadPilot AI v1.0 · ₹0 Zero-Cost Architecture
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="h-3.5 w-3.5 text-indigo-500" />
              Local Persistent Storage
            </span>
            <span>·</span>
            <span>Anti-Spam &amp; Opt-Out Guard Active</span>
          </div>
        </footer>
      </main>

      {/* Global Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
      />

      {/* Global Book Appointment Modal */}
      <BookAppointmentModal
        lead={targetLeadForAppt}
        isOpen={isBookApptModalOpen}
        onClose={() => {
          setIsBookApptModalOpen(false);
          setTargetLeadForAppt(null);
        }}
      />

      {/* Global Toast Stack */}
      <ToastContainer />
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

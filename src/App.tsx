import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadManagementView } from './components/leads/LeadManagementView';
import { AIAssistantView } from './components/assistant/AIAssistantView';
import { FollowUpManagerView } from './components/followups/FollowUpManagerView';
import { AppointmentSetterView } from './components/appointments/AppointmentSetterView';
import { GuidedDemoView } from './components/guided_demo/GuidedDemoView';
import { BusinessSettingsView } from './components/settings/BusinessSettingsView';
import { IntegrationsHubView } from './components/integrations/IntegrationsHubView';
import { AddLeadModal } from './components/leads/AddLeadModal';
import { BookAppointmentModal } from './components/appointments/BookAppointmentModal';
import { Lead } from './types';
import { ShieldCheck, Database } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
      <Navbar
        onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
      />

      {/* Main Body with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
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

          {activeTab === 'guided_demo' && <GuidedDemoView />}

          {activeTab === 'settings' && <BusinessSettingsView />}

          {activeTab === 'integrations' && <IntegrationsHubView />}

          {/* Footer Notice */}
          <footer className="mt-12 border-t border-slate-200 pt-6 pb-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                LeadPilot AI v1.0 • ₹0 Zero-Cost Architecture
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Database className="h-3.5 w-3.5 text-indigo-500" />
                Persistent in Browser LocalStorage
              </span>
              <span>•</span>
              <span>Rule-Based AI Simulation Engine</span>
            </div>
          </footer>
        </main>
      </div>

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

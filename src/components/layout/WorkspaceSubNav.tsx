import React from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceTab } from '../../types';
import {
  LayoutDashboard,
  Users,
  Bot,
  Clock,
  CalendarCheck,
  Settings,
  Layers,
  Sparkles,
} from 'lucide-react';

export const WorkspaceSubNav: React.FC = () => {
  const { activeTab, setActiveTab, leads, appointments, businessSettings } = useApp();

  const awaitingCount = leads.filter((l) => l.status === 'Awaiting Reply' || l.status === 'New').length;
  const followUpsDueCount = leads.filter(
    (l) => l.nextFollowUpDate && l.status !== 'Appointment Booked' && l.status !== 'Not Interested'
  ).length;
  const activeApptsCount = appointments.filter((a) => a.status === 'confirmed').length;

  const tabs: {
    id: WorkspaceTab;
    label: string;
    icon: any;
    count?: number | string;
    highlight?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'leads',
      label: 'Leads Queue',
      icon: Users,
      count: leads.length,
    },
    {
      id: 'assistant',
      label: 'AI Lead Assistant',
      icon: Bot,
      count: awaitingCount > 0 ? `${awaitingCount} due` : undefined,
      highlight: awaitingCount > 0,
    },
    {
      id: 'followups',
      label: 'Follow-Up Cadence',
      icon: Clock,
      count: followUpsDueCount > 0 ? followUpsDueCount : undefined,
    },
    {
      id: 'appointments',
      label: 'Appointment Setter',
      icon: CalendarCheck,
      count: activeApptsCount > 0 ? activeApptsCount : undefined,
    },
    {
      id: 'settings',
      label: 'Business Settings',
      icon: Settings,
    },
    {
      id: 'integrations',
      label: 'Integrations Hub',
      icon: Layers,
    },
  ];

  return (
    <div className="border-b border-slate-200/90 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/40 backdrop-blur-xs -mt-2 mb-6 rounded-2xl px-2 py-1.5 shadow-xs">
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.highlight
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quiet Profile Tag */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-semibold text-slate-400 shrink-0 pr-2">
          <span>{businessSettings.businessName}</span>
          <span>·</span>
          <span className="capitalize">{businessSettings.aiTone} tone</span>
        </div>
      </div>
    </div>
  );
};

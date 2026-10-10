import React from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceTab } from '../../types';
import {
  LayoutDashboard,
  Users,
  Bot,
  CalendarCheck,
  Clock,
  PlayCircle,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, setCurrentPage, leads, appointments, isDemoActive, demoCurrentStep } = useApp();

  const awaitingCount = leads.filter((l) => l.status === 'Awaiting Reply' || l.status === 'New').length;
  const dueFollowUpsCount = leads.filter(
    (l) => l.nextFollowUpDate && l.status !== 'Appointment Booked' && l.status !== 'Not Interested'
  ).length;
  const activeApptsCount = appointments.filter((a) => a.status === 'confirmed').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'leads',
      label: 'Lead Management',
      icon: Users,
      badge: leads.length,
    },
    {
      id: 'assistant',
      label: 'AI Lead Assistant',
      icon: Bot,
      highlight: awaitingCount > 0,
      badge: awaitingCount > 0 ? `${awaitingCount} due` : undefined,
    },
    {
      id: 'followups',
      label: 'Follow-Up Manager',
      icon: Clock,
      badge: dueFollowUpsCount > 0 ? dueFollowUpsCount : undefined,
    },
    {
      id: 'appointments',
      label: 'Appointment Setter',
      icon: CalendarCheck,
      badge: activeApptsCount > 0 ? activeApptsCount : undefined,
    },
    {
      id: 'guided_demo',
      label: 'Interactive Demo',
      icon: PlayCircle,
      special: true,
      badge: isDemoActive ? `Step ${demoCurrentStep}/9` : '9 Steps',
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

  const handleNavClick = (tabId: string) => {
    if (tabId === 'guided_demo') {
      setCurrentPage('guided_demo');
    } else {
      setActiveTab(tabId as WorkspaceTab);
    }
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto p-3">
      {/* Top list */}
      <div className="space-y-1">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {!isCollapsed && 'Navigation'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              } ${item.special && !isActive ? 'border border-indigo-100 bg-indigo-50/50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300' : ''}`}
              title={item.label}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform ${
                  isActive ? 'scale-110 text-white' : item.special ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              />
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate text-left">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.special
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {!isCollapsed && (
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-sky-50/50 p-3 dark:border-indigo-950 dark:from-indigo-950/30 dark:to-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                100% Local Prototype
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero API cost (₹0). Stored locally in browser. No paid keys required.
            </p>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden w-full items-center justify-center rounded-lg border border-slate-200 py-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:flex"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-1.5 font-medium">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:block ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        >
          <div
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

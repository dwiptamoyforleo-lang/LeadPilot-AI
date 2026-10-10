import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Inbox,
  Clock,
  Award,
  CalendarCheck,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  PlayCircle,
  Building2,
  Wrench,
  Car,
  Scissors,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { INDUSTRY_PRESETS } from '../../data/initialData';

interface DashboardViewProps {
  onOpenAddLeadModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddLeadModal }) => {
  const {
    leads,
    appointments,
    activityHistory,
    businessSettings,
    switchIndustryPreset,
    setSelectedLeadId,
    setActiveTab,
    startGuidedDemo,
  } = useApp();

  // Metrics calculations
  const totalLeads = leads.length;
  const newEnquiries = leads.filter((l) => l.status === 'New').length;
  const awaitingResponse = leads.filter(
    (l) => l.status === 'Awaiting Reply' || l.status === 'New'
  ).length;
  const qualifiedLeads = leads.filter(
    (l) => l.status === 'Qualified' || l.status === 'Appointment Booked'
  ).length;
  const bookedAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'rescheduled'
  ).length;
  const followUpsDue = leads.filter(
    (l) =>
      Boolean(l.nextFollowUpDate) &&
      l.status !== 'Appointment Booked' &&
      l.status !== 'Not Interested' &&
      l.status !== 'Closed'
  ).length;

  const upcomingAppointments = appointments
    .filter((a) => a.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
      trend: '+12% this week',
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400',
      actionTab: 'leads',
    },
    {
      title: 'New Enquiries',
      value: newEnquiries,
      icon: Inbox,
      trend: 'Fresh inbound',
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-400',
      actionTab: 'leads',
    },
    {
      title: 'Awaiting Response',
      value: awaitingResponse,
      icon: Clock,
      trend: 'Needs AI Draft',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400',
      actionTab: 'assistant',
    },
    {
      title: 'Qualified Leads',
      value: qualifiedLeads,
      icon: Award,
      trend: `${Math.round((qualifiedLeads / (totalLeads || 1)) * 100)}% conversion`,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400',
      actionTab: 'leads',
    },
    {
      title: 'Appointments Booked',
      value: bookedAppointments,
      icon: CalendarCheck,
      trend: 'No double-bookings',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400',
      actionTab: 'appointments',
    },
    {
      title: 'Follow-Ups Due',
      value: followUpsDue,
      icon: AlertTriangle,
      trend: 'Scheduled cadences',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400',
      actionTab: 'followups',
    },
  ];

  const industryPresets = [
    { key: 'real_estate', label: 'Real Estate', icon: Building2 },
    { key: 'home_services', label: 'Home Services (HVAC/Plumbing)', icon: Wrench },
    { key: 'car_dealership', label: 'Car Dealership', icon: Car },
    { key: 'salon_wellness', label: 'Salon & Wellness', icon: Scissors },
  ];

  const handleOpenLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Industry & Guided Walkthrough Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 backdrop-blur border border-indigo-400/30">
                Active Business Profile
              </span>
              <span className="text-xs text-slate-300">
                Industry: <strong className="text-white capitalize">{businessSettings.industry.replace('_', ' ')}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {businessSettings.businessName}
            </h1>
            <p className="max-w-2xl text-xs text-slate-300 sm:text-sm">
              {businessSettings.tagline} • AI Lead qualification engine responding via WhatsApp, SMS & Email drafts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={startGuidedDemo}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-950 shadow-md hover:bg-slate-100 active:scale-95 transition-all"
            >
              <PlayCircle className="h-4 w-4 text-indigo-600" />
              <span>Launch Guided Demo</span>
            </button>
            <button
              onClick={onOpenAddLeadModal}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all"
            >
              <span>+ Add Inbound Lead</span>
            </button>
          </div>
        </div>

        {/* Quick Industry Switcher row */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Switch Industry Preview:</span>
            {industryPresets.map((preset) => {
              const Icon = preset.icon;
              const isCurrent = businessSettings.industry === preset.key;
              return (
                <button
                  key={preset.key}
                  onClick={() => switchIndustryPreset(preset.key)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-indigo-500/40 text-white ring-1 ring-indigo-400'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={() => setActiveTab(stat.actionTab)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {stat.title}
                </span>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {stat.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Activity Feed & Upcoming Appointments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Lead & AI Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time updates as qualifications, drafts, and appointments occur
              </p>
            </div>
            <button
              onClick={() => setActiveTab('leads')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>View All Leads</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {activityHistory.slice(0, 6).map((activity) => (
              <div
                key={activity.id}
                onClick={() => activity.leadId && handleOpenLead(activity.leadId)}
                className={`flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                  activity.leadId
                    ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    : ''
                }`}
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  {activity.type === 'lead_created' && <Users className="h-3.5 w-3.5" />}
                  {activity.type === 'message_sent' && <MessageSquare className="h-3.5 w-3.5" />}
                  {activity.type === 'appointment_booked' && <CalendarCheck className="h-3.5 w-3.5" />}
                  {activity.type === 'qualified' && <Award className="h-3.5 w-3.5" />}
                  {activity.type === 'status_changed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {activity.type === 'followup_done' && <Clock className="h-3.5 w-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {activity.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {new Date(activity.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Appointments */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Appointments
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Booked directly through LeadPilot AI
              </p>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Schedule View</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  No upcoming appointments scheduled yet.
                </p>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="mt-3 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400"
                >
                  Book First Slot
                </button>
              </div>
            ) : (
              upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300">
                        {appt.type}
                      </span>
                      <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {appt.title}
                      </h4>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {appt.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      {appt.date} • {appt.timeSlot}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {appt.leadName}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

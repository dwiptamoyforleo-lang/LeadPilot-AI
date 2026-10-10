import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead } from '../../types';
import { generateFollowUpDraft } from '../../services/aiEngine';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const FollowUpManagerView: React.FC = () => {
  const {
    leads,
    businessSettings,
    completeFollowUp,
    scheduleNextFollowUp,
    setSelectedLeadId,
    setActiveTab,
    approveAndSendDraft,
    addMessageToLead,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'due_today' | 'overdue' | 'all_active'>('due_today');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Candidates for follow up
  const eligibleLeads = leads.filter(
    (l) =>
      !l.optedOut &&
      l.status !== 'Appointment Booked' &&
      l.status !== 'Not Interested' &&
      l.status !== 'Closed' &&
      Boolean(l.nextFollowUpDate)
  );

  const dueTodayLeads = eligibleLeads.filter((l) => l.nextFollowUpDate === todayStr);
  const overdueLeads = eligibleLeads.filter(
    (l) => l.nextFollowUpDate && l.nextFollowUpDate < todayStr
  );
  const allActiveLeads = eligibleLeads;

  const currentDisplayLeads =
    activeTabFilter === 'due_today'
      ? dueTodayLeads
      : activeTabFilter === 'overdue'
      ? overdueLeads
      : allActiveLeads;

  const handleOpenAssistant = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('assistant');
  };

  const handleDispatchFollowUpDraft = (lead: Lead) => {
    const nextAttempt = lead.followUpCount + 1;
    const { draft, rationale } = generateFollowUpDraft(
      lead,
      businessSettings,
      nextAttempt
    );

    // Add draft message and approve it simulated
    addMessageToLead(lead.id, {
      sender: 'ai',
      content: draft,
      channel: lead.preferredContactMethod === 'phone' ? 'sms' : lead.preferredContactMethod,
      isDraft: false,
      draftStatus: 'sent_simulated',
      aiRationale: rationale,
    });

    // Schedule next follow-up automatically based on business interval cadence
    const intervalDays = businessSettings.followUpIntervalDays[nextAttempt] || 3;
    scheduleNextFollowUp(lead.id, intervalDays);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
            Follow-Up Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nurture leads with polite, cadence-governed drafts. Max {businessSettings.maxFollowUps} attempts.
          </p>
        </div>

        {/* Cadence Configuration pill */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Cadence Intervals: {businessSettings.followUpIntervalDays.join(', ')} days</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          onClick={() => setActiveTabFilter('due_today')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTabFilter === 'due_today'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Due Today</span>
          <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">
            {dueTodayLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabFilter('overdue')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTabFilter === 'overdue'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Overdue</span>
          <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">
            {overdueLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabFilter('all_active')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTabFilter === 'all_active'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>All Scheduled Cadences</span>
          <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">
            {allActiveLeads.length}
          </span>
        </button>
      </div>

      {/* Leads list */}
      {currentDisplayLeads.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            All clear! No follow-ups in this queue.
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Great job keeping up with prospective leads.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentDisplayLeads.map((lead) => {
            const nextAttempt = lead.followUpCount + 1;
            const { draft, rationale, isFinal } = generateFollowUpDraft(
              lead,
              businessSettings,
              nextAttempt
            );

            const isDueToday = lead.nextFollowUpDate === todayStr;
            const isOverdue = Boolean(lead.nextFollowUpDate && lead.nextFollowUpDate < todayStr);

            return (
              <div
                key={lead.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {lead.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : isDueToday
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          }`}
                        >
                          {isOverdue ? 'Overdue' : isDueToday ? 'Due Today' : `Due: ${lead.nextFollowUpDate}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Attempt #{nextAttempt} of {businessSettings.maxFollowUps} • Channel: {lead.preferredContactMethod.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAssistant(lead.id)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Bot className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Open Thread</span>
                    </button>
                    <button
                      onClick={() => completeFollowUp(lead.id)}
                      className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark Done</span>
                    </button>
                  </div>
                </div>

                {/* AI Draft Box */}
                <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/20">
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                      <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>AI Follow-Up Draft ({rationale})</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(draft, lead.id)}
                      className="flex items-center gap-1 rounded-md bg-white px-2 py-0.8 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-xs dark:bg-slate-800 dark:text-slate-200"
                    >
                      {copiedDraftId === lead.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedDraftId === lead.id ? 'Copied' : 'Copy Draft'}</span>
                    </button>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    "{draft}"
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-indigo-200/50 pt-3 dark:border-indigo-900/40">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <span>Reschedule next attempt:</span>
                      <button
                        onClick={() => scheduleNextFollowUp(lead.id, 2)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        +2 Days
                      </button>
                      <button
                        onClick={() => scheduleNextFollowUp(lead.id, 5)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        +5 Days
                      </button>
                    </div>

                    <button
                      onClick={() => handleDispatchFollowUpDraft(lead)}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Approve & Dispatch Follow-Up (Simulate)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

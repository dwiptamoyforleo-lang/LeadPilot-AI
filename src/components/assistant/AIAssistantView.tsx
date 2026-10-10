import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lead,
  ConversationMessage,
  MessageChannel,
  CustomerScenario,
} from '../../types';
import {
  generateFirstResponseDraft,
  generateFollowUpDraft,
  extractLeadIntelligence,
  simulateCustomerResponse,
} from '../../services/aiEngine';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Award,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  XCircle,
  ChevronDown,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { DeepThinkingModal } from './DeepThinkingModal';

interface AIAssistantViewProps {
  onOpenBookAppointment: (lead: Lead) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onOpenBookAppointment,
}) => {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    businessSettings,
    addMessageToLead,
    approveAndSendDraft,
    discardDraft,
    simulateCustomerReplyForLead,
    qualifyLeadDirectly,
    changeLeadStatus,
  } = useApp();

  // Active lead selection
  const currentLead =
    leads.find((l) => l.id === selectedLeadId) || leads[0] || null;

  const [activeChannel, setActiveChannel] = useState<MessageChannel>('whatsapp');
  const [customReplyText, setCustomReplyText] = useState('');
  const [manualDraftText, setManualDraftText] = useState('');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeepThinkingOpen, setIsDeepThinkingOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleApplyThinkingDraft = (draftText: string, rationale: string) => {
    addMessageToLead(currentLead.id, {
      sender: 'ai',
      content: draftText,
      channel: activeChannel,
      isDraft: true,
      draftStatus: 'pending_review',
      aiRationale: rationale,
    });
  };

  // Sync preferred contact channel when lead changes
  useEffect(() => {
    if (currentLead) {
      const ch =
        currentLead.preferredContactMethod === 'phone'
          ? 'sms'
          : currentLead.preferredContactMethod;
      setActiveChannel(ch);
    }
  }, [currentLead?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentLead?.messages]);

  if (!currentLead) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <Bot className="mx-auto h-10 w-10 text-slate-400" />
        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
          No leads available
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Add an inbound lead first to use the AI Assistant.
        </p>
      </div>
    );
  }

  const intel = extractLeadIntelligence(currentLead, businessSettings);

  // Handle generating initial response draft
  const handleGenerateFirstResponse = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const { draft, rationale } = generateFirstResponseDraft(
        currentLead,
        businessSettings
      );
      addMessageToLead(currentLead.id, {
        sender: 'ai',
        content: draft,
        channel: activeChannel,
        isDraft: true,
        draftStatus: 'pending_review',
        aiRationale: rationale,
      });
      setIsGenerating(false);
    }, 300);
  };

  // Handle generating polite follow-up draft
  const handleGenerateFollowUp = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const nextAttempt = currentLead.followUpCount + 1;
      const { draft, rationale, isFinal } = generateFollowUpDraft(
        currentLead,
        businessSettings,
        nextAttempt
      );
      addMessageToLead(currentLead.id, {
        sender: 'ai',
        content: draft,
        channel: activeChannel,
        isDraft: true,
        draftStatus: 'pending_review',
        aiRationale: rationale,
      });
      setIsGenerating(false);
    }, 300);
  };

  // Simulate customer scenarios
  const handleSimulateScenario = (scenario: CustomerScenario) => {
    simulateCustomerReplyForLead(currentLead.id, scenario);
  };

  const handleSendCustomCustomerReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReplyText.trim()) return;
    simulateCustomerReplyForLead(currentLead.id, customReplyText.trim());
    setCustomReplyText('');
  };

  const handleSendManualDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDraftText.trim()) return;
    addMessageToLead(currentLead.id, {
      sender: 'agent',
      content: manualDraftText.trim(),
      channel: activeChannel,
      isDraft: false,
      draftStatus: 'sent_simulated',
    });
    setManualDraftText('');
  };

  const handleCopyDraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  const handleMarkQualified = () => {
    qualifyLeadDirectly(currentLead.id, {
      score: Math.max(currentLead.qualification.score, 85),
      isQualified: true,
      recommendedNextAction: 'High qualification score. Offer available appointment slots.',
    });
  };

  return (
    <div className="space-y-4">
      {/* Simulation Disclaimer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/80 p-3 text-xs dark:border-indigo-950/60 dark:from-indigo-950/30 dark:via-slate-900 dark:to-sky-950/30">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              AI Simulation Sandbox (₹0 Cost Engine)
            </span>
            <span className="hidden text-slate-500 dark:text-slate-400 sm:inline">
              {' '}
              — Draft messages are reviewed and simulated locally before external dispatch.
            </span>
          </div>
        </div>

        {/* Lead selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
            Target Lead:
          </span>
          <select
            value={currentLead.id}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Interface: Chat simulator on left, AI Intelligence on right */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: Interactive Chat & Simulation Console */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 h-[720px] overflow-hidden">
          {/* Chat Header: Channel selection & Lead Info */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-extrabold text-sm">
                {currentLead.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {currentLead.name}
                  </h3>
                  <span className="rounded-full bg-slate-200 px-2 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {currentLead.status}
                  </span>
                  {currentLead.optedOut && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.2 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      Opted Out
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentLead.phone || currentLead.email} • Follow-ups: {currentLead.followUpCount}
                </p>
              </div>
            </div>

            {/* Channel Tabs */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={() => setActiveChannel('whatsapp')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeChannel === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setActiveChannel('sms')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeChannel === 'sms'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <Phone className="h-3 w-3" />
                <span>SMS</span>
              </button>
              <button
                onClick={() => setActiveChannel('email')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeChannel === 'email'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <Mail className="h-3 w-3" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Quick AI Action Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-indigo-50/30 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              AI Actions:
            </span>

            <button
              onClick={handleGenerateFirstResponse}
              disabled={isGenerating || currentLead.optedOut}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Draft Initial Response</span>
            </button>

            <button
              onClick={handleGenerateFollowUp}
              disabled={isGenerating || currentLead.optedOut}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Draft Follow-Up #{currentLead.followUpCount + 1}</span>
            </button>

            {currentLead.status !== 'Appointment Booked' && (
              <button
                onClick={() => onOpenBookAppointment(currentLead)}
                className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-300"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>Book Slot</span>
              </button>
            )}

            <button
              onClick={() => setIsDeepThinkingOpen(true)}
              disabled={currentLead.optedOut}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 transition-all ml-auto"
              title="Activate Deep Thinking Mode (gemini-3.1-pro-preview with ThinkingLevel.HIGH)"
            >
              <Brain className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Thinking Mode</span>
            </button>
          </div>

          {/* Message Thread Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-slate-950/30">
            {currentLead.messages.map((message) => {
              const isCustomer = message.sender === 'customer';
              const isAi = message.sender === 'ai';
              const isAgent = message.sender === 'agent';
              const isDraft = message.isDraft;

              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    isCustomer ? 'items-start' : 'items-end'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-slate-400">
                    {isCustomer && (
                      <>
                        <User className="h-3 w-3" />
                        <span>{currentLead.name} (Customer)</span>
                      </>
                    )}
                    {isAi && (
                      <>
                        <Bot className="h-3 w-3 text-indigo-500" />
                        <span>LeadPilot AI</span>
                        {isDraft && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Draft (Pending Review)
                          </span>
                        )}
                        {!isDraft && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Sent (Simulated)
                          </span>
                        )}
                      </>
                    )}
                    {isAgent && (
                      <>
                        <User className="h-3 w-3 text-slate-600" />
                        <span>Manual Agent Message</span>
                      </>
                    )}
                    <span>• {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed whitespace-pre-wrap ${
                      isCustomer
                        ? 'rounded-tl-xs bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
                        : isDraft
                        ? 'rounded-tr-xs bg-indigo-50/90 text-indigo-950 border-2 border-dashed border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-700'
                        : 'rounded-tr-xs bg-indigo-600 text-white shadow-indigo-600/20'
                    }`}
                  >
                    {message.content}

                    {/* AI Rationale / Explanation Box */}
                    {message.aiRationale && (
                      <div className="mt-2.5 rounded-lg bg-indigo-100/70 p-2 text-[11px] font-medium text-indigo-900 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800">
                        <span className="font-bold">AI Rationale: </span>
                        {message.aiRationale}
                      </div>
                    )}

                    {/* Draft Action Controls */}
                    {isDraft && (
                      <div className="mt-3 flex items-center justify-between border-t border-indigo-200/60 pt-2.5 dark:border-indigo-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                          Review Draft Before Sending
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyDraft(message.content, message.id)}
                            className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 shadow-xs dark:bg-slate-800 dark:text-slate-200"
                            title="Copy text"
                          >
                            {copiedDraftId === message.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>{copiedDraftId === message.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => discardDraft(currentLead.id, message.id)}
                            className="rounded-md px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          >
                            Discard
                          </button>

                          <button
                            onClick={() => approveAndSendDraft(currentLead.id, message.id)}
                            className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 shadow-xs"
                          >
                            <Send className="h-3 w-3" />
                            <span>Approve & Send (Simulate)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Simulation Playground & Customer Reply Simulator */}
          <div className="border-t border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-2.5">
            {/* Quick Customer Reply Simulation Chips */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Simulate Customer Reply:
              </span>
              <span className="text-[10px] text-slate-400">
                Click any scenario chip to test AI reaction
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSimulateScenario('enthusiastic_booking')}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                👍 "Let's book appointment"
              </button>

              <button
                onClick={() => handleSimulateScenario('budget_pricing')}
                className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300"
              >
                💰 "Budget & Pricing details"
              </button>

              <button
                onClick={() => handleSimulateScenario('tentative_schedule')}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-800 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                📅 "Provide availability"
              </button>

              <button
                onClick={() => handleSimulateScenario('opt_out')}
                className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-800 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
              >
                🛑 "Not interested / Opt out"
              </button>
            </div>

            {/* Custom Input: Type either agent message or customer reply */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customReplyText}
                onChange={(e) => setCustomReplyText(e.target.value)}
                placeholder="Or type a custom customer reply to test..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                onClick={handleSendCustomCustomerReply}
                disabled={!customReplyText.trim()}
                className="rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-900 disabled:opacity-40 transition-all dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Simulate Reply
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Lead Intelligence & Qualifications Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Qualification Gauge Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Lead Intelligence
                </h4>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  intel.score >= 70
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : intel.score >= 40
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {intel.score}% Intent
              </span>
            </div>

            {/* Score progress bar */}
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    intel.score >= 70
                      ? 'bg-emerald-500'
                      : intel.score >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${intel.score}%` }}
                />
              </div>
            </div>

            {/* Extracted Criteria */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold uppercase text-slate-400">Identified Need</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-100">
                  {intel.need}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Budget</span>
                  <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-100 truncate">
                    {intel.budget || 'Pending'}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Location</span>
                  <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-100 truncate">
                    {intel.location || 'Local area'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold uppercase text-slate-400">Timeframe</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-100">
                  {intel.timeframe || 'Exploring'}
                </p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs leading-relaxed dark:border-indigo-950 dark:bg-indigo-950/30">
              <span className="font-bold text-indigo-950 dark:text-indigo-200">
                AI Summary:
              </span>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                {intel.summary}
              </p>
            </div>

            {/* Recommended Next Action */}
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs leading-relaxed dark:border-emerald-950 dark:bg-emerald-950/30">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                Recommended Action:
              </span>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                {intel.recommendedNextAction}
              </p>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              {currentLead.status !== 'Qualified' && currentLead.status !== 'Appointment Booked' && (
                <button
                  onClick={handleMarkQualified}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark as Qualified (Advance Lead)</span>
                </button>
              )}

              {currentLead.status !== 'Appointment Booked' && (
                <button
                  onClick={() => onOpenBookAppointment(currentLead)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span>Suggest Slots & Book Appointment</span>
                </button>
              )}

              {currentLead.optedOut && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Cadence stopped. Lead requested no further contact.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deep Thinking Mode Modal (gemini-3.1-pro-preview with ThinkingLevel.HIGH) */}
      <DeepThinkingModal
        isOpen={isDeepThinkingOpen}
        onClose={() => setIsDeepThinkingOpen(false)}
        lead={currentLead}
        businessSettings={businessSettings}
        onApplyDraft={handleApplyThinkingDraft}
      />
    </div>
  );
};

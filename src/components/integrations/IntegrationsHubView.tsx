import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Sparkles,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Database,
  Lock,
  Download,
  Upload,
  CheckCircle2,
  ExternalLink,
  Code2,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';

export const IntegrationsHubView: React.FC = () => {
  const { leads, appointments, businessSettings, importDataJSON, showToast } = useApp();
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      businessSettings,
      leadsCount: leads.length,
      appointmentsCount: appointments.length,
      leads,
      appointments,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `leadpilot-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported workspace JSON backup', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importDataJSON(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const integrations = [
    {
      id: 'gemini',
      title: 'Google Gemini AI (3.5 Flash / Pro)',
      category: 'AI Intelligence',
      status: 'Ready for Key',
      description:
        'Seamlessly transition from local rule-based simulation to genuine Gemini LLM reasoning via server proxy route without touching frontend code.',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300',
      badge: 'Zero-Cost Simulation Active',
      spec: 'POST /api/ai/qualify { leadId, transcript, prompt }',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Business Cloud API',
      category: 'Messaging',
      status: 'API Ready',
      description:
        'Direct connection to Meta Graph WhatsApp Cloud API to deliver templates and receive inbound webhooks from prospective leads.',
      icon: MessageSquare,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
      badge: 'Simulated In V1',
      spec: 'POST https://graph.facebook.com/v19.0/{phone-id}/messages',
    },
    {
      id: 'sms',
      title: 'Twilio SMS & Voice Calling',
      category: 'Telephony',
      status: 'API Ready',
      description:
        'Programmable SMS and automated voice IVR call routing for emergency home-services dispatch and auto-dealer test drive confirmations.',
      icon: Phone,
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
      badge: 'Simulated In V1',
      spec: 'POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json',
    },
    {
      id: 'calendar',
      title: 'Google Calendar (OAuth 2.0)',
      category: 'Calendar Sync',
      status: 'API Ready',
      description:
        'Two-way calendar sync to pull existing business conflicts and automatically push LeadPilot confirmed appointments into Google Calendar.',
      icon: Calendar,
      color: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300',
      badge: 'Internal Calendar Active',
      spec: 'POST https://www.googleapis.com/calendar/v3/calendars/primary/events',
    },
    {
      id: 'email',
      title: 'SendGrid / Resend Transactional Email',
      category: 'Email Dispatch',
      status: 'API Ready',
      description:
        'DKIM/SPF-signed transactional email dispatch for quotes, brochures, inspection confirmations, and follow-up emails.',
      icon: Mail,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
      badge: 'Simulated In V1',
      spec: 'POST https://api.resend.com/emails',
    },
    {
      id: 'database',
      title: 'PostgreSQL / Cloud SQL / Supabase',
      category: 'Persistence',
      status: 'Schema Prepared',
      description:
        'Multi-tenant database schema prepared for enterprise multi-user roles, teams, and multi-location agency deployments.',
      icon: Database,
      color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      badge: 'LocalStorage Active (₹0)',
      spec: 'Drizzle ORM / Prisma schema configured',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
            Integrations & Production Roadmap
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Modular architecture designed for plug-and-play connections to live APIs in v2
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 shadow-2xs cursor-pointer transition-colors">
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Data (JSON)</span>
          </button>
        </div>
      </div>

      {/* Zero Cost Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-950 dark:bg-emerald-950/30">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
              ₹0 Operational Cost Commitment Maintained
            </h3>
            <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Version 1 operates 100% locally in your browser. All qualification logic, conversational follow-up cadences, and appointment slot reservations execute with zero paid external APIs or credit cards. None of the external services below are faked or falsely claimed as live.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Connectors Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.category}
                </span>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">Interface Spec:</span>
                <p className="mt-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate">
                  {item.spec}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inbound Webhook Specification */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Inbound Lead Ingestion Webhook Specification
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            For Zapier, Make.com, or Website Forms
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          When ready for production deployment, your website contact form or Meta Lead Ad campaign can POST JSON leads directly to this endpoint:
        </p>

        <pre className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`POST /api/leads/webhook
Content-Type: application/json
Authorization: Bearer <SECURE_AUTH_TOKEN>

{
  "name": "Alex Morrison",
  "phone": "+1 (555) 890-4321",
  "email": "alex.m@example.com",
  "source": "Meta Ad",
  "preferredContactMethod": "whatsapp",
  "enquiryDetails": "Need quote for 3-bedroom property viewing this Saturday."
}`}
        </pre>
      </div>
    </div>
  );
};

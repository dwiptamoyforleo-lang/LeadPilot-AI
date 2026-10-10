import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Database,
  ArrowRight,
  FileText,
} from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const { setCurrentPage, setActiveTab } = useApp();

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Trust, Safety &amp; Ethics
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Anti-Spam &amp; Privacy Compliance Charter
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          LeadPilot AI is engineered to uphold strict communication ethics, respectful scheduling cadence limits, client-side data confidentiality, and instant opt-out compliance.
        </p>
      </div>

      {/* Main Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-xs">
        {/* Principle 1: Automated Opt-Out */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Instant TCPA Opt-Out Enforcement
              </h3>
              <span className="text-[10px] text-slate-400">Zero-Tolerance Spam Policy</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Our local engine continuously scans customer messages for opt-out keywords including <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">STOP</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">UNSUBSCRIBE</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">NOT INTERESTED</code>, and <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">WRONG NUMBER</code>. When triggered, the lead is immediately marked <em>Not Interested</em>, their qualification score drops to 0%, and future follow-up cadences are permanently halted.
          </p>
        </div>

        {/* Principle 2: Local-First Confidentiality */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                100% Client-Side Data Isolation
              </h3>
              <span className="text-[10px] text-slate-400">LocalStorage In Browser</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            In Version 1, your prospect records, phone numbers, notes, and appointment schedules never leave your browser sandbox. We do not transmit customer data to unvetted external servers, ad networks, or data brokers. You retain absolute ownership of all stored leads with one-click full JSON export.
          </p>
        </div>

        {/* Principle 3: Ethical AI Identity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Transparent Human-In-The-Loop Drafts
              </h3>
              <span className="text-[10px] text-slate-400">Review Before Dispatch</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Generated messages are clearly labeled as <span className="font-semibold text-indigo-600">Draft (Pending Review)</span>. Business owners and sales agents retain full editorial control to review, modify, or discard drafts before simulated dispatch, ensuring zero hallucinations reach customers.
          </p>
        </div>

        {/* Principle 4: Fair & Transparent Scheduling */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Conflict-Free Booking Integrity
              </h3>
              <span className="text-[10px] text-slate-400">Anti-Double Booking Guard</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            LeadPilot AI strictly honors your defined business hours, working days, and travel buffers. The system algorithmically prevents slot conflicts to safeguard your customer experience against embarrassing double-bookings.
          </p>
        </div>
      </div>

      {/* Charter Commitment Box */}
      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 text-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-600" />
          <span>Our Commitment for Version 2 Carrier Upgrades</span>
        </h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          When upgrading to live carrier integrations (Twilio 10DLC A2P campaign registration, Meta WhatsApp Cloud Business verification, SendGrid SPF/DKIM authentication), LeadPilot AI will continue to enforce explicit opt-in verification, opt-out compliance, and strict rate limits to maintain 100% carrier delivery reputation.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              setCurrentPage('workspace');
              setActiveTab('dashboard');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>Return to Live Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

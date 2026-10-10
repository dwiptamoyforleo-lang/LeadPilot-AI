import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Award,
  Clock,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bot,
  MessageSquare,
  Sliders,
  Check,
} from 'lucide-react';
import { timeSlotsConflict } from '../../services/aiEngine';

export const CapabilitiesPage: React.FC = () => {
  const { setCurrentPage, setActiveTab } = useApp();

  // Interactive Capability 1: Intent extractor test
  const [testInquiry, setTestInquiry] = useState(
    'Need urgent AC diagnostics. Blowing hot air in the living room. Budget around $500, home address in West End.'
  );
  const [extractedResult, setExtractedResult] = useState<{
    need: string;
    budget: string;
    urgency: string;
    location: string;
    score: number;
  }>({
    need: 'HVAC / AC Repair',
    budget: '$500',
    urgency: 'Immediate (High Priority)',
    location: 'West End',
    score: 85,
  });

  const handleRunExtraction = (text: string) => {
    setTestInquiry(text);
    const lower = text.toLowerCase();
    let need = 'General Inquiry';
    if (lower.includes('ac') || lower.includes('hvac')) need = 'HVAC Diagnostic Repair';
    else if (lower.includes('3-bed') || lower.includes('house') || lower.includes('property')) need = '3-Bedroom Property Showing';
    else if (lower.includes('test drive') || lower.includes('cr-v')) need = 'Vehicle Test Drive Reservation';
    else if (lower.includes('hair') || lower.includes('spa')) need = 'Hair Styling & Spa Treatment';

    let budget = 'Unspecified';
    const match = text.match(/\$\d+[\d,]*\s?[kK]?/);
    if (match) budget = match[0];

    let urgency = 'Standard (Within this week)';
    if (lower.includes('urgent') || lower.includes('today') || lower.includes('asap')) {
      urgency = 'Immediate (High Priority)';
    }

    let location = 'Local area';
    if (lower.includes('west end')) location = 'West End';
    if (lower.includes('maple street')) location = 'Maple Street';

    setExtractedResult({
      need,
      budget,
      urgency,
      location,
      score: 80 + (match ? 10 : 0),
    });
  };

  // Interactive Capability 4: Slot Conflict Checker Sandbox
  const [slotA, setSlotA] = useState('10:00 AM - 10:45 AM');
  const [slotB, setSlotB] = useState('10:30 AM - 11:15 AM');
  const [bufferMin, setBufferMin] = useState(15);

  const hasConflict = timeSlotsConflict(slotA, slotB, bufferMin);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          System Architecture
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Engineered for Speed, Precision & Zero Waste
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          LeadPilot AI combines local natural language parsing, cadence-governed follow-up scheduling, and conflict-checked appointment setters. Explore the five core capabilities below.
        </p>
      </div>

      {/* 5 Core Capabilities Grid */}
      <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
        {/* Capability 1: Instant Intent Extraction */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Capability 01</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">&lt;50ms Parsing</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Instant Intent & Requirement Extraction
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Extracts customer needs, price brackets, preferred locations, and urgency directly from unformatted inquiry text without making external API calls.
              </p>
            </div>
          </div>

          {/* Interactive Tester */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                Interactive Text Analyzer:
              </span>
              <div className="flex gap-1.5 text-[10px]">
                <button
                  onClick={() => handleRunExtraction('Looking for 3-bed home near Maple Street, budget $540k, moving ASAP.')}
                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                >
                  Real Estate sample
                </button>
                <button
                  onClick={() => handleRunExtraction('Want to test drive CR-V Hybrid Friday afternoon, trading in 2019 Civic.')}
                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                >
                  Car Dealership sample
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={testInquiry}
              onChange={(e) => handleRunExtraction(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />

            {/* Live Extracted Values */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs pt-1">
              <div className="rounded-lg bg-white p-2 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-400">Identified Need</span>
                <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">{extractedResult.need}</p>
              </div>
              <div className="rounded-lg bg-white p-2 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-400">Target Budget</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">{extractedResult.budget}</p>
              </div>
              <div className="rounded-lg bg-white p-2 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-400">Location Target</span>
                <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">{extractedResult.location}</p>
              </div>
              <div className="rounded-lg bg-white p-2 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-400">Urgency Triage</span>
                <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">{extractedResult.urgency}</p>
              </div>
              <div className="rounded-lg bg-white p-2 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-400">Intent Score</span>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">{extractedResult.score}% Intent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Capability 2: Polite Anti-Spam Cadence */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Capability 02</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-semibold">Strict TCPA / Opt-Out Compliance</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Polite, Non-Aggressive Follow-Up Cadence
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Most sales tools spam leads with robotic generic nudges. LeadPilot AI enforces a maximum attempt count, adapts intervals (Day 1, Day 3, Day 5), and immediately halts all outreach when opt-out intent is detected.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs pt-1">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Attempt #1 (Day 1)</span>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1">Gentle Context Check</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Re-states customer inquiry softly without pushiness.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Attempt #2 (Day 3)</span>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1">Value-Add & Flexibility</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Proposes shorter 10-minute discovery call around their schedule.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Attempt #3 (Day 5)</span>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1">Timeline Clarity</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Provides easy off-ramp to check if priorities shifted.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Attempt #4 (Final)</span>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1">Courteous Close-Out</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Respectfully ends communication loop with goodwill.
              </p>
            </div>
          </div>
        </div>

        {/* Capability 3: Conflict-Free Slot Setter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Capability 03</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Strict Overlap Guard</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Anti-Double Booking Scheduler with Buffer Guard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Calculates available booking windows using your configured working hours, duration, and travel/preparation buffer minutes. Prevents overlapping reservations even across edge cases.
              </p>
            </div>
          </div>

          {/* Conflict Sandbox */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
              Live Conflict Engine Simulator:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Existing Reservation</label>
                <input
                  type="text"
                  value={slotA}
                  onChange={(e) => setSlotA(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">New Requested Slot</label>
                <input
                  type="text"
                  value={slotB}
                  onChange={(e) => setSlotB(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Buffer ({bufferMin}m)</label>
                <input
                  type="range"
                  min={0}
                  max={45}
                  step={15}
                  value={bufferMin}
                  onChange={(e) => setBufferMin(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Conflict Engine Determination:
              </span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  hasConflict ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {hasConflict ? (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Conflict Detected — Slot Blocked from Booking</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Slot Available — Safe to Confirm</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Capability 4: Zero-Cost Privacy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Capability 04</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">₹0 Cost &amp; 100% Client-Side Privacy</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Zero Cloud Bill &amp; Instant Data Ownership
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                All records, conversations, and appointments remain strictly inside your browser's persistent storage. You never receive surprise token bills, credit card prompts, or downtime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="text-center pt-4 pb-8">
        <button
          onClick={() => {
            setCurrentPage('workspace');
            setActiveTab('dashboard');
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <span>Open Live Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

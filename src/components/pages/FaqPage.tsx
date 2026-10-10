import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Bot,
  CalendarCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'architecture' | 'qualification' | 'followup' | 'appointments' | 'roadmap';
}

export const FaqPage: React.FC = () => {
  const { setCurrentPage, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'architecture',
      q: 'How does LeadPilot AI operate for ₹0 without requiring paid API keys or subscriptions?',
      a: 'Version 1 runs a comprehensive local rule-based simulation engine directly inside your browser. Intent extraction, qualification scoring, first-response drafting, and appointment availability calculations execute via client-side JavaScript without incurring external LLM API token costs, cloud hosting fees, or credit card requirements.',
    },
    {
      category: 'architecture',
      q: 'Does LeadPilot AI store my leads and appointments securely?',
      a: 'Yes. All leads, conversation threads, appointments, and business settings are stored locally in your browser using persistent LocalStorage. Your data never leaves your device in Version 1, providing complete client-side confidentiality. You can export all records to JSON anytime from the Integrations Hub.',
    },
    {
      category: 'qualification',
      q: 'How does the qualification scoring engine evaluate incoming leads?',
      a: 'The engine parses customer inquiries and replies for essential parameters: Need / Service Type, Target Budget, Location / Neighborhood, and Urgency / Timeframe. It assigns points (base score 20, contact completeness +25, extracted criteria +45). Leads crossing the 60% threshold are marked as Qualified, while leads signaling opt-out intent are immediately set to 0% and locked from further outreach.',
    },
    {
      category: 'qualification',
      q: 'Can I customize the qualification questions for my specific business?',
      a: 'Yes! Navigate to Business Settings > Industry Qualifying Questions. You can add, edit, or delete questions for your industry. When you switch industry presets (e.g. from Real Estate to HVAC), the system automatically loads domain-specific intake questions.',
    },
    {
      category: 'followup',
      q: 'How does the follow-up cadence prevent annoying or spamming leads?',
      a: 'LeadPilot AI strictly enforces a maximum attempt count (configurable 1–6, default 3–4) and polite cadence intervals (Day 1 gentle check, Day 3 value-add, Day 5 timeline clarification, followed by a courteous close-out). Furthermore, if a customer replies with "Stop", "Not interested", "Unsubscribe", or "Wrong number", the engine halts all follow-ups immediately and updates their status to Not Interested.',
    },
    {
      category: 'followup',
      q: 'Does Version 1 send real WhatsApp messages or SMS text messages?',
      a: 'No. Version 1 is a transparent prototype. Generated messages are clearly designated as "Draft (Pending Review)" and "Sent (Simulated)". We do not fake delivery or connect third-party carriers in this initial version. When approved, messages update the simulated thread and scheduled follow-up dates.',
    },
    {
      category: 'appointments',
      q: 'How does the appointment scheduler prevent double-booking?',
      a: 'The system uses an algorithmic overlap check (timeSlotsConflict) that parses start and end times for each reservation on the selected date. It also enforces your configured buffer time (e.g. 15 minutes between client showings or 30 minutes for technician travel). Any overlapping or adjacent buffered slot is marked "Booked" and disabled.',
    },
    {
      category: 'appointments',
      q: 'Can I reschedule or cancel existing appointments?',
      a: 'Yes. In the Appointment Setter tab, you can click "Reschedule" on any active appointment to view remaining conflict-free slots on any future date, or click "Cancel" with one click. The associated lead record automatically synchronizes its status.',
    },
    {
      category: 'roadmap',
      q: 'How can this system be connected to Google Gemini and real messaging APIs later?',
      a: 'The code is architected with clean modular service interfaces. The Integrations Hub outlines the exact specifications for POST /api/ai/qualify (Gemini 3.5 Flash / Pro adapter), Meta WhatsApp Cloud API webhooks, Twilio Programmable SMS, and Google Calendar OAuth 2.0 integration for Version 2.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Knowledgebase &amp; FAQs
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Everything you need to know about LeadPilot AI’s zero-cost simulation architecture, lead qualification criteria, cadence enforcement, and appointment conflict guards.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="absolute left-3.5 top-5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. zero-cost, opt-out, buffer)..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto text-xs">
        {[
          { id: 'all', label: 'All Questions' },
          { id: 'architecture', label: '₹0 Architecture' },
          { id: 'qualification', label: 'Lead Qualification' },
          { id: 'followup', label: 'Follow-Up & Cadence' },
          { id: 'appointments', label: 'Appointment Scheduling' },
          { id: 'roadmap', label: 'Production Roadmap' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No matching questions found for "{searchQuery}". Try another keyword.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between p-4.5 text-left transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-4.5 pt-3 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300 bg-slate-50/40 dark:bg-slate-950/20 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support Banner */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-sky-50/80 p-6 text-center dark:border-indigo-950 dark:from-indigo-950/30 dark:to-slate-900 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Ready to experience the workflow live?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Test the interactive 9-step guided walkthrough to observe lead ingestion, AI response drafting, customer replies, and appointment booking in action.
        </p>
        <button
          onClick={() => {
            setCurrentPage('guided_demo');
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
        >
          <span>Launch 9-Step Interactive Demo</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

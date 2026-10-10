import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  CalendarCheck,
  Award,
  Clock,
  ArrowRight,
  Building2,
  Wrench,
  Car,
  Layers,
} from 'lucide-react';
import { generateFirstResponseDraft, simulateCustomerResponse } from '../../services/aiEngine';

export const GuidedDemoView: React.FC = () => {
  const {
    leads,
    appointments,
    businessSettings,
    demoCurrentStep,
    setDemoCurrentStep,
    addLead,
    setSelectedLeadId,
    setActiveTab,
    addMessageToLead,
    approveAndSendDraft,
    simulateCustomerReplyForLead,
    qualifyLeadDirectly,
    bookAppointmentForLead,
    resetDemoData,
    switchIndustryPreset,
  } = useApp();

  const [demoLeadId, setDemoLeadId] = useState<string>(() => {
    return leads[0]?.id || '';
  });
  const [selectedIndustry, setSelectedIndustry] = useState<string>('real_estate');

  const demoLead = leads.find((l) => l.id === demoLeadId) || leads[0];

  const steps = [
    {
      step: 1,
      title: 'Receive Sample Enquiry',
      desc: 'Simulate an incoming prospective customer enquiry across Real Estate, Home Services, or Auto Dealership.',
    },
    {
      step: 2,
      title: 'Open Lead Profile',
      desc: 'Inspect initial contact parameters, channel selection, and customer request details.',
    },
    {
      step: 3,
      title: 'Generate Personalized AI Draft',
      desc: 'AI analyzes the enquiry and formulates a polite, customized initial response asking qualifying questions.',
    },
    {
      step: 4,
      title: 'Simulate Customer Reply',
      desc: 'Simulate customer answering with specifics: budget, location preferences, and desired timeframe.',
    },
    {
      step: 5,
      title: 'Extract & Qualify Answers',
      desc: 'AI scores intent and extracts key criteria (Need, Budget, Timeline, Location).',
    },
    {
      step: 6,
      title: 'Mark Lead as Qualified',
      desc: 'Confirm lead qualification score passes 80%+ threshold and is ready for booking.',
    },
    {
      step: 7,
      title: 'Suggest Open Appointment Slots',
      desc: 'Query business working schedule for conflicts and suggest available booking windows.',
    },
    {
      step: 8,
      title: 'Confirm & Book Appointment',
      desc: 'Reserve the time slot with zero double-booking risk and update lead to "Appointment Booked".',
    },
    {
      step: 9,
      title: 'View Dashboard & Metrics',
      desc: 'Return to the command dashboard to observe updated KPI cards and real-time activity feed.',
    },
  ];

  // Step 1: Create a fresh sample enquiry
  const handleCreateSampleEnquiry = (type: string) => {
    switchIndustryPreset(type);
    setSelectedIndustry(type);

    let created;
    if (type === 'real_estate') {
      created = addLead({
        name: 'Jordan Miller',
        email: 'jordan.miller@gmail.com',
        phone: '+1 (555) 789-0123',
        preferredContactMethod: 'whatsapp',
        source: 'Zillow / Portal',
        enquiryDetails: 'Looking for a 3-bedroom property with backyard near West End. Budget is around $540,000. Wanting to view this weekend.',
      });
    } else if (type === 'home_services') {
      created = addLead({
        name: 'David Vance',
        email: 'david.vance@techcorp.io',
        phone: '+1 (555) 912-3344',
        preferredContactMethod: 'phone',
        source: 'Google Search',
        enquiryDetails: 'Central AC system is blowing warm air and humming. Need a certified technician to inspect today or tomorrow.',
      });
    } else {
      created = addLead({
        name: 'Samantha Ray',
        email: 'samantha.ray@auto.org',
        phone: '+1 (555) 345-6789',
        preferredContactMethod: 'sms',
        source: 'Meta Ad',
        enquiryDetails: 'Interested in test driving the 2024 CR-V Hybrid and exploring trade-in value for my 2019 Civic this Friday.',
      });
    }

    setDemoLeadId(created.id);
    setSelectedLeadId(created.id);
    setDemoCurrentStep(2);
  };

  // Step 3: Generate AI Draft
  const handleStep3Generate = () => {
    if (!demoLead) return;
    const { draft, rationale } = generateFirstResponseDraft(demoLead, businessSettings);
    addMessageToLead(demoLead.id, {
      sender: 'ai',
      content: draft,
      channel: demoLead.preferredContactMethod === 'phone' ? 'sms' : demoLead.preferredContactMethod,
      isDraft: true,
      draftStatus: 'pending_review',
      aiRationale: rationale,
    });
    setDemoCurrentStep(4);
  };

  // Step 4: Simulate Customer Reply
  const handleStep4Reply = () => {
    if (!demoLead) return;
    // Approve any pending draft first
    const pendingDraft = demoLead.messages.find((m) => m.isDraft);
    if (pendingDraft) {
      approveAndSendDraft(demoLead.id, pendingDraft.id);
    }
    simulateCustomerReplyForLead(demoLead.id, 'enthusiastic_booking');
    setDemoCurrentStep(5);
  };

  // Step 6: Mark Qualified
  const handleStep6Qualify = () => {
    if (!demoLead) return;
    qualifyLeadDirectly(demoLead.id, {
      score: 92,
      isQualified: true,
      recommendedNextAction: 'Lead fully qualified. Suggest Saturday afternoon appointment.',
    });
    setDemoCurrentStep(7);
  };

  // Step 8: Book Appointment
  const handleStep8Book = () => {
    if (!demoLead) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    bookAppointmentForLead({
      leadId: demoLead.id,
      leadName: demoLead.name,
      leadContact: demoLead.phone || demoLead.email,
      industry: demoLead.industry,
      title: `${demoLead.industry === 'real_estate' ? 'Property Viewing' : demoLead.industry === 'car_dealership' ? 'Test Drive' : 'Service Inspection'}: ${demoLead.name}`,
      type: demoLead.industry === 'real_estate' ? 'Property Viewing' : demoLead.industry === 'car_dealership' ? 'Test Drive' : 'Home Inspection / Estimate',
      date: dateStr,
      timeSlot: '02:00 PM - 02:45 PM',
      status: 'confirmed',
      notes: 'Booked via Guided Demo flow.',
      locationOrPlatform: 'On-site Location',
    });
    setDemoCurrentStep(9);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
                Interactive Guided Walkthrough
              </span>
              <span className="text-xs text-slate-300">
                Step {demoCurrentStep} of 9
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
              End-to-End Workflow Simulator
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-xl">
              Experience how LeadPilot AI ingests enquiries, drafts polite qualification questions, handles customer replies, and books appointments seamlessly.
            </p>
          </div>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="mt-6 grid grid-cols-3 gap-1.5 sm:grid-cols-9">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setDemoCurrentStep(s.step)}
              className={`rounded-lg p-2 text-left transition-all ${
                demoCurrentStep === s.step
                  ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400'
                  : demoCurrentStep > s.step
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span>#{s.step}</span>
                {demoCurrentStep > s.step && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              </div>
              <div className="mt-0.5 line-clamp-1 text-[11px] font-semibold">
                {s.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Step {demoCurrentStep}
            </span>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
              {steps[demoCurrentStep - 1].title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {steps[demoCurrentStep - 1].desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {demoCurrentStep > 1 && (
              <button
                onClick={() => setDemoCurrentStep(Math.max(demoCurrentStep - 1, 1))}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            )}
            {demoCurrentStep < 9 && (
              <button
                onClick={() => setDemoCurrentStep(Math.min(demoCurrentStep + 1, 9))}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700"
              >
                <span>Skip to Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step-Specific Actions */}
        <div className="mt-6">
          {/* STEP 1 */}
          {demoCurrentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select an industry to receive a sample enquiry:
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  onClick={() => handleCreateSampleEnquiry('real_estate')}
                  className="flex flex-col items-start rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 text-left hover:border-indigo-400 transition-all dark:border-indigo-900 dark:bg-indigo-950/30"
                >
                  <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    Real Estate Buyer
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    "Looking for 3-bed property near West End, budget $540,000."
                  </p>
                  <span className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Receive Inquiry →
                  </span>
                </button>

                <button
                  onClick={() => handleCreateSampleEnquiry('home_services')}
                  className="flex flex-col items-start rounded-xl border border-sky-200 bg-sky-50/50 p-4 text-left hover:border-sky-400 transition-all dark:border-sky-900 dark:bg-sky-950/30"
                >
                  <Wrench className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    Home Service / HVAC
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    "Emergency AC repair needed, blowing warm air today."
                  </p>
                  <span className="mt-3 text-xs font-bold text-sky-600 dark:text-sky-400">
                    Receive Inquiry →
                  </span>
                </button>

                <button
                  onClick={() => handleCreateSampleEnquiry('car_dealership')}
                  className="flex flex-col items-start rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-left hover:border-emerald-400 transition-all dark:border-emerald-900 dark:bg-emerald-950/30"
                >
                  <Car className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                    Car Dealership / SUV
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    "Test drive for 2024 CR-V Hybrid and trade-in evaluation."
                  </p>
                  <span className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Receive Inquiry →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {demoCurrentStep === 2 && demoLead && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {demoLead.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Channel: {demoLead.preferredContactMethod.toUpperCase()} • Status: {demoLead.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    Initial Score: {demoLead.qualification.score}%
                  </span>
                </div>
                <div className="mt-3 rounded-lg bg-white p-3 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  "{demoLead.enquiryDetails}"
                </div>
              </div>

              <button
                onClick={() => setDemoCurrentStep(3)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
              >
                <span>Proceed to Generate AI Response Draft</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {demoCurrentStep === 3 && demoLead && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The local rule-based engine reads the customer enquiry and drafts an empathetic, tailored response asking qualifying questions according to the configured tone ({businessSettings.aiTone}).
              </p>

              <button
                onClick={handleStep3Generate}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate AI First Response Draft</span>
              </button>
            </div>
          )}

          {/* STEP 4 */}
          {demoCurrentStep === 4 && demoLead && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The draft has been generated. Now let's simulate the customer's affirmative reply agreeing to an appointment and providing their budget and schedule details.
              </p>

              <button
                onClick={handleStep4Reply}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                <User className="h-4 w-4" />
                <span>Simulate Customer Affirmative Reply</span>
              </button>
            </div>
          )}

          {/* STEP 5 */}
          {demoCurrentStep === 5 && demoLead && (
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-950 dark:bg-indigo-950/30">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  Extracted Intelligence:
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Need</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {demoLead.qualification.need}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Budget</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {demoLead.qualification.budget || 'Captured'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Timeline</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {demoLead.qualification.timeframe || 'This weekend'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Score</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">
                      {demoLead.qualification.score}%
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDemoCurrentStep(6)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
              >
                <span>Advance to Qualification Confirmation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 6 */}
          {demoCurrentStep === 6 && demoLead && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Because the customer verified intent, budget, and timing, we can now officially advance their status to "Qualified".
              </p>

              <button
                onClick={handleStep6Qualify}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                <Award className="h-4 w-4" />
                <span>Mark Lead as Qualified</span>
              </button>
            </div>
          )}

          {/* STEP 7 */}
          {demoCurrentStep === 7 && demoLead && (
            <div className="space-y-4">
              <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-xs dark:border-purple-950 dark:bg-purple-950/20">
                <h4 className="font-bold text-purple-950 dark:text-purple-200">
                  Appointment Setter Ready
                </h4>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  The appointment setter checked tomorrow's timetable. Available slots calculated: 09:00 AM, 11:00 AM, 02:00 PM, 04:00 PM. No scheduling conflicts.
                </p>
              </div>

              <button
                onClick={() => setDemoCurrentStep(8)}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
              >
                <span>Proceed to Book Slot (02:00 PM)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 8 */}
          {demoCurrentStep === 8 && demoLead && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Lock in the reservation for tomorrow at 02:00 PM - 02:45 PM. The system automatically updates the lead status to "Appointment Booked" and records the event in activity logs.
              </p>

              <button
                onClick={handleStep8Book}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Confirm & Lock Appointment</span>
              </button>
            </div>
          )}

          {/* STEP 9 */}
          {demoCurrentStep === 9 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-950 dark:bg-emerald-950/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                    Full Cycle Demo Successfully Completed!
                  </h3>
                </div>
                <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  You took an inbound enquiry, generated an AI draft, simulated customer response, extracted qualifying parameters, marked the lead qualified, and booked a confirmed appointment without any double-booking.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  <span>View Live Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>View Appointments Table</span>
                </button>
                <button
                  onClick={resetDemoData}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-slate-700 dark:text-rose-400"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Restart Walkthrough</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

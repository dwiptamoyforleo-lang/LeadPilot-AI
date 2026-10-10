import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryType } from '../../types';
import { INDUSTRY_PRESETS } from '../../data/initialData';
import {
  Building2,
  Wrench,
  Car,
  Scissors,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  CalendarCheck,
  Zap,
  Users,
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const { switchIndustryPreset, setCurrentPage, setActiveTab, showToast } = useApp();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('real_estate');

  const industries: {
    id: IndustryType;
    title: string;
    subtitle: string;
    icon: any;
    dealSize: string;
    timeToRespond: string;
    challenge: string;
    solution: string;
    stats: { label: string; value: string }[];
    sampleInquiry: string;
    aiResponse: string;
    qualificationFlow: string[];
    imageSrc: string;
  }[] = [
    {
      id: 'real_estate',
      title: 'Real Estate Brokerages & Agents',
      subtitle: 'Never lose a pre-approved homebuyer to a slow response again',
      icon: Building2,
      dealSize: '$8,500+ avg. commission',
      timeToRespond: '< 30 seconds',
      imageSrc: '/src/assets/images/solution_real_estate_1791641707305.jpg',
      challenge:
        'Over 73% of portal leads (Zillow, Realtor.com, website forms) hire the first agent who replies within 5 minutes. Off-hours inquiries typically wait 8–14 hours, bleeding potential high-intent commission deals.',
      solution:
        'LeadPilot AI immediately captures the inquiry, extracts target bedrooms, budget bracket, pre-approval status, and offers private tour slots for the upcoming weekend.',
      stats: [
        { label: 'Avg. First Response Time', value: 'Instant (<30s)' },
        { label: 'Weekend Showing Bookings', value: '+3.4x' },
        { label: 'Unresponsive Lead Drop-off', value: '-62%' },
      ],
      sampleInquiry:
        'Hi, looking for a 3-bedroom property with a backyard near Maple Street under $520,000. Wanting to view this weekend.',
      aiResponse:
        'Hi Jordan! Thanks for reaching out to Apex Realty Group. We have 3 active listings matching your 3-bedroom search under $520k. Are you pre-approved with a lender? We have Saturday 10:00 AM or 2:00 PM open for a private tour walkthrough.',
      qualificationFlow: [
        '1. Buy vs. Rent intent validation',
        '2. Pre-approval & target budget limit ($520k)',
        '3. School district & neighborhood priority',
        '4. Weekend showing slot reservation',
      ],
    },
    {
      id: 'home_services',
      title: 'HVAC, Plumbing & Home Contractors',
      subtitle: 'Dispatch urgent repair estimates before homeowners call your competitors',
      icon: Wrench,
      dealSize: '$450 – $3,200 avg. ticket',
      timeToRespond: '< 15 seconds',
      imageSrc: '/src/assets/images/solution_home_services_1791641720985.jpg',
      challenge:
        'When an AC fails in summer or a basement pipe leaks, homeowners call 3 contractors simultaneously. The first business to confirm diagnostic availability locks the job 85% of the time.',
      solution:
        'LeadPilot AI triages emergency vs. routine maintenance, captures address and zip code, and reserves a 1-hour technician dispatch window with travel buffers.',
      stats: [
        { label: 'Emergency Lead Capture', value: '98%' },
        { label: 'Dispatch Booking Speed', value: '< 2 mins' },
        { label: 'Lost Estimating Revenue', value: '-74%' },
      ],
      sampleInquiry:
        'Main floor AC unit stopped cooling yesterday. Blowing warm air and making clicking sound. Need a technician estimate today.',
      aiResponse:
        'Hi Sarah! Titan HVAC received your emergency request. Our certified technicians have trucks in your area today. We have a diagnostic window open between 2:00 PM and 4:00 PM. Would you like us to dispatch our tech to inspect?',
      qualificationFlow: [
        '1. Urgency triage (Emergency same-day vs. scheduled)',
        '2. System type & symptom verification (AC, heater, pipes)',
        '3. Service location / zip code for dispatch routing',
        '4. Diagnostic arrival window confirmation',
      ],
    },
    {
      id: 'car_dealership',
      title: 'Automotive Dealerships & Showrooms',
      subtitle: 'Turn internet tire-kickers into confirmed showroom VIP test drives',
      icon: Car,
      dealSize: '$2,400+ gross profit/unit',
      timeToRespond: '< 45 seconds',
      imageSrc: '/src/assets/images/solution_car_dealership_1791641732373.jpg',
      challenge:
        'Digital automotive leads from Facebook Ads and Google Search submit inquiries on evenings and weekends. Typical BDC follow-up lags by 4+ hours, resulting in low test-drive show rates.',
      solution:
        'LeadPilot AI answers inventory questions, qualifies trade-in vehicles, checks financing preferences, and locks in VIP 45-minute test drive slots directly on showroom bays.',
      stats: [
        { label: 'Showroom Visit Rate', value: '+42%' },
        { label: 'Trade-In Valuation Capture', value: '88%' },
        { label: 'BDC Team Time Saved', value: '18 hrs/wk' },
      ],
      sampleInquiry:
        'Interested in test driving the 2024 CR-V Hybrid or RAV4 this Friday. Also want to evaluate my 2019 Civic for trade-in value.',
      aiResponse:
        'Hi Carlos! Vanguard Auto Gallery has 2 CR-V Hybrids ready on our showcase lot. We can also perform a complimentary 15-minute appraisal on your 2019 Civic while you drive. Would 11:30 AM or 2:00 PM on Friday suit your schedule?',
      qualificationFlow: [
        '1. Target vehicle model & trim interest',
        '2. Finance vs. lease vs. outright purchase',
        '3. Trade-in year, make, mileage & title status',
        '4. Dedicated test drive slot reservation',
      ],
    },
    {
      id: 'salon_wellness',
      title: 'Salons, MedSpas & Aesthetics Ateliers',
      subtitle: 'Fill empty styling chairs and treatment slots around the clock',
      icon: Scissors,
      dealSize: '$120 – $800 avg. booking',
      timeToRespond: '< 20 seconds',
      imageSrc: '/src/assets/images/hero_command_center_1791641694620.jpg',
      challenge:
        'Clients message Instagram and websites during late evening hours when front desk staff are off duty. Inquiries go cold or clients book elsewhere by the next morning.',
      solution:
        'LeadPilot AI automatically matches clients with senior stylists or treatment therapists, recommends services, and confirms appointments within opening hours.',
      stats: [
        { label: 'Off-Hours Bookings', value: '55% of total' },
        { label: 'Stylist Chair Utilization', value: '92%' },
        { label: 'Cancellation Drop', value: '-38%' },
      ],
      sampleInquiry:
        'Looking to book full hair balayage & blowout appointment for next Saturday afternoon. Any slots open with a senior stylist?',
      aiResponse:
        'Hello Hannah! We would love to take care of your hair balayage and blowout. Our senior stylist has open suites next Saturday at 1:30 PM or 3:30 PM. Shall we reserve that for you?',
      qualificationFlow: [
        '1. Service category (Color, cut, facial, massage)',
        '2. Stylist / practitioner tier preference',
        '3. Time of day preference (Morning vs. afternoon)',
        '4. Immediate treatment suite reservation',
      ],
    },
  ];

  const current = industries.find((i) => i.id === selectedIndustry) || industries[0];

  const handleApplyPreset = (indId: IndustryType) => {
    switchIndustryPreset(indId);
    setCurrentPage('workspace');
    setActiveTab('dashboard');
    showToast(`Loaded ${INDUSTRY_PRESETS[indId].businessName} into Workspace`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Tailored Business Solutions
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Purpose-Built for High-Touch Appointment Businesses
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Every industry has distinct qualifying questions, deal economics, and scheduling constraints. LeadPilot AI adapts its conversational tone, requirements extraction, and booking buffer rules to your exact domain.
        </p>
      </div>

      {/* Industry Selector Tabs */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 max-w-4xl mx-auto">
        {industries.map((ind) => {
          const Icon = ind.icon;
          const isSelected = selectedIndustry === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind.id)}
              className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs ring-1 ring-indigo-500/30 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-xs font-bold">{ind.title.split('&')[0]}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{ind.dealSize}</span>
            </button>
          );
        })}
      </div>

      {/* Main Solution Showcase Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-100 pb-6 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Industry Blueprint
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{current.dealSize}</span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {current.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {current.subtitle}
            </p>
          </div>

          <button
            onClick={() => handleApplyPreset(current.id)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all shrink-0"
          >
            <span>Load Profile in Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Domain Showcase */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-16/9 sm:aspect-21/9">
          <img
            src={current.imageSrc}
            alt={current.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-4 sm:p-6 pointer-events-none">
            <div className="text-white space-y-1">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-300">
                Domain Benchmark · {current.title}
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-200 max-w-xl">
                {current.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Challenge vs Solution */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
          <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4.5 dark:border-rose-950/60 dark:bg-rose-950/20 space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 text-[10px]">
              The Problem Before LeadPilot AI
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {current.challenge}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4.5 dark:border-emerald-950/60 dark:bg-emerald-950/20 space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 text-[10px]">
              The Automated LeadPilot AI Solution
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {current.solution}
            </p>
          </div>
        </div>

        {/* Quantifiable Stats */}
        <div className="grid grid-cols-3 gap-3">
          {current.stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Live Conversation Simulation Preview */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Live AI Qualification Workflow Preview
          </h3>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            {/* Qualification Logic */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Automated Intake Criteria</span>
              <div className="space-y-1.5 text-xs">
                {current.qualificationFlow.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg bg-white p-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation Preview */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                {/* Customer inbound */}
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold text-slate-400 mb-1">Customer Inbound Enquiry</span>
                  <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200 p-3 text-xs text-slate-800 shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 leading-relaxed">
                    "{current.sampleInquiry}"
                  </div>
                </div>

                {/* AI Instant Draft */}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    LeadPilot AI Response Draft (&lt;30s)
                  </span>
                  <div className="rounded-2xl rounded-tr-xs bg-indigo-600 text-white p-3 text-xs leading-relaxed shadow-xs max-w-[95%]">
                    {current.aiResponse}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => handleApplyPreset(current.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  <span>Test this conversation in Live Assistant</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Wrench,
  Car,
  Scissors,
  Check,
} from 'lucide-react';

export const RoiCalculatorPage: React.FC = () => {
  const { setCurrentPage, setActiveTab, showToast } = useApp();

  // State sliders
  const [monthlyLeads, setMonthlyLeads] = useState(80);
  const [avgDealValue, setAvgDealValue] = useState(1500);
  const [dropOffRate, setDropOffRate] = useState(50); // 50% dropped due to slow response
  const [closeRate, setCloseRate] = useState(25); // 25% of booked appointments close

  // Presets
  const applyPreset = (leads: number, deal: number, drop: number, close: number, label: string) => {
    setMonthlyLeads(leads);
    setAvgDealValue(deal);
    setDropOffRate(drop);
    setCloseRate(close);
    showToast(`Applied ${label} ROI baseline`, 'info');
  };

  // Calculations
  const leadsLostToSlowResponse = Math.round((monthlyLeads * dropOffRate) / 100);
  // LeadPilot AI recovers roughly 65% of dropped leads with immediate response (<30s)
  const recoveredLeads = Math.round(leadsLostToSlowResponse * 0.65);
  // Qualified appointments booked
  const extraAppointments = Math.max(1, Math.round(recoveredLeads * 0.6));
  // Closed deals
  const closedDeals = Math.max(1, Math.round((extraAppointments * closeRate) / 100));
  // Monthly and Annual Recovered Revenue
  const monthlyRecovered = closedDeals * avgDealValue;
  const annualRecovered = monthlyRecovered * 12;
  // Hours saved in manual follow-ups (approx 20 mins per lead)
  const hoursSavedPerWeek = Math.round((monthlyLeads * 0.33) / 4);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Financial Impact Simulator
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Lead Revenue Recovery Calculator
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Harvard Business Review research proves that firms contacting leads within 5 minutes are 7x more likely to qualify them than those waiting even 1 hour. Calculate the revenue LeadPilot AI recovers for your business.
        </p>
      </div>

      {/* Industry Presets Quick Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick Presets:</span>
        <button
          onClick={() => applyPreset(45, 8500, 60, 20, 'Real Estate')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Building2 className="h-3.5 w-3.5 text-indigo-600" />
          <span>Real Estate Agency ($8.5k deal)</span>
        </button>
        <button
          onClick={() => applyPreset(90, 650, 50, 35, 'Home Services')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Wrench className="h-3.5 w-3.5 text-sky-600" />
          <span>HVAC & Plumbing ($650 ticket)</span>
        </button>
        <button
          onClick={() => applyPreset(120, 2400, 55, 22, 'Car Dealership')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Car className="h-3.5 w-3.5 text-emerald-600" />
          <span>Auto Dealership ($2.4k margin)</span>
        </button>
        <button
          onClick={() => applyPreset(110, 140, 45, 45, 'Salon & Spa')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Scissors className="h-3.5 w-3.5 text-purple-600" />
          <span>Salon Atelier ($140 service)</span>
        </button>
      </div>

      {/* Main 2-Column Calculator Body */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 max-w-5xl mx-auto">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Adjust Your Business Metrics
          </h2>

          {/* Slider 1: Monthly Leads */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Monthly Inbound Enquiries
              </label>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {monthlyLeads} leads / month
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={600}
              step={5}
              value={monthlyLeads}
              onChange={(e) => setMonthlyLeads(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>15 leads</span>
              <span>600 leads</span>
            </div>
          </div>

          {/* Slider 2: Average Deal Value */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Average Customer / Deal Value
              </label>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${avgDealValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={15000}
              step={50}
              value={avgDealValue}
              onChange={(e) => setAvgDealValue(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$50</span>
              <span>$15,000</span>
            </div>
          </div>

          {/* Slider 3: Drop-Off Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Slow-Response Drop-Off Rate (Before AI)
              </label>
              <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {dropOffRate}% drop-off
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={80}
              step={5}
              value={dropOffRate}
              onChange={(e) => setDropOffRate(parseInt(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>15%</span>
              <span>80% (Industry avg ~50%)</span>
            </div>
          </div>

          {/* Slider 4: Appointment Close Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Qualified Appointment Close Rate
              </label>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {closeRate}% closed
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={closeRate}
              onChange={(e) => setCloseRate(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10%</span>
              <span>60%</span>
            </div>
          </div>
        </div>

        {/* Calculated Results Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 p-6 sm:p-8 shadow-xs dark:border-indigo-950 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Estimated Value Recovery
            </span>
            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                +${monthlyRecovered.toLocaleString()}
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Recovered Revenue / Month
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Annualized Revenue Boost</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +${annualRecovered.toLocaleString()} / year
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Extra Booked Appointments</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  +{extraAppointments} sessions / mo
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Manual Follow-Up Time Saved</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  ~{hoursSavedPerWeek} hours / week
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Prototype Running Cost</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹0 / month
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-indigo-100 dark:border-slate-800">
            <button
              onClick={() => {
                setCurrentPage('workspace');
                setActiveTab('dashboard');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <span>Test with Real Leads in Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Zero credit card or API key required to run LeadPilot AI v1.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison: LeadPilot AI vs Traditional Alternatives */}
      <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Cost & Speed Architecture Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400">Criteria</th>
                <th className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">LeadPilot AI (This App)</th>
                <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400">Outsourced BDC / Agency</th>
                <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400">Generic Paid SaaS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Monthly Operating Cost</td>
                <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">₹0 / $0 (Local Prototype)</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">$1,500 – $4,000 / month</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">$499 / mo + $0.05/msg</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Response Speed</td>
                <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">&lt; 30 Seconds (24/7)</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">15 – 45 Minutes</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">1 – 5 Minutes</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Double-Booking Guard</td>
                <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">Built-in with Travel Buffers</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Prone to Human Error</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Requires 3rd-Party Addon</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Data Privacy</td>
                <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">100% Client-Side in Browser</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Shared with External Reps</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Hosted on Third-Party Cloud</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

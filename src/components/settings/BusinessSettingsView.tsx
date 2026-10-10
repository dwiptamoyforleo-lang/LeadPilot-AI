import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndustryType,
  AITone,
  QualificationQuestionConfig,
  BusinessSettings,
} from '../../types';
import { INDUSTRY_PRESETS } from '../../data/initialData';
import {
  Settings,
  Building2,
  Wrench,
  Car,
  Scissors,
  Check,
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Clock,
  Calendar,
} from 'lucide-react';

export const BusinessSettingsView: React.FC = () => {
  const {
    businessSettings,
    updateBusinessSettings,
    switchIndustryPreset,
  } = useApp();

  const [settings, setSettings] = useState<BusinessSettings>(businessSettings);
  const [newService, setNewService] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState<QualificationQuestionConfig['category']>('need');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const industries: { key: IndustryType; label: string; icon: any; desc: string }[] = [
    {
      key: 'real_estate',
      label: 'Real Estate Agency',
      icon: Building2,
      desc: 'Property viewings, pre-approvals, budget matching, buyer intake',
    },
    {
      key: 'home_services',
      label: 'Home Services (HVAC/Plumbing)',
      icon: Wrench,
      desc: 'Emergency repairs, technician dispatch, on-site estimates',
    },
    {
      key: 'car_dealership',
      label: 'Car Dealership',
      icon: Car,
      desc: 'VIP test drives, inventory inquiries, trade-in valuations, financing',
    },
    {
      key: 'salon_wellness',
      label: 'Salon & Wellness Atelier',
      icon: Scissors,
      desc: 'Treatment bookings, stylist reservations, spa packages',
    },
  ];

  const handleSelectIndustryPreset = (indKey: string) => {
    switchIndustryPreset(indKey);
    setSettings(INDUSTRY_PRESETS[indKey]);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim()) return;
    setSettings((prev) => ({
      ...prev,
      services: [...prev.services, newService.trim()],
    }));
    setNewService('');
  };

  const handleRemoveService = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      services: prev.services.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ: QualificationQuestionConfig = {
      id: 'q-' + Date.now(),
      key: 'custom_' + Date.now(),
      question: newQuestionText.trim(),
      category: newQuestionCategory,
      required: true,
    };
    setSettings((prev) => ({
      ...prev,
      qualificationQuestions: [...prev.qualificationQuestions, newQ],
    }));
    setNewQuestionText('');
  };

  const handleRemoveQuestion = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      qualificationQuestions: prev.qualificationQuestions.filter((q) => q.id !== id),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
            Business Settings & Industry Presets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailor AI tone, qualifying questions, and appointment scheduling rules
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        >
          {saveSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saveSuccess ? 'Changes Saved!' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Industry Preset Selector Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          1. Select Primary Industry Preset
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = settings.industry === ind.key;
            return (
              <button
                key={ind.key}
                type="button"
                onClick={() => handleSelectIndustryPreset(ind.key)}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/30 dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-2.5 text-xs font-bold text-slate-900 dark:text-white">
                  {ind.label}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  {ind.desc}
                </p>
                {isSelected && (
                  <span className="mt-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                    Active Preset
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            2. Business Profile Details
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tagline / Value Proposition
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Location / Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Services list */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Active Offerings / Services
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {settings.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <span>{srv}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add service e.g. 'Virtual 3D Video Tours'..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>

        {/* AI Tone & Follow-Up Cadence */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            3. AI Assistant Persona & Cadence Settings
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                AI Tone of Voice
              </label>
              <select
                value={settings.aiTone}
                onChange={(e) => setSettings({ ...settings, aiTone: e.target.value as AITone })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="professional">Professional & Crisp</option>
                <option value="friendly">Friendly & Warm</option>
                <option value="direct">Direct & Consultative</option>
                <option value="enthusiastic">Enthusiastic & Energetic</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-400">
                Dictates greeting formulas and closing sign-offs in draft generation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Max Follow-Up Attempts
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={settings.maxFollowUps}
                onChange={(e) => setSettings({ ...settings, maxFollowUps: parseInt(e.target.value) || 3 })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Cadence automatically shuts off after this limit to avoid spamming.
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Setter Hours & Rules */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            4. Appointment Availability & Duration
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Start Time
              </label>
              <input
                type="time"
                value={settings.businessHoursStart}
                onChange={(e) => setSettings({ ...settings, businessHoursStart: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                End Time
              </label>
              <input
                type="time"
                value={settings.businessHoursEnd}
                onChange={(e) => setSettings({ ...settings, businessHoursEnd: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Slot Length (Minutes)
              </label>
              <select
                value={settings.appointmentDurationMinutes}
                onChange={(e) => setSettings({ ...settings, appointmentDurationMinutes: parseInt(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Buffer Time (Minutes)
              </label>
              <select
                value={settings.bufferMinutes}
                onChange={(e) => setSettings({ ...settings, bufferMinutes: parseInt(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value={0}>0 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Qualification Questions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              5. Industry Qualifying Questions
            </h3>
            <span className="text-[11px] text-slate-400">
              Asked by AI assistant during first responses
            </span>
          </div>

          <div className="space-y-2">
            {settings.qualificationQuestions.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
                    {q.category}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {q.question}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Add qualifying question..."
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <select
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="need">Need</option>
              <option value="budget">Budget</option>
              <option value="location">Location</option>
              <option value="timeframe">Timeframe</option>
              <option value="general">General</option>
            </select>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

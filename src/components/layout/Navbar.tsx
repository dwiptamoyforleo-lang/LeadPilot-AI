import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationPage } from '../../types';
import {
  Sparkles,
  Sun,
  Moon,
  RotateCcw,
  Plus,
  PlayCircle,
  Menu,
  X,
  Building2,
  HelpCircle,
  Calculator,
  ShieldCheck,
  ChevronDown,
  Layers,
  Award,
  AlertCircle,
  Check,
} from 'lucide-react';
import { INDUSTRY_PRESETS } from '../../data/initialData';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenAddLeadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddLeadModal }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    resetDemoData,
    businessSettings,
    switchIndustryPreset,
    currentPage,
    setCurrentPage,
    startGuidedDemo,
    leads,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showIndustryMenu, setShowIndustryMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const awaitingCount = leads.filter((l) => l.status === 'Awaiting Reply' || l.status === 'New').length;

  const navLinks: { id: NavigationPage; label: string; badge?: string }[] = [
    { id: 'workspace', label: 'Workspace', badge: awaitingCount > 0 ? `${awaitingCount} due` : undefined },
    { id: 'solutions', label: 'Solutions' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'roi_calculator', label: 'ROI Calculator' },
    { id: 'guided_demo', label: 'Guided Demo' },
    { id: 'faq', label: 'FAQ & Docs' },
    { id: 'compliance', label: 'Compliance' },
  ];

  const handleNavClick = (page: NavigationPage) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => handleNavClick('workspace')}
          className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          LeadPilot AI
        </button>

        {/* Zone 2: 5 Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Industry Preset Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowIndustryMenu(!showIndustryMenu)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Switch Industry Profile"
            >
              <Building2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="capitalize max-w-[110px] truncate">
                {businessSettings.industry.replace('_', ' ')}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showIndustryMenu && (
              <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Business Preset
                </div>
                {Object.keys(INDUSTRY_PRESETS).map((key) => {
                  const preset = INDUSTRY_PRESETS[key];
                  const isCurrent = businessSettings.industry === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        switchIndustryPreset(key);
                        setShowIndustryMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{preset.businessName}</span>
                      {isCurrent && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Reset Demo Data Confirmation */}
          <div className="relative">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-600 transition-colors dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
              title="Reset Demo Data"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {showResetConfirm && (
              <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reset Demo Data?</h4>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Restores initial sample leads, appointments, and settings stored in browser localStorage.
                    </p>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          resetDemoData();
                          setShowResetConfirm(false);
                        }}
                        className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        Reset Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenAddLeadModal}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Inbound Lead</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5 pb-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-left transition-colors ${
                  currentPage === link.id
                    ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950/60 dark:text-indigo-400'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Industry Preset Picker */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Industry Preset:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.keys(INDUSTRY_PRESETS).map((key) => {
                const preset = INDUSTRY_PRESETS[key];
                const isCurrent = businessSettings.industry === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      switchIndustryPreset(key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`rounded-lg px-2.5 py-1.5 text-xs text-left truncate transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {preset.businessName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

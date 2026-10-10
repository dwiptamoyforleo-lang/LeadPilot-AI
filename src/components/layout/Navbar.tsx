import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  PhoneCall,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenAddLeadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenAddLeadModal }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    resetDemoData,
    businessSettings,
    startGuidedDemo,
    leads,
    appointments,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const awaitingResponseCount = leads.filter((l) => l.status === 'Awaiting Reply' || l.status === 'New').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                LeadPilot<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 sm:inline-block">
                ₹0 Local Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 hidden md:block">
              {businessSettings.businessName} • {businessSettings.industry.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Guided Demo Button */}
        <button
          onClick={startGuidedDemo}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
          title="Start 9-step interactive guided workflow demo"
        >
          <PlayCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Guided Demo</span>
        </button>

        {/* Quick Add Lead */}
        <button
          onClick={onOpenAddLeadModal}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Add Lead</span>
        </button>

        {/* Dark/Light mode */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Reset Demo Data */}
        <div className="relative">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-600 transition-colors dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
            title="Reset to fresh demo dataset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {showResetConfirm && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reset Demo Data?</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    This restores all demo leads, appointments, and settings to their initial sample state.
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
      </div>
    </header>
  );
};

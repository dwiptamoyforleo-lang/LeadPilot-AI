import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead } from '../../types';
import {
  X,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Award,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Send,
  Plus,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onBookAppointment: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit,
  onBookAppointment,
}) => {
  const {
    addLeadNote,
    changeLeadStatus,
    setSelectedLeadId,
    setActiveTab,
    qualifyLeadDirectly,
  } = useApp();

  const [newNote, setNewNote] = useState('');

  if (!isOpen || !lead) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadNote(lead.id, newNote.trim());
    setNewNote('');
  };

  const handleOpenAssistant = () => {
    setSelectedLeadId(lead.id);
    setActiveTab('assistant');
    onClose();
  };

  const handleMarkQualified = () => {
    qualifyLeadDirectly(lead.id, {
      score: 90,
      isQualified: true,
      recommendedNextAction: 'High qualification score. Offer available appointment slots.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-base dark:bg-indigo-950 dark:text-indigo-300">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {lead.name}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    lead.status === 'Qualified'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : lead.status === 'Appointment Booked'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : lead.status === 'Not Interested'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {lead.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created on {new Date(lead.createdAt).toLocaleDateString()} • Source: {lead.source}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAssistant}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
            >
              <Bot className="h-4 w-4" />
              <span>Open AI Assistant & Drafts</span>
            </button>

            {lead.status !== 'Appointment Booked' && (
              <button
                onClick={() => {
                  onBookAppointment(lead);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300"
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Book Appointment</span>
              </button>
            )}

            {lead.status !== 'Qualified' && lead.status !== 'Appointment Booked' && (
              <button
                onClick={handleMarkQualified}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark as Qualified</span>
              </button>
            )}

            <button
              onClick={() => {
                onEdit(lead);
                onClose();
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Edit Lead
            </button>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Phone</span>
              <p className="mt-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {lead.phone || 'Not provided'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Email</span>
              <p className="mt-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {lead.email || 'Not provided'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Preferred Channel</span>
              <p className="mt-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                {lead.preferredContactMethod}
              </p>
            </div>
          </div>

          {/* Enquiry Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Customer Enquiry</h4>
            <div className="mt-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
              "{lead.enquiryDetails}"
            </div>
          </div>

          {/* AI Intelligence Card */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  AI Qualification Analysis
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {lead.qualification.score}% Intent Score
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Need</span>
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {lead.qualification.need}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Budget</span>
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {lead.qualification.budget || 'To be confirmed'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Location</span>
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {lead.qualification.location || 'Local area'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Timeline</span>
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {lead.qualification.timeframe || 'Standard'}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-indigo-100/60 dark:border-indigo-900/40 text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-300">Recommended Action: </span>
              <span className="text-slate-700 dark:text-slate-300">
                {lead.qualification.recommendedNextAction}
              </span>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Internal Team Notes</h4>
            <form onSubmit={handleAddNote} className="mt-2 flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a team note about this lead..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Add Note
              </button>
            </form>

            <div className="mt-2 space-y-1.5">
              {lead.notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes added yet.</p>
              ) : (
                lead.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:bg-slate-800/40 dark:text-slate-300"
                  >
                    • {note}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

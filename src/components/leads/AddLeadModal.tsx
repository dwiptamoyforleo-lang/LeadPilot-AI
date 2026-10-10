import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, User, Mail, Phone, MessageSquare, Tag } from 'lucide-react';
import { PreferredContactMethod } from '../../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead, businessSettings, setSelectedLeadId, setActiveTab } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<PreferredContactMethod>('whatsapp');
  const [source, setSource] = useState('Website Form');
  const [enquiryDetails, setEnquiryDetails] = useState('');
  const [initialNote, setInitialNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide the lead’s full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please provide at least a phone number or an email address.');
      return;
    }
    if (!enquiryDetails.trim()) {
      setError('Please provide the enquiry message or customer details.');
      return;
    }

    const createdLead = addLead({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      preferredContactMethod,
      source,
      enquiryDetails: enquiryDetails.trim(),
      notes: initialNote.trim() ? [initialNote.trim()] : [],
    });

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setEnquiryDetails('');
    setInitialNote('');
    setError('');
    onClose();

    // Directly open in AI Assistant so user can instantly see the AI draft!
    setSelectedLeadId(createdLead.id);
    setActiveTab('assistant');
  };

  // Sample prompt filler to test quickly
  const handleFillSample = () => {
    if (businessSettings.industry === 'real_estate') {
      setName('Sophia Chen');
      setEmail('sophia.chen@gmail.com');
      setPhone('+1 (555) 762-9843');
      setPreferredContactMethod('whatsapp');
      setSource('Zillow / Portal');
      setEnquiryDetails('Hi, looking for a 3-bedroom home near Maple Street under $500,000. Want to view this Saturday if available.');
      setInitialNote('Pre-approved buyer looking to close in 30 days.');
    } else if (businessSettings.industry === 'home_services') {
      setName('Robert Keller');
      setEmail('rkeller@gmail.com');
      setPhone('+1 (555) 902-1144');
      setPreferredContactMethod('phone');
      setSource('Google Search');
      setEnquiryDetails('Water pipe leaking under kitchen sink, dripping through basement ceiling. Need emergency technician estimate today.');
      setInitialNote('Water main shutoff located in garage.');
    } else if (businessSettings.industry === 'car_dealership') {
      setName('Alicia Gomez');
      setEmail('alicia.gomez@yahoo.com');
      setPhone('+1 (555) 432-6712');
      setPreferredContactMethod('sms');
      setSource('Meta Ad');
      setEnquiryDetails('Interested in scheduling a test drive for the 2024 CR-V Hybrid this Friday afternoon. Also inquiring about 0% APR financing.');
      setInitialNote('Trading in 2020 Corolla.');
    } else {
      setName('Hannah Brooks');
      setEmail('hbrooks@icloud.com');
      setPhone('+1 (555) 234-9081');
      setPreferredContactMethod('whatsapp');
      setSource('Instagram');
      setEnquiryDetails('Looking to book full hair balayage & blowout appointment for next Saturday afternoon.');
      setInitialNote('Requested Senior Stylist.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Inbound Lead
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                AI will immediately analyze and draft a first response
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="rounded-lg bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Lead Information
            </span>
            <button
              type="button"
              onClick={handleFillSample}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Fill Sample Lead
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sophia Chen"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 762-9843"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophia@example.com"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preferred Channel
              </label>
              <select
                value={preferredContactMethod}
                onChange={(e) => setPreferredContactMethod(e.target.value as PreferredContactMethod)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS / Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Lead Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Website Form">Website Form</option>
                <option value="Meta Ad">Meta / Facebook Ad</option>
                <option value="Google Search">Google Search</option>
                <option value="Zillow / Portal">Zillow / Portal</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in / Direct">Walk-in / Direct</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer Enquiry Details *
            </label>
            <textarea
              rows={3}
              required
              value={enquiryDetails}
              onChange={(e) => setEnquiryDetails(e.target.value)}
              placeholder="Paste enquiry details, question, property or service interest..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Internal Note (Optional)
            </label>
            <input
              type="text"
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="e.g. Referred by existing client"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition-all"
            >
              Add Lead & Generate Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

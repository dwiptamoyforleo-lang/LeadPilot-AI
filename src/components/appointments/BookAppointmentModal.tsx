import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, AppointmentType } from '../../types';
import { getAvailableSlots } from '../../services/aiEngine';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface BookAppointmentModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  lead,
  isOpen,
  onClose,
}) => {
  const {
    leads,
    appointments,
    businessSettings,
    bookAppointmentForLead,
  } = useApp();

  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [date, setDate] = useState<string>(() => {
    // Defaults to tomorrow or today
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [apptType, setApptType] = useState<AppointmentType>('In-Person Consultation');
  const [notes, setNotes] = useState('');
  const [locationOrPlatform, setLocationOrPlatform] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (lead) {
      setSelectedLeadId(lead.id);
      // Pre-select appropriate type based on industry
      if (lead.industry === 'real_estate') {
        setApptType('Property Viewing');
        setLocationOrPlatform(lead.qualification.location || '742 Maple Street');
      } else if (lead.industry === 'car_dealership') {
        setApptType('Test Drive');
        setLocationOrPlatform('Dealership Showcase Bay 1');
      } else if (lead.industry === 'home_services') {
        setApptType('Home Inspection / Estimate');
        setLocationOrPlatform(lead.qualification.location || 'Customer Residence');
      } else {
        setApptType('Service / Treatment Appointment');
        setLocationOrPlatform('Main Salon Suite');
      }
    } else if (leads.length > 0) {
      setSelectedLeadId(leads[0].id);
    }
  }, [lead, leads]);

  if (!isOpen) return null;

  const currentLead = leads.find((l) => l.id === selectedLeadId);

  // Compute available slots dynamically based on business working hours and existing appointments
  const slots = getAvailableSlots(date, businessSettings, appointments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLead) {
      setErrorMessage('Please select a lead.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Please select an available appointment time slot.');
      return;
    }

    try {
      bookAppointmentForLead({
        leadId: currentLead.id,
        leadName: currentLead.name,
        leadContact: currentLead.phone || currentLead.email,
        industry: currentLead.industry,
        title: `${apptType}: ${currentLead.name}`,
        type: apptType,
        date,
        timeSlot: selectedSlot,
        status: 'confirmed',
        notes: notes || `Customer requested ${apptType} for ${currentLead.qualification.need}.`,
        locationOrPlatform: locationOrPlatform || 'Main Office',
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error booking appointment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Book Appointment
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Slot conflict protection active • No double-booking allowed
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Appointment Successfully Booked!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reserved {date} at {selectedSlot}. Lead status updated to "Appointment Booked".
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Target Lead */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Lead *
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.qualification.need} ({l.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Appointment Type *
              </label>
              <select
                value={apptType}
                onChange={(e) => setApptType(e.target.value as AppointmentType)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Property Viewing">Property Viewing</option>
                <option value="Home Inspection / Estimate">Home Inspection / Estimate</option>
                <option value="Test Drive">Test Drive</option>
                <option value="Service / Treatment Appointment">Service / Treatment Appointment</option>
                <option value="In-Person Consultation">In-Person Consultation</option>
                <option value="Phone Discovery Call">Phone Discovery Call</option>
                <option value="Virtual Video Tour">Virtual Video Tour</option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Date *
              </label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedSlot('');
                }}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Available Slots Picker (Strict Double-Booking Check) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Time Slot ({businessSettings.appointmentDurationMinutes} mins) *
                </label>
                <span className="text-[10px] text-slate-400">
                  Hours: {businessSettings.businessHoursStart} - {businessSettings.businessHoursEnd}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-xl dark:border-slate-800">
                {slots.map((item) => (
                  <button
                    key={item.slot}
                    type="button"
                    disabled={!item.isAvailable}
                    onClick={() => {
                      setSelectedSlot(item.slot);
                      setErrorMessage('');
                    }}
                    className={`flex items-center justify-between rounded-lg p-2 text-xs font-medium transition-all ${
                      !item.isAvailable
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through dark:bg-slate-800 dark:text-slate-600'
                        : selectedSlot === item.slot
                        ? 'bg-purple-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-purple-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-purple-950'
                    }`}
                  >
                    <span>{item.slot}</span>
                    {!item.isAvailable && (
                      <span className="text-[9px] font-bold uppercase text-rose-500">Booked</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Location or meeting link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Location, Address or Link
              </label>
              <input
                type="text"
                value={locationOrPlatform}
                onChange={(e) => setLocationOrPlatform(e.target.value)}
                placeholder="e.g. 742 Maple Street / Dealership Showroom / Zoom"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Customer Preferences / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Needs wheelchair access / Wants to test AWD trim"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Submit buttons */}
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
                disabled={!selectedSlot}
                className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-sm disabled:opacity-40 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

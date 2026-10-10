import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, Lead } from '../../types';
import { getAvailableSlots } from '../../services/aiEngine';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Plus,
  X,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit,
  RotateCcw,
  Check,
} from 'lucide-react';
import { BookAppointmentModal } from './BookAppointmentModal';

interface AppointmentSetterViewProps {
  onOpenBookAppointment: (lead?: Lead) => void;
}

export const AppointmentSetterView: React.FC<AppointmentSetterViewProps> = ({
  onOpenBookAppointment,
}) => {
  const {
    appointments,
    businessSettings,
    rescheduleAppointment,
    cancelAppointment,
    leads,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'rescheduled' | 'cancelled'>('all');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const availableSlotsForReschedule = reschedulingAppt
    ? getAvailableSlots(rescheduleDate, businessSettings, appointments)
    : [];

  const handleOpenReschedule = (appt: Appointment) => {
    setReschedulingAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleSlot(appt.timeSlot);
    setRescheduleError('');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppt) return;
    if (!rescheduleSlot) {
      setRescheduleError('Please choose a valid time slot.');
      return;
    }

    try {
      rescheduleAppointment(reschedulingAppt.id, rescheduleDate, rescheduleSlot);
      setReschedulingAppt(null);
    } catch (err: any) {
      setRescheduleError(err.message || 'Cannot reschedule to this slot.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
            Appointment Setter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated slot reservation • Conflict checks • Double-booking prevention
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Configuration overview banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-purple-100 bg-purple-50/50 p-4 text-xs dark:border-purple-950/60 dark:bg-purple-950/20">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500">Working Days</span>
          <p className="mt-0.5 font-bold text-purple-950 dark:text-purple-200">
            {businessSettings.workingDays.join(', ')}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500">Business Hours</span>
          <p className="mt-0.5 font-bold text-purple-950 dark:text-purple-200">
            {businessSettings.businessHoursStart} - {businessSettings.businessHoursEnd}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500">Slot Duration</span>
          <p className="mt-0.5 font-bold text-purple-950 dark:text-purple-200">
            {businessSettings.appointmentDurationMinutes} Minutes (+{businessSettings.bufferMinutes}m buffer)
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-500">Total Bookings</span>
          <p className="mt-0.5 font-bold text-purple-950 dark:text-purple-200">
            {appointments.length} Records
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          onClick={() => setStatusFilter('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          All Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            statusFilter === 'confirmed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          Confirmed ({appointments.filter((a) => a.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setStatusFilter('rescheduled')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            statusFilter === 'rescheduled'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          Rescheduled ({appointments.filter((a) => a.status === 'rescheduled').length})
        </button>
        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            statusFilter === 'cancelled'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          Cancelled ({appointments.filter((a) => a.status === 'cancelled').length})
        </button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <CalendarCheck className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No appointments found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Book an appointment for a qualified lead using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all ${
                appt.status === 'cancelled'
                  ? 'border-slate-200 bg-slate-50/60 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {appt.type}
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {appt.title}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    appt.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : appt.status === 'rescheduled'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              {/* Date & Time slot */}
              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>{appt.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{appt.timeSlot}</span>
                </div>
                {appt.locationOrPlatform && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{appt.locationOrPlatform}</span>
                  </div>
                )}
              </div>

              {/* Lead details & notes */}
              {appt.notes && (
                <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 line-clamp-2">
                  "{appt.notes}"
                </div>
              )}

              {/* Footer controls */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {appt.leadName}
                </span>

                <div className="flex items-center gap-1.5">
                  {appt.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => handleOpenReschedule(appt)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        lead={null}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      {/* Reschedule Modal */}
      {reschedulingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Reschedule: {reschedulingAppt.leadName}
              </h3>
              <button
                onClick={() => setReschedulingAppt(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="mt-4 space-y-4">
              {rescheduleError && (
                <div className="rounded-lg bg-rose-50 p-2 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {rescheduleError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Choose New Date
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleSlot('');
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Open Slot
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-xl dark:border-slate-800">
                  {availableSlotsForReschedule.map((s) => (
                    <button
                      key={s.slot}
                      type="button"
                      disabled={!s.isAvailable}
                      onClick={() => setRescheduleSlot(s.slot)}
                      className={`rounded-lg p-2 text-xs font-medium transition-all ${
                        !s.isAvailable
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through dark:bg-slate-800'
                          : rescheduleSlot === s.slot
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-slate-50 text-slate-700 hover:bg-purple-50 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {s.slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReschedulingAppt(null)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rescheduleSlot}
                  className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-40"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

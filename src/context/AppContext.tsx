import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead,
  Appointment,
  BusinessSettings,
  ActivityEvent,
  LeadStatus,
  ConversationMessage,
  QualificationData,
} from '../types';
import {
  INDUSTRY_PRESETS,
  INITIAL_LEADS,
  INITIAL_APPOINTMENTS,
  INITIAL_ACTIVITIES,
} from '../data/initialData';
import {
  extractLeadIntelligence,
  generateFirstResponseDraft,
  simulateCustomerResponse,
  timeSlotsConflict,
  CustomerScenario,
} from '../services/aiEngine';

interface AppContextType {
  leads: Lead[];
  appointments: Appointment[];
  businessSettings: BusinessSettings;
  activityHistory: ActivityEvent[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Lead operations
  addLead: (lead: Partial<Lead> & { name: string; enquiryDetails: string }) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  changeLeadStatus: (id: string, newStatus: LeadStatus) => void;
  addLeadNote: (id: string, note: string) => void;

  // Messaging & AI
  addMessageToLead: (
    leadId: string,
    message: Omit<ConversationMessage, 'id' | 'timestamp'>
  ) => void;
  approveAndSendDraft: (leadId: string, messageId: string) => void;
  discardDraft: (leadId: string, messageId: string) => void;
  simulateCustomerReplyForLead: (
    leadId: string,
    scenarioOrCustomText: CustomerScenario | string
  ) => void;
  qualifyLeadDirectly: (
    leadId: string,
    updates: Partial<QualificationData>
  ) => void;

  // Appointments
  bookAppointmentForLead: (
    appt: Omit<Appointment, 'id' | 'createdAt'>
  ) => Appointment;
  rescheduleAppointment: (
    id: string,
    newDate: string,
    newTimeSlot: string
  ) => void;
  cancelAppointment: (id: string) => void;
  isSlotAvailable: (
    date: string,
    timeSlot: string,
    excludeApptId?: string
  ) => boolean;

  // Follow-ups
  completeFollowUp: (leadId: string) => void;
  scheduleNextFollowUp: (leadId: string, daysAhead: number) => void;

  // Business & Industry
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void;
  switchIndustryPreset: (industryKey: string) => void;
  resetDemoData: () => void;

  // Guided Interactive Demo
  isDemoActive: boolean;
  demoCurrentStep: number;
  startGuidedDemo: () => void;
  advanceDemoStep: () => void;
  setDemoCurrentStep: (step: number) => void;
  endGuidedDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  LEADS: 'leadpilot_leads_v1',
  APPOINTMENTS: 'leadpilot_appointments_v1',
  SETTINGS: 'leadpilot_settings_v1',
  ACTIVITIES: 'leadpilot_activities_v1',
  THEME: 'leadpilot_theme_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Business settings
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings from storage', e);
      }
    }
    return INDUSTRY_PRESETS.real_estate;
  });

  // Leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse leads from storage', e);
      }
    }
    return INITIAL_LEADS;
  });

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse appointments from storage', e);
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  // Activities
  const [activityHistory, setActivityHistory] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse activities from storage', e);
      }
    }
    return INITIAL_ACTIVITIES;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Guided demo state
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoCurrentStep, setDemoCurrentStep] = useState<number>(1);

  // Sync theme to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(businessSettings));
  }, [businessSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activityHistory));
  }, [activityHistory]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const addActivity = (title: string, description: string, type: ActivityEvent['type'], leadId?: string) => {
    const newAct: ActivityEvent = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      title,
      description,
      type,
      leadId,
    };
    setActivityHistory((prev) => [newAct, ...prev.slice(0, 30)]);
  };

  const addLead = (leadInput: Partial<Lead> & { name: string; enquiryDetails: string }) => {
    const now = new Date();
    const leadId = 'lead-' + Date.now();
    const preferredMethod = leadInput.preferredContactMethod || 'whatsapp';

    const baseLead: Lead = {
      id: leadId,
      name: leadInput.name,
      email: leadInput.email || `${leadInput.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: leadInput.phone || '+1 (555) 000-0000',
      preferredContactMethod: preferredMethod,
      industry: businessSettings.industry,
      source: leadInput.source || 'Website Form',
      createdAt: now.toISOString(),
      status: 'New',
      enquiryDetails: leadInput.enquiryDetails,
      notes: leadInput.notes || [],
      qualification: {
        need: 'Pending qualification',
        score: 30,
        answers: {},
        summary: `New inquiry submitted by ${leadInput.name}`,
        recommendedNextAction: 'Review inquiry and send personalized AI response draft.',
        isQualified: false,
      },
      nextFollowUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      followUpCount: 0,
      messages: [
        {
          id: 'msg-' + Date.now(),
          sender: 'customer',
          content: leadInput.enquiryDetails,
          timestamp: now.toISOString(),
          channel: preferredMethod === 'phone' ? 'sms' : preferredMethod,
        },
      ],
    };

    // Calculate initial intelligence from enquiry
    const intel = extractLeadIntelligence(baseLead, businessSettings);
    baseLead.qualification = {
      need: intel.need,
      budget: intel.budget,
      location: intel.location,
      timeframe: intel.timeframe,
      answers: {},
      score: intel.score,
      summary: intel.summary,
      recommendedNextAction: intel.recommendedNextAction,
      isQualified: intel.isQualified,
    };

    setLeads((prev) => [baseLead, ...prev]);
    addActivity('New Lead Added', `${baseLead.name} (${businessSettings.industry.replace('_', ' ')}) submitted an enquiry.`, 'lead_created', leadId);
    return baseLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        const updated = { ...lead, ...updates };
        return updated;
      })
    );
  };

  const deleteLead = (id: string) => {
    const leadToDelete = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    // Also cancel or remove associated appointments
    setAppointments((prev) => prev.filter((a) => a.leadId !== id));
    if (selectedLeadId === id) {
      setSelectedLeadId(null);
    }
    if (leadToDelete) {
      addActivity('Lead Deleted', `Removed record for ${leadToDelete.name}.`, 'status_changed');
    }
  };

  const changeLeadStatus = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        return { ...lead, status: newStatus };
      })
    );
    const target = leads.find((l) => l.id === id);
    addActivity('Status Updated', `${target?.name || 'Lead'} moved to "${newStatus}".`, 'status_changed', id);
  };

  const addLeadNote = (id: string, note: string) => {
    if (!note.trim()) return;
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        return { ...lead, notes: [note.trim(), ...lead.notes] };
      })
    );
  };

  const addMessageToLead = (
    leadId: string,
    msg: Omit<ConversationMessage, 'id' | 'timestamp'>
  ) => {
    const newMsg: ConversationMessage = {
      id: 'msg-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...msg,
    };

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const updatedMessages = [...lead.messages, newMsg];
        const tempLead = { ...lead, messages: updatedMessages };
        const intel = extractLeadIntelligence(tempLead, businessSettings);

        return {
          ...tempLead,
          qualification: {
            ...tempLead.qualification,
            need: intel.need,
            budget: intel.budget || tempLead.qualification.budget,
            location: intel.location || tempLead.qualification.location,
            timeframe: intel.timeframe || tempLead.qualification.timeframe,
            score: intel.score,
            summary: intel.summary,
            recommendedNextAction: intel.recommendedNextAction,
            isQualified: intel.isQualified,
          },
          optedOut: intel.isOptOut,
          status:
            intel.isOptOut
              ? 'Not Interested'
              : msg.sender === 'customer'
              ? 'Awaiting Reply'
              : lead.status === 'New'
              ? 'Contacted'
              : lead.status,
        };
      })
    );
  };

  const approveAndSendDraft = (leadId: string, messageId: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const updatedMessages = lead.messages.map((m) => {
          if (m.id === messageId) {
            return {
              ...m,
              isDraft: false,
              draftStatus: 'sent_simulated' as const,
            };
          }
          return m;
        });

        const newStatus: LeadStatus = lead.status === 'New' ? 'Contacted' : lead.status;

        return {
          ...lead,
          messages: updatedMessages,
          status: newStatus,
          followUpCount: lead.followUpCount + 1,
        };
      })
    );
    const target = leads.find((l) => l.id === leadId);
    addActivity('Simulated Message Sent', `Message draft approved and dispatched to ${target?.name || 'Lead'}.`, 'message_sent', leadId);
  };

  const discardDraft = (leadId: string, messageId: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          messages: lead.messages.filter((m) => m.id !== messageId),
        };
      })
    );
  };

  const simulateCustomerReplyForLead = (
    leadId: string,
    scenarioOrCustomText: CustomerScenario | string
  ) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    let replyText = '';
    const knownScenarios: CustomerScenario[] = [
      'enthusiastic_booking',
      'budget_pricing',
      'timeline_location',
      'tentative_schedule',
      'opt_out',
    ];

    if (knownScenarios.includes(scenarioOrCustomText as CustomerScenario)) {
      replyText = simulateCustomerResponse(
        targetLead,
        scenarioOrCustomText as CustomerScenario
      );
    } else {
      replyText = scenarioOrCustomText;
    }

    addMessageToLead(leadId, {
      sender: 'customer',
      content: replyText,
      channel: targetLead.preferredContactMethod === 'phone' ? 'sms' : targetLead.preferredContactMethod,
    });

    addActivity('Customer Reply Simulated', `${targetLead.name} replied in conversation thread.`, 'message_sent', leadId);
  };

  const qualifyLeadDirectly = (leadId: string, updates: Partial<QualificationData>) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const newQual = { ...lead.qualification, ...updates };
        const newScore = updates.score !== undefined ? updates.score : Math.max(lead.qualification.score, 75);
        return {
          ...lead,
          status: 'Qualified',
          qualification: {
            ...newQual,
            score: newScore,
            isQualified: true,
          },
        };
      })
    );
    const target = leads.find((l) => l.id === leadId);
    addActivity('Lead Marked Qualified', `${target?.name || 'Lead'} confirmed as Qualified. Ready for Appointment Booking.`, 'qualified', leadId);
  };

  const isSlotAvailable = (
    date: string,
    timeSlot: string,
    excludeApptId?: string
  ): boolean => {
    return !appointments.some(
      (appointment) =>
        appointment.date === date &&
        appointment.status !== 'cancelled' &&
        appointment.id !== excludeApptId &&
        timeSlotsConflict(
          timeSlot,
          appointment.timeSlot,
          businessSettings.bufferMinutes
        )
    );
  };

  const bookAppointmentForLead = (
    apptInput: Omit<Appointment, 'id' | 'createdAt'>
  ): Appointment => {
    // Check double booking
    if (!isSlotAvailable(apptInput.date, apptInput.timeSlot)) {
      throw new Error(`Slot ${apptInput.timeSlot} on ${apptInput.date} is already booked!`);
    }

    const apptId = 'appt-' + Date.now();
    const newAppt: Appointment = {
      id: apptId,
      createdAt: new Date().toISOString(),
      ...apptInput,
    };

    setAppointments((prev) => [newAppt, ...prev]);

    // Update lead status and link appointment
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== apptInput.leadId) return lead;
        return {
          ...lead,
          status: 'Appointment Booked',
          appointmentId: apptId,
          qualification: {
            ...lead.qualification,
            recommendedNextAction: `Appointment booked for ${apptInput.date} (${apptInput.timeSlot}). Send confirmation reminder.`,
          },
        };
      })
    );

    addActivity(
      'Appointment Booked',
      `${apptInput.leadName} scheduled: ${apptInput.title} (${apptInput.date} at ${apptInput.timeSlot}).`,
      'appointment_booked',
      apptInput.leadId
    );

    return newAppt;
  };

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newTimeSlot: string
  ) => {
    if (!isSlotAvailable(newDate, newTimeSlot, id)) {
      throw new Error(`Slot ${newTimeSlot} on ${newDate} is already booked!`);
    }

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          date: newDate,
          timeSlot: newTimeSlot,
          status: 'rescheduled',
        };
      })
    );

    const appt = appointments.find((a) => a.id === id);
    if (appt) {
      addActivity(
        'Appointment Rescheduled',
        `${appt.leadName}'s appointment rescheduled to ${newDate} at ${newTimeSlot}.`,
        'appointment_booked',
        appt.leadId
      );
    }
  };

  const cancelAppointment = (id: string) => {
    const targetAppt = appointments.find((a) => a.id === id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );

    if (targetAppt) {
      setLeads((prev) =>
        prev.map((l) => {
          if (l.id !== targetAppt.leadId) return l;
          return {
            ...l,
            status: 'Qualified',
            appointmentId: undefined,
          };
        })
      );
      addActivity('Appointment Cancelled', `${targetAppt.leadName}'s appointment cancelled.`, 'status_changed', targetAppt.leadId);
    }
  };

  const completeFollowUp = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        return {
          ...l,
          nextFollowUpDate: undefined,
        };
      })
    );
    const target = leads.find((l) => l.id === leadId);
    addActivity('Follow-Up Completed', `Marked follow-up completed for ${target?.name || 'Lead'}.`, 'followup_done', leadId);
  };

  const scheduleNextFollowUp = (leadId: string, daysAhead: number) => {
    const nextDate = new Date(Date.now() + daysAhead * 86400000)
      .toISOString()
      .split('T')[0];

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        return {
          ...l,
          nextFollowUpDate: nextDate,
        };
      })
    );
    const target = leads.find((l) => l.id === leadId);
    addActivity('Follow-Up Scheduled', `Next follow-up for ${target?.name} set for ${nextDate}.`, 'status_changed', leadId);
  };

  const updateBusinessSettings = (updates: Partial<BusinessSettings>) => {
    setBusinessSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const switchIndustryPreset = (industryKey: string) => {
    const preset = INDUSTRY_PRESETS[industryKey];
    if (preset) {
      setBusinessSettings(preset);
      addActivity('Industry Preset Applied', `Loaded configurations for ${preset.businessName} (${industryKey}).`, 'status_changed');
    }
  };

  const resetDemoData = () => {
    setLeads(INITIAL_LEADS);
    setAppointments(INITIAL_APPOINTMENTS);
    setActivityHistory(INITIAL_ACTIVITIES);
    setBusinessSettings(INDUSTRY_PRESETS.real_estate);
    setSelectedLeadId(null);
    setIsDemoActive(false);
    setDemoCurrentStep(1);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  };

  // Guided demo controls
  const startGuidedDemo = () => {
    setIsDemoActive(true);
    setDemoCurrentStep(1);
    setActiveTab('guided_demo');
  };

  const advanceDemoStep = () => {
    setDemoCurrentStep((prev) => Math.min(prev + 1, 9));
  };

  const endGuidedDemo = () => {
    setIsDemoActive(false);
    setDemoCurrentStep(1);
  };

  return (
    <AppContext.Provider
      value={{
        leads,
        appointments,
        businessSettings,
        activityHistory,
        activeTab,
        setActiveTab,
        selectedLeadId,
        setSelectedLeadId,
        isDarkMode,
        toggleDarkMode,
        addLead,
        updateLead,
        deleteLead,
        changeLeadStatus,
        addLeadNote,
        addMessageToLead,
        approveAndSendDraft,
        discardDraft,
        simulateCustomerReplyForLead,
        qualifyLeadDirectly,
        bookAppointmentForLead,
        rescheduleAppointment,
        cancelAppointment,
        isSlotAvailable,
        completeFollowUp,
        scheduleNextFollowUp,
        updateBusinessSettings,
        switchIndustryPreset,
        resetDemoData,
        isDemoActive,
        demoCurrentStep,
        startGuidedDemo,
        advanceDemoStep,
        setDemoCurrentStep,
        endGuidedDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type IndustryType = 'real_estate' | 'home_services' | 'car_dealership' | 'salon_wellness';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Awaiting Reply'
  | 'Qualified'
  | 'Appointment Booked'
  | 'Not Interested'
  | 'Closed';

export type PreferredContactMethod = 'whatsapp' | 'sms' | 'email' | 'phone';

export type MessageChannel = 'whatsapp' | 'sms' | 'email';

export type CustomerScenario =
  | 'enthusiastic_booking'
  | 'budget_pricing'
  | 'timeline_location'
  | 'tentative_schedule'
  | 'opt_out';

export interface QualificationData {
  need: string;
  budget?: string;
  location?: string;
  timeframe?: string;
  answers: Record<string, string>;
  score: number; // 0 - 100
  summary: string;
  recommendedNextAction: string;
  isQualified: boolean;
}

export interface ConversationMessage {
  id: string;
  sender: 'ai' | 'customer' | 'agent' | 'system';
  content: string;
  timestamp: string;
  channel: MessageChannel;
  isDraft?: boolean;
  draftStatus?: 'pending_review' | 'sent_simulated' | 'discarded';
  aiRationale?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredContactMethod: PreferredContactMethod;
  industry: IndustryType;
  source: string;
  createdAt: string;
  status: LeadStatus;
  enquiryDetails: string;
  notes: string[];
  qualification: QualificationData;
  nextFollowUpDate?: string; // YYYY-MM-DD
  followUpCount: number;
  maxFollowUpsAllowed?: number;
  optedOut?: boolean;
  appointmentId?: string;
  messages: ConversationMessage[];
}

export type AppointmentType =
  | 'In-Person Consultation'
  | 'Property Viewing'
  | 'Home Inspection / Estimate'
  | 'Test Drive'
  | 'Service / Treatment Appointment'
  | 'Phone Discovery Call'
  | 'Virtual Video Tour';

export type AppointmentStatus = 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  leadContact: string;
  industry: IndustryType;
  title: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:00 AM - 10:45 AM"
  status: AppointmentStatus;
  notes?: string;
  locationOrPlatform?: string;
  createdAt: string;
}

export interface FollowUpItem {
  id: string;
  leadId: string;
  leadName: string;
  leadContact: string;
  industry: IndustryType;
  attemptNumber: number;
  maxAttempts: number;
  dueDate: string; // YYYY-MM-DD
  status: 'due_today' | 'overdue' | 'scheduled' | 'completed' | 'cancelled';
  suggestedDraft: string;
  channel: MessageChannel;
  lastMessageSnippet?: string;
}

export interface QualificationQuestionConfig {
  id: string;
  key: string;
  question: string;
  category: 'need' | 'budget' | 'location' | 'timeframe' | 'general';
  required: boolean;
}

export type AITone = 'professional' | 'friendly' | 'direct' | 'enthusiastic';

export interface BusinessSettings {
  businessName: string;
  industry: IndustryType;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  services: string[];
  aiTone: AITone;
  workingDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  businessHoursStart: string; // "09:00"
  businessHoursEnd: string; // "18:00"
  appointmentDurationMinutes: number; // 30, 45, 60
  bufferMinutes: number; // 15
  maxFollowUps: number; // 4
  followUpIntervalDays: number[]; // [1, 3, 5, 7]
  qualificationQuestions: QualificationQuestionConfig[];
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'lead_created' | 'status_changed' | 'message_sent' | 'appointment_booked' | 'qualified' | 'followup_done';
  leadId?: string;
}

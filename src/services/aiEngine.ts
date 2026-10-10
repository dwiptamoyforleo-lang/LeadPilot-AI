import {
  Lead,
  BusinessSettings,
  QualificationData,
  IndustryType,
  ConversationMessage,
  CustomerScenario,
} from '../types';

export interface ExtractedInfo {
  need: string;
  budget?: string;
  location?: string;
  timeframe?: string;
  score: number;
  summary: string;
  recommendedNextAction: string;
  isOptOut: boolean;
  isQualified: boolean;
}

// Helper to analyze conversation & enquiry text
export function extractLeadIntelligence(
  lead: Lead,
  settings: BusinessSettings
): ExtractedInfo {
  const fullText = [
    lead.enquiryDetails,
    ...lead.messages.map((m) => m.content),
  ].join(' ').toLowerCase();

  // Only customer-authored messages should trigger opt-out detection.
  // Searching all conversation text for "stop" caused false positives for
  // ordinary phrases such as "the technician stopped by".
  const customerMessages = [
    lead.enquiryDetails,
    ...lead.messages
      .filter((message) => message.sender === 'customer')
      .map((message) => message.content),
  ];

  const optOutPatterns = [
    /^\\s*(?:please\\s+)?(?:stop|unsubscribe|cancel|end)\\s*[.!]*\\s*$/i,
    /\\b(?:please\\s+)?stop\\s+(?:all\\s+)?(?:messages|texts|calls|contacting|messaging|texting|calling)\\b/i,
    /\\b(?:remove me|take me off)\\s+(?:your\\s+)?(?:list|database|contact list)\\b/i,
    /\\b(?:do not|don't)\\s+(?:contact|message|text|call)\\s+me\\b/i,
    /\\bno more (?:messages|texts|calls)\\b/i,
    /\\bnot interested\\b/i,
    /\\bwrong number\\b/i,
  ];

  const isOptOut = customerMessages.some((message) =>
    optOutPatterns.some((pattern) => pattern.test(message.trim()))
  );

  // Need extraction
  let need = 'General enquiry';
  if (lead.industry === 'real_estate') {
    if (fullText.includes('3 bhk') || fullText.includes('3 bedroom') || fullText.includes('3-bedroom')) need = '3-Bedroom Property';
    else if (fullText.includes('2 bhk') || fullText.includes('2 bedroom')) need = '2-Bedroom Apartment';
    else if (fullText.includes('villa') || fullText.includes('house')) need = 'Independent Villa / House';
    else if (fullText.includes('rent') || fullText.includes('lease')) need = 'Rental Accommodation';
    else if (fullText.includes('buy') || fullText.includes('purchase')) need = 'Property Purchase / Investment';
    else need = 'Residential Property Inquiry';
  } else if (lead.industry === 'home_services') {
    if (fullText.includes('hvac') || fullText.includes('air condition') || fullText.includes('ac not cooling')) need = 'HVAC / AC Repair & Maintenance';
    else if (fullText.includes('leak') || fullText.includes('pipe') || fullText.includes('plumb')) need = 'Emergency Plumbing Repair';
    else if (fullText.includes('roof')) need = 'Roof Inspection & Repair';
    else if (fullText.includes('electric') || fullText.includes('wiring')) need = 'Electrical Diagnostics';
    else need = 'Home Maintenance / Repair Estimate';
  } else if (lead.industry === 'car_dealership') {
    if (fullText.includes('suv') || fullText.includes('cr-v') || fullText.includes('rav4')) need = 'Compact / Mid-size SUV';
    else if (fullText.includes('sedan') || fullText.includes('civic') || fullText.includes('camry')) need = 'Sedan Inquiry';
    else if (fullText.includes('electric') || fullText.includes('ev') || fullText.includes('tesla')) need = 'Electric Vehicle (EV)';
    else if (fullText.includes('used') || fullText.includes('pre-owned')) need = 'Certified Pre-Owned Vehicle';
    else need = 'Vehicle Consultation & Test Drive';
  } else if (lead.industry === 'salon_wellness') {
    if (fullText.includes('hair') || fullText.includes('color') || fullText.includes('balayage')) need = 'Hair Styling & Color Service';
    else if (fullText.includes('facial') || fullText.includes('skin')) need = 'Rejuvenating Facial & Skin Care';
    else if (fullText.includes('massage') || fullText.includes('spa')) need = 'Therapeutic Massage & Spa Package';
    else if (fullText.includes('bridal') || fullText.includes('wedding')) need = 'Bridal Styling & Makeover Package';
    else need = 'Salon / Wellness Treatment';
  }

  // Budget extraction
  let budget: string | undefined = undefined;
  const budgetMatch = fullText.match(
    /(\$\s?\d+[\d,]*\s?[kKmM]?|\d+[\d,]*\s?(k|lakh|lac|cr|crore|usd|dollars))/i
  ) || fullText.match(/budget (?:is|around|of)?\s*[:$]?\s*([0-9k,]+)/i);
  if (budgetMatch) {
    budget = budgetMatch[0].trim();
  } else if (fullText.includes('under 500k') || fullText.includes('500,000')) {
    budget = '$450,000 - $500,000';
  } else if (fullText.includes('under 300') || fullText.includes('300k')) {
    budget = 'Under $300k';
  } else if (lead.qualification.budget) {
    budget = lead.qualification.budget;
  }

  // Location extraction
  let location: string | undefined = undefined;
  const locationKeywords = [
    'downtown', 'suburbs', 'north side', 'oak ridge', 'green valley',
    'maple street', 'metro area', 'west end', 'uptown', 'austin', 'seattle', 'chicago'
  ];
  for (const loc of locationKeywords) {
    if (fullText.includes(loc)) {
      location = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }
  if (!location && lead.qualification.location) {
    location = lead.qualification.location;
  }

  // Timeframe extraction
  let timeframe: string | undefined = undefined;
  if (fullText.includes('urgent') || fullText.includes('asap') || fullText.includes('today') || fullText.includes('immediately')) {
    timeframe = 'Immediately (High Priority)';
  } else if (fullText.includes('this weekend') || fullText.includes('saturday') || fullText.includes('sunday')) {
    timeframe = 'This Weekend';
  } else if (fullText.includes('this week') || fullText.includes('next couple days')) {
    timeframe = 'Within This Week';
  } else if (fullText.includes('next month') || fullText.includes('few weeks') || fullText.includes('flexible')) {
    timeframe = 'Next 2-4 Weeks';
  } else if (lead.qualification.timeframe) {
    timeframe = lead.qualification.timeframe;
  }

  // Scoring logic
  let score = 20; // Base score for having an inquiry
  if (lead.phone && lead.phone.length > 5) score += 15;
  if (lead.email && lead.email.includes('@')) score += 10;
  if (need && need !== 'General enquiry') score += 15;
  if (budget) score += 15;
  if (location) score += 10;
  if (timeframe) score += 15;
  if (lead.messages.filter((m) => m.sender === 'customer').length >= 1) score += 10;
  if (isOptOut) score = 0;
  score = Math.min(100, score);

  const isQualified = score >= 60 && !isOptOut;

  // Summary builder
  let summary = `${lead.name} inquired regarding ${need}.`;
  if (budget) summary += ` Mentioned budget: ${budget}.`;
  if (location) summary += ` Preferred location/area: ${location}.`;
  if (timeframe) summary += ` Desired timeline: ${timeframe}.`;

  // Next action recommendation
  let recommendedNextAction = 'Send personalized initial welcome & qualifying response.';
  if (isOptOut) {
    recommendedNextAction = 'Lead opted out. Do not send further follow-ups. Mark status as Not Interested.';
  } else if (lead.status === 'Appointment Booked') {
    recommendedNextAction = 'Appointment confirmed. Prepare intake brief and send courtesy reminder 24h prior.';
  } else if (isQualified) {
    recommendedNextAction = `High-intent lead (Score ${score}%). Offer available appointment slots for a ${
      lead.industry === 'car_dealership'
        ? 'test drive'
        : lead.industry === 'real_estate'
        ? 'guided viewing'
        : lead.industry === 'home_services'
        ? 'technician inspection'
        : 'consultation session'
    }.`;
  } else if (lead.messages.filter((m) => m.sender === 'ai' || m.sender === 'agent').length > 0) {
    recommendedNextAction = 'Awaiting customer response. Next scheduled follow-up draft is queued.';
  }

  return {
    need,
    budget,
    location,
    timeframe,
    score,
    summary,
    recommendedNextAction,
    isOptOut,
    isQualified,
  };
}

// Generate Personalized Initial Response Draft
export function generateFirstResponseDraft(
  lead: Lead,
  settings: BusinessSettings
): { draft: string; rationale: string } {
  const intel = extractLeadIntelligence(lead, settings);
  const firstName = lead.name.split(' ')[0] || 'there';
  const bizName = settings.businessName || 'LeadPilot';

  let greeting = `Hi ${firstName},`;
  if (settings.aiTone === 'friendly') {
    greeting = `Hello ${firstName}! Thanks so much for reaching out to ${bizName} 😊`;
  } else if (settings.aiTone === 'enthusiastic') {
    greeting = `Hi ${firstName}! Great to connect with you at ${bizName}! 🚀`;
  } else if (settings.aiTone === 'direct') {
    greeting = `Hi ${firstName}, thanks for contacting ${bizName}.`;
  }

  let body = '';
  let qualifyingQuestions = '';

  switch (lead.industry) {
    case 'real_estate':
      body = `I saw your inquiry about properties in the area. We have several promising listings that match prospective buyers looking for ${intel.need.toLowerCase()}.`;
      qualifyingQuestions = `To help match you with the best options:
1. Are you looking to move within the next 30-60 days or exploring for later?
2. Do you have a specific target price range or neighborhood preference?
3. Would you be open to a quick 15-minute viewing or introductory call this week?`;
      break;

    case 'home_services':
      body = `I received your request regarding ${intel.need.toLowerCase()}. We understand how important fast, reliable service is for your home.`;
      qualifyingQuestions = `To help our service team provide an accurate estimate:
1. Is this an urgent issue needing same-day attention, or scheduled service?
2. What is your approximate neighborhood/zip code?
3. When is the best time for our licensed technician to inspect?`;
      break;

    case 'car_dealership':
      body = `Thank you for checking in regarding our ${intel.need.toLowerCase()} inventory! We have current promotional incentives and flexible financing options available.`;
      qualifyingQuestions = `Quick questions to tailor the best options:
1. Are you looking to purchase new or certified pre-owned?
2. Do you have a current vehicle you'd like an estimated trade-in value for?
3. Would you like to reserve a 30-minute priority test drive this Friday or Saturday?`;
      break;

    case 'salon_wellness':
      body = `We're thrilled you reached out about our ${intel.need.toLowerCase()}! Our team specializes in personalized care tailored to your exact style and schedule.`;
      qualifyingQuestions = `To get you booked in:
1. Do you have a specific stylist or preference in mind?
2. What days or times work best for you (e.g., weekday morning or weekend)?`;
      break;

    default:
      body = `Thank you for your enquiry. We would love to assist you with ${intel.need.toLowerCase()}.`;
      qualifyingQuestions = `Could you let us know your preferred timeline and what specific goals you are looking to achieve?`;
      break;
  }

  const signoff =
    settings.aiTone === 'friendly'
      ? `Warmly,\n${bizName} Lead Concierge`
      : `Best regards,\n${bizName} Team`;

  const draft = `${greeting}\n\n${body}\n\n${qualifyingQuestions}\n\n${signoff}`;
  const rationale = `Draft crafted using '${settings.aiTone}' tone for ${lead.industry} industry. Identified need: ${intel.need}. Asks essential qualification questions while guiding the lead toward a conversation or appointment.`;

  return { draft, rationale };
}

// Generate Follow-Up Message Drafts (Polite, Non-Aggressive, Cadence Aware)
export function generateFollowUpDraft(
  lead: Lead,
  settings: BusinessSettings,
  attemptNumber: number
): { draft: string; rationale: string; isFinal: boolean } {
  const firstName = lead.name.split(' ')[0] || 'there';
  const bizName = settings.businessName || 'LeadPilot';
  const intel = extractLeadIntelligence(lead, settings);

  if (intel.isOptOut) {
    return {
      draft: `Lead has opted out. No further follow-up allowed.`,
      rationale: `Opt-out keywords detected. Automatic cessation of communication.`,
      isFinal: true,
    };
  }

  let draft = '';
  let rationale = '';
  let isFinal = false;

  if (attemptNumber === 1) {
    // Follow-up 1: Gentle reminder
    draft = `Hi ${firstName}, just checking in to see if you had a chance to review my previous message regarding your inquiry for ${intel.need.toLowerCase()} at ${bizName}.\n\nWe have a couple open slots later this week if you would like a quick consultation. Feel free to reply whenever you have a moment!`;
    rationale = `First gentle follow-up (Day 1-2). Re-states context softly without pressure.`;
  } else if (attemptNumber === 2) {
    // Follow-up 2: Value add & flexibility
    draft = `Hello ${firstName}, wanted to touch base once more. We know schedules can get hectic! If it's easier, you can also let me know what day works best for a brief 10-minute chat or estimate for ${intel.need.toLowerCase()}.\n\nHappy to work around your availability!`;
    rationale = `Second follow-up (Day 3-4). Highlights flexibility and short time commitment.`;
  } else if (attemptNumber === 3) {
    // Follow-up 3: Direct question / Slot offer
    draft = `Hi ${firstName}, I wanted to make sure you got the info you needed. Are you still actively looking into ${intel.need.toLowerCase()}? If your timeline has changed or you've already found another solution, no problem at all—just let me know!`;
    rationale = `Third follow-up (Day 5-7). Provides an easy 'off-ramp' to gauge genuine intent.`;
  } else {
    // Final follow-up: Respectful close-out
    isFinal = true;
    draft = `Hi ${firstName}, I don't want to clutter your inbox, so this will be my final note. If you ever need help with ${intel.need.toLowerCase()} down the road, please don't hesitate to reach back out to us at ${bizName}.\n\nWishing you all the best!`;
    rationale = `Final close-out follow-up (Max limit reached). Respectfully closes communication loop to maintain goodwill.`;
  }

  return { draft, rationale, isFinal };
}

// Generate Realistic Customer Reply Simulation for Testing & Demo
export type { CustomerScenario };

export function simulateCustomerResponse(
  lead: Lead,
  scenario: CustomerScenario
): string {
  const firstName = lead.name.split(' ')[0] || 'there';

  switch (scenario) {
    case 'enthusiastic_booking':
      if (lead.industry === 'real_estate') {
        return `Hi! Yes, I would love to schedule a viewing. Saturday afternoon around 2:00 PM or 3:00 PM would work best for me and my spouse. Does that time work?`;
      } else if (lead.industry === 'home_services') {
        return `Thanks for following up! Saturday morning would be perfect for the technician to come inspect the issue. We're home between 9 AM and 12 PM.`;
      } else if (lead.industry === 'car_dealership') {
        return `Sounds great! I'd love to take it for a test drive this Friday around 11:30 AM if the vehicle is available on the lot.`;
      } else {
        return `That sounds wonderful! I'm free on Friday at 2:00 PM for the appointment. Please reserve that for me!`;
      }

    case 'budget_pricing':
      if (lead.industry === 'real_estate') {
        return `Our target budget is between $450,000 and $550,000. We have pre-approval in place and are looking primarily around the Westside or Maple Street area.`;
      } else if (lead.industry === 'home_services') {
        return `What is your typical estimate range for this type of repair? We're hoping to keep it under $500 if possible.`;
      } else if (lead.industry === 'car_dealership') {
        return `I'm looking for a monthly payment under $450/month with about $3,000 down. Do you have vehicles currently on incentive?`;
      } else {
        return `Could you give me an estimate on pricing for the full package? Looking to stay under $150.`;
      }

    case 'timeline_location':
      return `We are currently located in the North Suburbs and are planning to finalize our decision within the next 2 weeks. Can you send over available options?`;

    case 'tentative_schedule':
      return `My schedule is pretty packed during the week, but Thursday after 4:30 PM or anytime Saturday morning works well. What slots are open?`;

    case 'opt_out':
      return `Thanks, but we have decided to go in another direction / already resolved this. Please remove me from your list. Stop.`;
  }
}

// Available Slot Generator based on business settings and existing appointments
/**
 * Parse a generated appointment label (for example, "9:00 AM - 9:45 AM")
 * into minutes after midnight. Return null for legacy or unknown formats.
 */
function parseTimeSlot(slot: string): { start: number; end: number } | null {
  const match = slot.match(/^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i);
  if (!match) return null;

  const toMinutes = (hourText: string, minuteText: string, periodText: string) => {
    const hour = Number(hourText);
    const minute = Number(minuteText);
    const period = periodText.toUpperCase();

    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
    return ((hour % 12) + (period === 'PM' ? 12 : 0)) * 60 + minute;
  };

  const start = toMinutes(match[1], match[2], match[3]);
  const end = toMinutes(match[4], match[5], match[6]);
  if (start === null || end === null || end <= start) return null;
  return { start, end };
}

/**
 * Returns true when two appointment ranges overlap, including the configured
 * buffer around existing appointments. Unknown legacy labels conflict only
 * when their text exactly matches, which is safer than assuming they are free.
 */
export function timeSlotsConflict(
  slotA: string,
  slotB: string,
  bufferMinutes = 0
): boolean {
  const a = parseTimeSlot(slotA);
  const b = parseTimeSlot(slotB);
  if (!a || !b) return slotA === slotB;

  const buffer = Number.isFinite(bufferMinutes) ? Math.max(0, bufferMinutes) : 0;
  return a.start < b.end + buffer && a.end > b.start - buffer;
}

export function getAvailableSlots(
  dateStr: string, // YYYY-MM-DD
  settings: BusinessSettings,
  existingAppointments: { date: string; timeSlot: string; status: string }[]
): { slot: string; isAvailable: boolean }[] {
  // Parse working hours e.g. "09:00" to "18:00"
  const [startHour, startMin] = settings.businessHoursStart.split(':').map(Number);
  const [endHour, endMin] = settings.businessHoursEnd.split(':').map(Number);
  const duration = settings.appointmentDurationMinutes || 45;

  const activeAppointmentsOnDate = existingAppointments.filter(
    (a) => a.date === dateStr && a.status !== 'cancelled'
  );

  const slots: { slot: string; isAvailable: boolean }[] = [];
  let currentTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  while (currentTotalMinutes + duration <= endTotalMinutes) {
    const sH = Math.floor(currentTotalMinutes / 60);
    const sM = currentTotalMinutes % 60;
    const eH = Math.floor((currentTotalMinutes + duration) / 60);
    const eM = (currentTotalMinutes + duration) % 60;

    const formatTime = (h: number, m: number) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m.toString().padStart(2, '0');
      return `${displayH}:${displayM} ${period}`;
    };

    const slotLabel = `${formatTime(sH, sM)} - ${formatTime(eH, eM)}`;
    const isAvailable = !activeAppointmentsOnDate.some((appointment) =>
      timeSlotsConflict(slotLabel, appointment.timeSlot, settings.bufferMinutes)
    );

    slots.push({
      slot: slotLabel,
      isAvailable,
    });

    currentTotalMinutes += duration + settings.bufferMinutes;
  }

  return slots;
}

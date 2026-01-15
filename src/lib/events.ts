import { Variant, Persona, Goal, App } from './types';

interface BaseEvent {
  event_id: string;
  timestamp: string;
  user_id: string;
  session_id: string;
  variant: Variant;
}

export type EventType =
  | 'signup_completed'
  | 'survey_started'
  | 'survey_completed'
  | 'primary_app_assigned'
  | 'onboarding_viewed'
  | 'checklist_item_clicked'
  | 'first_win_started'
  | 'first_win_completed'
  | 'cross_activation_prompt_shown'
  | 'cross_activation_clicked'
  | 'second_app_activated'
  | 'return_session'
  | 'core_action'
  | 'help_requested'
  | 'error_occurred'
  | 'escape_hatch_clicked';

interface SignupCompletedPayload {
  entry_point: string;
  utm_source?: string;
  utm_campaign?: string;
}

interface SurveyCompletedPayload {
  persona: Persona;
  goal: Goal;
  skipped_questions: number;
}

interface PrimaryAppAssignedPayload {
  primary_app: App;
  assignment_reason: string;
}

interface OnboardingViewedPayload {
  screen: 'recs' | 'start' | 'bundle' | 'first_win';
}

interface ChecklistItemClickedPayload {
  item_id: string;
  item_category: 'product' | 'content' | 'community' | 'expansion';
}

interface FirstWinPayload {
  app: App;
}

interface FirstWinCompletedPayload {
  app: App;
  time_to_value_seconds: number;
  task_type: string;
}

interface CrossActivationPayload {
  from_app: App;
  to_app: App;
  trigger_type?: 'content_match' | 'task_complete' | 'time_based';
}

interface ReturnSessionPayload {
  day_offset: number;
  apps_used: App[];
}

interface CoreActionPayload {
  app: App;
  action_type: string;
}

interface ErrorPayload {
  screen: string;
  error_code?: string;
  error_message?: string;
  help_type?: 'tooltip' | 'faq' | 'support';
}

interface EscapeHatchPayload {
  from_app: App;
  to_app: App;
  trigger_screen: 'start' | 'app';
}

export type Event = BaseEvent & (
  | { event: 'signup_completed'; payload: SignupCompletedPayload }
  | { event: 'survey_started'; payload: Record<string, never> }
  | { event: 'survey_completed'; payload: SurveyCompletedPayload }
  | { event: 'primary_app_assigned'; payload: PrimaryAppAssignedPayload }
  | { event: 'onboarding_viewed'; payload: OnboardingViewedPayload }
  | { event: 'checklist_item_clicked'; payload: ChecklistItemClickedPayload }
  | { event: 'first_win_started'; payload: FirstWinPayload }
  | { event: 'first_win_completed'; payload: FirstWinCompletedPayload }
  | { event: 'cross_activation_prompt_shown'; payload: CrossActivationPayload }
  | { event: 'cross_activation_clicked'; payload: CrossActivationPayload }
  | { event: 'second_app_activated'; payload: { app: App; days_since_first_win: number } }
  | { event: 'return_session'; payload: ReturnSessionPayload }
  | { event: 'core_action'; payload: CoreActionPayload }
  | { event: 'help_requested'; payload: ErrorPayload }
  | { event: 'error_occurred'; payload: ErrorPayload }
  | { event: 'escape_hatch_clicked'; payload: EscapeHatchPayload }
);

const EVENTS_KEY = 'every_demo_events';

function generateEventId(): string {
  return 'evt_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function getAllEvents(): Event[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(EVENTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function trackEvent(
  eventType: EventType,
  userId: string,
  sessionId: string,
  variant: Variant,
  payload: Record<string, unknown> = {}
): Event {
  const event: Event = {
    event_id: generateEventId(),
    timestamp: new Date().toISOString(),
    user_id: userId,
    session_id: sessionId,
    variant,
    event: eventType,
    payload,
  } as Event;

  if (typeof window !== 'undefined') {
    const events = getAllEvents();
    events.push(event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }

  console.log('Event tracked:', event);
  return event;
}

export function clearAllEvents(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(EVENTS_KEY);
  }
}

export const clearEvents = clearAllEvents;

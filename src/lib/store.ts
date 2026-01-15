import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Persona, Goal, App, Variant, TaskArtifacts, CROSS_PROMPT_CONFIGS } from './types';
import { generateUserId, generateSessionId, getVariant, persistVariant } from './assignment';
import { getPrimaryApp, getAssignmentReason } from './primary-app';
import { trackEvent } from './events';

interface AppState {
  // User state
  user: User | null;
  sessionId: string;

  // Survey state
  surveyStep: number;
  selectedPersona: Persona | null;
  selectedGoal: Goal | null;

  // App state
  primaryApp: App | null;
  completedItems: string[];
  firstWinStartedAt: string | null;
  firstWinCompletedAt: string | null;
  firstWinApp: App | null;
  firstWinArtifacts: TaskArtifacts | null;
  crossActivationShown: boolean;

  // Actions
  initUser: (email: string, forcedVariant?: Variant) => void;
  setPersona: (persona: Persona) => void;
  setGoal: (goal: Goal) => void;
  completeSurvey: () => void;
  startFirstWin: (app: App) => void;
  completeFirstWin: (app: App, taskType: string, artifacts?: TaskArtifacts) => void;
  markItemCompleted: (itemId: string) => void;
  toggleChecklistItem: (itemId: string) => void;
  showCrossActivation: () => void;
  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      sessionId: generateSessionId(),
      surveyStep: 1,
      selectedPersona: null,
      selectedGoal: null,
      primaryApp: null,
      completedItems: [],
      firstWinStartedAt: null,
      firstWinCompletedAt: null,
      firstWinApp: null,
      firstWinArtifacts: null,
      crossActivationShown: false,

      initUser: (email: string, forcedVariant?: Variant) => {
        const userId = generateUserId();
        const variant = forcedVariant ?? getVariant(userId);
        persistVariant(userId, variant);

        const user: User = {
          id: userId,
          email,
          variant,
          createdAt: new Date().toISOString(),
        };

        set({ user });

        trackEvent('signup_completed', userId, get().sessionId, variant, {
          entry_point: 'signup_page',
        });
      },

      setPersona: (persona: Persona) => {
        set({ selectedPersona: persona, surveyStep: 2 });
        const { user, sessionId } = get();
        if (user) {
          trackEvent('survey_started', user.id, sessionId, user.variant, {});
        }
      },

      setGoal: (goal: Goal) => {
        set({ selectedGoal: goal });
      },

      completeSurvey: () => {
        const { user, sessionId, selectedPersona, selectedGoal } = get();
        if (!user || !selectedPersona || !selectedGoal) return;

        const primaryApp = getPrimaryApp(selectedPersona, selectedGoal);
        const updatedUser: User = {
          ...user,
          persona: selectedPersona,
          goal: selectedGoal,
          primaryApp,
        };

        set({ user: updatedUser, primaryApp });

        trackEvent('survey_completed', user.id, sessionId, user.variant, {
          persona: selectedPersona,
          goal: selectedGoal,
          skipped_questions: 0,
        });

        if (user.variant === 'treatment') {
          trackEvent('primary_app_assigned', user.id, sessionId, user.variant, {
            primary_app: primaryApp,
            assignment_reason: getAssignmentReason(selectedPersona, selectedGoal),
          });
        }
      },

      startFirstWin: (app: App) => {
        const { user, sessionId } = get();
        if (!user) return;

        set({ firstWinStartedAt: new Date().toISOString() });
        trackEvent('first_win_started', user.id, sessionId, user.variant, { app });
      },

      completeFirstWin: (app: App, taskType: string, artifacts?: TaskArtifacts) => {
        const { user, sessionId, firstWinStartedAt, completedItems } = get();
        if (!user || !firstWinStartedAt) return;

        const completedAt = new Date().toISOString();
        const startTime = new Date(firstWinStartedAt).getTime();
        const endTime = new Date(completedAt).getTime();
        const timeToValue = Math.round((endTime - startTime) / 1000);

        const newCompletedItems = completedItems.includes(app)
          ? completedItems
          : [...completedItems, app];

        set({
          firstWinCompletedAt: completedAt,
          firstWinApp: app,
          firstWinArtifacts: artifacts || null,
          completedItems: newCompletedItems,
        });

        trackEvent('first_win_completed', user.id, sessionId, user.variant, {
          app,
          time_to_value_seconds: timeToValue,
          task_type: taskType,
          ...artifacts,
        });
      },

      markItemCompleted: (itemId: string) => {
        const { user, sessionId, completedItems } = get();
        if (!user) return;

        if (!completedItems.includes(itemId)) {
          set({ completedItems: [...completedItems, itemId] });
          trackEvent('checklist_item_clicked', user.id, sessionId, user.variant, {
            item_id: itemId,
            item_category: 'product',
          });
        }
      },

      toggleChecklistItem: (itemId: string) => {
        const { completedItems } = get();
        if (completedItems.includes(itemId)) {
          set({ completedItems: completedItems.filter((id) => id !== itemId) });
        } else {
          set({ completedItems: [...completedItems, itemId] });
        }
      },

      showCrossActivation: () => {
        const { user, sessionId, primaryApp, crossActivationShown } = get();
        if (!user || !primaryApp || crossActivationShown) return;

        set({ crossActivationShown: true });

        const config = CROSS_PROMPT_CONFIGS.find((c) => c.fromApp === primaryApp);
        if (config) {
          trackEvent('cross_activation_prompt_shown', user.id, sessionId, user.variant, {
            from_app: primaryApp,
            to_app: config.toApp,
            trigger_type: 'task_complete',
          });
        }
      },

      reset: () => {
        set({
          user: null,
          sessionId: generateSessionId(),
          surveyStep: 1,
          selectedPersona: null,
          selectedGoal: null,
          primaryApp: null,
          completedItems: [],
          firstWinStartedAt: null,
          firstWinCompletedAt: null,
          firstWinApp: null,
          firstWinArtifacts: null,
          crossActivationShown: false,
        });
      },
    }),
    {
      name: 'every-demo-storage',
      partialize: (state) => ({
        user: state.user,
        selectedPersona: state.selectedPersona,
        selectedGoal: state.selectedGoal,
        primaryApp: state.primaryApp,
        completedItems: state.completedItems,
        firstWinCompletedAt: state.firstWinCompletedAt,
        firstWinApp: state.firstWinApp,
        firstWinArtifacts: state.firstWinArtifacts,
      }),
    }
  )
);

type OnboardingData = {
  primaryGoal: string[];
  trafficSource?: string;
  referralCode?: string;
  childName: string;
  childAge: string;
  gender: 'boy' | 'girl' | '';
  vocabularyPreference?: 'behind' | 'average' | 'advanced';
  parentingStyle: string;
  childPersonality: string[];
  dailyRoutine: string;
  readingTime: string;
  storyLength: string;
  storyThemes: string[];
  previousAttempts: string;
  parentChallenges: string[];
  struggleBehavior: string;
  aggressionTarget?: string;
  aggressionFrequency?: string;
  triggerSituations: string[];
  struggleAreas: string[];
  struggleFrequency: string;
  moralSharing: string;
  moralHonesty: string;
  moralPatience: string;
  moralKindness: string;
  parentReaction: string;
  email?: string;
  mascotName?: string;
  mascotJobId?: string;
  generatedMascotId?: string;
  generatedMascotUrl?: string;
};

type OnboardingStep = {
  path: string;
  isComplete: (data: OnboardingData) => boolean;
};

const hasValue = (val: unknown): boolean => {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return true;
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  { path: '/(onboarding)/quiz/goals', isComplete: (d) => hasValue(d.primaryGoal) },
  { path: '/(onboarding)/quiz/traffic-source', isComplete: (d) => hasValue(d.trafficSource) },
  { path: '/(onboarding)/quiz/child-name', isComplete: (d) => hasValue(d.childName) },
  { path: '/(onboarding)/quiz/child-age', isComplete: (d) => hasValue(d.childAge) },
  { path: '/(onboarding)/quiz/child-gender', isComplete: (d) => hasValue(d.gender) },
  { path: '/(onboarding)/quiz/vocabulary-level', isComplete: (d) => hasValue(d.vocabularyPreference) },
  { path: '/(onboarding)/quiz/parenting-style', isComplete: (d) => hasValue(d.parentingStyle) },
  { path: '/(onboarding)/quiz/child-personality', isComplete: (d) => hasValue(d.childPersonality) },
  { path: '/(onboarding)/quiz/daily-routine', isComplete: (d) => hasValue(d.dailyRoutine) },
  { path: '/(onboarding)/quiz/reading-time', isComplete: (d) => hasValue(d.readingTime) },
  { path: '/(onboarding)/quiz/story-length', isComplete: (d) => hasValue(d.storyLength) },
  { path: '/(onboarding)/quiz/story-themes', isComplete: (d) => hasValue(d.storyThemes) },
  { path: '/(onboarding)/quiz/previous-attempts', isComplete: (d) => hasValue(d.previousAttempts) },
  { path: '/(onboarding)/quiz/parent-challenges', isComplete: (d) => hasValue(d.parentChallenges) },
  { path: '/(onboarding)/quiz/diagnosis', isComplete: (d) => hasValue(d.struggleBehavior) },
  { path: '/(onboarding)/quiz/trigger-situations', isComplete: (d) => hasValue(d.triggerSituations) },
  { path: '/(onboarding)/quiz/struggle-areas', isComplete: (d) => hasValue(d.struggleAreas) },
  { path: '/(onboarding)/quiz/struggle-frequency', isComplete: (d) => hasValue(d.struggleFrequency) },
  { path: '/(onboarding)/quiz/moral-sharing', isComplete: (d) => hasValue(d.moralSharing) },
  { path: '/(onboarding)/quiz/moral-honesty', isComplete: (d) => hasValue(d.moralHonesty) },
  { path: '/(onboarding)/quiz/moral-patience', isComplete: (d) => hasValue(d.moralPatience) },
  { path: '/(onboarding)/quiz/moral-kindness', isComplete: (d) => hasValue(d.moralKindness) },
  { path: '/(onboarding)/quiz/parent-guilt', isComplete: (d) => hasValue(d.parentReaction) },
  { path: '/(onboarding)/auth/email', isComplete: (d) => hasValue(d.email) },
  { path: '/(onboarding)/child/mascot-name', isComplete: (d) => hasValue(d.mascotName) },
  { 
    path: '/(onboarding)/child/avatar', 
    isComplete: (d) => hasValue(d.mascotJobId) || hasValue(d.generatedMascotId),
  },
  { 
    path: '/(onboarding)/child/magic-moment', 
    isComplete: (d) => hasValue(d.generatedMascotId),
  },
];

const SPLASH_PATH = '/(onboarding)/splash';

export function getResumeStep(data: Partial<OnboardingData>): string {
  for (const step of ONBOARDING_STEPS) {
    if (!step.isComplete(data as OnboardingData)) {
      return step.path;
    }
  }
  return SPLASH_PATH;
}

export function hasOnboardingProgress(data: Partial<OnboardingData>): boolean {
  return ONBOARDING_STEPS.some((step) => step.isComplete(data as OnboardingData));
}

export function getOnboardingProgress(data: Partial<OnboardingData>): number {
  const completedSteps = ONBOARDING_STEPS.filter((step) =>
    step.isComplete(data as OnboardingData)
  ).length;
  return completedSteps / ONBOARDING_STEPS.length;
}

export { ONBOARDING_STEPS, SPLASH_PATH };
export type { OnboardingStep, OnboardingData as OnboardingFlowData };

import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../contexts/OnboardingContext';
import {
  getResumeStep,
  hasOnboardingProgress,
  getOnboardingProgress,
  SPLASH_PATH,
} from '../lib/onboardingFlow';

export function useOnboardingNavigation() {
  const router = useRouter();
  const { data, isLoaded } = useOnboarding();

  const resumeStep = isLoaded ? getResumeStep(data) : null;
  const hasProgress = isLoaded ? hasOnboardingProgress(data) : false;
  const progress = isLoaded ? getOnboardingProgress(data) : 0;

  const navigateToResume = useCallback(() => {
    if (!isLoaded) return;

    const targetPath = hasOnboardingProgress(data) ? getResumeStep(data) : SPLASH_PATH;
    router.replace(targetPath as typeof SPLASH_PATH);
  }, [isLoaded, data, router]);

  return {
    resumeStep,
    hasProgress,
    progress,
    isLoaded,
    navigateToResume,
  };
}

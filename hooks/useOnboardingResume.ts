import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { useOnboarding } from '../contexts/OnboardingContext';

export function useOnboardingResume() {
  const pathname = usePathname();
  const { setResumePath, data } = useOnboarding();

  useEffect(() => {
    if (pathname && pathname.startsWith('/(onboarding)')) {
      setResumePath(pathname);
    }
  }, [pathname, setResumePath]);

  return { currentPath: pathname, savedResumePath: data.resumePath };
}

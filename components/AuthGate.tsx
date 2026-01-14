import React, { useEffect, useRef, ReactNode, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useConvexAuth, useQuery, useMutation } from 'convex/react';
import * as SplashScreen from 'expo-splash-screen';
import { api } from '../convex/_generated/api';
import {
  CachedOnboardingStatus,
  checkIsReinstall,
  clearAuthOptimisticCache,
  clearPersistedOnboardingData,
  loadAuthSeen,
  loadCachedOnboardingStatus,
  markAppHasRun,
  markAuthSeen,
  saveCachedOnboardingStatus,
} from '../lib/onboardingStorage';
import { clearAllDataCaches } from '../lib/queryCache';
import { useAuthActions } from '@convex-dev/auth/react';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [cachedStatus, setCachedStatus] = useState<CachedOnboardingStatus | null>(null);
  const [authSeen, setAuthSeen] = useState(false);
  const [bootstrapLoaded, setBootstrapLoaded] = useState(false);
  const [reinstallChecked, setReinstallChecked] = useState(false);
  const didInitialRedirect = useRef(false);
  const didAuthRedirect = useRef(false);
  const didConvertTeaser = useRef(false);
  const isConvertingTeaser = useRef(false);
  const didClearOnboarding = useRef(false);
  const didHideSplash = useRef(false);
  const previousAuthenticated = useRef<boolean | null>(null);
  
  const onboardingStatus = useQuery(
    api.onboarding.getOnboardingStatus,
    isAuthenticated ? {} : "skip"
  );
  
  const convertTeaserToBook = useMutation(api.storyGeneration.convertTeaserToBook);

  useEffect(() => {
    let isMounted = true;

    Promise.all([loadCachedOnboardingStatus(), loadAuthSeen(), checkIsReinstall()])
      .then(([cached, seen, isReinstall]) => {
        if (!isMounted) {
          return;
        }
        setCachedStatus(cached);
        setAuthSeen(seen);
        
        if (isReinstall) {
          markAppHasRun().catch(() => {});
        }
      })
      .finally(() => {
        if (isMounted) {
          setBootstrapLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (reinstallChecked || authLoading || !bootstrapLoaded) {
      return;
    }

    const handleReinstallCheck = async () => {
      const isReinstall = await checkIsReinstall();
      
      if (isReinstall && isAuthenticated) {
        await Promise.all([
          clearAllDataCaches(),
          clearAuthOptimisticCache(),
        ]);
        await signOut();
      }
      
      await markAppHasRun();
      setReinstallChecked(true);
    };

    handleReinstallCheck().catch(() => {
      setReinstallChecked(true);
    });
  }, [authLoading, bootstrapLoaded, isAuthenticated, reinstallChecked, signOut]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    markAuthSeen().catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (previousAuthenticated.current === true && !isAuthenticated) {
      clearAllDataCaches().catch(() => {});
      clearAuthOptimisticCache().catch(() => {});
    }

    previousAuthenticated.current = isAuthenticated;
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || onboardingStatus === undefined) {
      return;
    }

    const statusToCache: CachedOnboardingStatus = onboardingStatus
      ? {
          hasOnboardingData: onboardingStatus.hasOnboardingData,
          hasMascotName: onboardingStatus.hasMascotName,
          hasMascotImage: onboardingStatus.hasMascotImage,
          isComplete: onboardingStatus.isComplete,
          updatedAt: Date.now(),
        }
      : {
          hasOnboardingData: false,
          hasMascotName: false,
          hasMascotImage: false,
          isComplete: false,
          updatedAt: Date.now(),
        };

    setCachedStatus(statusToCache);
    saveCachedOnboardingStatus(statusToCache).catch(() => {});
  }, [isAuthenticated, onboardingStatus]);

  useEffect(() => {
    didInitialRedirect.current = false;
    didAuthRedirect.current = false;
  }, [isAuthenticated]);

  const isReady = !authLoading && bootstrapLoaded && reinstallChecked && navigationState?.key;

  useEffect(() => {
    if (!isReady || didHideSplash.current) {
      return;
    }

    didHideSplash.current = true;
    SplashScreen.hideAsync().catch(() => {});
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === '(onboarding)';
    const inTabs = segments[0] === '(tabs)';
    const isAtRoot = segments.length <= 1 || (segments[0] === '(onboarding)' && segments[1] === undefined);

    if (!isAuthenticated) {
      if (isAtRoot && !didInitialRedirect.current) {
        didInitialRedirect.current = true;
        router.replace('/(onboarding)');
      }
      return;
    }

    if (onboardingStatus === undefined) {
      if (isAtRoot && !didInitialRedirect.current) {
        const target = cachedStatus
          ? !cachedStatus.hasOnboardingData
            ? '/(onboarding)/intro/slide-0'
            : !cachedStatus.isComplete
              ? !cachedStatus.hasMascotName
                ? '/(onboarding)/child/mascot-name'
                : '/(onboarding)/child/avatar'
              : '/(tabs)'
          : !authSeen
            ? '/(onboarding)/intro/slide-0'
            : '/(tabs)';
        const alreadyOnTarget = target === '/(tabs)' && inTabs;

        if (!alreadyOnTarget) {
          didInitialRedirect.current = true;
          router.replace(
            target as
              | '/(tabs)'
              | '/(onboarding)/intro/slide-0'
              | '/(onboarding)/child/mascot-name'
              | '/(onboarding)/child/avatar'
          );
        }
      }
      return;
    }

    if (!didAuthRedirect.current) {
      const needsOnboarding = !onboardingStatus || !onboardingStatus.hasOnboardingData;
      const target =
        needsOnboarding
          ? '/(onboarding)/intro/slide-0'
          : !onboardingStatus.isComplete
            ? !onboardingStatus.hasMascotName
              ? '/(onboarding)/child/mascot-name'
              : '/(onboarding)/child/avatar'
            : '/(tabs)';

      if (target === '/(tabs)') {
        if (inOnboarding) {
          didAuthRedirect.current = true;
          router.replace('/(tabs)');
        }
      } else {
        const isOnTarget =
          (target === '/(onboarding)/intro/slide-0' &&
            inOnboarding &&
            segments[1] === 'intro' &&
            segments[2] === 'slide-0') ||
          (target === '/(onboarding)/child/mascot-name' &&
            inOnboarding &&
            segments[1] === 'child' &&
            segments[2] === 'mascot-name') ||
          (target === '/(onboarding)/child/avatar' &&
            inOnboarding &&
            segments[1] === 'child' &&
            segments[2] === 'avatar');

        if (!isOnTarget) {
          didAuthRedirect.current = true;
          router.replace(
            target as
              | '/(onboarding)/intro/slide-0'
              | '/(onboarding)/child/mascot-name'
              | '/(onboarding)/child/avatar'
          );
          return;
        }

        didAuthRedirect.current = true;
      }
    }

    if (onboardingStatus?.isComplete && !didClearOnboarding.current) {
      didClearOnboarding.current = true;
      clearPersistedOnboardingData().catch(() => {});
    }

    if (onboardingStatus?.isComplete && !didConvertTeaser.current && !isConvertingTeaser.current) {
      isConvertingTeaser.current = true;
      convertTeaserToBook()
        .then((result) => {
          if (result?.success) {
            didConvertTeaser.current = true;
          }
        })
        .catch((err) => {
          console.warn('Failed to convert teaser to book:', err);
        })
        .finally(() => {
          isConvertingTeaser.current = false;
        });
    }

  }, [
    isReady,
    isAuthenticated,
    onboardingStatus,
    cachedStatus,
    authSeen,
    segments,
    router,
    convertTeaserToBook,
  ]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

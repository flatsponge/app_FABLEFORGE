import React, { useEffect, useRef, ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useConvexAuth, useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useOnboarding } from '../contexts/OnboardingContext';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { isLoaded: onboardingLoaded, hasPersistedData, data, clearOnboardingData } = useOnboarding();
  const didRedirect = useRef(false);
  const didConvertTeaser = useRef(false);
  
  const onboardingStatus = useQuery(
    api.onboarding.getOnboardingStatus,
    isAuthenticated ? {} : "skip"
  );
  
  const convertTeaserToBook = useMutation(api.storyGeneration.convertTeaserToBook);

  const isReady = !authLoading && onboardingLoaded && navigationState?.key;
  const onboardingStatusLoaded = !isAuthenticated || onboardingStatus !== undefined;

  useEffect(() => {
    if (!isReady || !onboardingStatusLoaded) return;
    if (didRedirect.current) return;

    const inOnboarding = segments[0] === '(onboarding)';
    const inTabs = segments[0] === '(tabs)';
    const isAtRoot = segments.length <= 1 || (segments[0] === '(onboarding)' && segments[1] === undefined);

    if (isAuthenticated) {
      if (!onboardingStatus || !onboardingStatus.hasOnboardingData) {
        if (!inOnboarding) {
          didRedirect.current = true;
          router.replace('/(onboarding)/intro/slide-0');
        }
        return;
      }

      if (!onboardingStatus.isComplete) {
        if (!onboardingStatus.hasMascotName) {
          didRedirect.current = true;
          router.replace('/(onboarding)/child/mascot-name');
          return;
        }
        if (!onboardingStatus.hasMascotImage) {
          didRedirect.current = true;
          router.replace('/(onboarding)/child/avatar');
          return;
        }
      }

      if (onboardingStatus.isComplete && hasPersistedData) {
        clearOnboardingData();
      }

      // Convert teaser to book when onboarding completes (once)
      if (onboardingStatus.isComplete && !didConvertTeaser.current) {
        didConvertTeaser.current = true;
        convertTeaserToBook().catch((err) => {
          console.warn('Failed to convert teaser to book:', err);
        });
      }

      if (!inTabs && isAtRoot) {
        didRedirect.current = true;
        router.replace('/(tabs)');
      }
      return;
    }

    if (!isAuthenticated && isAtRoot) {
      if (hasPersistedData && data.resumePath) {
        didRedirect.current = true;
        router.replace(data.resumePath as '/(onboarding)/splash');
        return;
      }
      
      didRedirect.current = true;
      router.replace('/(onboarding)/splash');
    }
  }, [
    isReady,
    onboardingStatusLoaded,
    isAuthenticated,
    onboardingStatus,
    hasPersistedData,
    data.resumePath,
    segments,
    router,
    clearOnboardingData,
    convertTeaserToBook,
  ]);

  if (!isReady || (isAuthenticated && !onboardingStatusLoaded)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
  },
});

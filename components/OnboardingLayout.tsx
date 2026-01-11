import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingTheme } from '../constants/OnboardingTheme';
import OnboardingButton from './OnboardingButton';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  progress?: number; // 0 to 1
  onNext?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNextButton?: boolean;
  showProgressBar?: boolean;
  backgroundColor?: string;
  progressBarColor?: string;
  progressBarTrackColor?: string;
  backButtonColor?: string;
  isScrollable?: boolean;
  skipTopSafeArea?: boolean; // When true, skip top safe area padding (for screens inside parent layouts that handle it)
  fadeInButton?: boolean;
  scrollResetKey?: string | number; // When this changes, scroll resets to top
}

export default function OnboardingLayout({
  children,
  progress = 0,
  onNext,
  nextLabel = 'Continue',
  showBack = true,
  onBack,
  showNextButton = true,
  showProgressBar = true,
  backgroundColor = OnboardingTheme.Colors.Background,
  progressBarColor = OnboardingTheme.Colors.Primary,
  progressBarTrackColor = '#E5E7EB',
  backButtonColor = OnboardingTheme.Colors.Text,
  isScrollable = false,
  skipTopSafeArea = false,
  fadeInButton = false,
  scrollResetKey,
}: OnboardingLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const progressWidth = useSharedValue(Math.max(0, progress * 100));
  // If fadeInButton is true, start at 0 if showNextButton is false. Otherwise always 1.
  const buttonOpacity = useSharedValue(fadeInButton ? (showNextButton ? 1 : 0) : 1);

  // Reset scroll position when scrollResetKey changes
  useEffect(() => {
    if (scrollResetKey !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [scrollResetKey]);

  // Update progress width when prop changes
  useEffect(() => {
    progressWidth.value = withTiming(progress * 100, { duration: 300 });
  }, [progress]);

  // Animate button opacity when showNextButton changes, ONLY if fadeInButton is true
  useEffect(() => {
    if (fadeInButton) {
      buttonOpacity.value = withTiming(showNextButton ? 1 : 0, { duration: 300 });
    } else {
      buttonOpacity.value = 1;
    }
  }, [showNextButton, fadeInButton]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
      backgroundColor: progressBarColor,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const containerPaddingTop = skipTopSafeArea ? 0 : insets.top;
  const contentPaddingTop = OnboardingTheme.Spacing.lg;

  const contentWrapperProps = isScrollable
    ? {
      showsVerticalScrollIndicator: false,
      contentContainerStyle: [
        styles.scrollContentContainer,
        { paddingTop: contentPaddingTop }
      ],
    }
    : {
      style: [
        styles.content,
        { paddingTop: contentPaddingTop }
      ],
    };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const isKeyboardVisible = keyboardHeight > 0;

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event?.endCoordinates?.height ?? 0);
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: containerPaddingTop,
          paddingBottom: isKeyboardVisible ? keyboardHeight : 0,
          backgroundColor,
        },
      ]}
    >
      {/* Header */}
      {showProgressBar ? (
        <View style={styles.header}>
          {showBack ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="arrow-back" size={24} color={backButtonColor} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 + OnboardingTheme.Spacing.md }} />
          )}

          <View style={styles.progressContainer}>
            <View style={[styles.progressBarBackground, { backgroundColor: progressBarTrackColor }]}>
              <Animated.View style={[styles.progressBarFill, progressStyle]} />
            </View>
          </View>
          {/* Spacer to balance the layout visually if needed, though flex handles it */}
          <View style={{ width: 24 + OnboardingTheme.Spacing.md }} />
        </View>
      ) : showBack && onBack ? (
        <View style={styles.headerBackOnly}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={24} color={backButtonColor} />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Content */}
      {isScrollable ? (
        <ScrollView
          ref={scrollViewRef}
          {...contentWrapperProps}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>
      ) : (
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
          <View {...contentWrapperProps}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Footer - always rendered to preserve layout, visibility controlled by animated opacity */}
      <Animated.View
        style={[
          styles.footer,
          buttonStyle,
          { paddingBottom: isKeyboardVisible ? OnboardingTheme.Spacing.md : (insets.bottom + OnboardingTheme.Spacing.md) }
        ]}
      >
        <OnboardingButton
          onPress={showNextButton ? onNext : undefined}
          title={nextLabel}
          disabled={!showNextButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: OnboardingTheme.Spacing.lg,
    paddingTop: OnboardingTheme.Spacing.xs,
    paddingBottom: OnboardingTheme.Spacing.md,
    height: 48,
  },
  headerBackOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: OnboardingTheme.Spacing.lg,
    paddingTop: OnboardingTheme.Spacing.xs,
    paddingBottom: OnboardingTheme.Spacing.md,
    height: 48,
  },
  backButton: {
    marginRight: OnboardingTheme.Spacing.md,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarBackground: {
    flex: 1,
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: OnboardingTheme.Spacing.lg,
    paddingTop: OnboardingTheme.Spacing.md, // Reduced spacing to keep content closer to progress bar
    // Using flex-start prevents layout shifts when content animates in
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: OnboardingTheme.Spacing.lg,
    paddingTop: OnboardingTheme.Spacing.md,
    paddingBottom: 100, // Extra buffer to ensure content doesn't get hidden behind footer button
  },
  footer: {
    paddingHorizontal: OnboardingTheme.Spacing.lg,
    paddingTop: OnboardingTheme.Spacing.md,
    paddingBottom: OnboardingTheme.Spacing.xs,
  },
});

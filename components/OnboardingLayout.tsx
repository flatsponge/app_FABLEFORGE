import React from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { OnboardingTheme } from '../constants/OnboardingTheme';
import OnboardingButton from './OnboardingButton';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  progress: number; // 0 to 1
  onNext: () => void;
  nextLabel?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNextButton?: boolean;
  backgroundColor?: string;
  progressBarColor?: string;
  progressBarTrackColor?: string;
  backButtonColor?: string;
  isScrollable?: boolean;
}

export default function OnboardingLayout({
  children,
  progress,
  onNext,
  nextLabel = 'Continue',
  showBack = true,
  onBack,
  showNextButton = true,
  backgroundColor = OnboardingTheme.Colors.Background,
  progressBarColor = OnboardingTheme.Colors.Primary,
  progressBarTrackColor = '#E5E7EB',
  backButtonColor = OnboardingTheme.Colors.Text,
  isScrollable = false,
}: OnboardingLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const progressWidth = useSharedValue(0);

  // Update progress width when prop changes
  React.useEffect(() => {
    progressWidth.value = withTiming(progress * 100, { duration: 500 });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
      backgroundColor: progressBarColor,
    };
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const ContentWrapper = isScrollable ? ScrollView : View;
  const contentWrapperProps = isScrollable 
    ? { 
        showsVerticalScrollIndicator: false,
        contentContainerStyle: styles.scrollContentContainer 
      } 
    : { style: styles.content };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ArrowLeft size={24} color={backButtonColor} />
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

      {/* Content */}
      {isScrollable ? (
          <ScrollView {...contentWrapperProps}>
              {children}
          </ScrollView>
      ) : (
          <View style={styles.content}>
              {children}
          </View>
      )}

      {/* Footer */}
      {showNextButton && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.footer}>
              <OnboardingButton onPress={onNext} title={nextLabel} />
          </View>
        </KeyboardAvoidingView>
      )}
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
    paddingVertical: OnboardingTheme.Spacing.md,
    height: 60,
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
    justifyContent: 'center', // Vertically center content by default
  },
  scrollContentContainer: {
      paddingHorizontal: OnboardingTheme.Spacing.lg,
      paddingBottom: OnboardingTheme.Spacing.xl,
  },
  footer: {
    paddingHorizontal: OnboardingTheme.Spacing.lg,
    paddingTop: OnboardingTheme.Spacing.md,
    paddingBottom: OnboardingTheme.Spacing.md,
  },
});
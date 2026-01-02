import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { OnboardingTheme } from '../constants/OnboardingTheme';

export function OnboardingTitle({ style, ...props }: TextProps) {
  return (
    <Text style={[styles.title, style]} {...props} />
  );
}

export function OnboardingSubtitle({ style, ...props }: TextProps) {
  return (
    <Text style={[styles.subtitle, style]} {...props} />
  );
}

export function OnboardingBody({ style, ...props }: TextProps) {
  return (
    <Text style={[styles.body, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  title: {
    ...OnboardingTheme.Typography.Title,
    marginBottom: OnboardingTheme.Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...OnboardingTheme.Typography.Subtitle,
    marginBottom: OnboardingTheme.Spacing.sm,
    textAlign: 'center',
  },
  body: {
    ...OnboardingTheme.Typography.Body,
    marginBottom: OnboardingTheme.Spacing.md,
    textAlign: 'center',
  },
});

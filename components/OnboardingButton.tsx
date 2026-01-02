import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { OnboardingTheme } from '../constants/OnboardingTheme';

interface OnboardingButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  textStyle?: TextStyle;
}

export default function OnboardingButton({ title, style, variant = 'primary', textStyle, ...props }: OnboardingButtonProps) {
  // Capitalize variant for style key lookup
  const textStyleKey = `text${variant}` as keyof typeof styles;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={[styles.textBase, styles[textStyleKey], textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: OnboardingTheme.Colors.Primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondary: {
    backgroundColor: OnboardingTheme.Colors.Surface,
    borderWidth: 1,
    borderColor: OnboardingTheme.Colors.Border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: OnboardingTheme.Colors.Primary,
  },
  textBase: {
    fontSize: 18,
    fontWeight: '700',
  },
  textprimary: {
    color: '#FFFFFF',
  },
  textsecondary: {
    color: OnboardingTheme.Colors.Text,
  },
  textoutline: {
    color: OnboardingTheme.Colors.Primary,
  },
});

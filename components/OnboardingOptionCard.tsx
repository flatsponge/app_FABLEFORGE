import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TouchableOpacityProps } from 'react-native';
import { OnboardingTheme } from '../constants/OnboardingTheme';

interface OnboardingOptionCardProps extends TouchableOpacityProps {
  title: string;
  description?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  showCheckbox?: boolean;
}

export default function OnboardingOptionCard({
  title,
  description,
  selected = false,
  icon,
  style,
  showCheckbox = true,
  ...props
}: OnboardingOptionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.containerSelected,
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
          {description && (
            <Text style={[styles.description, selected && styles.descriptionSelected]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {showCheckbox && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <View style={styles.checkboxInner} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: OnboardingTheme.Colors.Background,
    borderWidth: 1,
    borderColor: OnboardingTheme.Colors.Border,
    borderRadius: 16, // Rounded 2xl
    padding: OnboardingTheme.Spacing.md,
    marginBottom: OnboardingTheme.Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerSelected: {
    borderColor: OnboardingTheme.Colors.Primary,
    backgroundColor: OnboardingTheme.Colors.Surface, 
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: OnboardingTheme.Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: OnboardingTheme.Colors.Text,
  },
  titleSelected: {
    color: OnboardingTheme.Colors.Primary,
  },
  description: {
    fontSize: 14,
    color: OnboardingTheme.Colors.TextSecondary,
    marginTop: 2,
  },
  descriptionSelected: {
    color: OnboardingTheme.Colors.Secondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: OnboardingTheme.Colors.Border,
    marginLeft: OnboardingTheme.Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: OnboardingTheme.Colors.Primary,
    backgroundColor: OnboardingTheme.Colors.Primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});

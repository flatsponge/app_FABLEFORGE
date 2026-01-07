import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TouchableOpacityProps } from 'react-native';
import { OnboardingTheme } from '../constants/OnboardingTheme';

import { Ionicons } from '@expo/vector-icons';

interface OnboardingOptionCardProps extends TouchableOpacityProps {
  title: string;
  description?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  iconName?: keyof typeof Ionicons.glyphMap;
  rightContent?: React.ReactNode;
  showCheckbox?: boolean;
}

export default function OnboardingOptionCard({
  title,
  description,
  selected = false,
  icon,
  iconName,
  rightContent,
  style,
  showCheckbox = true,
  ...props
}: OnboardingOptionCardProps) {
  const renderIcon = () => {
    if (icon) return <View style={styles.iconContainer}>{icon}</View>;
    if (iconName) {
      return (
        <View style={[styles.iconContainer, styles.stdIconContainer, selected && styles.stdIconContainerSelected]}>
          <Ionicons 
            name={iconName} 
            size={24} 
            color={selected ? OnboardingTheme.Colors.Primary : OnboardingTheme.Colors.IconColor} 
          />
        </View>
      );
    }
    return null;
  };

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
        {renderIcon()}
        <View style={styles.textContainer}>
          <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
          {description && (
            <Text style={[styles.description, selected && styles.descriptionSelected]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {rightContent}
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
  stdIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: OnboardingTheme.Colors.IconBackground,
  },
  stdIconContainerSelected: {
    backgroundColor: '#E0E7FF', // Light indigo/primary tint - Adjust as needed
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

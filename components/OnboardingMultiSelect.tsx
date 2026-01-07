import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OnboardingOptionCard from './OnboardingOptionCard';
import { OnboardingTheme } from '../constants/OnboardingTheme';

export interface SelectOption {
    id: string;
    title: string;
    description?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    customIcon?: React.ReactNode;
    rightContent?: React.ReactNode;
}

interface OnboardingMultiSelectProps {
    options: SelectOption[];
    selectedValues: string[];
    onToggle: (id: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    showCheckbox?: boolean;
}

export default function OnboardingMultiSelect({ 
    options, 
    selectedValues, 
    onToggle, 
    containerStyle,
    showCheckbox = true 
}: OnboardingMultiSelectProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            {options.map((option) => (
                <OnboardingOptionCard
                    key={option.id}
                    title={option.title}
                    description={option.description}
                    selected={selectedValues.includes(option.id)}
                    onPress={() => onToggle(option.id)}
                    showCheckbox={showCheckbox}
                    iconName={option.icon}
                    icon={option.customIcon}
                    rightContent={option.rightContent}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: OnboardingTheme.Spacing.xl,
    },
});

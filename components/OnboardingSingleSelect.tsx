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
    // For custom icon rendering if needed, though iconName is preferred
    customIcon?: React.ReactNode; 
    rightContent?: React.ReactNode;
}

interface OnboardingSingleSelectProps {
    options: SelectOption[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    showCheckbox?: boolean;
}

export default function OnboardingSingleSelect({ 
    options, 
    selectedId, 
    onSelect, 
    containerStyle,
    showCheckbox = false 
}: OnboardingSingleSelectProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            {options.map((option) => (
                <OnboardingOptionCard
                    key={option.id}
                    title={option.title}
                    description={option.description}
                    selected={selectedId === option.id}
                    onPress={() => onSelect(option.id)}
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

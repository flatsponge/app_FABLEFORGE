import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useQuizFooter } from '../../../contexts/QuizFooterContext';
import OnboardingLayout from '../../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../../components/OnboardingTypography';
import MonthYearPicker from '../../../components/MonthYearPicker';
import { OnboardingTheme } from '../../../constants/OnboardingTheme';

export default function ChildAgeScreen() {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const { setFooter } = useQuizFooter();

    // Initialize with a reasonable default (5 years ago)
    const currentDate = new Date();
    const defaultYear = currentDate.getFullYear() - 5;
    const defaultMonth = currentDate.getMonth();

    // Parse existing data if available
    const [selectedMonth, setSelectedMonth] = useState<number>(() => {
        if (data.childBirthMonth !== undefined) return data.childBirthMonth;
        return defaultMonth;
    });

    const [selectedYear, setSelectedYear] = useState<number>(() => {
        if (data.childBirthYear !== undefined) return data.childBirthYear;
        return defaultYear;
    });

    // Calculate age from selected date
    const calculatedAge = useMemo(() => {
        const today = new Date();
        const birthDate = new Date(selectedYear, selectedMonth);

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return { years, months };
    }, [selectedMonth, selectedYear]);

    // Format the age display
    const ageDisplay = useMemo(() => {
        const { years, months } = calculatedAge;
        if (years < 0 || (years === 0 && months < 0)) {
            return "Invalid date";
        }
        if (years === 0) {
            return `${months} month${months !== 1 ? 's' : ''} old`;
        }
        if (months === 0) {
            return `${years} year${years !== 1 ? 's' : ''} old`;
        }
        return `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''} old`;
    }, [calculatedAge]);

    // Validate age range (2-12 years)
    const isValidAge = calculatedAge.years >= 2 && calculatedAge.years <= 12;

    const handleNext = () => {
        if (isValidAge) {
            // Store both the raw birth date and calculated age bucket
            let ageBucket: string;
            if (calculatedAge.years >= 2 && calculatedAge.years <= 3) ageBucket = '2-3';
            else if (calculatedAge.years >= 4 && calculatedAge.years <= 5) ageBucket = '4-5';
            else if (calculatedAge.years >= 6 && calculatedAge.years <= 7) ageBucket = '6-7';
            else if (calculatedAge.years >= 8 && calculatedAge.years <= 9) ageBucket = '8-9';
            else ageBucket = '10+';

            updateData({
                childAge: ageBucket,
                childBirthMonth: selectedMonth,
                childBirthYear: selectedYear,
            });
            router.push('/(onboarding)/quiz/child-gender');
        }
    };

    useEffect(() => {
        setFooter({
            onNext: handleNext,
            nextLabel: "Continue",
            showNextButton: isValidAge
        });
    }, [isValidAge, handleNext, setFooter]);

    return (
        <OnboardingLayout
            showProgressBar={false}
            skipTopSafeArea
            progress={0.15}
            hideFooter={true}
        >
            <View style={styles.contentContainer}>
                <OnboardingTitle>
                    When was {data.childName || 'your child'} born?
                </OnboardingTitle>
                <OnboardingBody>
                    We'll tailor the stories perfectly to their developmental stage.
                </OnboardingBody>

                <View style={styles.pickerContainer}>
                    <MonthYearPicker
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={setSelectedMonth}
                        onYearChange={setSelectedYear}
                        minYear={currentDate.getFullYear() - 12}
                        maxYear={currentDate.getFullYear() - 2}
                    />
                </View>

                {/* Age indicator */}
                <View style={styles.ageIndicator}>
                    <View style={[
                        styles.ageBadge,
                        isValidAge ? styles.ageBadgeValid : styles.ageBadgeInvalid
                    ]}>
                        <Text style={[
                            styles.ageText,
                            isValidAge ? styles.ageTextValid : styles.ageTextInvalid
                        ]}>
                            {ageDisplay}
                        </Text>
                    </View>
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
        flex: 1,
    },
    pickerContainer: {
        marginTop: OnboardingTheme.Spacing.xl,
    },
    ageIndicator: {
        marginTop: OnboardingTheme.Spacing.lg,
        alignItems: 'center',
    },
    ageBadge: {
        paddingHorizontal: OnboardingTheme.Spacing.lg,
        paddingVertical: OnboardingTheme.Spacing.md,
        borderRadius: OnboardingTheme.Radius.xxl,
    },
    ageBadgeValid: {
        backgroundColor: '#ECFDF5', // green-50
    },
    ageBadgeInvalid: {
        backgroundColor: '#FEF2F2', // red-50
    },
    ageText: {
        fontSize: 16,
        fontWeight: '600',
    },
    ageTextValid: {
        color: '#059669', // emerald-600
    },
    ageTextInvalid: {
        color: '#DC2626', // red-600
    },
});
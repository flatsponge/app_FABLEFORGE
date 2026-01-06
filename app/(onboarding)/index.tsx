import { Redirect } from 'expo-router';

export default function OnboardingIndex() {
    // New users start with the intro sizzle reel
    return <Redirect href="/(onboarding)/splash" />;
}

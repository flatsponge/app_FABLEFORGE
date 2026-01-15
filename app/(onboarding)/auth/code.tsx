import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import OnboardingLayout from "../../../components/OnboardingLayout";
import {
  OnboardingTitle,
  OnboardingBody,
} from "../../../components/OnboardingTypography";
import { OnboardingTheme } from "../../../constants/OnboardingTheme";
import { useAuth } from "../../../contexts/AuthContext";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import { calculateInitialScores, calculateOverallScore } from "../../../utils/calculateScores";

const CODE_LENGTH = 8;

export default function CodeScreen() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { email } = useAuth();
  const { data } = useOnboarding();
  const saveOnboarding = useMutation(api.onboarding.saveOnboardingResponses);
  const saveSkills = useMutation(api.onboarding.saveUserSkills);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [signInComplete, setSignInComplete] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const isComplete = code.every((digit) => digit !== "");
  const fullCode = code.join("");

  useEffect(() => {
    if (!signInComplete || authLoading || !isAuthenticated || dataSaved) {
      return;
    }

    async function saveOnboardingData() {
      try {
        await saveOnboarding({
          childName: data.childName,
          childAge: data.childAge,
          childBirthMonth: data.childBirthMonth ?? 0,
          childBirthYear: data.childBirthYear ?? 2020,
          gender: data.gender || "boy",
          childPersonality: data.childPersonality,
          primaryGoal: data.primaryGoal,
          goalsTimeline: data.goalsTimeline || "gradual",
          parentingStyle: data.parentingStyle,
          parentChallenges: data.parentChallenges,
          parentReaction: data.parentReaction,
          previousAttempts: data.previousAttempts,
          dailyRoutine: data.dailyRoutine,
          readingTime: data.readingTime,
          storyLength: data.storyLength,
          storyThemes: data.storyThemes,
          struggleBehavior: data.struggleBehavior,
          aggressionTarget: data.aggressionTarget,
          aggressionFrequency: data.aggressionFrequency,
          triggerSituations: data.triggerSituations,
          struggleAreas: data.struggleAreas,
          struggleFrequency: data.struggleFrequency,
          moralScore: data.moralScore,
          generatedMascotId: data.generatedMascotId as Id<"_storage"> | undefined,
          vocabularyPreference: data.vocabularyPreference,
        });

        const scores = calculateInitialScores(data);
        const overallScore = calculateOverallScore(scores);
        await saveSkills({
          overallScore,
          empathy: {
            progress: scores.empathy.progress, subSkills: [
              { name: "Perspective", value: scores.empathy.subSkills.perspective },
              { name: "Compassion", value: scores.empathy.subSkills.compassion },
              { name: "Kindness", value: scores.empathy.subSkills.kindness },
            ]
          },
          bravery: {
            progress: scores.bravery.progress, subSkills: [
              { name: "Confidence", value: scores.bravery.subSkills.confidence },
              { name: "Grit", value: scores.bravery.subSkills.grit },
              { name: "Risk Taking", value: scores.bravery.subSkills.riskTaking },
            ]
          },
          honesty: {
            progress: scores.honesty.progress, subSkills: [
              { name: "Truthfulness", value: scores.honesty.subSkills.truthfulness },
              { name: "Trust", value: scores.honesty.subSkills.trust },
              { name: "Integrity", value: scores.honesty.subSkills.integrity },
            ]
          },
          teamwork: {
            progress: scores.teamwork.progress, subSkills: [
              { name: "Cooperation", value: scores.teamwork.subSkills.cooperation },
              { name: "Listening", value: scores.teamwork.subSkills.listening },
              { name: "Support", value: scores.teamwork.subSkills.support },
            ]
          },
          creativity: {
            progress: scores.creativity.progress, subSkills: [
              { name: "Visualization", value: scores.creativity.subSkills.visualization },
              { name: "Storytelling", value: scores.creativity.subSkills.storytelling },
              { name: "Wonder", value: scores.creativity.subSkills.wonder },
            ]
          },
          gratitude: {
            progress: scores.gratitude.progress, subSkills: [
              { name: "Thankfulness", value: scores.gratitude.subSkills.thankfulness },
              { name: "Positivity", value: scores.gratitude.subSkills.positivity },
              { name: "Appreciation", value: scores.gratitude.subSkills.appreciation },
            ]
          },
          problemSolving: {
            progress: scores.problemSolving.progress, subSkills: [
              { name: "Logic", value: scores.problemSolving.subSkills.logic },
              { name: "Strategy", value: scores.problemSolving.subSkills.strategy },
              { name: "Analysis", value: scores.problemSolving.subSkills.analysis },
            ]
          },
          responsibility: {
            progress: scores.responsibility.progress, subSkills: [
              { name: "Duty", value: scores.responsibility.subSkills.duty },
              { name: "Reliability", value: scores.responsibility.subSkills.reliability },
              { name: "Ownership", value: scores.responsibility.subSkills.ownership },
            ]
          },
          patience: {
            progress: scores.patience.progress, subSkills: [
              { name: "Waiting", value: scores.patience.subSkills.waiting },
              { name: "Calmness", value: scores.patience.subSkills.calmness },
              { name: "Self-Control", value: scores.patience.subSkills.selfControl },
            ]
          },
          curiosity: {
            progress: scores.curiosity.progress, subSkills: [
              { name: "Inquiry", value: scores.curiosity.subSkills.inquiry },
              { name: "Exploration", value: scores.curiosity.subSkills.exploration },
              { name: "Discovery", value: scores.curiosity.subSkills.discovery },
            ]
          },
        });

        setDataSaved(true);
        setIsLoading(false);
        router.push("/(onboarding)/child/setup");
      } catch (error) {
        console.error("Failed to save onboarding data:", error);
        Alert.alert("Error", "Failed to save your data. Please try again.");
        setSignInComplete(false);
        setIsLoading(false);
      }
    }

    saveOnboardingData();
  }, [signInComplete, authLoading, isAuthenticated, dataSaved]);

  const handleVerify = async () => {
    if (!isComplete || isLoading) return;

    setIsLoading(true);
    try {
      await signIn("resend-otp", { email, code: fullCode });
      setSignInComplete(true);
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      Alert.alert("Error", "Invalid verification code. Please try again.");
      setCode(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;

    setIsResending(true);
    try {
      await signIn("resend-otp", { email });
      Alert.alert("Code Sent", "A new verification code has been sent.");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      Alert.alert("Error", "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    if (isLoading) return;

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(onboarding)/auth/email");
  };

  const handleChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, "");
    
    // Handle paste of full code
    if (numericText.length > 1) {
      const newCode = [...code];
      const pastedDigits = numericText.slice(0, CODE_LENGTH);
      
      for (let i = 0; i < pastedDigits.length && (index + i) < CODE_LENGTH; i++) {
        newCode[index + i] = pastedDigits[i];
      }
      
      setCode(newCode);
      
      // Focus last filled input or next empty
      const lastIndex = Math.min(index + pastedDigits.length - 1, CODE_LENGTH - 1);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Handle single digit
    const digit = numericText.slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-advance
    if (digit !== "" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <OnboardingLayout
      showProgressBar={false}
      progress={0.99}
      onNext={handleVerify}
      nextLabel={isLoading ? "Verifying..." : "Verify"}
      showNextButton={isComplete}
    >
      <View style={styles.contentContainer}>
        {/* Icon */}
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          style={styles.iconContainer}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="keypad"
              size={40}
              color={OnboardingTheme.Colors.Primary}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <OnboardingTitle style={styles.title}>
            Enter your code
          </OnboardingTitle>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <OnboardingBody style={styles.subtitle}>
            We sent an {CODE_LENGTH}-digit code to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </OnboardingBody>
        </Animated.View>

        {/* Code Inputs */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.codeContainer}
        >
          {code.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.codeInputWrapper,
                digit !== "" && styles.codeInputFilled,
              ]}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                style={styles.codeInput}
                keyboardType="number-pad"
                autoFocus={index === 0}
                selectTextOnFocus
                editable={!isLoading}
              />
            </View>
          ))}
        </Animated.View>

        {/* Resend Button */}
        <Animated.View entering={FadeIn.delay(600).duration(500)}>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResend}
            disabled={isResending}
          >
            <Ionicons
              name="refresh"
              size={18}
              color={OnboardingTheme.Colors.Primary}
            />
            <Text style={styles.resendText}>
              {isResending ? "Sending..." : "Resend code"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(650).duration(500)}>
          <TouchableOpacity
            style={styles.changeEmailButton}
            onPress={handleChangeEmail}
            disabled={isLoading}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={OnboardingTheme.Colors.TextSecondary}
            />
            <Text style={styles.changeEmailText}>Change email</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Trust indicator */}
        <Animated.View
          entering={FadeIn.delay(700).duration(500)}
          style={styles.trustContainer}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={OnboardingTheme.Colors.TextSecondary}
          />
          <Text style={styles.trustText}>Code expires in 10 minutes</Text>
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: OnboardingTheme.Spacing.lg,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#f3e8ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: OnboardingTheme.Spacing.md,
  },
  emailText: {
    fontWeight: "600",
    color: OnboardingTheme.Colors.Primary,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: OnboardingTheme.Spacing.xl,
    marginBottom: OnboardingTheme.Spacing.lg,
    flexWrap: "wrap",
    maxWidth: 320,
  },
  codeInputWrapper: {
    width: 44,
    height: 56,
    backgroundColor: OnboardingTheme.Colors.White,
    borderWidth: 2,
    borderColor: OnboardingTheme.Colors.Border,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  codeInputFilled: {
    borderColor: OnboardingTheme.Colors.Primary,
    backgroundColor: "#faf5ff",
  },
  codeInput: {
    width: "100%",
    height: "100%",
    fontSize: 24,
    fontWeight: "bold",
    color: OnboardingTheme.Colors.Text,
    textAlign: "center",
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: OnboardingTheme.Spacing.sm,
    paddingHorizontal: OnboardingTheme.Spacing.md,
    gap: 6,
  },
  resendText: {
    color: OnboardingTheme.Colors.Primary,
    fontWeight: "600",
    fontSize: 16,
  },
  changeEmailButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: OnboardingTheme.Spacing.sm,
    paddingHorizontal: OnboardingTheme.Spacing.md,
    gap: 6,
    marginTop: OnboardingTheme.Spacing.xs,
  },
  changeEmailText: {
    color: OnboardingTheme.Colors.TextSecondary,
    fontWeight: "600",
    fontSize: 16,
  },
  trustContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: OnboardingTheme.Spacing.xl,
    gap: 6,
  },
  trustText: {
    fontSize: 13,
    color: OnboardingTheme.Colors.TextSecondary,
  },
});

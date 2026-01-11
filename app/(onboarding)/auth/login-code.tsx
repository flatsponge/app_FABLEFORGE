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
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import OnboardingLayout from "../../../components/OnboardingLayout";
import {
  OnboardingTitle,
  OnboardingBody,
} from "../../../components/OnboardingTypography";
import { OnboardingTheme } from "../../../constants/OnboardingTheme";
import { useAuth } from "../../../contexts/AuthContext";

const CODE_LENGTH = 8;

export default function LoginCodeScreen() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { email } = useAuth();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [signInComplete, setSignInComplete] = useState(false);
  const [redirectComplete, setRedirectComplete] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const isComplete = code.every((digit) => digit !== "");
  const fullCode = code.join("");

  const onboardingStatus = useQuery(
    api.onboarding.getOnboardingStatus,
    signInComplete && isAuthenticated ? {} : "skip"
  );

  useEffect(() => {
    if (!signInComplete || authLoading || !isAuthenticated || redirectComplete) {
      return;
    }

    if (onboardingStatus === undefined) {
      return;
    }

    setRedirectComplete(true);
    setIsLoading(false);

    if (onboardingStatus === null || !onboardingStatus.hasOnboardingData) {
      Alert.alert(
        "Setup Required",
        "It looks like you haven't completed your profile setup. Let's get you started!",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(onboarding)/intro/slide-0"),
          },
        ]
      );
      return;
    }

    if (!onboardingStatus.isComplete) {
      if (!onboardingStatus.hasMascotName) {
        router.replace("/(onboarding)/child/mascot-name");
        return;
      }

      if (!onboardingStatus.hasMascotImage) {
        router.replace("/(onboarding)/child/avatar");
        return;
      }
    }

    router.replace("/(tabs)");
  }, [signInComplete, authLoading, isAuthenticated, onboardingStatus, redirectComplete]);

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
      progress={0}
      onNext={handleVerify}
      nextLabel={isLoading ? "Verifying..." : "Verify"}
      showNextButton={isComplete}
      onBack={() => router.back()}
    >
      <View style={styles.contentContainer}>
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
                maxLength={1}
                autoFocus={index === 0}
                selectTextOnFocus
                editable={!isLoading}
              />
            </View>
          ))}
        </Animated.View>

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

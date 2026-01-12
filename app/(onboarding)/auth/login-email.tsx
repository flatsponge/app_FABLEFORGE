import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import OnboardingLayout from "../../../components/OnboardingLayout";
import {
  OnboardingTitle,
  OnboardingBody,
} from "../../../components/OnboardingTypography";
import { OnboardingTheme } from "../../../constants/OnboardingTheme";
import { useAuth } from "../../../contexts/AuthContext";
import { useOnboarding } from "../../../contexts/OnboardingContext";

export default function LoginEmailScreen() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { setEmail: setAuthEmail } = useAuth();
  const { updateData } = useOnboarding();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noAccountError, setNoAccountError] = useState(false);

  const isValidEmail = email.includes("@") && email.includes(".");
  const normalizedEmail = email.toLowerCase().trim();

  const emailExists = useQuery(
    api.onboarding.checkEmailExists,
    isValidEmail ? { email: normalizedEmail } : "skip"
  );

  const handleNext = async () => {
    if (!isValidEmail || isLoading) return;

    if (emailExists === false) {
      setNoAccountError(true);
      return;
    }

    setIsLoading(true);
    setNoAccountError(false);
    try {
      setAuthEmail(normalizedEmail);
      updateData({ email: normalizedEmail });
      await signIn("resend-otp", { email: normalizedEmail });
      router.push("/(onboarding)/auth/login-code");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      Alert.alert(
        "Error",
        "Failed to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignup = () => {
    router.push("/(onboarding)/intro/slide-0");
  };

  const handleTryDifferentEmail = () => {
    setEmail("");
    setNoAccountError(false);
  };

  return (
    <OnboardingLayout
      showProgressBar={false}
      progress={0}
      onNext={handleNext}
      nextLabel={isLoading ? "Sending..." : "Continue"}
      showNextButton={isValidEmail && !noAccountError}
      onBack={() => router.back()}
    >
      <View style={styles.contentContainer}>
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          style={styles.iconContainer}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="log-in"
              size={40}
              color={OnboardingTheme.Colors.Primary}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <OnboardingTitle style={styles.title}>
            Welcome back!
          </OnboardingTitle>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <OnboardingBody style={styles.subtitle}>
            Enter your email to log in to your account.
          </OnboardingBody>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.inputContainer}
        >
          <View
            style={[
              styles.inputWrapper,
              isValidEmail && !noAccountError && styles.inputWrapperValid,
              noAccountError && styles.inputWrapperError,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={22}
              color={
                noAccountError
                  ? "#ef4444"
                  : isValidEmail
                    ? OnboardingTheme.Colors.Primary
                    : OnboardingTheme.Colors.TextSecondary
              }
              style={styles.inputIcon}
            />
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setNoAccountError(false);
              }}
              placeholder="parent@example.com"
              placeholderTextColor={OnboardingTheme.Colors.TextSecondary}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              editable={!isLoading}
            />
            {isValidEmail && !noAccountError && emailExists === true && (
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            )}
            {noAccountError && (
              <Ionicons name="alert-circle" size={24} color="#ef4444" />
            )}
          </View>
        </Animated.View>

        {noAccountError && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.errorContainer}
          >
            <View style={styles.errorBox}>
              <Ionicons name="information-circle" size={20} color="#dc2626" />
              <Text style={styles.errorText}>
                No account found with this email. Would you like to create one?
              </Text>
            </View>
            
            <View style={styles.errorActions}>
              <TouchableOpacity
                style={styles.errorActionButton}
                onPress={handleSwitchToSignup}
              >
                <Ionicons name="person-add-outline" size={18} color={OnboardingTheme.Colors.Primary} />
                <Text style={styles.errorActionText}>Create account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.errorActionButton}
                onPress={handleTryDifferentEmail}
              >
                <Ionicons name="refresh-outline" size={18} color={OnboardingTheme.Colors.TextSecondary} />
                <Text style={[styles.errorActionText, { color: OnboardingTheme.Colors.TextSecondary }]}>
                  Try different email
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeIn.delay(600).duration(500)}
          style={styles.trustContainer}
        >
          <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
          <Text style={styles.trustText}>
            We'll send a secure verification code
          </Text>
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
  inputContainer: {
    width: "100%",
    marginTop: OnboardingTheme.Spacing.lg,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: OnboardingTheme.Colors.White,
    borderWidth: 2,
    borderColor: OnboardingTheme.Colors.Border,
    borderRadius: 16,
    paddingHorizontal: OnboardingTheme.Spacing.md,
    paddingVertical: OnboardingTheme.Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperValid: {
    borderColor: OnboardingTheme.Colors.Primary,
  },
  inputWrapperError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  inputIcon: {
    marginRight: OnboardingTheme.Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: OnboardingTheme.Colors.Text,
    paddingVertical: OnboardingTheme.Spacing.sm,
  },
  errorContainer: {
    width: "100%",
    marginTop: OnboardingTheme.Spacing.md,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fef2f2",
    padding: OnboardingTheme.Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#dc2626",
    lineHeight: 20,
  },
  errorActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: OnboardingTheme.Spacing.md,
  },
  errorActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: OnboardingTheme.Spacing.sm,
    paddingHorizontal: OnboardingTheme.Spacing.md,
    gap: 6,
    backgroundColor: OnboardingTheme.Colors.White,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: OnboardingTheme.Colors.Border,
  },
  errorActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: OnboardingTheme.Colors.Primary,
  },
  trustContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: OnboardingTheme.Spacing.xl * 2,
  },
  trustText: {
    marginLeft: OnboardingTheme.Spacing.xs,
    fontSize: 13,
    color: OnboardingTheme.Colors.TextSecondary,
  },
});

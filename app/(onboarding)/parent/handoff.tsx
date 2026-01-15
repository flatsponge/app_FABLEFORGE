import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChunkyButton } from '@/components/ChunkyButton';

export default function ParentHandoffScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleParentContinue = () => {
    router.push('/(onboarding)/parent/processing');
  };

  return (
    <LinearGradient
      colors={['#F0FDF4', '#FFFFFF', '#F0F9FF']}
      style={styles.container}
    >
      <View style={[styles.contentContainer, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        
        <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={64} color="#10B981" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.textContainer}>
          <Text style={styles.title}>Parent Handoff</Text>
          <Text style={styles.subtitle}>
            Great job! Now, please hand the device back to your parent to build your full personalized plan.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.securityNote}>
          <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
          <Text style={styles.securityText}>Secure Parent Zone</Text>
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeIn.delay(800)} style={styles.buttonContainer}>
          <ChunkyButton
            onPress={handleParentContinue}
            bgColor="#10B981"
            borderColor="#059669"
            size="large"
          >
            <View style={styles.buttonContent}>
              <Ionicons name="person" size={24} color="white" />
              <Text style={styles.buttonText}>I am the Parent</Text>
            </View>
          </ChunkyButton>
        </Animated.View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 40,
    marginTop: 60,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#D1FAE5',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: '90%',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  securityText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
});

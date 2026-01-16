import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import OnboardingLayout from '../../../components/OnboardingLayout';
import RadarChart from '../../../components/RadarChart';

const STATE_BAD = {
  bgStart: '#450a0a',
  bgEnd: '#000000',
  primaryColor: '#ef4444',
  textMain: '#ffffff',
  textSub: '#a1a1aa',
  gridColor: '#ffffff',
  data: [27, 28, 21, 19, 13, 32, 24, 18, 15, 29],
};

export default function RadarBadScreen() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const score = Math.round(STATE_BAD.data.reduce((a, b) => a + b, 0) / STATE_BAD.data.length);

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={[STATE_BAD.bgStart, STATE_BAD.bgEnd]} style={StyleSheet.absoluteFill} />
      <OnboardingLayout
        showProgressBar={false}
        showNextButton={showButton}
        onNext={() => router.push('/(onboarding)/parent/radar-good')}
        nextLabel="SEE WHAT'S POSSIBLE"
        backgroundColor="transparent"
        backButtonColor="#ffffff"
        fadeInButton
      >
        <View style={styles.container}>
          <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
            <Text style={styles.title}>YOUR CHILD'S CURRENT VALUES</Text>
            <View style={styles.pill}>
              <View style={[styles.dot, { backgroundColor: STATE_BAD.primaryColor }]} />
              <Text style={styles.pillText}>Needs Work</Text>
            </View>
          </Animated.View>

          <View style={styles.chartWrapper}>
            <View style={[styles.glow, { backgroundColor: STATE_BAD.primaryColor }]} />
            <RadarChart
              data={STATE_BAD.data}
              primaryColor={STATE_BAD.primaryColor}
              gridColor={STATE_BAD.gridColor}
              textColor={STATE_BAD.textMain}
              size={300}
            />
          </View>

          <Text style={styles.score}>{score}%</Text>
          <Text style={styles.scoreLabel}>Child Score</Text>
        </View>
      </OnboardingLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { alignItems: 'center', paddingTop: 20 },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  pill: {
    flexDirection: 'row', alignItems: 'center', marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  pillText: { color: '#a1a1aa', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  chartWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  glow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.3 },
  score: { color: '#fff', fontSize: 64, fontWeight: '800', marginTop: 8 },
  scoreLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
});

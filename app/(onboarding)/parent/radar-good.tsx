import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import OnboardingLayout from '../../../components/OnboardingLayout';
import RadarChart from '../../../components/RadarChart';

const STATE_BAD = { data: [27, 28, 21, 19, 13, 32, 24, 18, 15, 29] };
const STATE_GOOD = {
  bgStart: '#34d399',
  bgEnd: '#ecfccb',
  primaryColor: '#059669',
  textMain: '#022c22',
  textSub: '#065f46',
  gridColor: '#000000',
  data: [100, 94, 100, 99, 96, 99, 95, 98, 92, 97],
};

export default function RadarGoodScreen() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [animatedData, setAnimatedData] = useState(STATE_BAD.data);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedData(STATE_BAD.data.map((start, i) => 
        start + (STATE_GOOD.data[i] - start) * eased
      ));
      
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    
    frameRef.current = requestAnimationFrame(animate);
    const timer = setTimeout(() => setShowButton(true), 1600);
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      clearTimeout(timer);
    };
  }, []);

  const currentScore = Math.round(animatedData.reduce((a, b) => a + b, 0) / animatedData.length);

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={[STATE_GOOD.bgStart, STATE_GOOD.bgEnd]} style={StyleSheet.absoluteFill} />
      <OnboardingLayout
        showProgressBar={false}
        showNextButton={showButton}
        onNext={() => router.push('/(onboarding)/parent/trajectory')}
        nextLabel="GET THE PARENTING PLAN"
        backgroundColor="transparent"
        backButtonColor="#022c22"
        fadeInButton
      >
        <View style={styles.container}>
          <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
            <Text style={styles.title}>THEIR POTENTIAL</Text>
            <View style={styles.pill}>
              <View style={[styles.dot, { backgroundColor: STATE_GOOD.primaryColor }]} />
              <Text style={styles.pillText}>Optimized</Text>
            </View>
          </Animated.View>

          <View style={styles.chartWrapper}>
            <View style={[styles.glow, { backgroundColor: STATE_GOOD.primaryColor }]} />
            <RadarChart
              data={animatedData}
              primaryColor={STATE_GOOD.primaryColor}
              gridColor={STATE_GOOD.gridColor}
              textColor={STATE_GOOD.textMain}
              size={300}
            />
          </View>

          <Text style={styles.score}>{currentScore}%</Text>
        </View>
      </OnboardingLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { alignItems: 'center', paddingTop: 20 },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { color: '#022c22', fontSize: 18, fontWeight: '700', letterSpacing: 1 },
  pill: {
    flexDirection: 'row', alignItems: 'center', marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  pillText: { color: '#065f46', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  chartWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  glow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.3 },
  score: { color: '#022c22', fontSize: 64, fontWeight: '800', marginTop: 8 },
});

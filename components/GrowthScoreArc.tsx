import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

interface MeterSegment {
  min: number;
  max: number;
  color: string;
  label: string;
}

const SEGMENTS: MeterSegment[] = [
  { min: 0, max: 25, color: '#ef4444', label: 'Needs attention' },
  { min: 25, max: 50, color: '#f59e0b', label: 'Watch closely' },
  { min: 50, max: 75, color: '#3b82f6', label: 'On track' },
  { min: 75, max: 100, color: '#10b981', label: 'Excellent' },
];

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const calculateDonutSegment = (
  x: number,
  y: number,
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
  paddingAngle: number = 0,
  cornerRadius: number = 8
) => {
  const ring = Math.max(1, outerRadius - innerRadius);
  const cr = Math.max(0, Math.min(cornerRadius, ring / 2 - 0.5, innerRadius - 0.5));
  const pad = paddingAngle / 2;
  const start = startAngle + pad;
  const end = endAngle - pad;
  if (start >= end) return '';

  const outerAngleOffset = (cr / outerRadius) * (180 / Math.PI);
  const innerAngleOffset = (cr / innerRadius) * (180 / Math.PI);

  const outerStartCorner = polarToCartesian(x, y, outerRadius, start);
  const outerEndCorner = polarToCartesian(x, y, outerRadius, end);
  const innerEndCorner = polarToCartesian(x, y, innerRadius, end);
  const innerStartCorner = polarToCartesian(x, y, innerRadius, start);

  const outerArcStart = polarToCartesian(x, y, outerRadius, start + outerAngleOffset);
  const outerArcEnd = polarToCartesian(x, y, outerRadius, end - outerAngleOffset);
  const innerArcStart = polarToCartesian(x, y, innerRadius, start + innerAngleOffset);
  const innerArcEnd = polarToCartesian(x, y, innerRadius, end - innerAngleOffset);

  const lineOuterStart = polarToCartesian(x, y, outerRadius - cr, start);
  const lineOuterEnd = polarToCartesian(x, y, outerRadius - cr, end);
  const lineInnerEnd = polarToCartesian(x, y, innerRadius + cr, end);
  const lineInnerStart = polarToCartesian(x, y, innerRadius + cr, start);

  const largeArcFlag = end - start <= 180 ? 0 : 1;
  if (start + outerAngleOffset >= end - outerAngleOffset) return '';

  return [
    'M', lineOuterStart.x, lineOuterStart.y,
    'Q', outerStartCorner.x, outerStartCorner.y, outerArcStart.x, outerArcStart.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 1, outerArcEnd.x, outerArcEnd.y,
    'Q', outerEndCorner.x, outerEndCorner.y, lineOuterEnd.x, lineOuterEnd.y,
    'L', lineInnerEnd.x, lineInnerEnd.y,
    'Q', innerEndCorner.x, innerEndCorner.y, innerArcEnd.x, innerArcEnd.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 0, innerArcStart.x, innerArcStart.y,
    'Q', innerStartCorner.x, innerStartCorner.y, lineInnerStart.x, lineInnerStart.y,
    'Z',
  ].join(' ');
};

export interface GrowthScoreArcProps {
  score: number;
  size?: number;
  showMotivation?: boolean;
  immediate?: boolean;
}

export const GrowthScoreArc: React.FC<GrowthScoreArcProps> = ({
  score,
  size = 240,
  showMotivation = true,
  immediate = false,
}) => {
  // Match original proportions: width=360, height=220 for size=240
  const width = size * 1.5;
  const height = size * 0.917;
  const outerRadius = size * 0.625;
  const innerRadius = size * 0.458;
  const cx = width / 2;
  const cy = height - size * 0.167; // Original: height - 40 for height=220

  const clamped = Math.min(100, Math.max(0, score));
  const activeIndex = SEGMENTS.findIndex(s => clamped >= s.min && clamped < s.max);
  const finalActiveIndex = activeIndex === -1 ? SEGMENTS.length - 1 : activeIndex;
  const activeSegment = SEGMENTS[finalActiveIndex];

  const targetAngle = (clamped / 100) * 180 - 90;

  // Animated pointer angle
  const [animatedAngle, setAnimatedAngle] = useState(immediate ? targetAngle : -90);
  const angleRef = useRef(animatedAngle);

  useEffect(() => {
    angleRef.current = animatedAngle;
  }, [animatedAngle]);

  useEffect(() => {
    if (immediate) {
      setAnimatedAngle(targetAngle);
      return;
    }

    const start = angleRef.current;
    const delta = targetAngle - start;
    if (Math.abs(delta) < 0.01) return;

    const durationMs = 600;
    const t0 = Date.now();
    let animationFrame: ReturnType<typeof requestAnimationFrame>;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = () => {
      const elapsed = Date.now() - t0;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      setAnimatedAngle(start + delta * eased);
      if (t < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetAngle, immediate]);

  // Active segment pop distance (original uses 10px for size ~240)
  const ACTIVE_POP = size * 0.042;

  // Calculate pointer geometry to touch the popped inner arc
  const activeStartAngle = (activeSegment.min / 100) * 180 - 90;
  const activeEndAngle = (activeSegment.max / 100) * 180 - 90;
  const activeMidAngle = (activeStartAngle + activeEndAngle) / 2;
  const t = polarToCartesian(0, 0, ACTIVE_POP, activeMidAngle);

  const aRad = ((animatedAngle - 90) * Math.PI) / 180;
  const ux = Math.cos(aRad);
  const uy = Math.sin(aRad);

  const dot = ux * t.x + uy * t.y;
  const tLen2 = t.x * t.x + t.y * t.y;
  const r = innerRadius;
  const disc = Math.max(0, dot * dot - (tLen2 - r * r));
  const s = dot + Math.sqrt(disc);

  const gap = 1.5;
  const pointerTip = s - gap;
  const pointerBase = pointerTip - (size * 0.108);
  const pointerHalfWidth = size * 0.046;

  const pointerPath = `M 0 -${pointerTip} L ${pointerHalfWidth} -${pointerBase} L -${pointerHalfWidth} -${pointerBase} Z`;

  // Original positions score at top=120px in 220px container (54.5% from top)
  const scoreTextTop = size * 0.5;

  return (
    <View className="items-center">
      <View style={{ width, height: height + 20 }}>
        <Svg width={width} height={height + 20} style={{ overflow: 'visible' }}>
          <Defs>
            <LinearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="white" stopOpacity={0.35} />
              <Stop offset="50%" stopColor="white" stopOpacity={0.1} />
              <Stop offset="100%" stopColor="white" stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* Arc Segments */}
          {SEGMENTS.map((segment, index) => {
            const startAngle = (segment.min / 100) * 180 - 90;
            const endAngle = (segment.max / 100) * 180 - 90;
            const isActive = index === finalActiveIndex;

            const pop = isActive ? ACTIVE_POP : 0;
            const midAngle = (startAngle + endAngle) / 2;
            const v = polarToCartesian(0, 0, pop, midAngle);

            const pathData = calculateDonutSegment(
              cx,
              cy,
              startAngle,
              endAngle,
              innerRadius,
              outerRadius,
              2,
              6
            );

            return (
              <G
                key={segment.label}
                opacity={isActive ? 1 : 0.42}
                translateX={v.x}
                translateY={v.y}
              >
                <Path d={pathData} fill={isActive ? segment.color : '#cbd5e1'} />
                {isActive && <Path d={pathData} fill="url(#gloss)" />}
              </G>
            );
          })}

          {/* Pointer */}
          <G transform={`translate(${cx}, ${cy})`}>
            <G transform={`rotate(${animatedAngle})`}>
              <Path
                d={pointerPath}
                fill="#0f172a"
                stroke="white"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </G>
          </G>
        </Svg>

        {/* Score display */}
        <View
          className="absolute items-center"
          style={{ top: scoreTextTop, left: 0, right: 0 }}
          pointerEvents="none"
        >
          <Text
            className="font-black tracking-tighter leading-none"
            style={{
              fontSize: size * 0.29,
              color: activeSegment.color,
              textShadowColor: 'rgba(0,0,0,0.1)',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 20,
            }}
          >
            {Math.round(clamped)}
          </Text>
          <View 
            className="mt-2 bg-slate-100 px-3 py-1 rounded-full"
            style={styles.labelBadge}
          >
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {activeSegment.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Motivation badge */}
      {showMotivation && (
        <View className="mt-2 bg-slate-50 border border-slate-100 px-5 py-2 rounded-full" style={styles.motivationBadge}>
          <Text className="text-sm font-semibold text-slate-700">
            {clamped >= 75 ? '🌟 ' : clamped >= 50 ? '🌱 ' : '✨ '}
            {activeSegment.label}!
          </Text>
        </View>
      )}
    </View>
  );
};

// Compact version for inline use - matches the segmented arc style
export const GrowthScoreArcCompact: React.FC<{ score: number; size?: number }> = ({
  score,
  size = 52,
}) => {
  const outerRadius = size * 0.48;
  const innerRadius = size * 0.32;
  const cx = size / 2;
  const cy = size / 2 + size * 0.08; // Shift center down slightly for semi-circle

  const clamped = Math.min(100, Math.max(0, score));
  const activeIndex = SEGMENTS.findIndex(s => clamped >= s.min && clamped < s.max);
  const finalActiveIndex = activeIndex === -1 ? SEGMENTS.length - 1 : activeIndex;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="glossCompact" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="white" stopOpacity={0.35} />
            <Stop offset="50%" stopColor="white" stopOpacity={0.1} />
            <Stop offset="100%" stopColor="white" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {SEGMENTS.map((segment, index) => {
          const startAngle = (segment.min / 100) * 180 - 90;
          const endAngle = (segment.max / 100) * 180 - 90;
          const isActive = index === finalActiveIndex;

          const pathData = calculateDonutSegment(
            cx,
            cy,
            startAngle,
            endAngle,
            innerRadius,
            outerRadius,
            1.5, // smaller padding for compact
            3    // smaller corner radius
          );

          return (
            <G key={segment.label} opacity={isActive ? 1 : 0.35}>
              <Path d={pathData} fill={isActive ? segment.color : '#cbd5e1'} />
              {isActive && <Path d={pathData} fill="url(#glossCompact)" />}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  labelBadge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  motivationBadge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

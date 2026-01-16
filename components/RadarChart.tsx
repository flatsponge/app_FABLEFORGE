import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop, G } from 'react-native-svg';

const LABELS = [
  "Empathy", "Bravery", "Honesty", "Teamwork", "Creativity",
  "Gratitude", "Problem Solving", "Responsibility", "Patience", "Curiosity"
];

interface RadarChartProps {
  data: number[];
  primaryColor: string;
  gridColor: string;
  textColor: string;
  size?: number;
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

export default function RadarChart({ data, primaryColor, gridColor, textColor, size = 300 }: RadarChartProps) {
  // Add padding for labels that extend beyond the chart
  const labelPadding = 50;
  const svgSize = size + labelPadding * 2;
  const center = svgSize / 2;
  const radius = (size / 2) - 60;
  const angleSlice = 360 / data.length;

  const dataPoints = data.map((value, i) => {
    const r = (Math.max(0, value) / 100) * radius;
    const { x, y } = polarToCartesian(center, center, r, i * angleSlice);
    return `${x},${y}`;
  }).join(' ');

  const levels = [33, 66, 100];

  return (
    <View style={styles.container}>
      <Svg height={svgSize} width={svgSize}>
        <Defs>
          <LinearGradient id="poly-gradient" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
            <Stop offset="100%" stopColor={primaryColor} stopOpacity={0.1} />
          </LinearGradient>
        </Defs>

        {/* Background Grid */}
        <G>
          {levels.map((level, lvlIdx) => {
            const pts = data.map((_, i) => {
              const r = (level / 100) * radius;
              const { x, y } = polarToCartesian(center, center, r, i * angleSlice);
              return `${x},${y}`;
            }).join(' ');
            return (
              <Polygon
                key={lvlIdx}
                points={pts}
                stroke={gridColor}
                strokeOpacity={lvlIdx === 2 ? 0.2 : 0.1}
                strokeWidth={1}
                fill="none"
              />
            );
          })}

          {/* Axis Lines */}
          {data.map((_, i) => {
            const { x, y } = polarToCartesian(center, center, radius, i * angleSlice);
            return (
              <Line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={gridColor}
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            );
          })}
        </G>

        {/* Data Shape */}
        <Polygon
          points={dataPoints}
          fill="url(#poly-gradient)"
          stroke={primaryColor}
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {data.map((value, i) => {
          const r = (Math.max(0, value) / 100) * radius;
          const { x, y } = polarToCartesian(center, center, r, i * angleSlice);
          const isWhiteGrid = gridColor === '#ffffff';
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill={isWhiteGrid ? '#ffffff' : primaryColor}
              stroke={isWhiteGrid ? 'none' : '#ffffff'}
              strokeWidth={isWhiteGrid ? 0 : 2}
            />
          );
        })}

        {/* Labels */}
        {data.map((value, i) => {
          const { x, y } = polarToCartesian(center, center, radius + 35, i * angleSlice);
          const dy = y > center ? 15 : -15;
          const valueDy = y > center ? 28 : -2;
          return (
            <G key={i}>
              <SvgText
                x={x}
                y={y + dy}
                fill={textColor}
                fillOpacity={0.6}
                fontSize={10}
                fontWeight="600"
                textAnchor="middle"
              >
                {LABELS[i].toUpperCase()}
              </SvgText>
              <SvgText
                x={x}
                y={y + valueDy}
                fill={primaryColor}
                fontSize={11}
                fontWeight="bold"
                textAnchor="middle"
              >
                {Math.round(value)}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

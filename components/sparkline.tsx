import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SparklineProps {
  data: number[];
  width: number;
  height: number;
  color: string;
}

function buildSmoothPath(data: number[], width: number, height: number): string {
  if (data.length < 2) return '';

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const usableHeight = height - padding * 2;
  const stepX = width / (data.length - 1);

  const points = data.map((value, index) => ({
    x: index * stepX,
    y: padding + usableHeight - ((value - min) / range) * usableHeight,
  }));

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX1 = current.x + stepX * 0.4;
    const controlY1 = current.y;
    const controlX2 = next.x - stepX * 0.4;
    const controlY2 = next.y;
    path += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${next.x},${next.y}`;
  }

  return path;
}

export function Sparkline({ data, width, height, color }: SparklineProps) {
  if (data.length < 2) {
    return <View style={{ width, height }} />;
  }

  const pathD = buildSmoothPath(data, width, height);

  return (
    <View
      style={{ width, height }}
      accessibilityRole="image"
      accessibilityLabel="Sparkline chart"
    >
      <Svg width={width} height={height}>
        <Path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

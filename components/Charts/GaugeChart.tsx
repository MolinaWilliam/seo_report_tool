'use client';

import { getHealthScoreColor, getHealthScoreLabel } from '@/lib/utils';

interface GaugeChartProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function GaugeChart({
  value,
  maxValue = 100,
  size = 'md',
  showLabel = true,
}: GaugeChartProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const rotation = (percentage / 100) * 180;

  const sizeClasses = {
    sm: 'w-24 h-12',
    md: 'w-32 h-16',
    lg: 'w-48 h-24',
  };

  const fontSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const colorClass = getHealthScoreColor(value);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 50"
          preserveAspectRatio="xMidYMax meet"
        >
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${rotation * 0.785} 1000`}
            className={colorClass}
          />
        </svg>

        {/* Value */}
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className={`font-bold ${fontSizes[size]} ${colorClass}`}>
            {value}
          </span>
        </div>
      </div>

      {showLabel && (
        <span className={`text-sm font-medium mt-1 ${colorClass}`}>
          {getHealthScoreLabel(value)}
        </span>
      )}
    </div>
  );
}

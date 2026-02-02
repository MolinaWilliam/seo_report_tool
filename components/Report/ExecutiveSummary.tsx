'use client';

import {
  TrendingUp,
  Link as LinkIcon,
  Award,
  Search,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import type { ReportData } from '@/lib/types';

interface ExecutiveSummaryProps {
  data: ReportData['executive'];
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  const metrics = [
    {
      label: 'Est. Traffic',
      value: formatNumber(data.traffic),
      suffix: '/mo',
      change: data.trafficChange,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Backlinks',
      value: formatNumber(data.backlinks),
      suffix: '',
      change: data.backlinksChange,
      icon: LinkIcon,
      color: 'text-purple-600',
    },
    {
      label: 'Authority',
      value: data.authority,
      suffix: '/100',
      change: data.authorityChange,
      icon: Award,
      color: 'text-amber-600',
    },
    {
      label: 'Keywords',
      value: formatNumber(data.keywords),
      suffix: '',
      change: null,
      icon: Search,
      color: 'text-green-600',
    },
    {
      label: 'AI Share of Voice',
      value: data.aiShareOfVoice ?? 0,
      suffix: '%',
      change: null,
      icon: Sparkles,
      color: 'text-cyan-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <metric.icon className={`w-5 h-5 ${metric.color}`} />
            <span className="text-sm text-gray-500">{metric.label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`metric-value ${metric.color}`}>
              {metric.value}
            </span>
            <span className="text-sm text-gray-400">{metric.suffix}</span>
          </div>
          {metric.change !== null && metric.change !== undefined && (
            <div
              className={`metric-change flex items-center gap-1 ${
                metric.change > 0
                  ? 'text-green-600'
                  : metric.change < 0
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {metric.change > 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : metric.change < 0 ? (
                <ArrowDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              <span>
                {metric.change > 0 ? '+' : ''}
                {metric.change}%
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

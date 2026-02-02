'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import { formatNumber } from '@/lib/utils';

interface DataPoint {
  date: string;
  top1_5: number;
  top6_10: number;
  top11_20: number;
  top21_50: number;
  top51_100: number;
  traffic?: number;
}

interface StackedAreaChartProps {
  data: DataPoint[];
  showTrafficLine?: boolean;
}

export default function StackedAreaChart({ data, showTrafficLine = true }: StackedAreaChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No historical data available
      </div>
    );
  }

  // Format date for display (e.g., "Jan 2022")
  const formattedData = data.map(item => ({
    ...item,
    displayDate: formatDateLabel(item.date),
  }));

  // Show fewer tick labels on X axis for readability
  const tickInterval = Math.max(1, Math.floor(formattedData.length / 12));

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            interval={tickInterval}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatNumber(value)}
          />
          {showTrafficLine && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="top51_100"
            stackId="1"
            stroke="#eab308"
            fill="#fef08a"
            name="Positions 51-100"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="top21_50"
            stackId="1"
            stroke="#22d3ee"
            fill="#a5f3fc"
            name="Positions 21-50"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="top11_20"
            stackId="1"
            stroke="#4ade80"
            fill="#bbf7d0"
            name="Positions 11-20"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="top6_10"
            stackId="1"
            stroke="#a855f7"
            fill="#e9d5ff"
            name="Positions 6-10"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="top1_5"
            stackId="1"
            stroke="#f97316"
            fill="#fed7aa"
            name="Positions 1-5"
          />
          {showTrafficLine && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="traffic"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Traffic"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDateLabel(date: string): string {
  const [year, month] = date.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
} from 'recharts';
import { formatNumber } from '@/lib/utils';

interface DataPoint {
  date: string;
  backlinks: number;
  refdomains: number;
}

interface TimelineChartProps {
  data: DataPoint[];
  showRefDomainsLine?: boolean;
  height?: number;
}

export default function TimelineChart({
  data,
  showRefDomainsLine = true,
  height = 300,
}: TimelineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500" style={{ height }}>
        No historical data available
      </div>
    );
  }

  // Format date for display (e.g., "Jan 2025")
  const formattedData = data.map(item => ({
    ...item,
    displayDate: formatDateLabel(item.date),
  }));

  // Calculate growth metrics
  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];
  const backlinkGrowth = lastPoint.backlinks - firstPoint.backlinks;
  const backlinkGrowthPercent = firstPoint.backlinks > 0
    ? ((backlinkGrowth / firstPoint.backlinks) * 100).toFixed(0)
    : 0;
  const refdomainGrowth = lastPoint.refdomains - firstPoint.refdomains;
  const refdomainGrowthPercent = firstPoint.refdomains > 0
    ? ((refdomainGrowth / firstPoint.refdomains) * 100).toFixed(0)
    : 0;

  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="backlinkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            {showRefDomainsLine && (
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
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="line"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="backlinks"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#backlinkGradient)"
              name="Backlinks"
            />
            {showRefDomainsLine && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="refdomains"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Ref. Domains"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">📈</span>
            <span className="text-sm text-blue-700">
              <strong>{backlinkGrowth > 0 ? '+' : ''}{formatNumber(backlinkGrowth)}</strong> backlinks ({backlinkGrowthPercent}%)
            </span>
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">📈</span>
            <span className="text-sm text-green-700">
              <strong>{refdomainGrowth > 0 ? '+' : ''}{formatNumber(refdomainGrowth)}</strong> ref. domains ({refdomainGrowthPercent}%)
            </span>
          </div>
        </div>
      </div>
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

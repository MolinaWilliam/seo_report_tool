'use client';

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceArea,
  Legend,
} from 'recharts';
import { formatNumber } from '@/lib/utils';

interface DataPoint {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
}

interface ScatterChartProps {
  data: DataPoint[];
  showSweetSpotZone?: boolean;
  sweetSpotThresholds?: {
    minVolume: number;
    maxDifficulty: number;
  };
}

export default function ScatterChart({
  data,
  showSweetSpotZone = true,
  sweetSpotThresholds = { minVolume: 1000, maxDifficulty: 40 },
}: ScatterChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No keyword data available
      </div>
    );
  }

  // Find axis ranges
  const maxVolume = Math.max(...data.map(d => d.volume), 1000);
  const maxDifficulty = 100;

  // Categorize points
  const isSweetSpot = (point: DataPoint) =>
    point.volume >= sweetSpotThresholds.minVolume &&
    point.difficulty < sweetSpotThresholds.maxDifficulty;

  const sweetSpotCount = data.filter(isSweetSpot).length;

  return (
    <div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="difficulty"
              domain={[0, maxDifficulty]}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              label={{ value: 'Difficulty', position: 'bottom', offset: -5, fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              type="number"
              dataKey="volume"
              domain={[0, maxVolume * 1.1]}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
              label={{ value: 'Volume', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6b7280' }}
            />
            {showSweetSpotZone && (
              <ReferenceArea
                x1={0}
                x2={sweetSpotThresholds.maxDifficulty}
                y1={sweetSpotThresholds.minVolume}
                y2={maxVolume * 1.1}
                fill="#22c55e"
                fillOpacity={0.1}
                stroke="#22c55e"
                strokeDasharray="3 3"
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              content={() => (
                <div className="flex items-center justify-center gap-6 text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Sweet Spot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600">Other Keywords</span>
                  </div>
                </div>
              )}
            />
            <Scatter name="Keywords" data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={isSweetSpot(entry) ? '#22c55e' : '#3b82f6'}
                  fillOpacity={0.7}
                  stroke={isSweetSpot(entry) ? '#16a34a' : '#2563eb'}
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
      {showSweetSpotZone && sweetSpotCount > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-lg">🎯</span>
            <span className="font-medium">
              {sweetSpotCount} keyword{sweetSpotCount !== 1 ? 's' : ''} with Volume ≥{formatNumber(sweetSpotThresholds.minVolume)} and Difficulty &lt;{sweetSpotThresholds.maxDifficulty}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
      <p className="font-semibold text-gray-900 mb-2 max-w-xs truncate">{data.keyword}</p>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Volume:</span>
          <span className="font-medium text-gray-900">{formatNumber(data.volume)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Difficulty:</span>
          <span className="font-medium text-gray-900">{data.difficulty}</span>
        </div>
        {data.cpc !== undefined && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">CPC:</span>
            <span className="font-medium text-gray-900">${data.cpc.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

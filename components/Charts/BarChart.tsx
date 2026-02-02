'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  horizontal?: boolean;
  showGrid?: boolean;
  color?: string;
}

export default function BarChart({
  data,
  horizontal = false,
  showGrid = true,
  color = '#0ea5e9',
}: BarChartProps) {
  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={data.length * 40 + 20}>
        <RechartsBarChart data={data} layout="vertical" margin={{ left: 80 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" horizontal={false} />}
          <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={75}
          />
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), 'Count']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsBarChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => v.toLocaleString()} />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), 'Count']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || color} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

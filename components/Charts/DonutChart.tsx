'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

export default function DonutChart({
  data,
  innerRadius = 50,
  outerRadius = 70,
  showLegend = true,
}: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
            'Count',
          ]}
        />
        {showLegend && (
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value: string) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

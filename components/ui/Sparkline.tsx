import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';

let sparklineCounter = 0;

export const Sparkline = ({ data, color }: { data: any[], color: string }) => {
  const [gradientId] = useState(() => `sparkline-grad-${sparklineCounter++}`);
  
  // Recharts needs at least 2 points to draw a curve/line; otherwise it renders a single dot.
  const chartData = data && data.length === 1 
    ? [ { ...data[0], date: 'previous' }, ...data ] 
    : data;

  const yDomain = [(dataMin: number) => (dataMin === 0 ? 0 : dataMin * 0.95), (dataMax: number) => (dataMax === 0 ? 10 : dataMax * 1.05)];

  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={yDomain} />
          <Area type="monotone" dataKey="price" stroke={color} fill={`url(#${gradientId})`} strokeWidth={2} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

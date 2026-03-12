import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

let sparklineCounter = 0;

export const Sparkline = ({ data, color }: { data: any[], color: string }) => {
  const [gradientId] = useState(() => `sparkline-grad-${sparklineCounter++}`);
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="price" stroke={color} fill={`url(#${gradientId})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

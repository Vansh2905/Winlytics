'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EloChart({ data, isLoading }) {
  if (isLoading) {
    return <Skeleton className="h-80 rounded-xl" />;
  }

  if (!data?.length) {
    return (
      <Card className="rounded-xl">
        <CardContent className="flex items-center justify-center h-80 text-muted-foreground text-sm">
          No chart data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg">ELO & Win Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="match" className="text-xs" />
            <YAxis yAxisId="elo" domain={['auto', 'auto']} className="text-xs" />
            <YAxis yAxisId="rate" orientation="right" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line yAxisId="elo" type="monotone" dataKey="elo" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} name="ELO" />
            <Line yAxisId="rate" type="monotone" dataKey="win_rate" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} name="Win Rate" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

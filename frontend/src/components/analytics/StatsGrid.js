import { TrendingUp, Activity, MapPin, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPercent } from '@/lib/utils';

const STAT_CONFIG = [
  { key: 'current_elo', label: 'Current ELO', icon: TrendingUp, format: (v) => Math.round(v) },
  { key: 'form', label: 'Last 10 Form', icon: Activity, format: (v) => formatPercent(v) },
  { key: 'city_experience', label: 'City Experience', icon: MapPin, format: (v) => Math.round(v) },
  { key: 'formats', label: 'Format ELO', icon: Trophy, format: (v) => Math.round(v) },
];

export default function StatsGrid({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} className="rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold">{format(data[key] ?? 0)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { History } from 'lucide-react';
import ConfidenceBadge from '@/components/shared/ConfidenceBadge';
import EmptyState from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPercent, formatDateTime, cn } from '@/lib/utils';

export default function HistoryList({ items, isLoading, compact = false }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: compact ? 3 : 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!items?.length) {
    return (
      <EmptyState
        icon={History}
        title="No predictions yet"
        description="Run a prediction to see it logged here. Requires MongoDB on the backend."
        actionLabel="Predict a Match"
        actionHref="/predict"
      />
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.timestamp}-${item.team1}-${item.team2}`}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
          >
            <div>
              <p className="text-sm font-medium">{item.team1} vs {item.team2}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Winner: {item.predicted_winner}
              </p>
            </div>
            <ConfidenceBadge confidence={item.confidence} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Match</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Format</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Winner</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Probabilities</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.timestamp}-${item.team1}-${item.team2}`} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="p-4 text-muted-foreground whitespace-nowrap">
                  {formatDateTime(item.timestamp)}
                </td>
                <td className="p-4 font-medium whitespace-nowrap">
                  {item.team1} vs {item.team2}
                </td>
                <td className="p-4">{item.format}</td>
                <td className={cn('p-4 font-medium', item.predicted_winner === item.team1 ? 'text-primary' : 'text-green-600 dark:text-green-400')}>
                  {item.predicted_winner}
                </td>
                <td className="p-4 text-muted-foreground whitespace-nowrap">
                  {formatPercent(item.team1_probability)} / {formatPercent(item.team2_probability)}
                </td>
                <td className="p-4">
                  <ConfidenceBadge confidence={item.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ConfidenceBadge from '@/components/shared/ConfidenceBadge';
import { formatPercent } from '@/lib/utils';
import { cn } from '@/lib/utils';

function ProbabilityBar({ team, probability, isWinner }) {
  const pct = probability * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className={cn('font-medium', isWinner && 'text-primary')}>{team}</span>
        <span className="font-semibold">{formatPercent(probability)}</span>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isWinner ? 'bg-primary' : 'bg-muted-foreground/30'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function PredictionResult({ result, isPending, error }) {
  if (isPending) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive font-medium">Prediction failed</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="rounded-xl border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Trophy className="w-10 h-10 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-sm">
            Fill in match details and click &quot;Get Prediction&quot; to see results.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isTeam1Winner = result.predicted_winner === result.team1;

  return (
    <Card
      className={cn(
        'rounded-xl transition-shadow duration-300',
        isTeam1Winner ? 'glow-blue' : 'glow-green'
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Prediction Result</CardTitle>
          <ConfidenceBadge confidence={result.confidence} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <Trophy className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Predicted Winner</p>
            <p className="text-lg font-bold text-primary">{result.predicted_winner}</p>
          </div>
        </div>

        <div className="space-y-4">
          <ProbabilityBar
            team={result.team1}
            probability={result.team1_probability}
            isWinner={isTeam1Winner}
          />
          <ProbabilityBar
            team={result.team2}
            probability={result.team2_probability}
            isWinner={!isTeam1Winner}
          />
        </div>

        {result.cached && (
          <p className="text-xs text-muted-foreground">Cached result</p>
        )}
      </CardContent>
    </Card>
  );
}

import Link from 'next/link';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime, formatCountdown } from '@/lib/utils';

function buildPredictUrl(match) {
  const params = new URLSearchParams({
    team1: match.team1,
    team2: match.team2,
    format: match.format || 'T20',
    event: 'International',
  });
  if (match.venue) params.set('venue', match.venue);
  if (match.city) params.set('city', match.city);
  return `/predict?${params.toString()}`;
}

export default function MatchCard({ match }) {
  const countdown = formatCountdown(match.date);

  return (
    <Card className="rounded-xl hover:border-primary/40 hover:shadow-sm transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary">{match.format || 'T20'}</Badge>
          {countdown && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {countdown}
            </span>
          )}
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold">{match.team1}</p>
          <p className="text-sm text-muted-foreground my-1">vs</p>
          <p className="text-lg font-semibold">{match.team2}</p>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground mb-5">
          {(match.venue || match.city) && (
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {[match.venue, match.city].filter(Boolean).join(', ')}
            </p>
          )}
          <p>{formatDateTime(match.date)}</p>
        </div>

        <Button asChild className="w-full" size="sm">
          <Link href={buildPredictUrl(match)}>
            Predict <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

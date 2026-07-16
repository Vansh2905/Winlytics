'use client';
import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import MatchCard from '@/components/schedule/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSchedule } from '@/hooks/useWinlytics';
import { FORMATS } from '@/constants';

export default function SchedulePageClient() {
  const { data: matches, isLoading, error } = useSchedule();
  const [formatFilter, setFormatFilter] = useState('All');

  const filtered = useMemo(() => {
    if (!matches) return [];
    if (formatFilter === 'All') return matches;
    return matches.filter((m) => m.format === formatFilter);
  }, [matches, formatFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Upcoming Schedule"
        description="Browse upcoming cricket fixtures and get instant AI predictions."
      />

      <Tabs value={formatFilter} onValueChange={setFormatFilter} className="mb-8">
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          {FORMATS.map((f) => (
            <TabsTrigger key={f} value={f}>{f}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          icon={Calendar}
          title="Failed to load schedule"
          description="Could not fetch upcoming matches. Make sure the backend is running."
          actionLabel="Try Predicting"
          actionHref="/predict"
        />
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No upcoming matches"
          description="No fixtures found. Check that CRICAPI_KEY is set on the backend, or predict a custom match."
          actionLabel="Predict a Match"
          actionHref="/predict"
        />
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((match) => (
            <MatchCard key={match.match_id ?? `${match.team1}-${match.team2}-${match.date}`} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

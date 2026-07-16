'use client';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import TeamSelect from '@/components/predict/TeamSelect';
import StatsGrid from '@/components/analytics/StatsGrid';
import EloChart from '@/components/analytics/EloChart';
import { useAnalytics } from '@/hooks/useWinlytics';

export default function AnalyticsPageClient() {
  const [team, setTeam] = useState('');
  const { data, isLoading, error } = useAnalytics(team);

  const errorMessage = error?.response?.data?.detail ?? error?.message;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Team Analytics"
        description="Explore ELO ratings, form, and performance trends for any team."
      />

      <div className="max-w-sm mb-8">
        <label className="text-sm font-medium mb-2 block">Select Team</label>
        <TeamSelect value={team} onChange={setTeam} placeholder="Choose a team" />
      </div>

      {!team && (
        <p className="text-muted-foreground text-sm">Select a team above to view analytics.</p>
      )}

      {team && error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{errorMessage || 'Failed to load analytics.'}</p>
        </div>
      )}

      {team && !error && (
        <div className="space-y-8">
          <StatsGrid data={data} isLoading={isLoading} />
          <EloChart data={data?.history} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}

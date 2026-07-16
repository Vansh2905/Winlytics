'use client';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTeams } from '@/hooks/useWinlytics';

export default function TeamSelect({ value, onChange, placeholder = 'Select team', exclude }) {
  const { data: teams, isLoading } = useTeams();
  const [search, setSearch] = useState('');

  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    return teams.filter(
      (t) =>
        t !== exclude &&
        t.toLowerCase().includes(search.toLowerCase())
    );
  }, [teams, exclude, search]);

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 pb-2">
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        {filteredTeams.length === 0 ? (
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">No teams found</div>
        ) : (
          filteredTeams.map((team) => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

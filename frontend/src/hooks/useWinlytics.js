import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeams, getSchedule, predictMatch, getHistory, getAnalytics } from '@/services/api';
import { QUERY_KEYS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

export function useTeams() {
  return useQuery({
    queryKey: QUERY_KEYS.TEAMS,
    queryFn: getTeams,
    staleTime: Infinity,
  });
}

export function useSchedule() {
  return useQuery({
    queryKey: QUERY_KEYS.SCHEDULE,
    queryFn: getSchedule,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHistory(limit = 20) {
  const { user } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.HISTORY(limit),
    queryFn: () => getHistory(limit, user?.token),
    enabled: !!user,
  });
}

export function useAnalytics(team) {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS(team),
    queryFn: () => getAnalytics(team),
    enabled: !!team,
  });
}

export function usePrediction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => predictMatch(payload, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import PredictForm from '@/components/predict/PredictForm';
import PredictionResult from '@/components/predict/PredictionResult';
import { usePrediction } from '@/hooks/useWinlytics';

export default function PredictPageClient() {
  const searchParams = useSearchParams();
  const { mutate, data, isPending, error } = usePrediction();

  const initialValues = useMemo(() => ({
    team1: searchParams.get('team1') ?? '',
    team2: searchParams.get('team2') ?? '',
    format: searchParams.get('format') ?? 'T20',
    event: searchParams.get('event') ?? 'International',
    venue: searchParams.get('venue') ?? '',
    city: searchParams.get('city') ?? '',
  }), [searchParams]);

  const errorMessage = error?.response?.data?.detail ?? error?.message;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Predict a Match"
        description="Select two teams and get AI-powered win probabilities in seconds."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PredictForm
          initialValues={initialValues}
          onSubmit={(payload) => mutate(payload)}
          isPending={isPending}
        />
        <PredictionResult
          result={data}
          isPending={isPending}
          error={errorMessage}
        />
      </div>
    </div>
  );
}

import { Suspense } from 'react';
import PredictPageClient from './PredictPageClient';

export const metadata = {
  title: 'Predict a Match — Winlytics',
  description: 'Get AI-powered cricket match predictions with win probabilities and confidence scores.',
};

export default function PredictPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-muted-foreground">Loading...</div>}>
      <PredictPageClient />
    </Suspense>
  );
}

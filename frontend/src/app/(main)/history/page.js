'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/shared/PageHeader';
import HistoryList from '@/components/history/HistoryList';
import { useHistory } from '@/hooks/useWinlytics';

function HistoryContent() {
  const { data, isLoading } = useHistory(20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Prediction History"
        description="View your recent match predictions and their outcomes."
      />
      <HistoryList items={data} isLoading={isLoading} />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}

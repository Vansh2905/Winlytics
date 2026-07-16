'use client';
import Link from 'next/link';
import { Target, Calendar, ArrowRight } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/shared/PageHeader';
import HistoryList from '@/components/history/HistoryList';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/hooks/useWinlytics';

const QUICK_ACTIONS = [
  {
    icon: Target,
    title: 'Predict a Match',
    description: 'Get AI win probabilities for any two teams.',
    href: '/predict',
  },
  {
    icon: Calendar,
    title: 'View Schedule',
    description: 'Browse upcoming fixtures and predict instantly.',
    href: '/schedule',
  },
];

function DashboardContent() {
  const { user } = useAuth();
  const { data: history, isLoading: historyLoading } = useHistory(5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'Fan'}`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {QUICK_ACTIONS.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Recent Predictions</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/history">
            View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <HistoryList items={history} isLoading={historyLoading} compact />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

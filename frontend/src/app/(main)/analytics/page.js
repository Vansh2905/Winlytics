import AnalyticsPageClient from './AnalyticsPageClient';

export const metadata = {
  title: 'Team Analytics — Winlytics',
  description: 'Explore team ELO ratings, form, and performance trends with interactive charts.',
};

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}

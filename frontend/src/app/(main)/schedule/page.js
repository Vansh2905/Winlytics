import SchedulePageClient from './SchedulePageClient';

export const metadata = {
  title: 'Match Schedule — Winlytics',
  description: 'Browse upcoming cricket fixtures and get AI predictions before the match starts.',
};

export default function SchedulePage() {
  return <SchedulePageClient />;
}

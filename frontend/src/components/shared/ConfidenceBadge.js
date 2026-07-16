import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CONFIDENCE_STYLES = {
  high: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  moderate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  low: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export default function ConfidenceBadge({ confidence, className }) {
  const level = confidence?.toLowerCase() ?? 'low';
  return (
    <Badge
      variant="outline"
      className={cn('capitalize', CONFIDENCE_STYLES[level] ?? CONFIDENCE_STYLES.low, className)}
    >
      {level} confidence
    </Badge>
  );
}

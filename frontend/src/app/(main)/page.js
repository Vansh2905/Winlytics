import Link from 'next/link';
import { ArrowRight, Zap, Target, BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Winlytics — AI Cricket Match Prediction',
  description: 'Predict the winning team of any cricket match with our CatBoost AI model. T20, ODI, and Test formats supported.',
};

const FEATURES = [
  {
    icon: Target,
    title: 'Accurate Predictions',
    description: 'CatBoost ML model trained on thousands of international matches with win probability scores.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Team ELO ratings, venue intelligence, head-to-head records, and form tracking.',
  },
  {
    icon: Calendar,
    title: 'Match Schedule',
    description: 'Browse upcoming fixtures and get instant AI predictions before the match starts.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Predictions return in under a second with smart caching for repeated queries.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Select Teams', desc: 'Choose Team 1, Team 2, and the match format.' },
  { step: '02', title: 'Add Context', desc: 'Optionally provide venue city for location intelligence.' },
  { step: '03', title: 'Get Prediction', desc: 'Our AI returns win probabilities and key match factors instantly.' },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Winlytics AI · v2.0 Live
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Predict Cricket Matches with{' '}
            <span className="text-primary">AI Precision</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enter any two teams. Get win probabilities, confidence scores, and key match factors powered by machine learning — in under a second.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/predict">
                Start Predicting <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/schedule">View Schedule</Link>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            {[
              { value: '10+', label: 'Teams' },
              { value: '3', label: 'Formats' },
              { value: '< 1s', label: 'Response' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Three steps to your prediction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Built for cricket enthusiasts who want data-driven insights.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to predict your first match?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            No account needed. Just pick two teams and let the AI do the rest.
          </p>
          <Button size="lg" asChild>
            <Link href="/predict">
              Predict Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

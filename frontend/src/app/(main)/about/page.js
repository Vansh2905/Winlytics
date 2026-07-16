import Link from 'next/link';
import { ArrowRight, Zap, Brain, Database, Code2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'About — Winlytics',
  description: 'Learn how Winlytics uses machine learning to predict cricket match outcomes.',
};

const TECH_STACK = [
  {
    icon: Brain,
    title: 'CatBoost ML Model',
    description: 'Gradient boosting model trained on international cricket data with ELO ratings, form, and venue features.',
  },
  {
    icon: Code2,
    title: 'FastAPI Backend',
    description: 'Python backend serving predictions via a REST API with async MongoDB logging and model versioning.',
  },
  {
    icon: Database,
    title: 'MongoDB Atlas',
    description: 'Every prediction is logged to the cloud for history tracking, analytics, and future model retraining.',
  },
  {
    icon: Zap,
    title: 'Next.js Frontend',
    description: 'React-based UI with server components, TanStack Query for data fetching, and Tailwind CSS styling.',
  },
];

const FEATURES_DETAIL = [
  {
    step: '01',
    title: 'ELO Rating System',
    desc: 'Each team carries a dynamic ELO score updated after every match, reflecting current form and historical strength.',
  },
  {
    step: '02',
    title: 'Venue Intelligence',
    desc: 'City experience scores capture how often a team has played at a given location, giving home-ground advantage weight.',
  },
  {
    step: '03',
    title: 'Confidence Scoring',
    desc: 'Predictions are tagged high, moderate, or low confidence based on win probability thresholds from the model.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            About Winlytics
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Built for Cricket.{' '}
            <span className="text-primary">Powered by AI.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Winlytics is a full-stack machine learning platform that predicts cricket match outcomes using team ELO ratings, recent form, venue data, and a CatBoost model trained on thousands of international matches.
          </p>
        </div>
      </section>

      {/* ── How the model works ──────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight">How the Model Works</h2>
            <p className="mt-3 text-muted-foreground">Three core signals behind every prediction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES_DETAIL.map(({ step, title, desc }) => (
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

      {/* ── Tech Stack ───────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight">Tech Stack</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Every layer of Winlytics is purpose-built for speed and accuracy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECH_STACK.map(({ icon: Icon, title, description }) => (
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

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10+', label: 'Teams Supported' },
              { value: '3', label: 'Match Formats' },
              { value: '< 1s', label: 'Prediction Time' },
              { value: 'v1', label: 'Model Version' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-6">
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Try it yourself</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Pick any two teams and see the AI prediction in under a second.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/predict">
                Start Predicting <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

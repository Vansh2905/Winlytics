'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FORMATS, EVENTS, PREDICTION_DEFAULTS } from '@/constants';
import TeamSelect from './TeamSelect';

export default function PredictForm({ initialValues = {}, onSubmit, isPending }) {
  const [form, setForm] = useState({ ...PREDICTION_DEFAULTS, ...initialValues });
  const [error, setError] = useState('');

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.team1 || !form.team2) {
      setError('Please select both teams.');
      return;
    }
    if (form.team1 === form.team2) {
      setError('Teams must be different.');
      return;
    }

    onSubmit({
      team1: form.team1,
      team2: form.team2,
      event: form.event,
      format: form.format,
      venue: form.venue || 'Unknown Venue',
      city: form.city || 'Unknown City',
    });
  };

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Match Details</CardTitle>
        <CardDescription>Select teams and provide match context for the AI model.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team 1</label>
              <TeamSelect
                value={form.team1}
                onChange={(v) => update('team1', v)}
                placeholder="Select Team 1"
                exclude={form.team2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Team 2</label>
              <TeamSelect
                value={form.team2}
                onChange={(v) => update('team2', v)}
                placeholder="Select Team 2"
                exclude={form.team1}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={form.format} onValueChange={(v) => update('format', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event</label>
              <Select value={form.event} onValueChange={(v) => update('event', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENTS.map((ev) => (
                    <SelectItem key={ev} value={ev}>{ev}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue</label>
              <Input
                placeholder="e.g. Melbourne Cricket Ground"
                value={form.venue}
                onChange={(e) => update('venue', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                placeholder="e.g. Melbourne"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Predicting...' : 'Get Prediction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

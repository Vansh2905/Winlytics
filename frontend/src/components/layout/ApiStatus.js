'use client';
import { useEffect, useState } from 'react';
import { getApiHealth } from '@/services/api';

export default function ApiStatus() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    getApiHealth()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  if (online === null) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
        Checking API...
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
      />
      {online ? 'API Online' : 'API Offline'}
    </span>
  );
}

// Query keys — single source of truth to avoid typos
export const QUERY_KEYS = {
  TEAMS: ['teams'],
  SCHEDULE: ['schedule'],
  HISTORY: (limit) => ['history', limit],
  ANALYTICS: (team) => ['analytics', team],
  MODELS: ['models'],
};

// Match formats supported by backend
export const FORMATS = ['T20', 'ODI', 'Test'];

// Event types for prediction context
export const EVENTS = ['International', 'IPL', 'BBL', 'PSL', 'County', 'Other'];

// Default form values for prediction
export const PREDICTION_DEFAULTS = {
  team1: '',
  team2: '',
  event: 'International',
  format: 'T20',
  venue: '',
  city: '',
};

export const NAV_LINKS = [
  { href: '/predict', label: 'Predict' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/about', label: 'About' },
];


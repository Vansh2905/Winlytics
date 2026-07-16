import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Response interceptor for token expiration and unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('winlytics_token');
        if (token) {
          localStorage.removeItem('winlytics_token');
          // Redirect to login with expired query param to show feedback to the user
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ───────────────────────────────────────────────
export const authRegister = (data) => api.post('/auth/register', data).then(r => r.data);
export const authLogin = (data) => api.post('/auth/login', data).then(r => r.data);
export const authMe = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// ── Teams ─────────────────────────────────────────────────
export const getTeams = () => api.get('/teams').then(r => r.data.teams);

// ── Schedule ─────────────────────────────────────────────
export const getSchedule = () => api.get('/schedule').then(r => r.data.matches);

// ── Predict ──────────────────────────────────────────────
export const predictMatch = (payload, token) => api.post('/predict', payload, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
}).then(r => r.data);

// ── History ──────────────────────────────────────────────
export const getHistory = (limit = 20, token) => api.get(`/history?limit=${limit}`, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
}).then(r => r.data.history);

// ── Analytics ────────────────────────────────────────────
export const getAnalytics = (team) => api.get(`/analytics/${encodeURIComponent(team)}`).then(r => r.data);

// ── Models ───────────────────────────────────────────────
export const getModels = () => api.get('/models').then(r => r.data);

// ── Health ───────────────────────────────────────────────
export const getApiHealth = () => api.get('/').then(r => r.data);

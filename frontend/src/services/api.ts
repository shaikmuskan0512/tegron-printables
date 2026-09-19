import axios, { AxiosError, type AxiosInstance } from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

const USER_KEY = 'tp_user_token';
const ADMIN_KEY = 'tp_admin_token';

function store(key: string) {
  return {
    get: () => {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set: (v: string) => {
      try { localStorage.setItem(key, v); } catch { /* storage unavailable */ }
    },
    clear: () => {
      try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
    },
  };
}

export const userToken = store(USER_KEY);
export const adminToken = store(ADMIN_KEY);

function createClient(token: ReturnType<typeof store>, logoutEvent: string): AxiosInstance {
  const client = axios.create({ baseURL: API_BASE, timeout: 30_000 });
  client.interceptors.request.use((config) => {
    const t = token.get();
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });
  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      const hadToken = Boolean(error.config?.headers?.Authorization);
      if (hadToken && (error.response?.status === 401)) {
        token.clear();
        window.dispatchEvent(new Event(logoutEvent));
      }
      return Promise.reject(error);
    },
  );
  return client;
}

/** Public + member requests */
export const api = createClient(userToken, 'tp:user-logout');
/** Admin requests use a separate token */
export const adminHttp = createClient(adminToken, 'tp:admin-logout');

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

/** Friendly message for the UI; never surfaces server internals. */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isCancel(err)) return '';
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    if (!err.response) return "We couldn't reach the server. Please check your connection.";
    const msg = err.response.data?.message;
    if (err.response.status < 500 && typeof msg === 'string') return msg;
  }
  return fallback;
}

export function getFieldErrors(err: unknown): Record<string, string> {
  if (axios.isAxiosError<ApiErrorBody>(err) && err.response?.data?.errors) {
    return err.response.data.errors;
  }
  return {};
}

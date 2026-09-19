import type { Admin, CustomerQuery, Idea, User } from '@/types';
import { api } from './api';

export interface AuthResponse {
  token: string;
  user: User;
}

export type Role = 'user' | 'admin';

/** POST /auth/login: the backend decides the role and returns the matching profile. */
export type LoginResponse =
  | { role: 'user'; token: string; user: User }
  | { role: 'admin'; token: string; admin: Admin };

export const authService = {
  signup: (body: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signup', body).then((r) => r.data),
  login: (body: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', body).then((r) => r.data),
  me: () => api.get<{ user: User }>('/auth/me').then((r) => r.data.user),
};

export const memberService = {
  updateProfile: (name: string) => api.patch<{ user: User }>('/users/me', { name }).then((r) => r.data.user),
  submitQuery: (body: { name: string; email: string; query: string }) =>
    api.post<{ query: CustomerQuery }>('/queries', body).then((r) => r.data.query),
  myQueries: () => api.get<{ queries: CustomerQuery[] }>('/queries/my').then((r) => r.data.queries),
  submitIdea: (body: { name: string; email: string; productIdea: string; description: string }) =>
    api.post<{ idea: Idea }>('/ideas', body).then((r) => r.data.idea),
  myIdeas: () => api.get<{ ideas: Idea[] }>('/ideas/my').then((r) => r.data.ideas),
};
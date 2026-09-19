import type {
  Admin, AdminUserRow, Category, CustomerQuery, DashboardStats, Idea, IdeaStatus, Paged, Product, QueryStatus,
} from '@/types';
import { adminHttp } from './api';

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

const clean = (p: ListParams) =>
  Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== ''));

export const adminService = {
  me: () => adminHttp.get<{ admin: Admin }>('/admin/auth/me').then((r) => r.data.admin),
  stats: () => adminHttp.get<DashboardStats>('/admin/dashboard/stats').then((r) => r.data),

  users: {
    list: (p: ListParams) => adminHttp.get<Paged<AdminUserRow>>('/admin/users', { params: clean(p) }).then((r) => r.data),
    get: (id: string) =>
      adminHttp
        .get<{ user: AdminUserRow; recentQueries: CustomerQuery[]; recentIdeas: Idea[] }>(`/admin/users/${id}`)
        .then((r) => r.data),
    remove: (id: string) => adminHttp.delete(`/admin/users/${id}`),
  },

  products: {
    create: (fd: FormData) => adminHttp.post<{ product: Product }>('/admin/products', fd).then((r) => r.data.product),
    update: (id: string, fd: FormData) =>
      adminHttp.patch<{ product: Product }>(`/admin/products/${id}`, fd).then((r) => r.data.product),
    remove: (id: string) => adminHttp.delete(`/admin/products/${id}`),
  },

  categories: {
    list: () => adminHttp.get<{ categories: Category[] }>('/admin/categories').then((r) => r.data.categories),
    create: (body: { name: string; icon?: string }) =>
      adminHttp.post<{ category: Category }>('/admin/categories', body).then((r) => r.data.category),
    update: (id: string, body: { name?: string; icon?: string }) =>
      adminHttp.patch<{ category: Category }>(`/admin/categories/${id}`, body).then((r) => r.data.category),
    remove: (id: string) => adminHttp.delete(`/admin/categories/${id}`),
  },

  queries: {
    list: (p: ListParams) => adminHttp.get<Paged<CustomerQuery>>('/admin/queries', { params: clean(p) }).then((r) => r.data),
    setStatus: (id: string, status: QueryStatus) =>
      adminHttp.patch<{ item: CustomerQuery }>(`/admin/queries/${id}/status`, { status }).then((r) => r.data.item),
    remove: (id: string) => adminHttp.delete(`/admin/queries/${id}`),
  },

  ideas: {
    list: (p: ListParams) => adminHttp.get<Paged<Idea>>('/admin/ideas', { params: clean(p) }).then((r) => r.data),
    setStatus: (id: string, status: IdeaStatus) =>
      adminHttp.patch<{ item: Idea }>(`/admin/ideas/${id}/status`, { status }).then((r) => r.data.item),
    remove: (id: string) => adminHttp.delete(`/admin/ideas/${id}`),
  },
};
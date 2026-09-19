import type { Category, Product, ProductListResponse } from '@/types';
import { api } from './api';

export interface ProductQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const catalogService = {
  async listProducts(params: ProductQuery, signal?: AbortSignal) {
    const clean: Record<string, string | number> = {};
    if (params.search) clean.search = params.search;
    if (params.category && params.category !== 'all') clean.category = params.category;
    clean.page = params.page ?? 1;
    clean.limit = params.limit ?? 12;
    const { data } = await api.get<ProductListResponse>('/products', { params: clean, signal });
    return data;
  },
  async getProduct(idOrSlug: string) {
    const { data } = await api.get<{ product: Product }>(`/products/${encodeURIComponent(idOrSlug)}`);
    return data.product;
  },
  async listCategories() {
    const { data } = await api.get<{ categories: Category[] }>('/categories');
    return data.categories;
  },
};

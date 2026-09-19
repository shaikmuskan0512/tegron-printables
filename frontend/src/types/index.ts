export interface User {
  name: string;
  email: string;
  joinedAt: string;
}

export interface Admin {
  name: string;
  email: string;
}

export type CategoryIconName =
  | 'sun' | 'book-open' | 'palette' | 'scissors' | 'puzzle' | 'star'
  | 'heart' | 'pencil' | 'shapes' | 'sparkles' | 'baby' | 'calculator';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: CategoryIconName;
  createdAt: string;
  productCount?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  etsyUrl: string;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export type QueryStatus = 'pending' | 'resolved';
export type IdeaStatus = 'submitted' | 'reviewed';

interface SubmissionBase {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
}

export interface CustomerQuery extends SubmissionBase {
  query: string;
  status: QueryStatus;
}

export interface Idea extends SubmissionBase {
  productIdea: string;
  description: string;
  status: IdeaStatus;
}

export interface Paged<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  queryCount: number;
  ideaCount: number;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalQueries: number;
    totalIdeas: number;
    pendingQueries: number;
    newIdeas: number;
  };
  recentQueries: CustomerQuery[];
  recentIdeas: Idea[];
}

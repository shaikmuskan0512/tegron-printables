import { useCallback, useEffect, useRef, useState } from 'react';
import { catalogService, type ProductQuery } from '@/services/catalog.service';
import { getErrorMessage } from '@/services/api';
import type { ProductListResponse } from '@/types';

const EMPTY: ProductListResponse = { products: [], currentPage: 1, totalPages: 1, totalProducts: 0 };

/** Server-side search, filtering and pagination. Stale requests are aborted. */
export function useProducts(query: ProductQuery) {
  const [data, setData] = useState<ProductListResponse>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nonce, setNonce] = useState(0);
  const ctrl = useRef<AbortController | null>(null);

  const { search, category, page, limit } = query;

  useEffect(() => {
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    setLoading(true);
    setError('');
    catalogService
      .listProducts({ search, category, page, limit }, c.signal)
      .then((res) => setData(res))
      .catch((err) => {
        const msg = getErrorMessage(err, 'Unable to load products.');
        if (msg) setError(msg);
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [search, category, page, limit, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { ...data, loading, error, reload };
}

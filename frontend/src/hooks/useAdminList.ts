import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '@/services/api';
import type { ListParams } from '@/services/admin.service';
import type { Paged } from '@/types';
import { useDebounce } from './useDebounce';

/** Paginated, searchable admin list backed by an API call. */
export function useAdminList<T>(fetcher: (p: ListParams) => Promise<Paged<T>>, limit = 10) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState<Paged<T>>({ items: [], currentPage: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const q = useDebounce(search.trim(), 350);

  useEffect(() => setPage(1), [q, status]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetcher({ page, limit, search: q, status });
      // If the last item on a page was deleted, step back a page
      if (res.items.length === 0 && page > 1) setPage(res.totalPages);
      setData(res);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, limit, q, status]);

  useEffect(() => { void load(); }, [load]);

  const patchItem = (match: (t: T) => boolean, next: T) =>
    setData((d) => ({ ...d, items: d.items.map((i) => (match(i) ? next : i)) }));

  return { ...data, page, setPage, search, setSearch, status, setStatus, loading, error, reload: load, patchItem };
}

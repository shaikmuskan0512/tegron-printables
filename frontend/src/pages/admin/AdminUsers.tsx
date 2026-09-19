import { Eye, Trash2, Users } from 'lucide-react';
import { useCallback, useState } from 'react';
import { IconButton, PageHeader, SearchInput } from '@/components/admin/AdminUi';
import { ResponsiveTable, type Column } from '@/components/admin/ResponsiveTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/context/ToastContext';
import { useAdminList } from '@/hooks/useAdminList';
import { adminService, type ListParams } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import type { AdminUserRow, CustomerQuery, Idea } from '@/types';
import { formatDate } from '@/utils/format';

type Detail = { user: AdminUserRow; recentQueries: CustomerQuery[]; recentIdeas: Idea[] };

export default function AdminUsers() {
  const toast = useToast();
  const fetcher = useCallback((p: ListParams) => adminService.users.list(p), []);
  const list = useAdminList(fetcher);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [toDelete, setToDelete] = useState<AdminUserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const view = async (u: AdminUserRow) => {
    setDetail(null);
    setDetailOpen(true);
    try {
      setDetail(await adminService.users.get(u.id));
    } catch (e) {
      setDetailOpen(false);
      toast.error(getErrorMessage(e));
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminService.users.remove(toDelete.id);
      toast.success('User deleted.');
      setToDelete(null);
      void list.reload();
    } catch (e) {
      toast.error(getErrorMessage(e, 'User could not be deleted.'));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminUserRow>[] = [
    { key: 'name', header: 'Name', primary: true, render: (u) => <span className="font-semibold">{u.name}</span> },
    { key: 'email', header: 'Email', render: (u) => <span className="break-all text-ink-700">{u.email}</span> },
    { key: 'joined', header: 'Registered', render: (u) => formatDate(u.joinedAt), className: 'whitespace-nowrap' },
    { key: 'q', header: 'Queries', render: (u) => u.queryCount, className: 'text-center md:w-24' },
    { key: 'i', header: 'Ideas', render: (u) => u.ideaCount, className: 'text-center md:w-24' },
  ];

  return (
    <>
      <PageHeader title="Users" lead={`${list.total} registered member${list.total === 1 ? '' : 's'}`} action={<SearchInput value={list.search} onChange={list.setSearch} placeholder="Search name or email" />} />
      {list.error && <p role="alert" className="mb-4 rounded-2xl bg-coral-50 p-3 font-semibold text-coral-700">{list.error}</p>}
      <ResponsiveTable
        caption="Registered users"
        columns={columns}
        rows={list.items}
        rowKey={(u) => u.id}
        loading={list.loading}
        empty={<div className="rounded-3xl bg-white shadow-paper"><EmptyState tone="teal" icon={<Users className="h-9 w-9" />} title={list.search ? 'No users match that search.' : 'No users yet.'} /></div>}
        actions={(u) => (
          <>
            <IconButton label={`View ${u.name}`} onClick={() => view(u)}><Eye className="h-4 w-4" /></IconButton>
            <IconButton label={`Delete ${u.name}`} tone="danger" onClick={() => setToDelete(u)}><Trash2 className="h-4 w-4" /></IconButton>
          </>
        )}
      />
      <div className="mt-6"><Pagination page={list.currentPage} totalPages={list.totalPages} onChange={list.setPage} disabled={list.loading} /></div>

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="User details" size="lg">
        {!detail ? (
          <div className="space-y-3"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-24" /></div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-3xl bg-white p-5 shadow-paper">
              <p className="font-display text-2xl font-semibold">{detail.user.name}</p>
              <p className="break-all text-ink-500">{detail.user.email}</p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-cream-100 p-3"><dt className="text-xs text-ink-500">Joined</dt><dd className="font-semibold">{formatDate(detail.user.joinedAt)}</dd></div>
                <div className="rounded-2xl bg-teal-50 p-3"><dt className="text-xs text-ink-500">Queries</dt><dd className="font-display text-2xl font-bold">{detail.user.queryCount}</dd></div>
                <div className="rounded-2xl bg-coral-50 p-3"><dt className="text-xs text-ink-500">Ideas</dt><dd className="font-display text-2xl font-bold">{detail.user.ideaCount}</dd></div>
              </dl>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Recent queries', items: detail.recentQueries.map((q) => ({ id: q.id, t: q.query, s: q.status, d: q.createdAt })) },
                { title: 'Recent ideas', items: detail.recentIdeas.map((i) => ({ id: i.id, t: i.productIdea, s: i.status, d: i.createdAt })) },
              ].map((b) => (
                <div key={b.title}>
                  <h3 className="mb-2 font-display text-lg font-semibold">{b.title}</h3>
                  {b.items.length === 0 ? <p className="text-sm text-ink-500">No submissions yet.</p> : (
                    <ul className="space-y-2">
                      {b.items.map((i) => (
                        <li key={i.id} className="rounded-2xl bg-white p-3 text-sm shadow-paper">
                          <p className="line-clamp-2 font-semibold">{i.t}</p>
                          <p className="mt-1 flex items-center justify-between text-xs text-ink-500">{formatDate(i.d)} <StatusBadge status={i.s} /></p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this user?"
        message={`${toDelete?.name ?? ''}'s account, along with their queries and ideas, will be permanently removed.`}
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

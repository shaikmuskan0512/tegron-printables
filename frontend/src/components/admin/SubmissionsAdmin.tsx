import { Check, Eye, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FilterTabs, IconButton, NoSubmissions, PageHeader, SearchInput } from './AdminUi';
import { ResponsiveTable, type Column } from './ResponsiveTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/context/ToastContext';
import { useAdminList } from '@/hooks/useAdminList';
import type { ListParams } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import type { Paged } from '@/types';
import { formatDate } from '@/utils/format';

interface Base { id: string; name: string; email: string; status: string; createdAt: string }

export interface SubmissionConfig<T extends Base> {
  title: string;
  noun: string;
  statuses: [open: string, done: string];
  doneLabel: string;
  fetcher: (p: ListParams) => Promise<Paged<T>>;
  setStatus: (id: string, status: string) => Promise<T>;
  remove: (id: string) => Promise<unknown>;
  columns: Column<T>[];
  renderBody: (item: T) => React.ReactNode;
}

/** Shared admin screen for Queries and Ideas. */
export function SubmissionsAdmin<T extends Base>(cfg: SubmissionConfig<T>) {
  const toast = useToast();
  const list = useAdminList(cfg.fetcher);
  const [viewing, setViewing] = useState<T | null>(null);
  const [busy, setBusy] = useState('');
  const [toDelete, setToDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [open, done] = cfg.statuses;

  const toggle = async (item: T) => {
    const next = item.status === done ? open : done;
    setBusy(item.id);
    try {
      const updated = await cfg.setStatus(item.id, next);
      list.patchItem((i) => i.id === item.id, updated);
      if (viewing?.id === item.id) setViewing(updated);
      toast.success(next === done ? `Marked as ${done}.` : `Marked as ${open}.`);
      if (list.status) void list.reload();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setBusy('');
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await cfg.remove(toDelete.id);
      toast.success(`${cfg.noun} deleted.`);
      if (viewing?.id === toDelete.id) setViewing(null);
      setToDelete(null);
      void list.reload();
    } catch (e) {
      toast.error(getErrorMessage(e, `${cfg.noun} could not be deleted.`));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<T>[] = [
    { key: 'who', header: 'User', render: (i) => (<span><span className="block font-semibold">{i.name}</span><span className="block break-all text-xs text-ink-500">{i.email}</span></span>) },
    ...cfg.columns,
    { key: 'date', header: 'Date', render: (i) => formatDate(i.createdAt), className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} /> },
  ];

  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

  return (
    <>
      <PageHeader title={cfg.title} lead={`${list.total} ${list.status ? list.status : 'total'}`} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          value={list.status}
          onChange={list.setStatus}
          options={[{ value: '', label: 'All' }, { value: open, label: cap(open) }, { value: done, label: cap(done) }]}
        />
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search submissions" />
      </div>
      {list.error && <p role="alert" className="mb-4 rounded-2xl bg-coral-50 p-3 font-semibold text-coral-700">{list.error}</p>}
      <ResponsiveTable
        caption={cfg.title}
        columns={columns}
        rows={list.items}
        rowKey={(i) => i.id}
        loading={list.loading}
        empty={<NoSubmissions text={list.search || list.status ? 'Nothing matches these filters.' : 'No submissions yet.'} />}
        actions={(i) => (
          <>
            <IconButton label="View" onClick={() => setViewing(i)}><Eye className="h-4 w-4" /></IconButton>
            <IconButton label={i.status === done ? `Mark ${open}` : cfg.doneLabel} tone="success" onClick={() => busy !== i.id && toggle(i)}>
              {i.status === done ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </IconButton>
            <IconButton label="Delete" tone="danger" onClick={() => setToDelete(i)}><Trash2 className="h-4 w-4" /></IconButton>
          </>
        )}
      />
      <div className="mt-6"><Pagination page={list.currentPage} totalPages={list.totalPages} onChange={list.setPage} disabled={list.loading} /></div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={`${cfg.noun} details`} size="lg">
        {viewing && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <StatusBadge status={viewing.status} /> {formatDate(viewing.createdAt)}
            </div>
            <p className="rounded-2xl bg-white p-4 text-sm shadow-paper">
              <span className="font-semibold text-ink">{viewing.name}</span> ·{' '}
              <a href={`mailto:${viewing.email}`} className="break-all font-semibold text-teal-700 hover:underline">{viewing.email}</a>
            </p>
            {cfg.renderBody(viewing)}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setToDelete(viewing)} icon={<Trash2 className="h-4 w-4" />}>Delete</Button>
              <Button variant="teal" loading={busy === viewing.id} loadingText="Saving..." onClick={() => toggle(viewing)}>
                {viewing.status === done ? `Mark as ${open}` : cfg.doneLabel}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete this ${cfg.noun.toLowerCase()}?`}
        message="This can't be undone. The member will no longer see it in their dashboard."
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

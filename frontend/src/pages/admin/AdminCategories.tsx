import { FolderHeart, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { IconButton, PageHeader } from '@/components/admin/AdminUi';
import { ResponsiveTable, type Column } from '@/components/admin/ResponsiveTable';
import { CATEGORY_ICON_NAMES, CategoryIcon } from '@/components/brand/CategoryIcon';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { adminService } from '@/services/admin.service';
import { getErrorMessage, getFieldErrors } from '@/services/api';
import type { Category, CategoryIconName } from '@/types';
import { formatDate } from '@/utils/format';

function IconPicker({ value, onChange }: { value: CategoryIconName; onChange: (v: CategoryIconName) => void }) {
  return (
    <fieldset>
      <legend className="field-label">Icon</legend>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ICON_NAMES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            aria-label={n.replace('-', ' ')}
            className={`grid h-10 w-10 place-items-center rounded-xl border-2 ${value === n ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-cream-200 bg-white text-ink-500 hover:border-teal-200'}`}
          >
            <CategoryIcon name={n} className="h-5 w-5" />
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function CategoryForm({ initial, onSubmit, submitLabel, onCancel }: {
  initial?: Category; submitLabel: string; onCancel?: () => void;
  onSubmit: (v: { name: string; icon: CategoryIconName }) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState<CategoryIconName>(initial?.icon ?? 'sparkles');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const n = name.trim();
    if (n.length < 2 || n.length > 40) return setError('Name must be 2–40 characters');
    setSaving(true);
    try {
      await onSubmit({ name: n, icon });
      if (!initial) { setName(''); setIcon('sparkles'); }
    } catch (err) {
      setError(getFieldErrors(err).name ?? '');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <TextField label="Category name" value={name} maxLength={40} onChange={(e) => { setName(e.target.value); setError(''); }} error={error} placeholder="e.g. Seasonal" />
      <IconPicker value={icon} onChange={setIcon} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>}
        <Button type="submit" variant="teal" loading={saving} loadingText="Saving...">{submitLabel}</Button>
      </div>
    </form>
  );
}

export default function AdminCategories() {
  const toast = useToast();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminService.categories.list()
      .then((c) => { setItems(c); setError(''); })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const create = async (v: { name: string; icon: CategoryIconName }) => {
    try {
      await adminService.categories.create(v);
      toast.success('Category added ✨');
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
      throw e;
    }
  };

  const update = async (v: { name: string; icon: CategoryIconName }) => {
    if (!editing) return;
    try {
      await adminService.categories.update(editing.id, v);
      toast.success('Category updated.');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
      throw e;
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminService.categories.remove(toDelete.id);
      toast.success('Category deleted.');
      setToDelete(null);
      load();
    } catch (e) {
      // e.g. 409 when products still use it — the server message explains what to do
      toast.error(getErrorMessage(e, 'Category could not be deleted.'));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Category>[] = [
    {
      key: 'name', header: 'Category', primary: true,
      render: (c) => (
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700"><CategoryIcon name={c.icon} className="h-4 w-4" /></span>
          <span className="font-semibold">{c.name}</span>
        </span>
      ),
    },
    { key: 'slug', header: 'Slug', render: (c) => <code className="rounded bg-cream-100 px-1.5 py-0.5 text-xs">{c.slug}</code> },
    { key: 'count', header: 'Products', render: (c) => c.productCount ?? 0 },
    { key: 'created', header: 'Created', render: (c) => formatDate(c.createdAt), className: 'whitespace-nowrap' },
  ];

  return (
    <>
      <PageHeader title="Categories" lead="These power the category filters on the website." />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          {error && <p role="alert" className="mb-4 rounded-2xl bg-coral-50 p-3 font-semibold text-coral-700">{error}</p>}
          <ResponsiveTable
            caption="Categories"
            columns={columns}
            rows={items}
            rowKey={(c) => c.id}
            loading={loading}
            empty={<div className="rounded-3xl bg-white shadow-paper"><EmptyState tone="leaf" icon={<FolderHeart className="h-9 w-9" />} title="No categories yet." text="Add one to start organising printables." /></div>}
            actions={(c) => (
              <>
                <IconButton label={`Edit ${c.name}`} onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></IconButton>
                <IconButton label={`Delete ${c.name}`} tone="danger" onClick={() => setToDelete(c)}><Trash2 className="h-4 w-4" /></IconButton>
              </>
            )}
          />
        </div>
        <section className="rounded-3xl bg-white p-5 shadow-paper lg:sticky lg:top-10" aria-labelledby="new-cat">
          <h2 id="new-cat" className="mb-4 font-display text-xl font-semibold">New category</h2>
          <CategoryForm submitLabel="Add category" onSubmit={create} />
        </section>
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit category">
        {editing && <CategoryForm key={editing.id} initial={editing} submitLabel="Save changes" onSubmit={update} onCancel={() => setEditing(null)} />}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this category?"
        message={
          toDelete?.productCount
            ? `"${toDelete.name}" still has ${toDelete.productCount} product(s). Move or delete them first — the server will block this.`
            : `"${toDelete?.name ?? ''}" will be removed from the website filters.`
        }
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

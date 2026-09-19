import { ExternalLink, ImagePlus, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconButton, PageHeader, SearchInput } from '@/components/admin/AdminUi';
import { ResponsiveTable, type Column } from '@/components/admin/ResponsiveTable';
import { ProductImage } from '@/components/home/ProductImage';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import { adminService } from '@/services/admin.service';
import { getErrorMessage, getFieldErrors } from '@/services/api';
import { catalogService } from '@/services/catalog.service';
import type { Category, Product } from '@/types';
import { formatDate, formatPrice } from '@/utils/format';
import { ACCEPTED_IMAGES, fieldErrors, MAX_IMAGE_MB, productSchema, validateImage } from '@/utils/validation';

export default function AdminProducts() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const q = useDebounce(search.trim());
  useEffect(() => setPage(1), [q, category]);
  const list = useProducts({ search: q, category, page, limit: 10 });

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { catalogService.listCategories().then(setCategories).catch(() => undefined); }, []);

  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(params.get('new') === '1');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setFormOpen(true); };
  const closeForm = () => {
    setFormOpen(false);
    if (params.get('new')) setParams({}, { replace: true });
  };

  const remove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminService.products.remove(toDelete.id);
      toast.success('Product deleted.');
      setToDelete(null);
      if (list.products.length === 1 && page > 1) setPage(page - 1); else list.reload();
    } catch (e) {
      toast.error(getErrorMessage(e, 'Product could not be deleted.'));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'title', header: 'Product', primary: true,
      render: (p) => (
        <span className="flex items-center gap-3">
          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-100"><ProductImage product={p} sizes="48px" /></span>
          <span className="min-w-0">
            <span className="block truncate font-semibold md:max-w-[260px]">{p.title}</span>
            <span className="block text-xs font-normal text-ink-500">Added {formatDate(p.createdAt)}</span>
          </span>
        </span>
      ),
    },
    { key: 'cat', header: 'Category', render: (p) => p.category?.name ?? <span className="text-coral-700">None</span> },
    { key: 'price', header: 'Price', render: (p) => <span className="font-semibold">{formatPrice(p.price)}</span> },
    {
      key: 'etsy', header: 'Etsy', hideOnMobile: true,
      render: (p) => (
        <a href={p.etsyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:underline">
          Listing <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Products" lead={`${list.totalProducts} printable${list.totalProducts === 1 ? '' : 's'} in the shop`} action={<Button onClick={openNew} icon={<Plus className="h-4 w-4" />}>Add product</Button>} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by title" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category" className="field-input h-11 py-0 sm:max-w-[220px]">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      {list.error && <p role="alert" className="mb-4 rounded-2xl bg-coral-50 p-3 font-semibold text-coral-700">{list.error}</p>}
      <ResponsiveTable
        caption="Products"
        columns={columns}
        rows={list.products}
        rowKey={(p) => p.id}
        loading={list.loading}
        empty={
          <div className="rounded-3xl bg-white shadow-paper">
            <EmptyState tone="sun" icon={<Package className="h-9 w-9" />} title={q || category !== 'all' ? 'No products match.' : 'No products yet.'} text="Add your first printable to show it on the website." action={<Button onClick={openNew}>Add product</Button>} />
          </div>
        }
        actions={(p) => (
          <>
            <IconButton label={`Edit ${p.title}`} onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></IconButton>
            <IconButton label={`Delete ${p.title}`} tone="danger" onClick={() => setToDelete(p)}><Trash2 className="h-4 w-4" /></IconButton>
          </>
        )}
      />
      <div className="mt-6"><Pagination page={list.currentPage} totalPages={list.totalPages} onChange={setPage} disabled={list.loading} /></div>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit product' : 'Add product'} size="lg">
        <ProductForm
          key={editing?.id ?? 'new'}
          product={editing}
          categories={categories}
          onCancel={closeForm}
          onSaved={() => { closeForm(); list.reload(); }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this product?"
        message={`"${toDelete?.title ?? ''}" will be removed from the website and its image deleted.`}
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

function ProductForm({ product, categories, onCancel, onSaved }: {
  product: Product | null; categories: Category[]; onCancel: () => void; onSaved: () => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState({
    title: product?.title ?? '',
    description: product?.description ?? '',
    price: product ? product.price.toFixed(2) : '',
    category: product?.category?.id ?? '',
    etsyUrl: product?.etsyUrl ?? '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(product?.imageUrl ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const pick = (f?: File) => {
    if (!f) return;
    const err = validateImage(f);
    if (err) { setErrors((er) => ({ ...er, image: err })); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setErrors((er) => ({ ...er, image: '' }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const r = fieldErrors(productSchema, values);
    const errs = r.ok ? {} : { ...r.errors };
    if (!product && !file) errs.image = 'Please add a product image.';
    if (Object.keys(errs).length) return setErrors(errs);

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v.trim()));
    if (file) fd.append('image', file);

    setSaving(true);
    try {
      if (product) {
        await adminService.products.update(product.id, fd);
        toast.success('Product updated successfully.');
      } else {
        await adminService.products.create(fd);
        toast.success('Product added successfully ✨');
      }
      onSaved();
    } catch (err) {
      setErrors(getFieldErrors(err));
      toast.error(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 md:grid-cols-[220px_1fr]">
      <div>
        <span className="field-label">Product image</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}
          className={`group relative grid aspect-square w-full place-items-center overflow-hidden rounded-3xl border-2 border-dashed bg-white ${errors.image ? 'border-coral-400' : 'border-cream-200 hover:border-teal-300'}`}
        >
          {preview ? (
            <>
              <img src={preview} alt="Selected product" className="h-full w-full object-cover" />
              <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 py-1.5 text-sm font-bold shadow-pill">Replace image</span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-2 p-4 text-center text-ink-500">
              <ImagePlus className="h-9 w-9 text-teal-500" aria-hidden />
              <span className="text-sm font-bold">Choose or drop an image</span>
              <span className="text-xs">JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB</span>
            </span>
          )}
        </button>
        <input ref={fileRef} type="file" accept={ACCEPTED_IMAGES.join(',')} className="sr-only" tabIndex={-1} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
        {errors.image && <p className="field-error">{errors.image}</p>}
      </div>

      <div className="grid gap-4">
        <TextField label="Title" value={values.title} onChange={set('title')} error={errors.title} maxLength={120} />
        <TextAreaField label="Description" value={values.description} onChange={set('description')} error={errors.description} maxLength={2000} rows={4} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Price (USD)" inputMode="decimal" placeholder="3.99" value={values.price} onChange={set('price')} error={errors.price} />
          <SelectField label="Category" value={values.category} onChange={set('category')} error={errors.category}>
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </SelectField>
        </div>
        <TextField label="Etsy listing URL" type="url" placeholder="https://www.etsy.com/listing/..." value={values.etsyUrl} onChange={set('etsyUrl')} error={errors.etsyUrl} maxLength={500} />
        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>
          <Button type="submit" variant="teal" loading={saving} loadingText={file ? 'Uploading...' : 'Saving...'}>
            {product ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </div>
    </form>
  );
}

import { TriangleAlert } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onCancel }: Props) {
  return (
    <Modal open={open} onClose={loading ? () => undefined : onCancel} title={title} size="sm">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-coral-50 text-coral-600">
          <TriangleAlert className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-ink-700">{message}</p>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>Keep it</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading} loadingText="Deleting...">{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

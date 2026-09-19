const styles: Record<string, { cls: string; label: string }> = {
  pending: { cls: 'bg-sun-100 text-sun-700', label: 'Pending' },
  resolved: { cls: 'bg-leaf-100 text-leaf-700', label: 'Resolved' },
  submitted: { cls: 'bg-lilac-100 text-lilac-700', label: 'Submitted' },
  reviewed: { cls: 'bg-teal-100 text-teal-700', label: 'Reviewed' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = styles[status] ?? { cls: 'bg-cream-100 text-ink-500', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {s.label}
    </span>
  );
}

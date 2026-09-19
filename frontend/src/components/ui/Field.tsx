import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface Wrap { label: string; error?: string; hint?: ReactNode; className?: string }

function Shell({ id, label, error, hint, className, children }: Wrap & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="field-error">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  error ? `${id}-err` : hint ? `${id}-hint` : undefined;

export function TextField({ label, error, hint, className, ...rest }: Wrap & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} className={className}>
      <input id={id} className="field-input" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </Shell>
  );
}

export function TextAreaField({ label, error, hint, className, ...rest }: Wrap & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} className={className}>
      <textarea id={id} rows={4} className="field-input resize-y leading-relaxed" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </Shell>
  );
}

export function SelectField({ label, error, hint, className, children, ...rest }: Wrap & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} className={className}>
      <select id={id} className="field-input appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%235E6781%22 stroke-width=%222%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)} {...rest}>
        {children}
      </select>
    </Shell>
  );
}

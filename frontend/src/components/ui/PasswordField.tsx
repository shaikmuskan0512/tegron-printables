import { Eye, EyeOff } from 'lucide-react';
import { useId, useState, type InputHTMLAttributes } from 'react';

export function PasswordField({ label, error, hint, ...rest }: {
  label: string; error?: string; hint?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="field-input pr-12"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined}
          maxLength={72}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-500 hover:bg-cream-100"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p id={`${id}-e`} className="field-error">{error}</p> : hint ? <p id={`${id}-h`} className="mt-1.5 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

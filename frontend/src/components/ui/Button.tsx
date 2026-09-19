import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'teal' | 'secondary' | 'ghost' | 'danger' | 'soft';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-coral-500 text-white shadow-pill hover:bg-coral-600 active:bg-coral-700',
  teal: 'bg-teal-500 text-white shadow-pill hover:bg-teal-600 active:bg-teal-700',
  secondary: 'bg-white text-ink border-2 border-cream-200 hover:border-teal-200 hover:bg-teal-50',
  ghost: 'text-ink-700 hover:bg-cream-100',
  danger: 'bg-coral-600 text-white hover:bg-coral-700',
  soft: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-[52px] px-7 text-base gap-2',
};

export const buttonClass = (variant: ButtonVariant = 'primary', size: Size = 'md', extra = '') =>
  `inline-flex items-center justify-center rounded-full font-display font-semibold tracking-[0.01em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${extra}`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, loadingText, icon, className = '', children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      <span className="inline-flex items-center gap-[inherit] whitespace-nowrap">{loading && loadingText ? loadingText : children}</span>
    </button>
  );
});

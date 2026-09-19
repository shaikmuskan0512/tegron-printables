import { Link } from 'react-router-dom';
import logo from '@/assets/tegron-logo.png';
import mark from '@/assets/tegron-mark.png';
import { HOME_PATH } from '@/utils/navigation';

/** Horizontal lockup: the real sun+book mark with a type-set wordmark. */
export function LogoLockup({ to = HOME_PATH, size = 'md', tagline = false, onClick }: {
  to?: string; size?: 'sm' | 'md'; tagline?: boolean; onClick?: () => void;
}) {
  const img = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  return (
    <Link to={to} onClick={onClick} className="group inline-flex items-center gap-2.5 rounded-2xl" aria-label="Tegron Printables home">
      <img src={mark} alt="" className={`${img} object-contain transition-transform group-hover:-rotate-6`} width={44} height={44} />
      <span className="leading-none">
        <Wordmark className={size === 'sm' ? 'text-xl' : 'text-[1.6rem]'} />
        <span className={`block font-display font-semibold text-ink ${size === 'sm' ? 'text-xs' : 'text-sm'} -mt-0.5`}>
          Printables
        </span>
        {tagline && <LearnPlayGrow className="mt-1 text-xs" />}
      </span>
    </Link>
  );
}

/** The multicolor "Tegron" letters with the heart inside the "o". */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-display font-bold leading-none tracking-tight ${className}`} aria-label="Tegron">
      <span aria-hidden className="text-teal-500">T</span>
      <span aria-hidden className="text-coral-500">e</span>
      <span aria-hidden className="text-sun-500">g</span>
      <span aria-hidden className="text-leaf-500">r</span>
      <span aria-hidden className="relative inline-block text-lilac-500">
        o
        <svg viewBox="0 0 24 24" className="absolute left-1/2 top-[58%] h-[0.3em] w-[0.3em] -translate-x-1/2 -translate-y-1/2" aria-hidden>
          <path d="M12 21s-8-4.8-9.6-9.6C1.2 7.8 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 5.8 3.3 4.6 6.9C20 16.2 12 21 12 21z" fill="#fff" />
        </svg>
      </span>
      <span aria-hidden className="text-teal-500">n</span>
    </span>
  );
}

export function LearnPlayGrow({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold text-ink-700 ${className}`}>
      Learn <span className="h-1.5 w-1.5 rounded-full bg-coral-500" aria-hidden /> Play
      <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" aria-hidden /> Grow
    </span>
  );
}

export const logoSrc = logo;
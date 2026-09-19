import type { ReactNode } from 'react';
import { Heart, Sparkle, Star } from '@/components/brand/Doodles';

interface Props {
  icon: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  tone?: 'teal' | 'coral' | 'sun' | 'leaf' | 'lilac';
  compact?: boolean;
}

const tones = {
  teal: 'bg-teal-50 text-teal-600',
  coral: 'bg-coral-50 text-coral-600',
  sun: 'bg-sun-50 text-sun-700',
  leaf: 'bg-leaf-50 text-leaf-600',
  lilac: 'bg-lilac-50 text-lilac-600',
};

export function EmptyState({ icon, title, text, action, tone = 'teal', compact }: Props) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'py-8' : 'py-14'}`}>
      <div className="relative">
        <Star className="absolute -left-6 -top-2 h-5 w-5" />
        <Heart className="absolute -right-5 top-1 h-4 w-4" />
        <Sparkle className="absolute -bottom-1 -right-7 h-4 w-4 text-leaf-500" />
        <div className={`grid h-20 w-20 place-items-center rounded-blob ${tones[tone]}`}>{icon}</div>
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-ink-500">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

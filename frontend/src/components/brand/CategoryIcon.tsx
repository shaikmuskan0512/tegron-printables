import {
  Baby, BookOpen, Calculator, Heart, LayoutGrid, Palette, Pencil, Puzzle, Scissors, Shapes, Sparkles, Star, Sun,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryIconName } from '@/types';

export const CATEGORY_ICON_MAP: Record<CategoryIconName, LucideIcon> = {
  sun: Sun, 'book-open': BookOpen, palette: Palette, scissors: Scissors, puzzle: Puzzle, star: Star,
  heart: Heart, pencil: Pencil, shapes: Shapes, sparkles: Sparkles, baby: Baby, calculator: Calculator,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICON_MAP) as CategoryIconName[];

export function CategoryIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && CATEGORY_ICON_MAP[name as CategoryIconName]) || LayoutGrid;
  return <Icon className={className} aria-hidden strokeWidth={2.2} />;
}

/** Consistent pastel pairing for each category, derived from its slug */
export const CATEGORY_TONES = [
  { badge: 'bg-sun-100 text-sun-700', soft: 'bg-sun-50', icon: 'text-sun-600', tape: 'bg-sun-200', ring: 'ring-sun-200' },
  { badge: 'bg-lilac-100 text-lilac-700', soft: 'bg-lilac-50', icon: 'text-lilac-600', tape: 'bg-lilac-200', ring: 'ring-lilac-200' },
  { badge: 'bg-leaf-100 text-leaf-700', soft: 'bg-leaf-50', icon: 'text-leaf-600', tape: 'bg-leaf-200', ring: 'ring-leaf-200' },
  { badge: 'bg-coral-100 text-coral-700', soft: 'bg-coral-50', icon: 'text-coral-600', tape: 'bg-coral-200', ring: 'ring-coral-200' },
  { badge: 'bg-teal-100 text-teal-700', soft: 'bg-teal-50', icon: 'text-teal-600', tape: 'bg-teal-200', ring: 'ring-teal-200' },
] as const;

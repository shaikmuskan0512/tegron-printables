import { Link } from 'react-router-dom';
import { OpenBook, Star } from '@/components/brand/Doodles';
import { buttonClass } from '@/components/ui/Button';
import { HOME_PATH } from '@/utils/navigation';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 text-center">
      <div>
        <div className="relative mx-auto w-48">
          <OpenBook />
          <Star className="absolute -right-4 -top-4 h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold">This page wandered off</h1>
        <p className="mt-2 text-ink-500">The page you're looking for doesn't exist.</p>
        <Link to={HOME_PATH} className={buttonClass('primary', 'lg', 'mt-6')}>Back to printables</Link>
      </div>
    </main>
  );
}
import { Download, Heart as HeartIcon, Printer, Search } from 'lucide-react';
import { Sprout, Star } from '@/components/brand/Doodles';

const steps = [
  { icon: Search, label: 'Find a printable you love', tone: 'bg-teal-100 text-teal-700' },
  { icon: Download, label: 'Download it instantly on Etsy', tone: 'bg-sun-100 text-sun-700' },
  { icon: Printer, label: 'Print it at home', tone: 'bg-coral-100 text-coral-700' },
  { icon: HeartIcon, label: 'Play & learn together', tone: 'bg-leaf-100 text-leaf-700' },
];

/** "Learn • Play • Grow" statement plus the four-step printable journey from the brand banner. */
export function BrandStrip() {
  return (
    <section aria-labelledby="lpg-title" className="relative -mt-6 pb-4">
      <div className="page-container">
        <div className="relative mx-auto max-w-5xl rounded-4xl bg-white px-5 py-7 shadow-paper sm:px-10">
          <Star className="absolute -top-3 left-8 h-7 w-7 -rotate-12" />
          <Sprout className="absolute -right-2 -top-8 h-14 w-12" />
          <h2 id="lpg-title" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-display text-[1.7rem] font-semibold sm:gap-x-4 sm:text-4xl">
            <span className="text-teal-600">Learn</span>
            <span className="h-2.5 w-2.5 rounded-full bg-coral-400" aria-hidden />
            <span className="text-coral-600">Play</span>
            <span className="h-2.5 w-2.5 rounded-full bg-leaf-500" aria-hidden />
            <span className="text-leaf-600">Grow</span>
          </h2>
          <ol className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-4">
            {steps.map(({ icon: Icon, label, tone }, i) => (
              <li key={label} className={`flex flex-col items-center gap-2.5 text-center md:border-dashed md:border-cream-200 ${i > 0 ? 'md:border-l-2' : ''}`}>
                <span className={`grid h-14 w-14 place-items-center rounded-full ${tone}`}>
                  <Icon className="h-6 w-6" aria-hidden strokeWidth={2.2} />
                </span>
                <span className="max-w-[10rem] font-display text-[15px] font-medium leading-snug text-ink-700">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AbcSheet, Blob, CrayonCup, Heart, RainbowSheet, Sparkle, Sprout, Star, SunReading } from '@/components/brand/Doodles';
import { LogoLockup } from '@/components/brand/Logo';
import { HOME_PATH } from '@/utils/navigation';

/** Split layout: friendly illustration beside the form card; stacks on mobile. */
export function AuthLayout({ title, subtitle, note, children }: {
  title: string; subtitle: string; note: string; children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="page-container flex h-[72px] items-center justify-between">
        <LogoLockup />
        <Link to={HOME_PATH} className="font-display font-medium text-ink-700 hover:text-coral-600">Back to printables</Link>
      </header>

      <main className="page-container grid flex-1 items-center gap-6 pb-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative order-2 hidden overflow-hidden rounded-4xl bg-sun-50 p-10 lg:order-1 lg:block lg:min-h-[560px]" aria-hidden>
          <Blob color="#DDEDD7" className="absolute -bottom-24 -left-20 h-80 w-96" />
          <Blob color="#D6ECEF" className="absolute -right-24 -top-16 h-72 w-72" />
          <p className="relative max-w-xs -rotate-3 font-hand text-3xl leading-tight text-ink-700">{note}</p>
          <SunReading className="absolute left-1/2 top-[26%] w-[46%] -translate-x-1/2" />
          <div className="absolute bottom-10 left-10 w-[22%] -rotate-12 drop-shadow-lg"><AbcSheet /></div>
          <div className="absolute bottom-14 left-[30%] w-[19%] rotate-6 drop-shadow-lg"><RainbowSheet /></div>
          <CrayonCup className="absolute bottom-8 right-10 w-[22%]" />
          <Sprout className="absolute bottom-6 right-[36%] w-12" />
          <Star className="absolute right-[22%] top-[20%] h-8 w-8 rotate-12" />
          <Heart className="absolute left-[20%] top-[40%] h-6 w-6 -rotate-12" />
          <Sparkle className="absolute right-12 top-[48%] h-6 w-6 text-lilac-500" />
        </div>

        <div className="order-1 mx-auto w-full max-w-md lg:order-2">
          <div className="relative mb-6 text-center lg:hidden" aria-hidden>
            <SunReading className="mx-auto w-28" />
          </div>
          <div className="paper p-6 sm:p-9">
            <h1 className="font-display text-3xl font-semibold sm:text-[2.1rem]">{title}</h1>
            <p className="mt-1.5 text-ink-500">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
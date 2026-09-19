import { ArrowRight } from 'lucide-react';
import {
  AbcSheet, Blob, CrayonCup, Heart, HeartTrail, Shine, Sparkle, Sprout, Star, SunReading,
} from '@/components/brand/Doodles';
import { Wordmark } from '@/components/brand/Logo';
import { EtsyIcon } from '@/components/brand/SocialIcons';
import { Button, buttonClass } from '@/components/ui/Button';
import { social } from '@/utils/format';
import { scrollToSection } from '@/utils/navigation';
import { RainbowSheet } from '@/components/brand/Doodles';

const stickers = [
  { word: 'Happier', cls: 'bg-coral-100 text-coral-700 -rotate-3' },
  { word: 'Brighter', cls: 'bg-sun-100 text-sun-700 rotate-2' },
  { word: 'Kinder', cls: 'bg-leaf-100 text-leaf-700 -rotate-1' },
  { word: 'Smarter', cls: 'bg-teal-100 text-teal-700 rotate-3' },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden" aria-labelledby="hero-title">
      {/* Background shapes */}
      <Blob color="#FEEFC0" className="pointer-events-none absolute -left-32 -top-24 h-[420px] w-[420px] opacity-70" />
      <Blob color="#DDEDD7" className="pointer-events-none absolute -bottom-40 -left-24 h-[360px] w-[460px] opacity-60" />
      <Blob color="#D6ECEF" className="pointer-events-none absolute -right-28 top-10 hidden h-[520px] w-[520px] opacity-60 md:block" />

      <div className="page-container relative grid items-center gap-8 pb-16 pt-6 md:pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pb-24">
        <div className="relative z-10 text-center lg:text-left">
          <h1 id="hero-title" className="relative">
            <span className="sr-only">Tegron Printables — Cute Printables for Little Learners &amp; Big Imaginations</span>
            <span aria-hidden className="relative inline-block">
              <Shine className="absolute -left-10 top-4 hidden h-9 w-9 sm:block" />
              <Wordmark className="text-[4.5rem] sm:text-[6rem] lg:text-[7.25rem]" />
            </span>
            <span aria-hidden className="mt-1 flex items-center justify-center gap-2 font-display text-4xl font-bold sm:text-5xl lg:justify-start lg:text-[3.6rem]">
              Printables <Heart className="h-8 w-8 -rotate-12 sm:h-10 sm:w-10" />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl font-display text-2xl font-semibold leading-snug text-ink sm:text-[1.7rem] lg:mx-0">
            Cute printables for little learners &amp; big imaginations
          </p>
          <p className="mx-auto mt-3 max-w-lg text-[17px] leading-relaxed text-ink-500 lg:mx-0">
            Fun, creative and educational printables designed to make learning, playing and creating more joyful.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <Button size="lg" onClick={() => scrollToSection('products')}>
              Explore Products <ArrowRight className="h-5 w-5" aria-hidden />
            </Button>
            {social.etsy ? (
              <a href={social.etsy} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'lg')}>
                <EtsyIcon className="h-5 w-5" /> Visit Etsy
              </a>
            ) : (
              <Button size="lg" variant="secondary" onClick={() => scrollToSection('categories')}>
                Browse categories
              </Button>
            )}
          </div>
        </div>

        {/* Illustration */}
        <div className="relative mx-auto aspect-[1.05] w-full max-w-[520px]" aria-hidden>
          <p className="absolute left-0 top-2 hidden -rotate-6 font-hand text-2xl leading-tight text-ink-700 sm:block">
            Print, play,<br />learn, repeat
            <Heart className="ml-6 mt-1 block h-5 w-5" />
          </p>
          <HeartTrail className="absolute left-[6%] top-[30%] hidden w-28 sm:block" />
          <Star className="absolute right-[30%] top-0 h-9 w-9 rotate-12" />
          <Sparkle className="absolute right-[8%] top-[16%] h-6 w-6 text-leaf-500" />
          <Star color="#A38BC7" className="absolute left-[16%] top-[58%] h-5 w-5 -rotate-12" />

          <div className="absolute left-1/2 top-[6%] w-[58%] -translate-x-1/2">
            <SunReading className="w-full animate-sun-rise" />
          </div>

          <div className="absolute bottom-[4%] left-[2%] w-[30%] -rotate-[9deg] drop-shadow-[0_10px_14px_rgba(31,42,68,.14)]">
            <AbcSheet className="w-full" />
          </div>
          <div className="absolute bottom-[9%] left-[22%] w-[26%] rotate-[7deg] drop-shadow-[0_10px_14px_rgba(31,42,68,.14)]">
            <RainbowSheet className="w-full" />
          </div>

          <CrayonCup className="absolute bottom-[3%] right-[5%] w-[25%]" />
          <Sprout className="absolute bottom-0 right-[30%] w-[10%]" />

          <ul className="absolute right-[-4%] top-[40%] hidden flex-col items-end gap-1.5 sm:flex">
            {stickers.map((s) => (
              <li key={s.word} className={`rounded-lg px-3 py-1 font-display text-sm font-semibold shadow-pill ${s.cls}`}>
                {s.word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

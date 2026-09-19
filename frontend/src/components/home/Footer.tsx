import { Instagram, Mail, Youtube } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sprout, SunFace, Wave } from '@/components/brand/Doodles';
import { LearnPlayGrow, Wordmark } from '@/components/brand/Logo';
import { EtsyIcon, PinterestIcon } from '@/components/brand/SocialIcons';
import { social } from '@/utils/format';
import { HOME_PATH, scrollToSection } from '@/utils/navigation';
import { NAV_LINKS } from './Navbar';

export function Footer() {
  const links: { href: string; label: string; icon: ReactNode }[] = [];
  if (social.etsy) links.push({ href: social.etsy, label: 'Etsy', icon: <EtsyIcon className="h-5 w-5" /> });
  if (social.instagram) links.push({ href: social.instagram, label: 'Instagram', icon: <Instagram className="h-5 w-5 text-coral-600" /> });
  if (social.pinterest) links.push({ href: social.pinterest, label: 'Pinterest', icon: <PinterestIcon className="h-5 w-5 text-[#E60023]" /> });
  if (social.youtube) links.push({ href: social.youtube, label: 'YouTube', icon: <Youtube className="h-5 w-5 text-[#FF0000]" /> });
  if (social.email) links.push({ href: `mailto:${social.email}`, label: 'Contact', icon: <Mail className="h-5 w-5 text-teal-600" /> });

  const onHome = typeof window !== 'undefined' && window.location.pathname === HOME_PATH;

  return (
    <footer className="relative mt-auto">
      <Wave fill="#F5F1FA" />
      <div className="relative overflow-hidden bg-lilac-50">
        <Sprout className="pointer-events-none absolute -left-2 bottom-10 hidden h-24 w-20 md:block" />
        <div className="page-container grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr] lg:py-14">
          <div>
            <div className="flex items-center gap-3">
              <SunFace className="h-14 w-14" />
              <div>
                <Wordmark className="text-3xl" />
                <p className="font-display text-lg font-semibold leading-none">Printables</p>
              </div>
            </div>
            <LearnPlayGrow className="mt-4" />
            <p className="mt-4 max-w-xs font-hand text-xl leading-snug text-ink-700">
              Little printables for brighter tomorrows
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold">Explore</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  {onHome ? (
                    <a href={`${HOME_PATH}#${l.id}`} onClick={(e) => { e.preventDefault(); scrollToSection(l.id); }} className="text-ink-700 hover:text-coral-600">
                      {l.label}
                    </a>
                  ) : (
                    <Link to={`${HOME_PATH}#${l.id}`} className="text-ink-700 hover:text-coral-600">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {links.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold">Follow us</h2>
              <ul className="mt-3 flex flex-wrap gap-2 md:flex-col md:items-start">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-bold shadow-pill hover:bg-cream-100"
                    >
                      {l.icon} {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="border-t-2 border-dashed border-lilac-200">
          <div className="page-container flex flex-col items-center justify-between gap-2 py-5 text-sm text-ink-500 sm:flex-row">
            <p>© 2026 Tegron Printables. All Rights Reserved.</p>
            <p className="inline-flex items-center gap-1.5">
              Made with <Heart className="h-4 w-4" /> for little learners everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
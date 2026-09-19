import type { ReactNode } from 'react';
import { Shine } from '@/components/brand/Doodles';

export function SectionHeading({ id, title, lead, align = 'center', children }: {
  id: string; title: string; lead: string; align?: 'center' | 'left'; children?: ReactNode;
}) {
  const center = align === 'center';
  return (
    <div className={center ? 'text-center' : 'text-center md:text-left'}>
      <h2 id={id} className={`section-title inline-flex items-center gap-2 ${center ? '' : 'md:-ml-1'}`}>
        <Shine className="h-7 w-7 shrink-0" />
        {title}
        {center && <Shine flip className="h-7 w-7 shrink-0" />}
      </h2>
      <p className="section-lead">{lead}</p>
      {children}
    </div>
  );
}

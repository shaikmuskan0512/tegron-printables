/**
 * Tegron doodle kit — small SVG illustrations drawn to match the logo:
 * soft rounded shapes, chunky rays, rosy cheeks, navy line work.
 * All are decorative (aria-hidden) unless a label is passed.
 */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const deco = { 'aria-hidden': true, focusable: false } as const;

const C = {
  sun: '#F8C84B', sunDeep: '#F3B93A', coral: '#F07F86', cheek: '#F59AA0', teal: '#4E9FAE',
  tealLight: '#8CC4CE', leaf: '#7DAE6F', leafDeep: '#629257', lilac: '#A38BC7', ink: '#1F2A44', paper: '#FFFDF8',
};

export function SunFace({ rays = true, ...p }: P & { rays?: boolean }) {
  const angles = [-90, -52, -128, -16, -164];
  return (
    <svg viewBox="0 0 120 110" {...deco} {...p}>
      {rays && (
        <g stroke={C.sun} strokeWidth="8" strokeLinecap="round">
          {angles.map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line key={a} x1={60 + Math.cos(r) * 40} y1={66 + Math.sin(r) * 40} x2={60 + Math.cos(r) * 53} y2={66 + Math.sin(r) * 53} />
            );
          })}
        </g>
      )}
      <circle cx="60" cy="66" r="31" fill={C.sun} />
      <path d="M44 62q5-6 10 0M66 62q5-6 10 0" stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M52 72q8 7 16 0" stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="41" cy="71" r="4.5" fill={C.cheek} opacity=".85" />
      <circle cx="79" cy="71" r="4.5" fill={C.cheek} opacity=".85" />
    </svg>
  );
}

export function Star({ color = C.sun, ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...deco} {...p}>
      <path
        d="M12 2.8l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"
        fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round"
      />
    </svg>
  );
}

export function Heart({ color = C.coral, ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" {...deco} {...p}>
      <path d="M12 20.5s-7.6-4.5-9.3-9.2C1.4 7.9 3.5 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.5 0 5.6 3.4 4.3 6.8-1.7 4.7-9.3 9.2-9.3 9.2z" fill={color} />
    </svg>
  );
}

export function HeartOutline(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...deco} {...p}>
      <path d="M12 20s-7-4.4-8.6-8.8C2.2 8 4.1 5 7.2 5c2 0 3.4 1.2 4.8 3 1.4-1.8 2.8-3 4.8-3 3.1 0 5 3 3.8 6.2C19 15.6 12 20 12 20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** Four-point sparkle; uses currentColor */
export function Sparkle(p: P) {
  return (
    <svg viewBox="0 0 24 24" {...deco} {...p}>
      <path d="M12 2c.6 4.8 2.2 6.9 7 7.9-4.8 1-6.4 3.1-7 8.1-.6-5-2.2-7.1-7-8.1 4.8-1 6.4-3.1 7-7.9z" fill="currentColor" />
    </svg>
  );
}

/** The little "shine" dashes next to headings in the logo */
export function Shine({ flip, ...p }: P & { flip?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" style={flip ? { transform: 'scaleX(-1)' } : undefined} {...deco} {...p}>
      <g stroke={C.sun} strokeWidth="3.4" strokeLinecap="round">
        <path d="M5 8l7 4" />
        <path d="M3 17h8" />
        <path d="M5 26l7-4" />
      </g>
    </svg>
  );
}

export function Sprout({ ...p }: P) {
  return (
    <svg viewBox="0 0 60 70" {...deco} {...p}>
      <path d="M30 68c0-14 1-26 0-38" stroke={C.leafDeep} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M30 34C18 36 7 29 5 15c13-2 24 5 25 19z" fill={C.leaf} />
      <path d="M31 28c2-13 12-21 25-19-1 13-11 21-25 19z" fill={C.leaf} opacity=".85" />
      <path d="M11 19c6 3 12 8 17 13M50 13c-5 3-11 8-17 13" stroke={C.leafDeep} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".5" />
    </svg>
  );
}

export function Leaf(p: P) {
  return (
    <svg viewBox="0 0 40 40" {...deco} {...p}>
      <path d="M6 34C4 18 16 5 35 5c1 18-12 31-29 29z" fill={C.leaf} />
      <path d="M8 32C15 24 22 16 31 9" stroke={C.leafDeep} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".6" />
    </svg>
  );
}

export function OpenBook(p: P) {
  return (
    <svg viewBox="0 0 170 100" {...deco} {...p}>
      <path d="M6 22l79 10 0 64-72-8z" fill={C.teal} />
      <path d="M164 22l-79 10 0 64 72-8z" fill={C.teal} />
      <path d="M14 14c26-3 50 1 71 14v60C64 77 41 75 20 80z" fill={C.paper} stroke={C.tealLight} strokeWidth="2" />
      <path d="M156 14c-26-3-50 1-71 14v60c21-11 44-13 65-8z" fill={C.paper} stroke={C.tealLight} strokeWidth="2" />
      <path d="M85 28v60" stroke={C.tealLight} strokeWidth="2" />
      <g transform="translate(36 38) scale(1.2)"><path d="M12 2.8l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" fill={C.sun} stroke={C.sun} strokeWidth="1.6" strokeLinejoin="round" /></g>
      <g transform="translate(106 38) scale(1.25)"><path d="M12 20.5s-7.6-4.5-9.3-9.2C1.4 7.9 3.5 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.5 0 5.6 3.4 4.3 6.8-1.7 4.7-9.3 9.2-9.3 9.2z" fill={C.coral} /></g>
    </svg>
  );
}

/** The logo scene: the sun peeking over an open book */
export function SunReading(p: P) {
  return (
    <svg viewBox="0 0 200 172" {...deco} {...p}>
      <g transform="translate(40 0) scale(1)"><SunFace width="120" height="110" /></g>
      <g transform="translate(15 70)"><OpenBook width="170" height="100" /></g>
    </svg>
  );
}

export function Pencil({ body = C.sun, ...p }: P & { body?: string }) {
  return (
    <svg viewBox="0 0 24 110" {...deco} {...p}>
      <rect x="3" y="10" width="18" height="72" rx="3" fill={body} />
      <rect x="3" y="4" width="18" height="10" rx="3" fill={C.cheek} />
      <path d="M8 10v72M16 10v72" stroke="#000" strokeOpacity=".08" strokeWidth="2" />
      <path d="M3 82h18l-9 22z" fill="#F4D9B5" />
      <path d="M9.2 97.5h5.6L12 104z" fill={C.ink} />
    </svg>
  );
}

export function Crayon({ color = C.coral, ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 24 100" {...deco} {...p}>
      <path d="M5 18l7-16 7 16z" fill={color} />
      <rect x="4" y="18" width="16" height="80" rx="3" fill={color} />
      <rect x="4" y="34" width="16" height="22" fill="#fff" opacity=".35" />
    </svg>
  );
}

/** Green cup of crayons from the brand banner */
export function CrayonCup(p: P) {
  return (
    <svg viewBox="0 0 130 150" {...deco} {...p}>
      <g transform="rotate(-14 30 60)"><g transform="translate(18 6)"><Crayon color={C.coral} width="24" height="100" /></g></g>
      <g transform="translate(52 0)"><Pencil width="24" height="110" /></g>
      <g transform="rotate(16 90 60)"><g transform="translate(80 10)"><Crayon color={C.leaf} width="24" height="100" /></g></g>
      <path d="M12 72h96l-8 70a8 8 0 0 1-8 7H28a8 8 0 0 1-8-7z" fill="#A9CDA0" />
      <path d="M12 72h96" stroke="#93BE89" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 128s-15-9-18-18c-2-7 2-13 9-13 4 0 7 2 9 6 2-4 5-6 9-6 7 0 11 6 9 13-3 9-18 18-18 18z" fill="#fff" />
    </svg>
  );
}

/** A printable sheet with a rainbow on it */
export function RainbowSheet(p: P) {
  return (
    <svg viewBox="0 0 110 140" {...deco} {...p}>
      <rect x="4" y="4" width="102" height="132" rx="6" fill={C.paper} />
      <g fill="none" strokeWidth="9" strokeLinecap="round" transform="translate(0 6)">
        <path d="M25 80a30 30 0 0 1 60 0" stroke={C.cheek} />
        <path d="M34 80a21 21 0 0 1 42 0" stroke={C.sun} />
        <path d="M43 80a12 12 0 0 1 24 0" stroke={C.leaf} />
      </g>
      <path d="M22 110h40M22 120h26" stroke="#E6DDCC" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(74 104) scale(.9)"><Heart width="24" height="24" /></g>
    </svg>
  );
}

/** A worksheet with ABC letters and tracing lines */
export function AbcSheet(p: P) {
  return (
    <svg viewBox="0 0 110 140" {...deco} {...p}>
      <rect x="4" y="4" width="102" height="132" rx="6" fill={C.paper} />
      <text x="16" y="52" fontFamily="Fredoka, ui-rounded, sans-serif" fontWeight="700" fontSize="34" fill={C.teal}>A</text>
      <text x="44" y="52" fontFamily="Fredoka, ui-rounded, sans-serif" fontWeight="700" fontSize="34" fill={C.coral}>b</text>
      <text x="72" y="52" fontFamily="Fredoka, ui-rounded, sans-serif" fontWeight="700" fontSize="34" fill={C.leaf}>c</text>
      <g stroke="#C9CFDB" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round">
        <path d="M16 76h78M16 96h78M16 116h78" />
      </g>
      <path d="M18 92c6-10 10-10 14 0s8 10 14 0 10-10 14 0" stroke={C.lilac} strokeWidth="3" fill="none" strokeLinecap="round" />
      <g transform="translate(76 104) scale(.8)"><Star width="24" height="24" /></g>
    </svg>
  );
}

/** Dashed flight path ending in a looped heart */
export function HeartTrail(p: P) {
  return (
    <svg viewBox="0 0 150 70" fill="none" {...deco} {...p}>
      <path
        d="M4 58c30 10 60 4 82-14 8-7 12-18 6-24-6-5-14 0-12 8 1 6 8 9 14 4 4 5 12 6 16 0 5-8-3-15-10-10"
        stroke={C.ink} strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" opacity=".55"
      />
    </svg>
  );
}

export function Envelope(p: P) {
  return (
    <svg viewBox="0 0 96 80" {...deco} {...p}>
      <rect x="4" y="12" width="88" height="62" rx="8" fill="#FFF6EA" />
      <path d="M6 18l42 30 42-30" stroke="#EADCC6" strokeWidth="3" fill="none" strokeLinejoin="round" />
      <path d="M48 52s-12-7-14-14c-2-5 1-10 7-10 3 0 5 2 7 4 2-2 4-4 7-4 6 0 9 5 7 10-2 7-14 14-14 14z" fill={C.coral} />
    </svg>
  );
}

export function Bulb(p: P) {
  return (
    <svg viewBox="0 0 80 100" {...deco} {...p}>
      <g stroke={C.sun} strokeWidth="4" strokeLinecap="round">
        <path d="M40 4v8M12 16l6 6M68 16l-6 6M4 42h8M68 42h8" />
      </g>
      <path d="M40 20a22 22 0 0 0-13 40c3 2 5 6 5 10h16c0-4 2-8 5-10a22 22 0 0 0-13-40z" fill={C.sun} />
      <path d="M34 60c0-8 3-12 6-18 3 6 6 10 6 18" stroke={C.sunDeep} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="31" y="72" width="18" height="7" rx="3" fill="#8E97AE" />
      <rect x="33" y="81" width="14" height="7" rx="3" fill="#6E7891" />
    </svg>
  );
}

/** Soft organic blob background shape */
export function Blob({ color = '#FEEFC0', ...p }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="none" {...deco} {...p}>
      <path d="M42 22c30-22 86-18 118 6s44 72 26 108-66 60-108 54S4 152 4 110 12 44 42 22z" fill={color} />
    </svg>
  );
}

/** Wavy edge between sections. `fill` is the color of the section below. */
export function Wave({ fill = '#FBF5EA', flip, className = '' }: { fill?: string; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={`block h-6 w-full sm:h-10 ${className}`}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
      {...deco}
    >
      <path d="M0 30c120-18 260-26 420-10s300 26 460 8 320-30 560-6v26H0z" fill={fill} />
    </svg>
  );
}

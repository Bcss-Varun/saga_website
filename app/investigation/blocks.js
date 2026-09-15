import styles from './investigation.module.css';

/* Page-specific blocks for /investigation. The shared bento vocabulary lives
   in `Bento`; a block belonging to one route stays in that route's module,
   which is the pattern /platform already follows.

   Nothing here animates beyond hover feedback, and nothing states a figure:
   the same two rules that govern app/platform/blocks.js. */

/* A small stroke set, drawn here rather than pulled from a library — the site
   carries no UI dependency. Every icon sits beside its own text label, so all
   of them are decorative and hidden from assistive technology. */
const ICONS = {
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0',
  inbox: 'M4 6h16v12H4zM4 7l8 6 8-6',
  network:
    'M6 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7.4 5.6l9.2 12.8M16.6 5.6 7.4 18.4',
  image: 'M4 5h16v14H4zM4 15l4.5-4.5L13 15l3-3 4 4M9.5 9.5h.01',
  video: 'M3.5 6.5h11v11h-11zM14.5 10.5l6-3.5v10l-6-3.5',
  play: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM10.3 8.6 15.8 12l-5.5 3.4z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM16.8 16.8 21 21',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.2 12h17.6M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z',
  chat: 'M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.2A7.5 7.5 0 1 1 20 12Z',
  chip: 'M8 8h8v8H8zM4 9h2M4 15h2M18 9h2M18 15h2M9 4v2M15 4v2M9 18v2M15 18v2M6 6h12v12H6z',
  mood: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 10h.01M15.5 10h.01M8 14.5c1 1.2 2.4 1.8 4 1.8s3-.6 4-1.8',
  filter: 'M4 5h16l-6.2 7.4V19l-3.6 2v-8.6z',
  scales: 'M12 4.5v15.5M8.5 20h7M12 7.5 5 9.5m7-2 7 2M5 9.5 2.6 15h4.8zM19 9.5 16.6 15h4.8z',
  megaphone: 'M4 10v4h3.5l6 3.5v-11L7.5 10zM17 9.6a3.4 3.4 0 0 1 0 4.8M19.6 7a7 7 0 0 1 0 10',
};

export function Icon({ name, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={ICONS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

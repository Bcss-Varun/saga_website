import { pageMetadata } from './lib/meta';
import Hero from './home/Hero';
import Showcase from './home/Showcase';
import Challenge from './home/Challenge';
import Pillars from './home/Pillars';
import FourDoors from './home/FourDoors';
import Capabilities from './home/Capabilities';
import Flow from './home/Flow';
import Faq from './home/Faq';
import FinalCta from './home/FinalCta';

export const metadata = pageMetadata({
  title: 'SAGA — Sentiment and Goodwill Analysis',
  description: 'Social media intelligence for law enforcement, government, brands and public figures. [draft — needs review]',
  path: '/',
});

/* Home, resequenced per CLAUDE.md.

   Removed from this page:
   · the tabbed `worlds` selector (decision 4) — the four doors below are now
     the single vertical chooser, moved up from DOM position 9 to 5. Removing
     it also removes the Governance deep-dive, which lived inside it as the
     default tab and made the page lopsided; that depth belongs on /governance.
   · most FAQ entries — the page keeps platform-level questions only.
   · deep capability detail — the section is now a teaser linking to /platform.

   Home answers three things: what SAGA is, how it works, which door is yours. */

export default function Home() {
  return (
    <>
      <Hero />
      <Showcase />
      <Challenge />
      <Pillars />
      <FourDoors />
      <Capabilities />
      <Flow />
      <Faq />
      <FinalCta />
    </>
  );
}

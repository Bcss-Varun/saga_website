import './globals.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Stage from './components/Stage';
import Reveal from './components/Reveal';
import VisitTracker from './components/VisitTracker';

export const metadata = {
  title: 'SAGA',
  description:
    'SAGA — Sentiment and Goodwill Analysis. Social media intelligence platform by Blue Cloud Softech Solutions Limited.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Reveal />
        <VisitTracker />
        <Nav />
        {/* Decision 1: the stage is mounted once here and survives navigation.
            It sits INSIDE .wrap because .wrap is a stacking context (z-index 1)
            — the hero's framed-card backdrop paints at z-index -1 within that
            same context, so the canvas has to share it to stay above the card
            and below the hero's own content. Still a layout singleton. */}
        <div className="wrap">
          <Stage />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

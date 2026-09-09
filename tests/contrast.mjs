/* WCAG contrast for every foreground/background pairing actually rendered.
   Colours are read from the live page rather than from the stylesheet, so a
   pairing introduced by a component (not just the ported palette) is measured
   too. Composites alpha against the effective background before measuring. */
export const CONTRAST_PROBE = `(() => {
  const parse = c => {
    const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r:p[0], g:p[1], b:p[2], a: p.length>3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r*fg.a + bg.r*(1-fg.a),
    g: fg.g*fg.a + bg.g*(1-fg.a),
    b: fg.b*fg.a + bg.b*(1-fg.a), a: 1 });
  const lum = c => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
    return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b); };
  const ratio = (a,b) => { const l1=lum(a), l2=lum(b); const hi=Math.max(l1,l2), lo=Math.min(l1,l2);
    return (hi+0.05)/(lo+0.05); };

  /* Returns the composited background, or null when it cannot be known from
     the DOM. Two cases defeat a computed-style walk and must be declared
     rather than guessed at:
       · a gradient or image background — no single colour to composite;
       · a fixed-position element, whose visual backdrop is whatever the page
         has scrolled beneath it (the nav sits over the hero's light gutter,
         which is painted by a pseudo-element it is not a descendant of).
     Reporting those as failures would be false; reporting them as passes would
     be worse. They are counted as unmeasurable and listed for a human. */
  const effBg = el => {
    let n = el;
    let acc = null;
    let fixed = false;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.position === 'fixed') fixed = true;
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { unmeasurable: 'gradient' };
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c;
        /* Once a fixed ancestor is in the chain, an opaque background further
           up is the page's, not the backdrop this element is actually drawn
           over — the fixed element floats above whatever has scrolled beneath
           it. Declare it rather than measure the wrong thing. */
        if (acc.a >= 0.999) return fixed ? { unmeasurable: 'over-fixed' } : acc;
      }
      n = n.parentElement;
    }
    if (fixed) return { unmeasurable: 'over-fixed' };
    const root = parse(getComputedStyle(document.body).backgroundColor) || {r:0,g:0,b:0,a:1};
    return acc ? over(acc, root) : root;
  };

  const out = [];
  const seen = new Set();
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
    // only elements with their own visible text
    const txt = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
    if (!txt) return;
    if (el.closest('[aria-hidden="true"]')) return;   // decorative, not read
    const fg = parse(cs.color); if (!fg) return;
    const bg = effBg(el);
    if (bg.unmeasurable) {
      const k = 'U|' + cs.color + '|' + bg.unmeasurable;
      if (!seen.has(k)) { seen.add(k);
        out.push({ unmeasurable: bg.unmeasurable, color: cs.color, sample: txt.slice(0,44),
                   sel: el.tagName.toLowerCase() + (typeof el.className==='string' && el.className ? '.'+el.className.trim().split(/\s+/)[0] : '') }); }
      return;
    }
    const composed = fg.a < 1 ? over(fg, bg) : fg;
    const px = parseFloat(cs.fontSize);
    const bold = (parseInt(cs.fontWeight,10) || 400) >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    const r = ratio(composed, bg);
    const key = cs.color + '|' + Math.round(bg.r)+','+Math.round(bg.g)+','+Math.round(bg.b) + '|' + (large?'L':'S');
    if (seen.has(key)) return; seen.add(key);
    out.push({ ratio: +r.toFixed(2), need, pass: r >= need - 0.005,
               color: cs.color, size: px, bold, sample: txt.slice(0,44),
               sel: el.tagName.toLowerCase() + (el.className && typeof el.className==='string' ? '.'+el.className.trim().split(/\\s+/)[0] : '') });
  });
  return JSON.stringify(out);
})()`;

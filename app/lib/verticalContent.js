import { publicSafety } from './content/publicSafety';
import { governance } from './content/governance';
import { brands } from './content/brands';
import { celebrity } from './content/celebrity';

const VERTICALS = { publicSafety, governance, brands, celebrity };
export const VERTICAL_KEYS = Object.keys(VERTICALS);
export const NAMES = Object.fromEntries(VERTICAL_KEYS.map(key => [key, VERTICALS[key].name]));

// Editorial sections differ by audience; no fixed capability-slot limit.
export const DEPTH = Object.fromEntries(VERTICAL_KEYS.map(key => {
  const page = VERTICALS[key];
  return [key, {
    sections: page.workflow ? 10 : 9,
    features: page.features.length,
    scenarios: page.scenarios.items.length,
    faqs: page.faqs.length,
  }];
}));

export function getVertical(key) {
  const page = VERTICALS[key];
  if (!page) throw new Error('Unknown vertical: ' + key);
  return { ...page, key };
}

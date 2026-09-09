import VerticalPage from '../components/VerticalPage';
import { NAMES } from '../lib/verticalContent';
import { pageMetadata } from '../lib/meta';


export const metadata = pageMetadata({
  title: `SAGA — ${NAMES.celebrity}`,
  description:
    'SAGA — social media intelligence for ' + NAMES.celebrity + '. [draft — needs review]',
  path: '/celebrity',
});

export default function Page() {
  return <VerticalPage vertical="celebrity" />;
}

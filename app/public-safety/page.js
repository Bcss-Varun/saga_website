import VerticalPage from '../components/VerticalPage';
import { NAMES } from '../lib/verticalContent';
import { pageMetadata } from '../lib/meta';


export const metadata = pageMetadata({
  title: `SAGA — ${NAMES.publicSafety}`,
  description:
    'SAGA — social media intelligence for ' + NAMES.publicSafety + '. [draft — needs review]',
  path: '/public-safety',
});

export default function Page() {
  return <VerticalPage vertical="publicSafety" />;
}

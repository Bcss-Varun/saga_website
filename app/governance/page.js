import VerticalPage from '../components/VerticalPage';
import { NAMES } from '../lib/verticalContent';
import { pageMetadata } from '../lib/meta';


export const metadata = pageMetadata({
  title: `SAGA — ${NAMES.governance}`,
  description:
    'SAGA — social media intelligence for ' + NAMES.governance + '. [draft — needs review]',
  path: '/governance',
});

export default function Page() {
  return <VerticalPage vertical="governance" />;
}

import VerticalPage from '../components/VerticalPage';
import { NAMES } from '../lib/verticalContent';
import { pageMetadata } from '../lib/meta';


export const metadata = pageMetadata({
  title: `SAGA — ${NAMES.brands}`,
  description:
    'SAGA — social media intelligence for ' + NAMES.brands + '. [draft — needs review]',
  path: '/brands',
});

export default function Page() {
  return <VerticalPage vertical="brands" />;
}

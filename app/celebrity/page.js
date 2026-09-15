import VerticalPage from '../components/VerticalPage';
import { celebrity } from '../lib/content/celebrity';
import { pageMetadata } from '../lib/meta';

export const metadata = pageMetadata({ ...celebrity.meta, path: celebrity.path });

export default function Page() {
  return <VerticalPage vertical="celebrity" />;
}

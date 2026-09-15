import VerticalPage from '../components/VerticalPage';
import { brands } from '../lib/content/brands';
import { pageMetadata } from '../lib/meta';

export const metadata = pageMetadata({ ...brands.meta, path: brands.path });

export default function Page() {
  return <VerticalPage vertical="brands" />;
}

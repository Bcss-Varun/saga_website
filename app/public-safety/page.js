import VerticalPage from '../components/VerticalPage';
import { publicSafety } from '../lib/content/publicSafety';
import { pageMetadata } from '../lib/meta';

export const metadata = pageMetadata({ ...publicSafety.meta, path: publicSafety.path });

export default function Page() {
  return <VerticalPage vertical="publicSafety" />;
}

import VerticalPage from '../components/VerticalPage';
import { governance } from '../lib/content/governance';
import { pageMetadata } from '../lib/meta';

export const metadata = pageMetadata({ ...governance.meta, path: governance.path });

export default function Page() {
  return <VerticalPage vertical="governance" />;
}

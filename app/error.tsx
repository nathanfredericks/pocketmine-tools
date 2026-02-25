'use client';
import Layout from '../components/Layout';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Layout title={null} showNav={false}>
      <h1>500 - Internal Server Error</h1>
    </Layout>
  );
}

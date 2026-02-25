'use client';
import Layout from '../components/Layout';
export default function Home() {
  return (
    <Layout title={null} showNav={true}>
      <h1>Welcome to PocketMine Tools!</h1>
      <p>
        PocketMine Tools is a website built for Minecraft server
        administrators and plugin developers. The website offers nine
        responsive utilities for efficient server administration and plugin
        development.
      </p>
    </Layout>
  );
}

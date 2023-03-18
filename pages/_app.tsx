import Head from 'next/head';
import type { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';
import 'bootstrap/scss/bootstrap.scss';
import './globals.scss';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Create and extract PocketMine plugins online"
        />
        <meta
          name="keywords"
          content="PocketMine,PocketMine Tools,PMT,pmt.mcpe.fun,pmt"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        <script defer data-domain="pmt.nathfreder.dev" src="https://analytics.mcpe.fun/js/script.tagged-events.js"></script>
      </Head>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </>
  );
}

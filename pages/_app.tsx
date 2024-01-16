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
        <meta name="keywords" content="PocketMine,PocketMine Tools,PMT,pmt.mcpe.fun,pmt,mcpe.fun" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
      </Head>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </>
  );
}

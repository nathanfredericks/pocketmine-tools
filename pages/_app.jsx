import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Head from 'next/head';
import React from 'react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Create and extract PocketMine plugins online"
        />
        <meta
          name="keywords"
          content="PocketMine,PocketMine Tools,PMT,pmt.mcpe.fun"
        />
        <meta name="author" content="Nathaniel Fredericks" />
        <meta name="theme-color" content="#eeeeee" />
        <meta property="og:image" content="/static/logo.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script defer data-domain="pmt.nathfreder.dev" src="https://analytics.mcpe.fun/js/script.js" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

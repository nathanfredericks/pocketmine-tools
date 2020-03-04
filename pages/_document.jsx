import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => (
    <Html>
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
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.sa=window.sa||function(){a=[].slice.call(arguments);sa.q?sa.q.push(a):sa.q=[a]};
            `,
          }}
        />
        <script data-skip-dnt="true" async defer src="https://api.pmt.nathfreder.dev/latest.js" />
        <noscript><img src="https://api.pmt.nathfreder.dev/image.gif" alt="" /></noscript>
      </body>
    </Html>
  );
}

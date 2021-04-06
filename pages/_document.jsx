import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "f54f74cc527f419c956ab9a2e6d13936"}'></script>
      </body>
    </Html>
  );
}

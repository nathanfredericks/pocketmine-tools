import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();

    return { html, head, errorHtml, chunks };
  }

  render = () => (
    <html lang="en">
      <Head>
        <script data-skip-dnt="true" async defer src="https://cdn.simpleanalytics.io/hello.js"></script>
        <script
          src="https://app.codefund.io/properties/601/funder.js"
          async="async"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.intergramId = "678904684"
            `,
          }}
        />
        <script __dangero>  </script>
        <script id="intergram" type="text/javascript" src="https://www.intergram.xyz/js/widget.js"></script>
        <noscript><img src="https://api.simpleanalytics.io/hello.gif" alt=""/></noscript> 
      </body>
    </html>
  );
}

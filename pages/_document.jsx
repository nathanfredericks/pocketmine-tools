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
            (function(w, d, s, u) {
              w.RocketChat = function(c) { w.RocketChat._.push(c) }; w.RocketChat._ = []; w.RocketChat.url = u;
              var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
              j.async = true; j.src = 'https://chat.nathfreder.dev/livechat/rocketchat-livechat.min.js?_=201903270000';
              h.parentNode.insertBefore(j, h);
            })(window, document, 'script', 'https://chat.nathfreder.dev/livechat');
            `,
          }}
        />
        <noscript><img src="https://api.simpleanalytics.io/hello.gif" alt=""/></noscript> 
      </body>
    </html>
  );
}

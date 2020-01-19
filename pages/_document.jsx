import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();

    return { html, head, errorHtml, chunks };
  }

  render = () => (
    <html lang="en">
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.sa=window.sa||function(){a=[].slice.call(arguments);sa.q?sa.q.push(a):sa.q=[a]};
            `,
          }}
        />
        <script data-skip-dnt="true" async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
        <noscript><img src="https://api.simpleanalytics.io/hello.gif" alt=""/></noscript> 
      </body>
    </html>
  );
}

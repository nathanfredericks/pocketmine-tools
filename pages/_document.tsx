import { Head, Html, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
      <Main />
      <NextScript />
      <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "a19dd734f701418ca061efc56d180b99"}'></script>
      </body>
    </Html>
  );
}

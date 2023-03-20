import React, { Component } from 'react';
import Layout from '../components/Layout';
export default class Home extends Component {
  render = () => (
    <Layout title={null} showNav={true}>
      <h1>Welcome to PocketMine Tools!</h1>
      <p>
        Create and extract PocketMine plugins online.
      </p>
      {/*<h2>Features</h2>*/}
      {/*<h3>Convert between <code>.zip</code> and <code>.phar</code></h3>*/}
      {/*<p>*/}
      {/*  Easily convert your PocketMine-MP plugins between <code>.zip</code> and <code>.phar</code> using our plugin converter.*/}
      {/*  All conversions are done locally in your browser.*/}
      {/*</p>*/}
      {/*<h3>Inject new API versions</h3>*/}
      {/*<p>*/}
      {/*  Use our API Injector to quickly bump plugin APIs and test on newer versions of PocketMine-MP.*/}
      {/*</p>*/}
      {/*<h3>Parse and preview crashdumps</h3>*/}
      {/*<h3>Decode legacy <code>.pmf</code> plugins</h3>*/}
      {/*<p>*/}
      {/*  Come across an old <code>.pmf</code> plugin? Decode and beautify it&apos;s contents using our <code>.pmf</code> decoder.*/}
      {/*</p>*/}
      {/*<h3>Generate and preview MOTD messages</h3>*/}
      {/*<h3>Improved Poggit Search</h3>*/}
      {/*<h3>Basic server ping</h3>*/}
    </Layout>
  );
}

import React, { Component } from 'react';
import Layout from '../components/Layout';

export default class extends Component {
  render = () => (
    <Layout title="MOTD Generator">
      <iframe width="100%" height="500px" frameBorder="0" src="https://motd-generator.nathfreder.dev/" title="MOTD Generator" />
    </Layout>
  );
}

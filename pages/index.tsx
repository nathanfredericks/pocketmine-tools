import React, { Component } from 'react';
import Layout from '../components/Layout';
export default class Home extends Component {
  render = () => (
    <Layout title={null} showNav={true}>
      <h1>Welcome to PocketMine Tools!</h1>
      <p>
        Convert PocketMine-MP plugins online.
      </p>
    </Layout>
  );
}

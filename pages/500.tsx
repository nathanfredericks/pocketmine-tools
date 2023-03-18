import React, { Component } from 'react';
import Layout from '../components/Layout';
export default class Custom500 extends Component {
  render = () => (
    <Layout title={null} showNav={false}>
      <h1>500 - Internal Server Error</h1>
    </Layout>
  );
}

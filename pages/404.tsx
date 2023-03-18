import React, { Component } from 'react';
import Layout from '../components/Layout';
export default class Custom404 extends Component {
  render = () => (
    <Layout title={null} showNav={false}>
      <h1>404 - Page Not Found</h1>
    </Layout>
  );
}

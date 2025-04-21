import React, { Component } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
export default class Home extends Component {
  render = () => (
    <>
      <Head>
        <meta
          name="description"
          content="Convert PocketMine-MP plugins online"
        />
      </Head>
      <Layout title={null} showNav={true}>
        <h1>Welcome to PocketMine Tools!</h1>
        <p>
          PocketMine Tools is a website built for Minecraft server
          administrators and plugin developers. The website offers nine
          responsive utilities for efficient server administration and plugin
          development.
        </p>
      </Layout>
    </>
  );
}

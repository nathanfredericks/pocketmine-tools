import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const Layout = ({ children, title = 'PocketMine Tools' }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

Layout.defaultProps = {
  title: 'PocketMine Tools',
};

export default Layout;

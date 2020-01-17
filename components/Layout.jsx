import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import Router from 'next/router';

const Layout = ({ title, children }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="Create and extract PocketMine plugins online."
      />
      <meta
        name="keywords"
        content="PocketMine,PocketMine Tools,PMT,pmt.mcpe.fun"
      />
      <meta name="author" content="Nathaniel Fredericks" />
      <meta name="theme-color" content="#eeeeee" />
      <meta property="og:image" content="/static/logo.png" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Navbar bg="light" expand="lg">
      <Link href="/">
        <Navbar.Brand>PocketMine Tools</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/">
            <Nav.Link active>Home</Nav.Link>
          </Link>
          <Nav.Link href="https://discord.gg/qPqrKAF" target="_blank">
            Discord
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Container className="mt-4">{children}</Container>
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

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container, Navbar, Nav, Alert } from 'react-bootstrap';
import Link from 'next/link';

const Layout = ({ title, children }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
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
          <Nav.Link href="https://discord.gg/qGDemhY">Discord</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Container className="mt-4">
      <Alert dismissible variant="info" className="mb-4">
        PocketMine Tools is joining BoxOfDevs. <a href="https://nathfreder.tech/pocketmine-tools-is-joining-boxofdevs/">Read more</a>.
      </Alert>
      {children}
    </Container>
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

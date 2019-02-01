import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Link from 'next/link';

class Layout extends PureComponent {
  render = () => {
    const { title, children } = this.props;

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Navbar bg="light" expand="lg">
          <Link href="/">
            <Navbar.Brand>PocketMine Tools</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link href="/">
                <Nav.Link>Home</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container className="mt-3">{children}</Container>
      </>
    );
  };
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

Layout.defaultProps = {
  title: 'PocketMine Tools',
};

export default Layout;

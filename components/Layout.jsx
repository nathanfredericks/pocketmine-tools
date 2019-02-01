import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from 'reactstrap';

class Layout extends Component {
  state = {
    isNavOpen: false,
  };

  render = () => {
    const { title, children } = this.props;
    const { isNavOpen } = this.state;

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
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            PocketMine Tools
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              <NavItem>
                <Link href="/">
                  <NavLink>Home</NavLink>
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container className="mt-3">
          {children}
        </Container>
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

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Container, Navbar, Nav, Tab, Row, Col, ListGroup } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'bootstrap/scss/bootstrap.scss';

const Layout = ({ title, children }) => {
  const router = useRouter()
  const isActive = (routes) => routes.includes(router.pathname) ? true : false

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Create and extract PocketMine plugins online"
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
          <Navbar.Brand>
            <img alt="" src="/static/logo.png" width="30" height="30" className="d-inline-block align-top" />{' '}
            PocketMine Tools
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="mr-auto">
            <Nav.Link href="https://github.com/pmt-mcpe-fun/website" target="_blank">
              GitHub
            </Nav.Link>
            <Nav.Link href="https://discord.gg/qPqrKAF" target="_blank">
              Discord
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mt-4">
        <Tab.Container>
          <Row>
            <Col md={3} className="mb-4">
              <ListGroup>
                <Link href="/create">
                  <ListGroup.Item active={isActive(['/', '/create'])}>
                    Create <code>.phar</code>
                  </ListGroup.Item>
                </Link>
                <Link href="/extract">
                  <ListGroup.Item active={isActive(['/extract'])}>
                    Extract <code>.phar</code>
                  </ListGroup.Item>
                </Link>
                <Link href="/inject">
                  <ListGroup.Item active={isActive(['/inject'])}>
                    API Injector
                  </ListGroup.Item>
                </Link>
                <Link href="/poggit-search">
                  <ListGroup.Item active={isActive(['/poggit-search'])}>
                    Poggit Search
                  </ListGroup.Item>
                </Link>
                <Link href="/motd-generator">
                  <ListGroup.Item active={isActive(['/motd-generator'])}>
                    MOTD Generator
                  </ListGroup.Item>
                </Link>
                <Link href="/crashdump-parser">
                  <ListGroup.Item active={isActive(['/crashdump-parser'])}>
                    Crashdump Parser
                  </ListGroup.Item>
                </Link>
                <Link href="/pmf-decoder">
                  <ListGroup.Item active={isActive(['/pmt-decoder'])}>
                    <code>.pmf</code> Decoder
                  </ListGroup.Item>
                </Link>
              </ListGroup>
            </Col>
            <Col md={9} className="mb-3">
              <Tab.Content>
                {children}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

Layout.defaultProps = {
  title: 'PocketMine Tools',
};

export default Layout;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Navbar,
  Nav,
  Tab,
  Row,
  Col,
  ListGroup,
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Wrench from 'bootstrap-icons/icons/wrench.svg';
import FolderFill from 'bootstrap-icons/icons/folder-fill.svg';
import GearFill from 'bootstrap-icons/icons/gear-fill.svg';
import Search from 'bootstrap-icons/icons/search.svg';
import Pencil from 'bootstrap-icons/icons/pencil.svg';
import Compass from 'bootstrap-icons/icons/compass.svg';
import FileCode from 'bootstrap-icons/icons/file-code.svg';

const Layout = ({ title, children }) => {
  const router = useRouter();
  const isActive = (routes) => !!routes.includes(router.pathname);

  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : null}PocketMine Tools</title>
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            PocketMine Tools
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Tab.Container>
          <Row>
            <Col md={3} className="mb-4">
              <ListGroup>
                <Link href="/create">
                  <ListGroup.Item active={isActive(['/', '/create'])}>
                    <Wrench width="1.25em" height="1.25em" /> Create <code>.phar</code>
                  </ListGroup.Item>
                </Link>
                <Link href="/extract">
                  <ListGroup.Item active={isActive(['/extract'])}>
                    <FolderFill width="1.25em" height="1.25em" /> Extract <code>.phar</code>
                  </ListGroup.Item>
                </Link>
                <Link href="/inject">
                  <ListGroup.Item active={isActive(['/inject'])}>
                    <GearFill width="1.25em" height="1.25em" /> API Injector
                  </ListGroup.Item>
                </Link>
                <Link href="/poggit-search">
                  <ListGroup.Item active={isActive(['/poggit-search'])}>
                    <Search width="1.25em" height="1.25em" /> Poggit Search
                  </ListGroup.Item>
                </Link>
                <Link href="/motd-generator">
                  <ListGroup.Item active={isActive(['/motd-generator'])}>
                    <Pencil width="1.25em" height="1.25em" /> MOTD Generator
                  </ListGroup.Item>
                </Link>
                <Link href="/crashdump-parser">
                  <ListGroup.Item active={isActive(['/crashdump-parser'])}>
                    <Compass width="1.25em" height="1.25em" /> Crashdump Parser
                  </ListGroup.Item>
                </Link>
                <Link href="/pmf-decoder">
                  <ListGroup.Item active={isActive(['/pmf-decoder'])}>
                    <FileCode width="1.25em" height="1.25em" /> <code>.pmf</code> Decoder
                  </ListGroup.Item>
                </Link>
              </ListGroup>
            </Col>
            <Col md={9} className="mb-3">
              <Tab.Content>{children}</Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Layout;

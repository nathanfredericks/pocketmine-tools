import React, { PropsWithChildren } from 'react';
import {
  Col,
  Container,
  Navbar,
  Row,
  Tab
} from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';
import PMTLogo from '../private/logo.svg';
import NavItems from './NavItems';

type LayoutProps = {
  title: string | null;
};

export default function Layout({
  title,
  children,
}: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Head>
        <title>
          {title ? `${title} - PocketMine Tools` : 'PocketMine Tools'}
        </title>
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Link href="/" legacyBehavior>
            <Navbar.Brand>
              <PMTLogo
                width="30"
                height="30"
                className="d-inline-block align-top me-2"
              />
              PocketMine Tools
            </Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Tab.Container>
          <Row>
            <Col md={3} className="mb-4">
                <NavItems />
            </Col>
            <Col md={9} className="mb-3">
              <Tab.Content>{children}</Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
}

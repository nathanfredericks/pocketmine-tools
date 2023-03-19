import React, { PropsWithChildren, useState } from 'react';
import {
  Col,
  Container,
  Navbar,
  Row,
  Tab,
  Button,
  Nav,
  NavDropdown, Badge
} from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';
import PMTLogo from '../public/static/logo.svg';
import NavItems from './NavItems';
import { useRouter } from 'next/router';
type LayoutProps = {
  title: string | null;
  showNav: boolean;
};
export default function Layout({
  title,
  children,
  showNav = true
}: PropsWithChildren<LayoutProps>) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isActive = (routes: string[]) => routes.includes(router.pathname);
  return (
    <>
      <Head>
        <title>
          {title ? `${title} - PocketMine Tools` : 'PocketMine Tools'}
        </title>
      </Head>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Container>
            <Navbar.Brand>
              <PMTLogo
                width="30"
                height="30"
                className="d-inline-block align-top me-2"
              />
              PocketMine Tools
            </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/" as={Link} className={isActive(['/']) ? 'active' : ''}>Home</Nav.Link>
              <Nav.Link href="/support" as={Link} className={isActive(['/support']) ? 'active' : ''}>Support</Nav.Link>
              <Nav.Link href="https://github.com/pmt-mcpe-fun/website/tree/v3" target="_blank">GitHub</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
            <NavDropdown title="Versions">
              <NavDropdown.Item href="https://mcpeme.mcpe.fun" target="_blank">mcpe.me</NavDropdown.Item>
              <NavDropdown.Item href="https://v1.mcpe.fun" target="_blank">v1 (Old PMT)</NavDropdown.Item>
              <NavDropdown.Item href="https://v2.mcpe.fun" target="_blank">v2</NavDropdown.Item>
              <NavDropdown.Item href="https://v3.mcpe.fun" target="_blank">v3 <Badge bg="info">Current</Badge></NavDropdown.Item>
            </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        {showNav ? (
          <Row>
            <Col lg={3} className="mb-3">
              <div className="d-lg-none">
                <Button
                  onClick={() => setOpen(!open)}
                  className="w-100"
                >
                  {open ? 'Hide navigation' : 'Show navigation'}
                </Button>
                <NavItems open={open} />
              </div>
              <div className="d-none d-lg-block">
                <NavItems open={true} />
              </div>
            </Col>
            <Col lg={9} className="mb-3">
              <Tab.Content>{children}</Tab.Content>
            </Col>
          </Row>
        ): children}
      </Container>
    </>
  );
}

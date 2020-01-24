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
  InputGroup
} from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Layout = ({ title, children }) => {
  const router = useRouter();
  const isActive = (routes) => !!routes.includes(router.pathname);

  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [files, setFiles] = useState([]);
  const handleFileChange = (event) => setFiles(event.target.files)

  return (
    <>
      <Head>
        <title>{title ? `${title} | ` : null}PocketMine Tools</title>
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            {/* <img
              alt=""
              src="/static/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top rounded-circle mr-2"
            /> */}
            PocketMine Tools
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse >
            <Nav>
              <Nav.Link onClick={handleShow}>
                Contact
              </Nav.Link>
              <Nav.Link href="https://discord.gg/qPqrKAF" target="_blank">
                Discord
              </Nav.Link>
              <Nav.Link
                href="https://github.com/pmt-mcpe-fun/website"
                target="_blank"
              >
                GitHub
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
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
                  <ListGroup.Item active={isActive(['/pmf-decoder'])}>
                    <code>.pmf</code> Decoder
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact</Modal.Title>
        </Modal.Header>
        <Form action="https://formsubmit.co/nathfreder@protonmail.com" method="POST" encType="multipart/form-data">
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="Your email" />
            </Form.Group>
            <Form.Label>Attachment</Form.Label>
            <InputGroup className="mb-3">
              <div className="custom-file">
                <Form.Control
                  type="file"
                  name="attachment"
                  className="custom-file-input"
                  accept=".zip,.phar"
                  onChange={handleFileChange}
                />
                <Form.Label className="custom-file-label" style={{ color: files[0] ? null : '#747c84' }}>
                  {files[0] ? files[0].name : 'No file selected'}
                </Form.Label>
              </div>
            </InputGroup>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows="3" name="message" />
            </Form.Group>
            <input type="hidden" name="_replyto"/>
            <input type="hidden" name="_captcha" value="false"/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose} type="submit">
              Send
            </Button>
          </Modal.Footer>
          </Form>
        {/* </form> */}
      </Modal>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Layout;

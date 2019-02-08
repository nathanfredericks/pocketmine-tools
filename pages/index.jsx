import React from 'react';
import { Tab, Row, Col, ListGroup } from 'react-bootstrap';
import Layout from '../components/Layout';
import Extract from '../components/Extract';
import Create from '../components/Create';
import Update from '../components/Update';

export default () => (
  <Layout>
    <Tab.Container defaultActiveKey="#update">
      <Row>
        <Col md={3} className="mb-4">
          <ListGroup>
            <ListGroup.Item action href="#create">
              Create <code>.phar</code>
            </ListGroup.Item>
            <ListGroup.Item action href="#extract">
              Extract <code>.phar</code>
            </ListGroup.Item>
            <ListGroup.Item action href="#update">
              API Updater
            </ListGroup.Item>
            <ListGroup.Item action disabled>
              Crashdump Parser
            </ListGroup.Item>
            <ListGroup.Item action disabled>
              Plugin Generator
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          <Tab.Content>
            <Tab.Pane eventKey="#create">
              <Create />
            </Tab.Pane>
            <Tab.Pane eventKey="#extract">
              <Extract />
            </Tab.Pane>
            <Tab.Pane eventKey="#update">
              <Update />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Layout>
);

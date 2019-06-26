import React from 'react';
import { Tab, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';
import Extract from '../components/Extract';
import Create from '../components/Create';
import Inject from '../components/Inject';

export default () => (
  <Layout>
    <Tab.Container defaultActiveKey="#create">
      <Row>
        <Col md={3} className="mb-4">
          <ListGroup>
            <ListGroup.Item action href="#create">
              Create <code>.phar</code>
            </ListGroup.Item>
            <ListGroup.Item action href="#extract">
              Extract <code>.phar</code>
            </ListGroup.Item>
            <ListGroup.Item action href="#inject">
              API Injector
            </ListGroup.Item>
            <ListGroup.Item action href="https://poggit-search.nathfreder.dev"  target="_blank">
              Poggit Search <Badge variant="warning">New</Badge>
            </ListGroup.Item>
            <ListGroup.Item action disabled>
              Crashdump Parser
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
            <Tab.Pane eventKey="#inject">
              <Inject />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Layout>
);

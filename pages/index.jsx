import React from 'react';
import { Tab, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';
import Extract from '../components/Extract';
import Create from '../components/Create';
import Inject from '../components/Inject';
import PoggitSearch from '../components/PoggitSearch';

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
            <ListGroup.Item action href="#poggit-search">
              Poggit Search
            </ListGroup.Item>
            <ListGroup.Item action href="#motd-generator">
              MOTD Generator <Badge variant="warning">New</Badge>
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
            <Tab.Pane eventKey="#poggit-search">
              <PoggitSearch />
            </Tab.Pane>
            <Tab.Pane eventKey="#motd-generator">
              <iframe width="100%" height="500px" frameBorder="0" src="https://motd-generator.nathfreder.dev/" title="MOTD Generator" />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Layout>
);

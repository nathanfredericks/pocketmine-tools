import React from 'react';
import { Tab, Row, Col, ListGroup } from 'react-bootstrap';
import Layout from '../components/Layout';

export default () => (
  <Layout>
    <Tab.Container defaultActiveKey="#create">
      <Row>
        <Col md={3} className="mb-4">
          <ListGroup>
            <ListGroup.Item action defaultValue href="#create">
              Create <code>.phar</code>
            </ListGroup.Item>
            <ListGroup.Item action href="#extract">
              Extract <code>.phar</code>
            </ListGroup.Item>
            <ListGroup.Item action href="#view-crashdump">
              Edit Crashdump
            </ListGroup.Item>
            {/* <ListGroup.Item action disabled href="#plugin-creator">
              Plugin Creator
            </ListGroup.Item> */}
          </ListGroup>
        </Col>
        <Col md={9}>
          <Tab.Content>
            <Tab.Pane eventKey="#create">Create</Tab.Pane>
            <Tab.Pane eventKey="#extract">Extract</Tab.Pane>
            <Tab.Pane eventKey="#view-crashdump">View Crashdump</Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Layout>
);

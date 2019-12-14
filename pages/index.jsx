import React, { Component } from 'react';
import { Tab, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';
import Extract from '../components/Extract';
import Create from '../components/Create';
import Inject from '../components/Inject';
import PoggitSearch from '../components/PoggitSearch';
import CrashdumpParser from '../components/CrashdumpParser';
import PMFDecoder from '../components/PMFDecoder';

export default class extends Component {
  state = {
    activeKey: undefined
  }

  componentDidMount = () => {
    if (window.location.hash) {
      this.setState({
        activeKey: window.location.hash
      })
    }
  }

  handleTabChange = (activeKey) => {
    this.setState({
      activeKey: activeKey
    })
  }

  render = () => (
    <Layout>
      <Tab.Container defaultActiveKey='#create' activeKey={this.state.activeKey} onSelect={this.handleTabChange}>
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
                MOTD Generator
              </ListGroup.Item>
              <ListGroup.Item action href="#crashdump-parser">
                Crashdump Parser
              </ListGroup.Item>
              <ListGroup.Item action href="#pmf-decoder">
                <code>.pmf</code> Decoder
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
              <Tab.Pane eventKey="#crashdump-parser">
                <CrashdumpParser />
              </Tab.Pane>
              <Tab.Pane eventKey="#pmf-decoder">
                <PMFDecoder />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Layout>
  );
}

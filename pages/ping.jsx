import React, { Component } from 'react';
import { Alert, Button, Form, Row, Col, Table } from 'react-bootstrap';
import Layout from '../components/Layout';
import Link from 'next/link';
export default class CrashdumpParser extends Component {
  state = {
    pingError: null,
    pingErrorLink: null,
    host: null,
    port: null,
    loading: false,
    data: null,
  };
  handleHostChange = (event) => {
    this.setState({
      host: event.currentTarget.value,
    });
  };
  handlePortChange = (event) => {
    this.setState({
      port: event.currentTarget.value,
    });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      pingError: null,
      pingErrorLink: null,
      data: null,
    });
    const { host, port } = this.state;
    const response = await fetch(`/api/ping/?host=${host}&port=${port}`);
    const json = await response.json();
    if (response.status === 200){
      this.setState({
        data: json,
        loading: false
      });
    } else if (response.status === 400) {
      if (json.code === 'DNS_LOOKUP_FAILED') {
        this.setState({
          pingError: 'Sorry, an error occurred pinging your server. Ensure you have the correct hostname.',
          pingErrorLink: '/support#ping-error-host',
          loading: false
        });
      } else {
        this.setState({
          pingError: 'Sorry, an error occurred pinging your server.',
          pingErrorLink: '/support#ping-error',
          loading: false
        });
      }
    } else {
      this.setState({
        pingError: 'Sorry, an error occurred pinging your server.',
        pingErrorLink: '/support#ping-error',
        loading: false
      });
    }
  };
  render() {
    const {
      pingError,
      pingErrorLink,
      host,
      port,
      loading,
      data
    } = this.state;
    return (
      <Layout title="Ping server" showNav={true}>
        {pingError ? <Alert variant="danger">{pingError} <Link href={pingErrorLink}>More info.</Link></Alert> : null}
        <Form onSubmit={this.handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Host</Form.Label>
              <Form.Control type="text" placeholder="play.lbsg.net" onChange={this.handleHostChange} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Port</Form.Label>
              <Form.Control type="number" placeholder="19132" onChange={this.handlePortChange} />
            </Form.Group>
          </Row>
          <Button
            variant="primary"
            type="submit"
            disabled={!host || !port || loading}
            className="mb-3"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-1" />{' '}
                Pinging
                <span className="dots" />
              </>
            ) : (
              'Ping'
            )}
          </Button>
        </Form>
        {data ? (
          <Table responsive>
            <tbody>
            <tr>
              <td>MOTD</td>
              <td>{data.name} <a href={`/motd-generator/?motd=${data.name}`} target="_blank">Open in MOTD Generator</a></td>
            </tr>
            <tr>
              <td>MCPE Version</td>
              <td>v{data.mcpeVersion}</td>
            </tr>
            <tr>
              <td>Current players</td>
              <td>{data.currentPlayers}</td>
            </tr>
            <tr>
              <td>Max players</td>
              <td>{data.maxPlayers}</td>
            </tr>
            </tbody>
          </Table>
        ) : null}
      </Layout>
    );
  }
}

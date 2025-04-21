import React, { Component } from 'react';
import { Alert, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Head from 'next/head';
export default class CrashdumpParser extends Component {
  state = {
    parseError: null,
    parseErrorLink: null,
    parsedCrashdumpStr: null,
    parsedCrashdumpObj: null,
    loading: false,
    crashdump: null,
  };
  handleChange = (event) => {
    this.setState({
      crashdump: event.currentTarget.value,
    });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      parseError: null,
      parseErrorLink: null,
      previewError: null,
      previewErrorLink: null,
      parsedCrashdumpStr: null,
      parsedCrashdumpObj: null,
    });
    const response = await fetch('/api/parse-crashdump', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crashdump: this.state.crashdump,
      }),
    });
    const json = await response.json();
    if (response.status === 400) {
      return this.setState({
        loading: false,
        parseError: 'Sorry, an error occurred decoding your crashdump.',
        parseErrorLink: '/support#decode-crashdump-error',
      });
    }
    this.setState({
      loading: false,
      parsedCrashdumpStr: json.crashdump,
      parsedCrashdumpObj: JSON.parse(json.crashdump),
    });
  };
  saveCrashdump = () => {
    const blob = new Blob([this.state.parsedCrashdumpStr], {
      type: 'application/json;charset=utf-8',
    });
    saveAs(blob, 'crashdump.json');
  };
  render() {
    const {
      parseError,
      parseErrorLink,
      parsedCrashdumpStr,
      parsedCrashdumpObj,
      loading,
      crashdump,
    } = this.state;
    let CrashdumpPreview = null;
    if (parsedCrashdumpStr) {
      CrashdumpPreview = dynamic(import('../components/CrashdumpPreview'), {
        loading: () => (
          <p>
            Loading preview
            <span className="dots" />
          </p>
        ),
      });
    }
    return (
      <>
        <Head>
          <meta name="description" content="Decode and preview crashdumps" />
        </Head>
        <Layout title="Crashdump Parser" showNav={true}>
          {parseError ? (
            <Alert variant="danger">
              {parseError} <Link href={parseErrorLink}>More info.</Link>
            </Alert>
          ) : null}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Crashdump</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                onChange={this.handleChange}
                placeholder="Paste crashdump here"
                className="mb-3"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!crashdump || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-1" />{' '}
                  Decoding
                  <span className="dots" />
                </>
              ) : (
                'Decode'
              )}
            </Button>
            <small className="text-muted">
              <br />
              Your crashdump will be sent to the server for decoding.
            </small>
          </Form>
          {parsedCrashdumpStr ? (
            <Tabs defaultActiveKey="preview" className="mb-3 mt-3">
              <Tab eventKey="preview" title="Preview">
                <CrashdumpPreview crashdump={parsedCrashdumpObj} />
              </Tab>
              <Tab eventKey="raw" title="Raw JSON">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    value={parsedCrashdumpStr}
                    disabled
                    className="mb-3 raw-json-crashdump"
                  />
                </Form.Group>
                <Button variant="primary" onClick={this.saveCrashdump}>
                  Download
                </Button>
              </Tab>
            </Tabs>
          ) : null}
        </Layout>
      </>
    );
  }
}

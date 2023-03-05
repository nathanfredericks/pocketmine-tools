import React, { Component, SyntheticEvent } from 'react';
import { Alert, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
import CrashdumpPreview from '../components/CrashdumpPreview';
import Crashdump from '../lib/crashdump.interface';

type CrashdumpParserState = {
  parseError: string | null;
  previewError: string | null;
  parsedCrashdumpStr: string | null;
  parsedCrashdumpObj: Crashdump | null;
  loading: boolean;
  crashdump: string | null;
};

export default class CrashdumpParser extends Component {
  state: CrashdumpParserState = {
    parseError: null,
    previewError: null,
    parsedCrashdumpStr: null,
    parsedCrashdumpObj: null,
    loading: false,
    crashdump: null,
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      crashdump: event.currentTarget.value,
    });
  };

  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    this.setState({
      loading: true,
      parseError: null,
      previewError: null,
      parsedCrashdumpStr: null,
      parsedCrashdumpObj: null,
    });
    const response = await fetch('/api/parse-crashdump', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crashdump: this.state.crashdump!,
      }),
    });
    const json = await response.json();
    if (response.status === 401) {
      return this.setState({
        loading: false,
        parseError: 'Sorry, an error occurred decoding your crashdump.',
      });
    }
    if (json.preview) {
      this.setState({
        parsedCrashdumpObj: JSON.parse(json.crashdump),
      });
    } else {
      this.setState({
        previewError:
          'Sorry, your crashdump could not be previewed. Raw JSON is still available.',
      });
    }
    this.setState({
      loading: false,
      parsedCrashdumpStr: json.crashdump,
    });
  };

  saveCrashdump = () => {
    const blob = new Blob([this.state.parsedCrashdumpStr!], {
      type: 'application/json;charset=utf-8',
    });
    saveAs(blob, 'crashdump.json');
  };

  render() {
    const {
      parseError,
      previewError,
      parsedCrashdumpStr,
      parsedCrashdumpObj,
      loading,
      crashdump,
    } = this.state;
    return (
      <Layout title="Crashdump Parser">
        {parseError ? <Alert variant="danger">{parseError}</Alert> : null}
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
              {previewError ? (
                <Alert variant="danger">{previewError}</Alert>
              ) : (
                <CrashdumpPreview crashdump={parsedCrashdumpObj!} />
              )}
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
    );
  }
}

/* global sa */
import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import pako from 'pako';
import encoding from 'text-encoding';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';

export default class extends Component {
  state = {
    parsedJson: '',
  };

  handleChange = (event) => {
    let crashdump = event.target.value;
    crashdump = crashdump.replace(
      '----------------------REPORT THE DATA BELOW THIS LINE-----------------------',
      '',
    );
    crashdump = crashdump.replace('===BEGIN CRASH DUMP===', '');
    crashdump = crashdump.replace('===END CRASH DUMP===', '');

    try {
      const decodedBase64 = atob(crashdump);
      const inflatedZlib = pako.inflate(decodedBase64);
      const decodedCrashdump = new encoding.TextDecoder('utf-8').decode(inflatedZlib);
      let parsedJson = JSON.parse(decodedCrashdump);
      parsedJson = JSON.stringify(parsedJson, null, 2);

      return this.setState({
        parsedJson,
      });
      sa('parse_crashdump');
    } catch (err) {
      console.error(err)
    }
  };

  saveCrashdump = () => {
    const blob = new Blob([this.state.parsedJson], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'crashdump.json');
    sa('save_crashdump');
  }

  render = () => {
    const { parsedJson } = this.state;

    return (
      <Layout title="Crashdump Parser">
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Crashdump</Form.Label>
          <Form.Control as="textarea" rows="3" onChange={this.handleChange} />
        </Form.Group>
        {parsedJson.length > 1 ? (
          <>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Parsed JSON</Form.Label>
              <Form.Control as="textarea" rows="6" value={parsedJson} disabled />
            </Form.Group>
            <Button variant="secondary" onClick={this.saveCrashdump}>Download</Button>
          </>
        ) : null}
      </Layout>
    );
  };
}

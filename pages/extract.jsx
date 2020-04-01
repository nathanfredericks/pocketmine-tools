/* global FileReader, Blob, sa */
import React, { Component } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import * as PHAR from 'phar';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';

export default class extends Component {
  state = {
    files: [],
  };

  handleChange = (event) => {
    this.setState({
      files: event.target.files,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { files } = this.state;

    const reader = new FileReader();

    reader.onload = async () => {
      const phar = new PHAR.Archive();

      phar.loadPharData(new Uint8Array(reader.result));

      const data = await PHAR.ZipConverter.toZip(phar);

      const zip = await data.generateAsync({
        type: 'uint8array',
      });

      saveAs(
        new Blob([zip], {
          type: 'application/zip',
        }),
        `${files[0].name
          .split('.')
          .slice(0, -1)
          .join('.')}.zip`,
      );

      sa('extract_phar');
    };

    reader.readAsArrayBuffer(files[0]);
  };

  render = () => {
    const { files } = this.state;

    return (
      <Layout title="Extract .phar">
        <Form onSubmit={this.handleSubmit}>
          <Form.Label>Plugin</Form.Label>
          <InputGroup className="mb-3">
            <div className="custom-file">
              <Form.Control
                type="file"
                className="custom-file-input"
                accept=".phar"
                onChange={this.handleChange}
              />
              <Form.Label className="custom-file-label" style={{ color: files[0] ? null : '#747c84' }}>
                {files[0] ? files[0].name : 'No phar selected'}
              </Form.Label>
            </div>
          </InputGroup>
          <Button variant="secondary" type="submit" disabled={files.length < 1}>
            Extract
          </Button>
        </Form>
      </Layout>
    );
  };
}

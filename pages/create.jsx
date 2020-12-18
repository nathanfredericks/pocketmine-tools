/* global FileReader, Blob, sa */
import React, { Component } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import * as PHAR from 'phar';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';

export default class extends Component {
  state = {
    files: [],
    stub: '<?php __HALT_COMPILER();',
  };

  handleFileChange = (event) => {
    this.setState({
      files: event.target.files,
    });
  };

  handleStubChange = (event) => {
    this.setState({
      stub: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { files, stub } = this.state;

    const reader = new FileReader();

    reader.onload = async () => {
      const zip = await JSZip.loadAsync(new Uint8Array(reader.result))
      const originalName = files[0].name
        .split('.')
        .slice(0, -1)
        .join('.')

      if (zip.files[`${originalName}/`] && zip.files[`${originalName}/`].dir) {
        zip.root = zip.files[`${originalName}/`].name
      }

      const phar = await PHAR.ZipConverter.toPhar(
        await zip.generateAsync({ type: 'uint8array' }),
      );

      phar.setStub(stub);

      saveAs(
        new Blob([phar.savePharData()], {
          type: 'application/octet-stream',
        }),
        `${files[0].name
          .split('.')
          .slice(0, -1)
          .join('.')}.phar`,
      );

      sa('create_phar');
    };

    reader.readAsArrayBuffer(files[0]);
  };

  render = () => {
    const { files } = this.state;
    const { isIndex } = this.props;

    return (
      <Layout title={isIndex ? null : "Create .phar"}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Label>Plugin</Form.Label>
          <InputGroup className="mb-3">
            <div className="custom-file">
              <Form.Control
                type="file"
                className="custom-file-input"
                accept=".zip"
                onChange={this.handleFileChange}
              />
              <Form.Label className="custom-file-label" style={{ color: files[0] ? null : '#747c84' }}>
                {files[0] ? files[0].name : 'No zip selected'}
              </Form.Label>
            </div>
          </InputGroup>
          <Form.Group className="mb-3">
            <Form.Label>Stub</Form.Label>
            <Form.Control
              type="text"
              defaultValue="<?php __HALT_COMPILER();"
              onChange={this.handleStubChange}
            />
            <Form.Text className="text-muted">
              Don&#39;t change this unless you know what you&#39;re doing.
            </Form.Text>
          </Form.Group>
          <Button variant="secondary" type="submit" disabled={files.length < 1}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  };
}

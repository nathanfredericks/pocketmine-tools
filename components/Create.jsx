/* global FileReader, Blob */
import React, { Component } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import * as PHAR from 'phar';
import { saveAs } from 'file-saver';
import * as gtag from '../utils/gtag';

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

    gtag.event({
      action: 'package',
      category: 'Plugin',
      label: files[0].name,
    });

    const reader = new FileReader();

    reader.onload = async () => {
      const phar = await PHAR.ZipConverter.toPhar(
        new Uint8Array(reader.result),
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
    };

    reader.readAsArrayBuffer(files[0]);
  };

  render = () => {
    const { files } = this.state;

    return (
      <>
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
              <Form.Label className="custom-file-label">
                {files[0] ? files[0].name : 'No file selected.'}
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
              I hope you know what you&#39;re doing.
            </Form.Text>
          </Form.Group>
          <Button variant="secondary" type="submit" disabled={files.length < 1}>
            Create
          </Button>
        </Form>
      </>
    );
  };
}

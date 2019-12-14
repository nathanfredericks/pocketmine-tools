/* global FileReader, Blob */
import React, { Component } from 'react';
import { Form, InputGroup, Button, Alert } from 'react-bootstrap';
import * as PHAR from 'phar';
import { saveAs } from 'file-saver';

export default class extends Component {
  state = {
    files: [],
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

  handleSubmit = async (event) => {
    event.preventDefault();

    const { files, stub } = this.state;

    const formData = new FormData();
    formData.append('fileToUpload', files[0]);
  
    const response = await fetch('https://pmf-decoder.azurewebsites.net/', {
        method: 'POST',
        body: formData
    });

    if (response.headers.get('Content-Type') !== 'application/json') {
      alert(await response.text())
    } else {
      const json = await response.json()
      saveAs(
        new Blob([json.code], {
          type: 'text/x-php',
        }),
        `${files[0].name
          .split('.')
          .slice(0, -1)
          .join('.')}.php`,
      );
    }
  };

  render = () => {
    const { files } = this.state;

    return (
      <>
        <Alert variant="warning">Your plugin will sent to https://pmf-decoder.azurewebsites.net and stored temporarily.</Alert>
        <Form onSubmit={this.handleSubmit}>
          <Form.Label>Plugin</Form.Label>
          <InputGroup className="mb-3">
            <div className="custom-file">
              <Form.Control
                type="file"
                name="fileToUpload"
                className="custom-file-input"
                accept=".pmf"
                onChange={this.handleFileChange}
              />
              <Form.Label className="custom-file-label">
                {files[0] ? files[0].name : 'No file selected.'}
              </Form.Label>
            </div>
          </InputGroup>
          <Button variant="secondary" type="submit" disabled={files.length < 1}>
            Decode
          </Button>
        </Form>
      </>
    );
  };
}

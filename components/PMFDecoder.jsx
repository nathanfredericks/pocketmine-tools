/* global FileReader, Blob */
import React, { Component } from 'react';
import { Form, InputGroup, Button, Alert } from 'react-bootstrap';
import * as PHAR from 'phar';
import { saveAs } from 'file-saver';

export default class extends Component {
  state = {
    files: [],
    loading: false,
    error: null
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

    const { files } = this.state;
    this.setState({
      loading: true,
      error: false
    })

    const formData = new FormData();
    formData.append('fileToUpload', files[0]);
  
    const response = await fetch('https://pmf-decoder.azurewebsites.net/', {
        method: 'POST',
        body: formData
    });

    this.setState({
      loading: false
    })

    if (response.headers.get('Content-Type') !== 'application/json') {
      return this.setState({
        error: await response.text()
      })
    }

    const json = await response.json()
    saveAs(
      new Blob([`<?php ${json.code}`]),
      `${files[0].name
        .split('.')
        .slice(0, -1)
        .join('.')}.php`,
    );
  };

  render = () => {
    const { files, loading, error } = this.state;

    return (
      <>
        {error ? <Alert variant="danger">{error}</Alert> : null}
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
          <Button variant="secondary" type="submit" disabled={files.length < 1} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span> : null}
            Decode
          </Button>
          <small className="text-muted"><br />Your plugin will be uploaded to <a>https://pmf-decoder.azurewebsites.net</a> and stored temporarily.</small>
        </Form>
      </>
    );
  };
}

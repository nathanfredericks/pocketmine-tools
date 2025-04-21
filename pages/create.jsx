import React, { Component } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import Layout from '../components/Layout';
import { saveAs } from 'file-saver';
import Link from 'next/link';
import Head from 'next/head';
export default class Create extends Component {
  state = {
    files: [],
    stub: '<?php __HALT_COMPILER();',
    loading: false,
    error: null,
    errorLink: null,
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
    this.setState({
      error: null,
      errorLink: null,
      loading: true,
    });
    const { files, stub } = this.state;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(new Uint8Array(reader.result));
        const originalName = files[0].name.split('.').slice(0, -1).join('.');
        if (
          zip.files[`${originalName}/`] &&
          zip.files[`${originalName}/`].dir
        ) {
          zip.root = zip.files[`${originalName}/`].name;
        }
        const ZipConverter = (await import('phar')).ZipConverter;
        const phar = await ZipConverter.toPhar(
          await zip.generateAsync({ type: 'uint8array' })
        );
        phar.setStub(stub);
        saveAs(
          new Blob([phar.savePharData()], {
            type: 'application/octet-stream',
          }),
          `${files[0].name.split('.').slice(0, -1).join('.')}.phar`
        );
      } catch (err) {
        this.setState({
          error:
            'An error occurred while converting your plugin. Please check your network connection and try again.',
          errorLink: '/support#convert-error',
        });
      } finally {
        this.setState({
          loading: false,
        });
      }
    };
    reader.onerror = () => {
      console.log('net err');
      this.setState({
        error: 'An error occurred while converting your plugin.',
        errorLink: '/support#convert-error',
        loading: false,
      });
    };
    reader.readAsArrayBuffer(files[0]);
  };
  render = () => {
    const { files, loading, error, errorLink } = this.state;
    return (
      <>
        <Head>
          <meta name="description" content="Convert .zip to .phar" />
        </Head>
        <Layout title="Create .phar" showNav={true}>
          {error ? (
            <Alert variant="danger">
              {error} <Link href={errorLink}>More info.</Link>
            </Alert>
          ) : null}
          <Form onSubmit={this.handleSubmit}>
            <Form.Label>
              Plugin (<code>.zip</code> file)
            </Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="file"
                accept=".zip,application/zip"
                onChange={this.handleFileChange}
              />
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
            <Button
              variant="primary"
              type="submit"
              disabled={loading || files.length < 1}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-1" />{' '}
                  Converting
                  <span className="dots" />
                </>
              ) : (
                'Create'
              )}
            </Button>
          </Form>
        </Layout>
      </>
    );
  };
}

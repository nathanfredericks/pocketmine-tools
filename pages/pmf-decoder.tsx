import React, { Component, SyntheticEvent } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
type PMFDecoderState = {
  files: FileList | null;
  loading: boolean;
  error: string | null;
  errorLink: string | null;
  beautifyOutput: boolean;
};
export default class PMFDecoder extends Component {
  state: PMFDecoderState = {
    beautifyOutput: false,
    error: null,
    errorLink: null,
    files: null,
    loading: false,
  };
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      files: event.target.files,
    });
  };
  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { files, beautifyOutput } = this.state;
    this.setState({
      error: null,
    });
    if (files) {
      const formData = new FormData();
      formData.append('plugin', files[0]);
      this.setState({
        loading: true,
      });
      // @ts-ignore
      const response = await fetch(process.env.NEXT_PUBLIC_PMF_DECODER_ENDPOINT,
        {
          method: 'POST',
          body: formData,
        },
      );
      this.setState({
        loading: false,
      });
      if (response.headers.get('Content-Type') !== 'application/json') {
          this.setState({
          error: 'internal server error'
        });
      }
      const json = await response.json()
      if (!response.ok) {
        this.setState({
          error: json.message
        });
      }
      let { plugin } = json;
      plugin = `<?php ${plugin}`;
      if (beautifyOutput) {
        try {
          const prettier = (await import('prettier')).default;
          // @ts-ignore
          const PhpPlugin = (await import('@prettier/plugin-php/standalone'))
            .default;
          plugin = prettier.format(plugin, {
            plugins: [PhpPlugin],
            parser: 'php',
          });
        } catch {
          return this.setState({
            error: 'error beautifying code',
          });
        }
      }
      saveAs(
        new Blob([plugin]),
        `${files[0].name.split('.').slice(0, -1).join('.')}.php`,
      );
    }
  };
  render = () => {
    const { files, loading, error, errorLink, beautifyOutput } = this.state;
    return (
      <>
        <Head>
          <meta name="description" content="Decode and beautify .pmf plugins" />
        </Head>
        <Layout title="PMF Decoder" showNav={true}>
          {error ? <Alert variant="danger">{error} <Link href={errorLink!}>More info.</Link></Alert> : null}
          <Form onSubmit={this.handleSubmit}>
            <Form.Label>Plugin (<code>.pmf</code> file)</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="file"
                name="fileToUpload"
                accept=".pmf"
                onChange={this.handleChange}
              />
            </InputGroup>
            <div className="mb-3">
              <Form.Check
                type="switch"
                checked={beautifyOutput}
                onChange={(event) =>
                  this.setState({ beautifyOutput: event.target.checked })
                }
                label="Beautify output"
              />
            </div>
            <Button variant="primary" type="submit" disabled={!files || loading}>
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
              Your plugin will be sent to{' '}
              <a>{process.env.NEXT_PUBLIC_PMF_DECODER_HOST}</a> for decoding.
            </small>
          </Form>
        </Layout>
      </>
    );
  };
}

import React, { Component, SyntheticEvent } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
type PMFDecoderState = {
  files: FileList | null;
  loading: boolean;
  error: string | null;
  beautifyOutput: boolean;
};
export default class PMFDecoder extends Component {
  state: PMFDecoderState = {
    beautifyOutput: false,
    error: null,
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
      loading: true,
      error: null,
    });
    if (files) {
      const formData = new FormData();
      formData.append('fileToUpload', files[0]);
      // @ts-ignore
      const response = await fetch(
        `${process.env.PMF_DECODER_PROTOCOL}://${process.env.PMF_DECODER_HOST}:${process.env.PMF_DECODER_PORT}/`,
        {
          method: 'POST',
          body: formData,
        },
      );
      if (response.headers.get('Content-Type') !== 'application/json') {
        return this.setState({
          loading: false,
          error: await response.text(),
        });
      }
      const json = await response.json();
      if (!json.code) {
        return this.setState({
          loading: false,
          error: 'Sorry, there was an error decoding your file.',
        });
      }
      const plugin = { ...json };
      plugin.code = `<?php ${plugin.code}`;
      if (beautifyOutput) {
        try {
          const prettier = (await import('prettier')).default;
          // @ts-ignore
          const PhpPlugin = (await import('@prettier/plugin-php/standalone'))
            .default;
          plugin.code = prettier.format(plugin.code, {
            plugins: [PhpPlugin],
            parser: 'php',
          });
        } catch {
          return this.setState({
            loading: false,
            error:
              'Sorry, there was an error beautifying your code. Try turning off beautify output.',
          });
        }
      }
      this.setState({
        loading: false,
      });
      saveAs(
        new Blob([plugin.code]),
        `${files[0].name.split('.').slice(0, -1).join('.')}.php`,
      );
    }
  };
  render = () => {
    const { files, loading, error, beautifyOutput } = this.state;
    return (
      <Layout title="PMF Decoder" showNav={true}>
        {error ? <Alert variant="danger">{error}</Alert> : null}
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
          <Button variant="primary" type="submit" disabled={!files || loading} className="plausible-event-name=Decode+PMF">
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
            <a>{process.env.PMF_DECODER_HOST}</a> for decoding.
          </small>
        </Form>
      </Layout>
    );
  };
}
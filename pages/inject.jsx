import React, { Component } from 'react';
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
import Link from 'next/link';
export default class Inject extends Component {
  state = {
    files: [],
    apiVersion: '',
    warningModal: false,
    warningRead: false,
    warningThreeWords: false,
    originalPluginYml: {},
    error: null,
    errorLink: null,
    loading: false,
  };
  handleChange = (event) => {
    this.setState({
      files: event.target.files,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      error: null,
      loading: true,
    });
    const { files, apiVersion } = this.state;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const Archive = (await import('phar')).Archive;
        const phar = new Archive();
        phar.loadPharData(new Uint8Array(reader.result));
        const yaml = (await import('js-yaml')).default;
        const originalPluginYml = phar.getFile('plugin.yml');
        if (!originalPluginYml) {
          return this.setState({
            error:
              'An error occurred while injecting your plugin. Ensure that the plugin is in the root directory of the zip.',
            errorLink: '/support#inject-directory-error'
          });
        }
        const pluginYml = yaml.load(originalPluginYml.getContents());
        this.setState({
          originalPluginYml: pluginYml,
        });
        pluginYml.api = apiVersion;
        phar.removeFile('plugin.yml');
        const File = (await import('phar')).File;
        phar.addFile(new File('plugin.yml', yaml.dump(pluginYml)));
        saveAs(
          new Blob([phar.savePharData()], {
            type: 'application/octet-stream',
          }),
          `${files[0].name
            .split('.')
            .slice(0, -1)
            .join('.')}-${apiVersion}.phar`,
        );
      } catch {
        this.setState({
          error: 'An error occurred while injecting your plugin.',
          errorLink: '/support#inject-error'
        });
      } finally {
        this.setState({
          warningModal: false,
          warningThreeWords: false,
          warningRead: false,
          loading: false,
        });
      }
    };
    reader.readAsArrayBuffer(files[0]);
  };
  render = () => {
    const {
      files,
      apiVersion,
      warningModal,
      warningThreeWords,
      error,
      errorLink,
      loading,
    } = this.state;
    return (
      <Layout title="API Injector" showNav={true}>
        {error ? <Alert variant="danger">{error} <Link href={errorLink}>More info.</Link></Alert> : null}
        <Form>
          <Form.Label>Plugin (<code>.phar</code> file)</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="file"
              accept=".phar"
              onChange={this.handleChange}
            />
          </InputGroup>
          <Form.Group className="mb-3">
            <Form.Label>API version</Form.Label>
            <Form.Control
              type="text"
              value={apiVersion}
              placeholder="4.0.0"
              onChange={(event) =>
                this.setState({ apiVersion: event.target.value })
              }
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={() =>
              this.setState({
                warningModal: true,
              })
            }
            disabled={files.length < 1 || apiVersion.length < 1}
          >
            Inject
          </Button>
        </Form>
        <Modal
          show={warningModal}
          onHide={() => this.setState({ warningModal: false })}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">This is dangerous</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ol>
              <li>
                This tool only forces the plugin to say that it supports API
                version <code>{apiVersion}</code>. It will not fix the actual
                incompatibility issues.
              </li>
              <li>
                If errors happen after loading the downloaded plugin, uninstall
                it immediately and contact the plugin developer for support.
              </li>
              <li>
                Click{' '}
                <em onClick={() => this.setState({ warningThreeWords: true })}>
                  these three words
                </em>{' '}
                if you have read the above.
              </li>
            </ol>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={this.handleSubmit}
              disabled={!warningThreeWords || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-1" />{' '}
                  Injecting
                  <span className="dots" />
                </>
              ) : (
                'Inject'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Layout>
    );
  };
}

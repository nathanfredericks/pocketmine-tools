'use client';
import { useState } from 'react';
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../../components/Layout';
import Link from 'next/link';
export default function Inject() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [apiVersion, setApiVersion] = useState('');
  const [warningModal, setWarningModal] = useState(false);
  const [warningThreeWords, setWarningThreeWords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorLink, setErrorLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    if (!files || files.length < 1) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const Archive = (await import('phar')).Archive;
        const phar = new Archive();
        phar.loadPharData(new Uint8Array(reader.result as ArrayBuffer));
        const yaml = (await import('js-yaml')).default;
        const originalPluginYml = phar.getFile('plugin.yml');
        if (!originalPluginYml) {
          setError(
            'An error occurred while injecting your plugin. Ensure that the plugin is in the root directory of the zip.'
          );
          setErrorLink('/support#inject-directory-error');
          return;
        }
        const pluginYml = yaml.load(originalPluginYml.getContents()) as Record<string, unknown>;
        pluginYml.api = apiVersion;
        phar.removeFile('plugin.yml');
        const File = (await import('phar')).File;
        phar.addFile(new File('plugin.yml', yaml.dump(pluginYml)));
        saveAs(
          new Blob([phar.savePharData() as unknown as BlobPart], {
            type: 'application/octet-stream',
          }),
          `${files[0].name
            .split('.')
            .slice(0, -1)
            .join('.')}-${apiVersion}.phar`
        );
      } catch {
        setError('An error occurred while injecting your plugin.');
        setErrorLink('/support#inject-error');
      } finally {
        setWarningModal(false);
        setWarningThreeWords(false);
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(files[0]);
  };
  return (
    <Layout title="API Injector" showNav={true}>
      {error ? (
        <Alert variant="danger">
          {error} <Link href={errorLink!}>More info.</Link>
        </Alert>
      ) : null}
      <Form>
        <Form.Label>
          Plugin (<code>.phar</code> file)
        </Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="file"
            accept=".phar"
            onChange={handleChange}
          />
        </InputGroup>
        <Form.Group className="mb-3">
          <Form.Label>API version</Form.Label>
          <Form.Control
            type="text"
            value={apiVersion}
            onChange={(event) => setApiVersion(event.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => setWarningModal(true)}
          disabled={!files || files.length < 1 || apiVersion.length < 1}
        >
          Inject
        </Button>
      </Form>
      <Modal
        show={warningModal}
        onHide={() => setWarningModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            This is dangerous
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol>
            <li>
              This tool only forces the plugin to say that it supports API
              version <code>{apiVersion}</code>. It will not fix the actual
              incompatibility issues.
            </li>
            <li>
              If errors happen after loading the downloaded plugin,
              uninstall it immediately and contact the plugin developer for
              support.
            </li>
            <li>
              Click{' '}
              <em
                onClick={() => setWarningThreeWords(true)}
              >
                these three words
              </em>{' '}
              if you have read the above.
            </li>
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSubmit}
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
}

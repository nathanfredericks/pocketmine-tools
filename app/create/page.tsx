'use client';
import { useState } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import Layout from '../../components/Layout';
import { saveAs } from 'file-saver';
import Link from 'next/link';
export default function Create() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [stub, setStub] = useState('<?php __HALT_COMPILER();');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorLink, setErrorLink] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };
  const handleStubChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStub(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setErrorLink(null);
    setLoading(true);
    if (!files || files.length < 1) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(new Uint8Array(reader.result as ArrayBuffer));
        const originalName = files[0].name.split('.').slice(0, -1).join('.');
        if (
          zip.files[`${originalName}/`] &&
          zip.files[`${originalName}/`].dir
        ) {
          (zip as any).root = zip.files[`${originalName}/`].name;
        }
        const ZipConverter = (await import('phar')).ZipConverter;
        const phar = await ZipConverter.toPhar(
          await zip.generateAsync({ type: 'uint8array' })
        );
        phar.setStub(stub);
        saveAs(
          new Blob([phar.savePharData() as unknown as BlobPart], {
            type: 'application/octet-stream',
          }),
          `${files[0].name.split('.').slice(0, -1).join('.')}.phar`
        );
      } catch (err) {
        setError(
          'An error occurred while converting your plugin. Please check your network connection and try again.'
        );
        setErrorLink('/support#convert-error');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      console.log('net err');
      setError('An error occurred while converting your plugin.');
      setErrorLink('/support#convert-error');
      setLoading(false);
    };
    reader.readAsArrayBuffer(files[0]);
  };
  return (
    <Layout title="Create .phar" showNav={true}>
      {error ? (
        <Alert variant="danger">
          {error} <Link href={errorLink!}>More info.</Link>
        </Alert>
      ) : null}
      <Form onSubmit={handleSubmit}>
        <Form.Label>
          Plugin (<code>.zip</code> file)
        </Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="file"
            accept=".zip,application/zip"
            onChange={handleFileChange}
          />
        </InputGroup>
        <Form.Group className="mb-3">
          <Form.Label>Stub</Form.Label>
          <Form.Control
            type="text"
            defaultValue="<?php __HALT_COMPILER();"
            onChange={handleStubChange}
          />
          <Form.Text className="text-muted">
            Don&#39;t change this unless you know what you&#39;re doing.
          </Form.Text>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={loading || !files || files.length < 1}
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
  );
}

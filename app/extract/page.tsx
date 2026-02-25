'use client';
import { useState, type SyntheticEvent } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../../components/Layout';
import Link from 'next/link';
export default function Extract() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorLink, setErrorLink] = useState<string | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.currentTarget.files);
  };
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setErrorLink(null);
    setLoading(true);
    if (files) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const Archive = (await import('phar')).Archive;
          const phar = new Archive();
          phar.loadPharData(new Uint8Array(reader.result as ArrayBuffer));
          const ZipConverter = (await import('phar')).ZipConverter;
          const data = await ZipConverter.toZip(phar);
          const zip = await data.generateAsync({
            type: 'blob',
          });
          saveAs(
            zip,
            `${files[0].name.split('.').slice(0, -1).join('.')}.zip`
          );
        } catch {
          setError('An error occurred while converting your plugin.');
          setErrorLink('/support#convert-error');
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('An error occurred while converting your plugin.');
        setErrorLink('/support#convert-error');
        setLoading(false);
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };
  return (
    <Layout title="Extract .phar" showNav={true}>
      {error ? (
        <Alert variant="danger">
          {error} <Link href={errorLink!}>More info.</Link>
        </Alert>
      ) : null}
      <Form onSubmit={handleSubmit}>
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
        <Button
          variant="primary"
          type="submit"
          disabled={loading || !files}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-1" />{' '}
              Converting
              <span className="dots" />
            </>
          ) : (
            'Extract'
          )}
        </Button>
      </Form>
    </Layout>
  );
}

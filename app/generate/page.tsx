'use client';
import { useState, type SyntheticEvent } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import Layout from '../../components/Layout';
import { dump } from 'js-yaml';
import { correctNamespacePart } from '../../lib/utils';
import { saveAs } from 'file-saver';
import Link from 'next/link';
export default function Generate() {
  const [name, setName] = useState<string | null>(null);
  const [api, setApi] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorLink, setErrorLink] = useState<string | null>(null);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.value;
    setNameError(/[^A-Za-z0-9_-]/.test(inputName));
    setName(event.currentTarget.value);
  };
  const handleAPIChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApi(event.currentTarget.value);
  };
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const JSZip = (await import('jszip')).default;
      const plugin = new JSZip();
      const correctedName = correctNamespacePart(name!);
      const namespacePath = 'src/';
      plugin.folder(namespacePath);
      const manifest = dump({
        name,
        version: '0.0.1',
        main: correctedName + '\\Main',
        api,
        'src-namespace-prefix': correctedName,
      });
      plugin.file('plugin.yml', manifest);
      plugin.file(
        namespacePath + 'Main.php',
        `<?php

declare(strict_types=1);

namespace ${correctedName};

use pocketmine\\plugin\\PluginBase;

class Main extends PluginBase{

}`
      );
      const zip = await plugin.generateAsync({
        type: 'uint8array',
      });
      saveAs(
        new Blob([zip as unknown as BlobPart], {
          type: 'application/zip',
        }),
        `${name}.zip`
      );
    } catch {
      setError('An error occurred while generating your plugin.');
      setErrorLink('/support#generate-error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout title="Generate plugin" showNav={true}>
      {error ? (
        <Alert variant="danger">
          {error} <Link href={errorLink!}>More info.</Link>
        </Alert>
      ) : null}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Plugin name</Form.Label>
          <Form.Control
            type="text"
            onChange={handleNameChange}
            isInvalid={nameError}
          />
          <Form.Control.Feedback type="invalid">
            Only letters, numbers, underscores and dashes are allowed.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Plugin API version</Form.Label>
          <Form.Control type="text" onChange={handleAPIChange} />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={!name || !api || nameError || loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-1" />{' '}
              Generating
              <span className="dots" />
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </Form>
    </Layout>
  );
}

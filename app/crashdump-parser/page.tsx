'use client';
import { useState } from 'react';
import { Alert, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../../components/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type Crashdump from '../../lib/crashdump.interface';
export default function CrashdumpParser() {
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseErrorLink, setParseErrorLink] = useState<string | null>(null);
  const [parsedCrashdumpStr, setParsedCrashdumpStr] = useState<string | null>(null);
  const [parsedCrashdumpObj, setParsedCrashdumpObj] = useState<Crashdump | null>(null);
  const [loading, setLoading] = useState(false);
  const [crashdump, setCrashdump] = useState<string | null>(null);
  const CrashdumpPreview = parsedCrashdumpStr
    ? dynamic(() => import('../../components/CrashdumpPreview'), {
        loading: () => (
          <p>
            Loading preview
            <span className="dots" />
          </p>
        ),
      })
    : null;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCrashdump(event.currentTarget.value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setParseError(null);
    setParseErrorLink(null);
    setParsedCrashdumpStr(null);
    setParsedCrashdumpObj(null);
    const response = await fetch('/api/parse-crashdump', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crashdump,
      }),
    });
    const json = await response.json();
    if (response.status === 400) {
      setLoading(false);
      setParseError('Sorry, an error occurred decoding your crashdump.');
      setParseErrorLink('/support#decode-crashdump-error');
      return;
    }
    setLoading(false);
    setParsedCrashdumpStr(json.crashdump);
    setParsedCrashdumpObj(JSON.parse(json.crashdump));
  };
  const saveCrashdump = () => {
    const blob = new Blob([parsedCrashdumpStr!], {
      type: 'application/json;charset=utf-8',
    });
    saveAs(blob, 'crashdump.json');
  };
  return (
    <Layout title="Crashdump Parser" showNav={true}>
      {parseError ? (
        <Alert variant="danger">
          {parseError} <Link href={parseErrorLink!}>More info.</Link>
        </Alert>
      ) : null}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Crashdump</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            onChange={handleChange}
            placeholder="Paste crashdump here"
            className="mb-3"
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={!crashdump || loading}
        >
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
          Your crashdump will be sent to the server for decoding.
        </small>
      </Form>
      {parsedCrashdumpStr ? (
        <Tabs defaultActiveKey="preview" className="mb-3 mt-3">
          <Tab eventKey="preview" title="Preview">
            {CrashdumpPreview && parsedCrashdumpObj && <CrashdumpPreview crashdump={parsedCrashdumpObj} />}
          </Tab>
          <Tab eventKey="raw" title="Raw JSON">
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={12}
                value={parsedCrashdumpStr}
                disabled
                className="mb-3 raw-json-crashdump"
              />
            </Form.Group>
            <Button variant="primary" onClick={saveCrashdump}>
              Download
            </Button>
          </Tab>
        </Tabs>
      ) : null}
    </Layout>
  );
}

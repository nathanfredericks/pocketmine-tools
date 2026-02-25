'use client';
import { useState } from 'react';
import { Alert, Button, Col, Form, Row, Table } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Link from 'next/link';
export default function Ping() {
  const [pingError, setPingError] = useState<string | null>(null);
  const [pingErrorLink, setPingErrorLink] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [port, setPort] = useState('19132');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    name: string;
    mcpeVersion: string;
    currentPlayers: number;
    maxPlayers: number;
  } | null>(null);
  const handleHostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHost(event.currentTarget.value);
  };
  const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(event.currentTarget.value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setPingError(null);
    setPingErrorLink(null);
    setData(null);
    const response = await fetch(`/api/ping/?host=${host}&port=${port}`);
    const json = await response.json();
    if (response.status === 200) {
      setData(json);
      setLoading(false);
    } else if (response.status === 400) {
      if (json.code === 'DNS_LOOKUP_FAILED') {
        setPingError(
          'Sorry, an error occurred pinging your server. Ensure you have the correct hostname.'
        );
        setPingErrorLink('/support#ping-error-host');
      } else {
        setPingError('Sorry, an error occurred pinging your server.');
        setPingErrorLink('/support#ping-error');
      }
      setLoading(false);
    } else {
      setPingError('Sorry, an error occurred pinging your server.');
      setPingErrorLink('/support#ping-error');
      setLoading(false);
    }
  };
  return (
    <Layout title="Ping server" showNav={true}>
      {pingError ? (
        <Alert variant="danger">
          {pingError} <Link href={pingErrorLink!}>More info.</Link>
        </Alert>
      ) : null}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3 align-items-center mt">
          <Col xs="auto">
            <Form.Label>Host</Form.Label>
            <Form.Control
              type="text"
              placeholder="play.lbsg.net"
              onChange={handleHostChange}
            />
          </Col>
          <Col xs="auto">
            <Form.Label className="mt-3 mt-md-0">Port</Form.Label>
            <Form.Control
              type="number"
              placeholder="19132"
              value="19132"
              onChange={handlePortChange}
            />
          </Col>
        </Row>
        <Button
          variant="primary"
          type="submit"
          disabled={!host || !port || loading}
          className="mb-3"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-1" />{' '}
              Pinging
              <span className="dots" />
            </>
          ) : (
            'Ping'
          )}
        </Button>
      </Form>
      {data ? (
        <Table responsive>
          <tbody>
            <tr>
              <td>MOTD</td>
              <td>
                {data.name}{' '}
                <a
                  href={`/motd-generator/?motd=${data.name}`}
                  target="_blank"
                >
                  Open in MOTD Generator
                </a>
              </td>
            </tr>
            <tr>
              <td>MCPE Version</td>
              <td>v{data.mcpeVersion}</td>
            </tr>
            <tr>
              <td>Current players</td>
              <td>{data.currentPlayers}</td>
            </tr>
            <tr>
              <td>Max players</td>
              <td>{data.maxPlayers}</td>
            </tr>
          </tbody>
        </Table>
      ) : null}
    </Layout>
  );
}

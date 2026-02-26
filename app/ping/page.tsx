'use client';
import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Layout from '../../components/Layout';
export default function Ping() {
  const [pingError, setPingError] = useState<string | null>(null);
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
      } else {
        setPingError('Sorry, an error occurred pinging your server.');
      }
      setLoading(false);
    } else {
      setPingError('Sorry, an error occurred pinging your server.');
      setLoading(false);
    }
  };
  return (
    <Layout title="Ping Server" showNav={true}>
      {pingError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {pingError}
          </AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-end gap-4 mb-3">
          <div>
            <Label className="mb-1">Host</Label>
            <Input
              type="text"
              placeholder="play.lbsg.net"
              onChange={handleHostChange}
            />
          </div>
          <div>
            <Label className="mb-1">Port</Label>
            <Input
              type="number"
              placeholder="19132"
              value="19132"
              onChange={handlePortChange}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={!host || !port || loading}
          className="mb-3"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />{' '}
              Pinging
            </>
          ) : (
            'Ping'
          )}
        </Button>
      </form>
      {data ? (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>MOTD</TableCell>
              <TableCell>
                {data.name}{' '}
                <a
                  href={`/motd-generator/?motd=${data.name}`}
                  target="_blank"
                >
                  Open in MOTD Generator
                </a>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>MCPE Version</TableCell>
              <TableCell>v{data.mcpeVersion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Current players</TableCell>
              <TableCell>{data.currentPlayers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Max players</TableCell>
              <TableCell>{data.maxPlayers}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : null}
    </Layout>
  );
}

'use client';
import React, { Component, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveAs } from 'file-saver';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
import type Crashdump from '../../lib/crashdump.interface';

class PreviewErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Unable to preview this crashdump. Try the Raw JSON tab instead.
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}
export default function CrashdumpParser() {
  const [parseError, setParseError] = useState<string | null>(null);
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
    setParsedCrashdumpStr(null);
    setParsedCrashdumpObj(null);
    try {
      const response = await fetch('/api/parse-crashdump', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crashdump,
        }),
      });
      if (!response.ok) {
        setParseError('Sorry, an error occurred decoding your crashdump.');
        return;
      }
      const json = await response.json();
      const parsed: Crashdump = JSON.parse(json.crashdump);
      setParsedCrashdumpStr(json.crashdump);
      setParsedCrashdumpObj(parsed);
    } catch {
      setParseError('Sorry, an error occurred decoding your crashdump.');
    } finally {
      setLoading(false);
    }
  };
  const saveCrashdump = () => {
    const blob = new Blob([parsedCrashdumpStr!], {
      type: 'application/json;charset=utf-8',
    });
    saveAs(blob, 'crashdump.json');
  };
  return (
    <Layout title="Parse Crashdump" showNav={true}>
      {parseError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {parseError}
          </AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2 mb-3">
          <Label>Crashdump</Label>
          <Textarea
            rows={6}
            onChange={handleChange}
            placeholder="Paste crashdump here"
          />
        </div>
        <Button
          type="submit"
          disabled={!crashdump || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Decoding
              <span className="dots" />
            </>
          ) : (
            'Decode'
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Your crashdump will be sent to the server for decoding.
        </p>
      </form>
      {parsedCrashdumpStr ? (
        <Tabs defaultValue="preview" className="mt-3">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <PreviewErrorBoundary>
              {CrashdumpPreview && parsedCrashdumpObj && <CrashdumpPreview crashdump={parsedCrashdumpObj} />}
            </PreviewErrorBoundary>
          </TabsContent>
          <TabsContent value="raw">
            <Textarea
              rows={12}
              value={parsedCrashdumpStr}
              disabled
              className="mb-3 font-mono"
            />
            <Button onClick={saveCrashdump}>
              Download
            </Button>
          </TabsContent>
        </Tabs>
      ) : null}
    </Layout>
  );
}

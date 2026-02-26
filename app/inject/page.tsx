'use client';
import { useState } from 'react';
import { AlertCircle, CloudUpload, Loader2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { saveAs } from 'file-saver';
import Layout from '../../components/Layout';
export default function Inject() {
  const [files, setFiles] = useState<File[]>([]);
  const [apiVersion, setApiVersion] = useState('');
  const [warningModal, setWarningModal] = useState(false);
  const [warningThreeWords, setWarningThreeWords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    if (files.length < 1) return;
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
      } finally {
        setWarningModal(false);
        setWarningThreeWords(false);
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(files[0]);
  };
  return (
    <Layout title="Inject API Version" showNav={true}>
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : null}
      <form>
        <div className="grid gap-2 mb-3">
          <Label>Plugin (<code>.phar</code> file)</Label>
          <FileUpload
            value={files}
            onValueChange={setFiles}
            accept=".phar"
            maxFiles={1}
          >
            <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
              <CloudUpload className="size-4" />
              Drag and drop or
              <FileUploadTrigger asChild>
                <Button variant="link" size="sm" className="p-0">
                  choose a file
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon-xs">
                      <X />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </div>
        <div className="grid gap-2 mb-3">
          <Label>API version</Label>
          <Input
            type="text"
            value={apiVersion}
            onChange={(event) => setApiVersion(event.target.value)}
          />
        </div>
        <Button
          onClick={() => setWarningModal(true)}
          disabled={files.length < 1 || apiVersion.length < 1}
        >
          Inject
        </Button>
      </form>
      <Dialog open={warningModal} onOpenChange={setWarningModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              This is dangerous
            </DialogTitle>
          </DialogHeader>
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
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={!warningThreeWords || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Injecting
                  <span className="dots" />
                </>
              ) : (
                'Inject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

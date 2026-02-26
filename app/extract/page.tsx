"use client";
import { useState, type SyntheticEvent } from "react";
import { AlertCircle, CloudUpload, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { saveAs } from "file-saver";
import Layout from "../../components/Layout";

export default function Extract() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    if (files.length > 0) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const Archive = (await import("phar")).Archive;
          const phar = new Archive();

          phar.loadPharData(new Uint8Array(reader.result as ArrayBuffer));
          const ZipConverter = (await import("phar")).ZipConverter;
          const data = await ZipConverter.toZip(phar);
          const zip = await data.generateAsync({
            type: "blob",
          });

          saveAs(
            zip,
            `${files[0].name.split(".").slice(0, -1).join(".")}.zip`
          );
        } catch {
          setError("An error occurred while converting your plugin.");
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("An error occurred while converting your plugin.");
        setLoading(false);
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  return (
    <Layout title="Extract .phar" showNav={true}>
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : null}
      <form onSubmit={handleSubmit}>
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
        <Button
          type="submit"
          disabled={loading || files.length < 1}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Converting
              <span className="dots" />
            </>
          ) : (
            "Extract"
          )}
        </Button>
      </form>
    </Layout>
  );
}

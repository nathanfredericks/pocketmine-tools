"use client";
import { useState } from "react";
import { AlertCircle, CloudUpload, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Layout from "../../components/Layout";
import { saveAs } from "file-saver";

export default function Create() {
  const [files, setFiles] = useState<File[]>([]);
  const [stub, setStub] = useState("<?php __HALT_COMPILER();");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleStubChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStub(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    if (files.length < 1) return;
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const JSZip = (await import("jszip")).default;
        const zip = await JSZip.loadAsync(new Uint8Array(reader.result as ArrayBuffer));
        const originalName = files[0].name.split(".").slice(0, -1).join(".");

        if (
          zip.files[`${originalName}/`] &&
          zip.files[`${originalName}/`].dir
        ) {
          (zip as any).root = zip.files[`${originalName}/`].name;
        }
        const ZipConverter = (await import("phar")).ZipConverter;
        const phar = await ZipConverter.toPhar(
          await zip.generateAsync({ type: "uint8array" })
        );

        phar.setStub(stub);
        saveAs(
          new Blob([phar.savePharData() as unknown as BlobPart], {
            type: "application/octet-stream",
          }),
          `${files[0].name.split(".").slice(0, -1).join(".")}.phar`
        );
      } catch {
        setError(
          "An error occurred while converting your plugin. Please check your network connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      console.log("net err");
      setError("An error occurred while converting your plugin.");
      setLoading(false);
    };
    reader.readAsArrayBuffer(files[0]);
  };

  return (
    <Layout title="Create .phar" showNav={true}>
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
          <Label>Plugin (<code>.zip</code> file)</Label>
          <FileUpload
            value={files}
            onValueChange={setFiles}
            accept=".zip,application/zip"
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
          <Label>Stub</Label>
          <Input
            type="text"
            defaultValue="<?php __HALT_COMPILER();"
            onChange={handleStubChange}
          />
          <p className="text-sm text-muted-foreground">
            Don&#39;t change this unless you know what you&#39;re doing.
          </p>
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
            "Create"
          )}
        </Button>
      </form>
    </Layout>
  );
}

"use client";
import { useState, type SyntheticEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "../../components/Layout";
import { dump } from "js-yaml";
import { correctNamespacePart } from "../../lib/pocketmine-utils";
import { saveAs } from "file-saver";

export default function Generate() {
  const [name, setName] = useState<string | null>(null);
  const [api, setApi] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const JSZip = (await import("jszip")).default;
      const plugin = new JSZip();
      const correctedName = correctNamespacePart(name!);
      const namespacePath = "src/";

      plugin.folder(namespacePath);
      const manifest = dump({
        name,
        version: "0.0.1",
        main: correctedName + "\\Main",
        api,
        "src-namespace-prefix": correctedName,
      });

      plugin.file("plugin.yml", manifest);
      plugin.file(
        namespacePath + "Main.php",
        `<?php

declare(strict_types=1);

namespace ${correctedName};

use pocketmine\\plugin\\PluginBase;

class Main extends PluginBase{

}`
      );
      const zip = await plugin.generateAsync({
        type: "uint8array",
      });

      saveAs(
        new Blob([zip as unknown as BlobPart], {
          type: "application/zip",
        }),
        `${name}.zip`
      );
    } catch {
      setError("An error occurred while generating your plugin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Generate Plugin Template" showNav={true}>
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
          <Label>Plugin name</Label>
          <Input
            type="text"
            onChange={handleNameChange}
            className={nameError ? "border-destructive" : ""}
          />
          {nameError && (
            <p className="text-sm text-destructive">
              Only letters, numbers, underscores and dashes are allowed.
            </p>
          )}
        </div>
        <div className="grid gap-2 mb-3">
          <Label>Plugin API version</Label>
          <Input type="text" onChange={handleAPIChange} />
        </div>
        <Button
          type="submit"
          disabled={!name || !api || nameError || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating
              <span className="dots" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </form>
    </Layout>
  );
}

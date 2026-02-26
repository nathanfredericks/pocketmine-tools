'use client';
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from '@/components/ui/table';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import php from 'react-syntax-highlighter/dist/cjs/languages/hljs/php';
import properties from 'react-syntax-highlighter/dist/cjs/languages/hljs/properties';
import yml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml';
import defaultStyle from 'react-syntax-highlighter/dist/cjs/styles/hljs/default-style';
import vs2015 from 'react-syntax-highlighter/dist/cjs/styles/hljs/vs2015';
import { capitalize, formatOS, parseCode, secondsToDHMS } from '../lib/pocketmine-utils';
import { Server, OctagonX, Plug, SlidersHorizontal, Settings, Box, FileCode2 } from 'lucide-react';
import { useDarkMode } from '@/hooks/use-dark-mode';
import Crashdump from '../lib/crashdump.interface';
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('properties', properties);
SyntaxHighlighter.registerLanguage('yml', yml);
type CrashdumpPreviewProps = {
  crashdump: Crashdump;
};
export default function CrashdumpPreview({ crashdump }: CrashdumpPreviewProps) {
  const isDark = useDarkMode();
  const codeStyle = isDark ? vs2015 : defaultStyle;
  return (
    <>
      <h4>{crashdump.error?.message}</h4>
      <Accordion type="single" collapsible defaultValue="item-0">
        <AccordionItem value="item-0">
          <AccordionTrigger>
            <Server className="mr-2 size-4" />
            General and System Information
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Version</TableCell>
                  <TableCell>{crashdump.general?.base_version}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Git commit</TableCell>
                  <TableCell>
                    {crashdump.general?.git ? (
                      <a
                        href={`https://github.com/pmmp/PocketMine-MP/tree/${crashdump.general.git}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {crashdump.general.git.substring(0, 8)}
                      </a>
                    ) : null}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Plugin involvement</TableCell>
                  <TableCell>{crashdump.plugin_involvement ? capitalize(crashdump.plugin_involvement) : null}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Report date</TableCell>
                  <TableCell>{crashdump.time ? new Date(crashdump.time * 1000).toISOString() : null}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Server uptime</TableCell>
                  <TableCell>{crashdump.uptime !== undefined ? secondsToDHMS(crashdump.uptime) : null}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PHP Version</TableCell>
                  <TableCell>{crashdump.general?.php}</TableCell>
                </TableRow>
                {crashdump.jit_mode !== undefined && crashdump.jit_mode !== null ? (
                  <TableRow>
                    <TableCell>JIT status</TableCell>
                    <TableCell>{crashdump.jit_mode ? 'Enabled' : 'Disabled'}</TableCell>
                  </TableRow>
                ) : null}
                <TableRow>
                  <TableCell>Operating system</TableCell>
                  <TableCell>{crashdump.general?.os ? formatOS(crashdump.general.os) : null}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>System banner</TableCell>
                  <TableCell>{crashdump.general?.uname ? capitalize(crashdump.general.uname) : null}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Startup arguments</TableCell>
                  <TableCell>
                    <code>{crashdump.parameters?.join(' ')}</code>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <OctagonX className="mr-2 size-4" />
            Error Information
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                {crashdump.plugin ? (
                  <TableRow>
                    <TableCell>Plugin involved</TableCell>
                    <TableCell className="bg-sky-50 dark:bg-sky-950">{crashdump.plugin}</TableCell>
                  </TableRow>
                ) : null}
                {crashdump.thread ? (
                  <TableRow>
                    <TableCell>Thread</TableCell>
                    <TableCell>{crashdump.thread}</TableCell>
                  </TableRow>
                ) : null}
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{crashdump.error?.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Message</TableCell>
                  <TableCell>{crashdump.error?.message}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>File</TableCell>
                  <TableCell>{crashdump.error?.file}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Line</TableCell>
                  <TableCell>{crashdump.error?.line}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {crashdump.code ? (
              <SyntaxHighlighter
                className="code-block"
                language="php"
                style={codeStyle}
                showLineNumbers
                startingLineNumber={parseInt(Object.keys(crashdump.code)[0])}
              >
                {parseCode(crashdump.code)}
              </SyntaxHighlighter>
            ) : null}
            {crashdump.trace?.length ? (
              <SyntaxHighlighter className="code-block" style={codeStyle}>
                {crashdump.trace.join('\n')}
              </SyntaxHighlighter>
            ) : null}
          </AccordionContent>
        </AccordionItem>
        {crashdump.lastError && typeof crashdump.lastError === 'object' && !Array.isArray(crashdump.lastError) ? (
          <AccordionItem value="item-last-error">
            <AccordionTrigger>
              <OctagonX className="mr-2 size-4" />
              Last Error
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>{crashdump.lastError.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Message</TableCell>
                    <TableCell>{crashdump.lastError.message}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>File</TableCell>
                    <TableCell>{crashdump.lastError.file}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Line</TableCell>
                    <TableCell>{crashdump.lastError.line}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {crashdump.lastError.trace?.length ? (
                <SyntaxHighlighter className="code-block" style={codeStyle}>
                  {crashdump.lastError.trace.join('\n')}
                </SyntaxHighlighter>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {crashdump.plugins ? (
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Plug className="mr-2 size-4" />
              Loaded Plugins
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>API</TableHead>
                    <TableHead>Load order</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Author(s)</TableHead>
                    <TableHead>Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(crashdump.plugins).map((key) => (
                    <TableRow key={key}>
                      <TableCell>{crashdump.plugins![key].name}</TableCell>
                      <TableCell>{crashdump.plugins![key].version}</TableCell>
                      <TableCell>{crashdump.plugins![key].api?.join(', ')}</TableCell>
                      <TableCell>{crashdump.plugins![key].load}</TableCell>
                      <TableCell>
                        {crashdump.plugins![key].enabled ? 'Enabled' : 'Disabled'}
                      </TableCell>
                      <TableCell>{crashdump.plugins![key].authors?.join(', ')}</TableCell>
                      <TableCell>
                        {crashdump.plugins![key].website ? (
                          <a href={crashdump.plugins![key].website}>Visit</a>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {crashdump['server.properties'] ? (
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <SlidersHorizontal className="mr-2 size-4" />
              Server Settings
            </AccordionTrigger>
            <AccordionContent>
              <SyntaxHighlighter
                className="code-block"
                language="properties"
                style={codeStyle}
                showLineNumbers
              >
                {crashdump['server.properties']}
              </SyntaxHighlighter>
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {crashdump['pocketmine.yml'] ? (
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <Settings className="mr-2 size-4" />
              PocketMine-MP Configuration
            </AccordionTrigger>
            <AccordionContent>
              <SyntaxHighlighter
                className="code-block"
                language="yml"
                style={codeStyle}
                showLineNumbers
              >
                {crashdump['pocketmine.yml']}
              </SyntaxHighlighter>
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {crashdump.general?.composer_libraries ? (
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <Box className="mr-2 size-4" />
              Installed Composer Dependencies
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(crashdump.general.composer_libraries).map(
                    (key) => (
                      <TableRow key={key}>
                        <TableCell>
                          <a href={`https://packagist.org/packages/${key}`}>
                            {key}
                          </a>
                        </TableCell>
                        <TableCell>{crashdump.general!.composer_libraries![key]}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {crashdump.extensions ? (
          <AccordionItem value="item-6">
            <AccordionTrigger>
              <FileCode2 className="mr-2 size-4" />
              Installed PHP extensions
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(crashdump.extensions).map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{crashdump.extensions![key]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>
    </>
  );
}

import React from 'react';
import { Accordion, Table } from 'react-bootstrap';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import php from 'react-syntax-highlighter/dist/cjs/languages/hljs/php';
import properties from 'react-syntax-highlighter/dist/cjs/languages/hljs/properties';
import yml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml';
import defaultStyle from 'react-syntax-highlighter/dist/cjs/styles/hljs/default-style';
import { capitalize, formatOS, parseCode, secondsToDHMS } from '../lib/utils';
import Server from 'bootstrap-icons/icons/server.svg';
import XOctagonFill from 'bootstrap-icons/icons/x-octagon-fill.svg';
import Plugin from 'bootstrap-icons/icons/plugin.svg';
import Sliders from 'bootstrap-icons/icons/sliders.svg';
import GearFill from 'bootstrap-icons/icons/gear-fill.svg';
import BoxFill from 'bootstrap-icons/icons/box-fill.svg';
import FiletypePHP from 'bootstrap-icons/icons/filetype-php.svg';
import Crashdump from '../lib/crashdump.interface';
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('properties', properties);
SyntaxHighlighter.registerLanguage('yml', yml);
type CrashdumpPreviewProps = {
  crashdump: Crashdump;
};
export default function CrashdumpPreview({ crashdump }: CrashdumpPreviewProps) {
  return (
    <>
      <h4>{crashdump.lastError.message}</h4>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Server className="accordion-icon" />
            General and system information
          </Accordion.Header>
          <Accordion.Body>
            <Table responsive>
              <tbody>
                <tr>
                  <td>Version</td>
                  <td>{crashdump.general.base_version}</td>
                </tr>
                <tr>
                  <td>Git commit</td>
                  <td>
                    <a
                      href={`https://github.com/pmmp/PocketMine-MP/tree/${crashdump.general.git}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {crashdump.general.git.substring(0, 8)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Plugin involvement</td>
                  <td>{capitalize(crashdump.plugin_involvement)}</td>
                </tr>
                <tr>
                  <td>Report date</td>
                  <td>{new Date(crashdump.time * 1000).toISOString()}</td>
                </tr>
                <tr>
                  <td>Server uptime</td>
                  <td>{secondsToDHMS(crashdump.uptime)}</td>
                </tr>
                <tr>
                  <td>PHP Version</td>
                  <td>{crashdump.general.php}</td>
                </tr>
                {crashdump.jit_mode ? (
                  <tr>
                    <td>JIT status</td>
                    <td>{crashdump.jit_mode ? 'Enabled' : 'Disabled'}</td>
                  </tr>
                ) : null}
                <tr>
                  <td>Operating system</td>
                  <td>{formatOS(crashdump.general.os)}</td>
                </tr>
                <tr>
                  <td>System banner</td>
                  <td>{capitalize(crashdump.general.uname)}</td>
                </tr>
                <tr>
                  <td>Startup arguments</td>
                  <td>
                    <code>{crashdump.parameters.join(' ')}</code>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <XOctagonFill className="accordion-icon" />
            Error information
          </Accordion.Header>
          <Accordion.Body>
            <Table responsive>
              <tbody>
                {crashdump.plugin ? (
                  <tr>
                    <td>Plugin involved</td>
                    <td className="table-info">{crashdump.plugin}</td>
                  </tr>
                ) : null}
                <tr>
                  <td>Message</td>
                  <td>{crashdump.error.message}</td>
                </tr>
                <tr>
                  <td>File</td>
                  <td>{crashdump.error.file}</td>
                </tr>
                <tr>
                  <td>Line</td>
                  <td>{crashdump.error.line}</td>
                </tr>
              </tbody>
            </Table>
            <SyntaxHighlighter
              className="code-block"
              language="php"
              style={defaultStyle}
              showLineNumbers
              startingLineNumber={parseInt(Object.keys(crashdump.code)[0])}
            >
              {parseCode(crashdump.code)}
            </SyntaxHighlighter>
            <SyntaxHighlighter className="code-block" style={defaultStyle}>
              {crashdump.lastError.trace.join('\n')}
            </SyntaxHighlighter>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <Plugin className="accordion-icon" />
            Loaded plugins
          </Accordion.Header>
          <Accordion.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Version</th>
                  <th>API</th>
                  <th>Load order</th>
                  <th>State</th>
                  <th>Author(s)</th>
                  <th>Website</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(crashdump.plugins).map((key) => (
                  <tr key={key}>
                    <td>{crashdump.plugins[key].name}</td>
                    <td>{crashdump.plugins[key].version}</td>
                    <td>{crashdump.plugins[key].api.join(', ')}</td>
                    <td>{crashdump.plugins[key].load}</td>
                    <td>
                      {crashdump.plugins[key].enabled ? 'Enabled' : 'Disabled'}
                    </td>
                    <td>{crashdump.plugins[key].authors.join(', ')}</td>
                    <td>
                      {crashdump.plugins[key].website ? (
                        <a href={crashdump.plugins[key].website}>Visit</a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        {crashdump['server.properties'] ? (
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <Sliders className="accordion-icon" />
              Server settings
            </Accordion.Header>
            <Accordion.Body>
              <SyntaxHighlighter
                className="code-block"
                language="properties"
                style={defaultStyle}
                showLineNumbers
              >
                {crashdump['server.properties']}
              </SyntaxHighlighter>
            </Accordion.Body>
          </Accordion.Item>
        ) : null}
        {crashdump['pocketmine.yml'] ? (
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <GearFill className="accordion-icon" />
              PocketMine-MP configuration
            </Accordion.Header>
            <Accordion.Body>
              <SyntaxHighlighter
                className="code-block"
                language="yml"
                style={defaultStyle}
                showLineNumbers
              >
                {crashdump['pocketmine.yml']}
              </SyntaxHighlighter>
            </Accordion.Body>
          </Accordion.Item>
        ) : null}
        <Accordion.Item eventKey="5">
          <Accordion.Header>
            <BoxFill className="accordion-icon" />
            Installed Composer Dependencies
          </Accordion.Header>
          <Accordion.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Version</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(crashdump.general.composer_libraries).map(
                  (key) => (
                    <tr key={key}>
                      <td>
                        <a href={`https://packagist.org/packages/${key}`}>
                          {key}
                        </a>
                      </td>
                      <td>{crashdump.general.composer_libraries[key]}</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="6">
          <Accordion.Header>
            <FiletypePHP className="accordion-icon" />
            Installed PHP extensions
          </Accordion.Header>
          <Accordion.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Version</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(crashdump.extensions).map((key) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{crashdump.extensions[key]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

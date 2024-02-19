import React, { Component } from 'react';
import Layout from '../components/Layout';
import {Accordion, Alert, Table} from 'react-bootstrap';
import FileStructTable from '../components/FileStructTable';
import Head from 'next/head';
import getConfig from 'next/config';
export default class Support extends Component {
  render = () => {
    const { publicRuntimeConfig } = getConfig();
    const version = publicRuntimeConfig.version;
    return (
      <>
        <Head>
          <meta name="description" content="Get support with PocketMine Tools" />
        </Head>
        <Layout title="Support" showNav={true}>
          <h1>Support</h1>
          <h2>FAQ</h2>
          <Accordion className="mb-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Why won&apos;t my plugin work?</Accordion.Header>
              <Accordion.Body>
                <strong>Make <code>.phar</code></strong>
                <br/>
                Before uploading your <code>.zip</code> file, make sure the plugin&apos;s contents are in the root
                directory or a directory with the same name as the <code>.zip</code> file.
                <FileStructTable exTitles={false}/>
                <strong>Extract <code>.phar</code></strong><br/>
                Before moving your converted <code>.zip</code> file to the <code>plugins/</code> directory, make sure to
                unzip it.
                <br/>
                <strong>API Injector</strong><br/>
                In previous versions of PocketMine Tools (v2 and below), API Injector would modify your plugin&apos;s code
                to make it compatible with newer API versions.
                As of v3, PocketMine Tools only bumps the API version in <code>plugin.yml</code>. This means you must
                handle API changes by hand.
                <br/>
                <strong>Decode <code>.pmf</code></strong><br/>
                Decode <code>.pmf</code> only decodes your <code>.pmf</code> plugin. It does not do anything behind the
                scenes to make your plugin compatible with newer PocketMine-MP versions.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>I need help with plugin development</Accordion.Header>
              <Accordion.Body>
                <p>Check out these official resources from the PMMP team.</p>
                <ul>
                  <li><a href="https://discord.com/invite/bmSAZBG">Discord server</a></li>
                  <li><a href="https://doc.pmmp.io/en/rtfd/index.html">Documentation</a></li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>How can I report a bug?</Accordion.Header>
              <Accordion.Body>
                You can report a bug at our <a href="https://github.com/nathanfredericks/pocketmine-tools/issues">GitHub
                repository</a>.
                Please include your browser and device with your bug report.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>How can I make a feature request?</Accordion.Header>
              <Accordion.Body>
                You can request a feature at our <a href="https://github.com/nathanfredericks/pocketmine-tools/issues">GitHub
                repository</a>. Please include a full description of the feature you are requesting.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <h2>Troubleshooting errors</h2>
          <Alert variant="info"><strong>Note: </strong>Before troubleshooting, please check your internet connection.
            PocketMine Tools requires an internet connection to work.</Alert>
          <h3 id="decode-crashdump-error">Sorry, an error occurred decoding your crashdump.</h3>
          <p>
            This error occurs when the crashdump body is invalid or doesn&apos;t exist.
            <ul>
              <li>Check that your crashdump was pasted in full. Missing characters can make the crashdump invalid.</li>
              <li>Check that your crashdump was produced by an official version of PocketMine-MP. Spoons/forks are not
                supported.
              </li>
            </ul>
          </p>
          <h3 id="convert-error">An error occurred while converting your plugin.</h3>
          <p>
            This error occurs when your plugin cannot be converted. Often this error is caused by uploading the wrong file
            type.
            <ul>
              <li><strong>Make <code>.phar</code></strong><br/>Required file type: <code>.zip</code></li>
              <li><strong>Extract <code>.phar</code></strong><br/>Required file type: <code>.phar</code></li>
            </ul>
            <mark>Note that changing the file extension will not change the file type.</mark>
          </p>
          <h3 id="generate-error">An error occurred while generating your plugin.</h3>
          <p>This error occurs when there is an error generating your plugin. Please file a bug report if you experience
            this error. Make sure to include your browser, device, plugin name and plugin API.</p>
          <h3 id="inject-directory-error">An error occurred while injecting your plugin. Ensure that the plugin is in the
            root directory of the zip.</h3>
          <p>This error occurs when a <code>plugin.yml</code> file is not located in the root directory of the uploaded
            plugin.
            <ul>
              <li>Use the <em>Extract <code>.phar</code></em> tool to extract your plugin to a <code>.zip</code> file.
              </li>
              <li>Unzip the <code>.zip</code> file.</li>
              <li>
                Check that the plugin&apos;s contents are in the root directory of the <code>.zip</code> file or a
                directory with the same name as the <code>.zip</code> file.
                <FileStructTable exTitles/>
              </li>
              <li>If your folder structure looks like <strong>Example 3 or 4</strong>, move your files into the root of
                the <code>.zip</code> file. Your file structure should look like <strong>Example 1</strong>.
              </li>
              <li>Use the <em>Create <code>.phar</code></em> tool to convert your plugin back to <code>.phar</code>.</li>
            </ul>
          </p>
          <h3 id="inject-error">An error occurred while injecting your plugin.</h3>
          <p>
            This error occurs when your plugin cannot be injected. Often this error is caused by uploading the wrong file
            type.
            <ul>
              <li><strong>API Injector</strong><br/>Required file type: <code>.phar</code></li>
            </ul>
            <mark>Note that changing the file extension will not change the file type.</mark>
          </p>
          <h3 id="pmf-decode-error">Sorry, there was an error decoding your file.</h3>
          <p>
            This error occurs when there an an error decoding your <code>.pmf</code> plugin. Check that your plugin is
            valid and not corrupted.
          </p>
          <h3 id="pmf-beautify-error">Sorry, there was an error beautifying your code. Try turning off beautify
            output.</h3>
          <p>This error often occurs when the PHP code in the <code>.pmf</code> plugin has an invalid syntax. Try
            uploading a different plugin or turn off beautify output to get the original code.</p>
          <h3 id="pmf-size-error">Sorry, your .pmf plugin is too large. The maximum size is 5 megabytes.</h3>
          <p>This error occurs when you upload a <code>.pmf</code> plugin bigger than 5 megabytes. Please upload a smaller
            plugin.</p>
          <h3 id="pmf-ext-error">Sorry, only .pmf plugins are allowed.</h3>
          <p>This error occurs when you upload a plugin not ending in <code>.pmf</code>. Please ensure your plugin has the
            correct extension and is a <code>.pmf</code> plugin.</p>
          <h3 id="ping-error-host">Sorry, an error occurred pinging your server. Ensure you have the correct
            hostname.</h3>
          <p>This error is shown when your server&apos;s DNS record cannot be found.</p>
          <ol>
            <li>Check that you have an <code>A</code> record pointing to your server&apos;s IP address.</li>
            <li>Check that the hostname and port are entered correctly.</li>
          </ol>
          <h3 id="ping-error">Sorry, an error occurred pinging your server.</h3>
          <p>This error occurs when your server cannot be pinged. Check that the server is online and the hostname and
            port are entered correctly. If you continue to experience errors, file a bug report and make sure to include
            the affected hostname and port.</p>
          <h2>Contact us</h2>
          <p>Please send an email to <a
            href={`mailto:${process.env.CONTACT_EMAIL}`}>{process.env.CONTACT_EMAIL}</a>.</p>
          <h2>Build Information</h2>
          <Table bordered>
            <tbody>
            <tr>
              <th>Version</th>
              <td><code className="text-body-secondary">v{version}</code></td>
            </tr>
            </tbody>
          </Table>
        </Layout>
      </>
    );
  }
}

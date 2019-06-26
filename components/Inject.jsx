/* eslint-disable no-param-reassign */
/* eslint-disable implicit-arrow-linebreak */
import React, { Component } from 'react';
import { Form, InputGroup, Button, Badge, Modal, Alert } from 'react-bootstrap';
import * as PHAR from 'phar';
import yaml from 'yaml-js';
import { saveAs } from 'file-saver';
import * as gtag from '../utils/gtag';

const getFileExtension = (name) =>
  name.slice((Math.max(0, name.lastIndexOf('.')) || Infinity) + 1);

export default class extends Component {
  state = {
    files: [],
    apiVersion: '3.0.0',
    replaceNbtTags: true,
    protocolReplace: true,
    replaceStrictTypes: true,
    warningModal: false,
    warningRead: false,
    warningThreeWords: false,
    originalPluginYml: {},
  };

  handleChange = (event) => {
    this.setState({
      files: event.target.files,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const {
      files,
      apiVersion,
      replaceNbtTags,
      protocolReplace,
      replaceStrictTypes,
      // warningRead,
    } = this.state;

    gtag.event({
      action: 'inject',
      category: 'Plugin',
      label: files[0].name,
    });

    const reader = new FileReader();

    reader.onload = async () => {
      const phar = new PHAR.Archive();

      phar.loadPharData(new Uint8Array(reader.result));

      phar.getFiles().forEach(({ name, contents }) => {
        if (getFileExtension(name) === 'php') {
          if (replaceNbtTags) {
            const nbtTags = {
              ByteArray: 'ByteArrayTag',
              Byte: 'ByteTag',
              Compound: 'CompoundTag',
              Double: 'DoubleTag',
              End: 'EndTag',
              Float: 'FloatTag',
              IntArray: 'IntArrayTag',
              Int: 'IntTag',
              Enum: 'ListTag',
              Long: 'LongTag',
              Short: 'ShortTag',
              String: 'StringTag',
            };

            Object.keys(nbtTags).forEach((nbtTag) => {
              const findRegex = new RegExp(
                `pocketmine\\nbt\\tag\\${nbtTag};|()/mi`,
              );
              const replaceRegex = new RegExp(
                `pocketmine\\nbt\\tag\\${nbtTags[nbtTag]}$1/`,
              );

              contents = contents.replace(findRegex, replaceRegex);
            });
          }

          if (protocolReplace) {
            contents = contents.replace(
              /pocketmine\\network\\protocol\\(.+?)(;|\()/im,
              /pocketmine\\network\\mcpe\\protocol\\$1$2/,
            );
          }

          if (replaceStrictTypes) {
            // Command strict types
            contents = contents.replace(
              /public\s+function\s+onCommand\s*\(\s*((([\w]|\\)*CommandSender)\s+)?\$([\w]+)\s*,\s*((([\w]|\\)*Command)\s+)?\$([\w]+)\s*,\s*(string\s+)?\$([\w]+)\s*,\s*(array\s+)?\$([\w]+)\s*\)\s*(:\s*bool\s*)?{/im,
              'public function onCommand($2 $$$4, $6 $$$8, string $$$10, array $$$12): bool {',
            );

            // onRun strict types
            contents = contents.replace(
              /public\s+function\s+onRun\s*\(\s*(int\s+)?\$([\w]+)\s*\)\s*(:\s*\w+\s*)?{/im,
              'public function onRun(int $$$2) {',
            );
          }

          phar.removeFile(name);
          phar.addFile(new PHAR.File(name, contents));
        }
      });

      const pluginYml = yaml.load(phar.getFile('plugin.yml').contents);

      this.setState({
        originalPluginYml: pluginYml,
      });

      pluginYml.api = apiVersion;

      phar.removeFile('plugin.yml');
      phar.addFile(new PHAR.File('plugin.yml', yaml.dump(pluginYml)));

      saveAs(
        new Blob([phar.savePharData()], {
          type: 'application/octet-stream',
        }),
        `${files[0].name
          .split('.')
          .slice(0, -1)
          .join('.')}-${apiVersion}.phar`,
      );

      this.setState({
        warningModal: false,
        warningRead: false,
        warningThreeWords: false,
      });
    };

    reader.readAsArrayBuffer(files[0]);
  };

  render = () => {
    const {
      files,
      apiVersion,
      replaceNbtTags,
      protocolReplace,
      replaceStrictTypes,
      warningModal,
      // originalPluginYml,
      warningThreeWords,
    } = this.state;

    return (
      <>
        <Alert variant="danger">
          API Injector will be deprecated upon release of PocketMine-MP v4.0
        </Alert>
        <Form>
          <Form.Label>Plugin</Form.Label>
          <InputGroup className="mb-3">
            <div className="custom-file">
              <Form.Control
                type="file"
                className="custom-file-input"
                accept=".phar"
                onChange={this.handleChange}
              />
              <Form.Label className="custom-file-label">
                {files[0] ? files[0].name : 'No file selected.'}
              </Form.Label>
            </div>
          </InputGroup>
          <Form.Group className="mb-3">
            <Form.Label>API version</Form.Label>
            <Form.Control
              type="text"
              value={apiVersion}
              onChange={(event) =>
                this.setState({ apiVersion: event.target.value })
              }
            />
          </Form.Group>
          <div className="mb-3">
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="replaceStrictTypes"
                checked={replaceStrictTypes}
                onChange={(event) =>
                  this.setState({ replaceStrictTypes: event.target.checked })
                }
              />
              <label
                className="custom-control-label"
                htmlFor="replaceStrictTypes"
              >
                Add strict types{' '}
                <Badge variant="light">3.0.0-ALPHA6 to 3.0.0-ALPHA7</Badge>
              </label>
            </div>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="protocolReplace"
                checked={protocolReplace}
                onChange={(event) =>
                  this.setState({ protocolReplace: event.target.checked })
                }
              />
              <label className="custom-control-label" htmlFor="protocolReplace">
                Replace protocol{' '}
                <Badge variant="light">2.0.0 to 3.0.0-ALPHA1</Badge>
              </label>
            </div>
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="replaceNbtTags"
                checked={replaceNbtTags}
                onChange={(event) =>
                  this.setState({ replaceNbtTags: event.target.checked })
                }
              />
              <label className="custom-control-label" htmlFor="replaceNbtTags">
                Replace NBT tags <Badge variant="light">1.0.0 to 2.0.0</Badge>
              </label>
            </div>
          </div>
          <Button
            variant="secondary"
            // type="submit"
            onClick={() =>
              this.setState({
                warningModal: true,
              })
            }
            disabled={files.length < 1 || apiVersion.length < 1}
          >
            Inject
          </Button>
        </Form>
        <Modal
          show={warningModal}
          onHide={() => this.setState({ warningModal: false })}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>This is dangerous</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ol>
              <li>
                This tool only forces the plugin to say that it supports API
                version {apiVersion}, and optionally, blindly replaces some
                specific backwards-incompatible changes in the{' '}
                <code>.phar</code>. It will not fix the actual incompatibility
                issues.
              </li>
              <li>
                If errors happen after loading the downloaded plugin, uninstall
                it immediately and contact the plugin developer for support.
              </li>
              <li>
                Click{' '}
                <em onClick={() => this.setState({ warningThreeWords: true })}>
                  these three words
                </em>{' '}
                if you have read the above.
              </li>
            </ol>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button
              variant="secondary"
              onClick={() => this.setState({ warningModal: false })}
            >
              Close
            </Button> */}
            <Button
              variant="primary"
              onClick={this.handleSubmit}
              disabled={!warningThreeWords}
            >
              Inject
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
}

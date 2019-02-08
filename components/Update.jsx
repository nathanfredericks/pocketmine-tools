/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import * as PHAR from 'phar';
// import { saveAs } from 'file-saver';
import * as gtag from '../utils/gtag';

const getFileExtension = (name) => // eslint-disable-next-line implicit-arrow-linebreak
  name.slice((Math.max(0, name.lastIndexOf('.')) || Infinity) + 1);

export default class extends Component {
  state = {
    files: [],
  };

  handleChange = (event) => {
    this.setState({
      files: event.target.files,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { files } = this.state;

    gtag.event({
      action: 'update',
      category: 'Plugin',
      label: files[0].name,
    });

    const reader = new FileReader();

    const replaceNbtTags = true;
    const protocolReplace = true;
    const replaceStrictTypes = true;

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
                `"pocketmine\\nbt\\tag\\${nbtTags[nbtTag]}$1/`,
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
              /public function onCommand($2 $$$4, $6 $$$8, string $$$10, array $$$12): bool {/,
            );

            // onRun strict types
            contents = contents.replace(
              /public\s+function\s+onRun\s*\(\s*(int\s+)?\$([\w]+)\s*\)\s*(:\s*\w+\s*)?{/im,
              /public function onRun(int $$$2) {/,
            );
          }

          phar.removeFile(name);
          phar.addFile(new PHAR.File(name, contents));
        }
      });
    };

    reader.readAsArrayBuffer(files[0]);
  };

  render = () => {
    const { files } = this.state;

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
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
          <Button variant="secondary" type="submit" disabled={files.length < 1}>
            Update
          </Button>
        </Form>
      </>
    );
  };
}

/* global sa */
import React, { Component } from 'react';
import { Form, InputGroup, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import * as PHAR from 'phar';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';

export default class extends Component {
  state = {
    files: [],
    stub: '<?php __HALT_COMPILER();',
    radioValue: 'plugin',
    repoName: '',
    repoIsValid: false,
    repoUrl: ''
  };

  handleFileChange = (event) => {
    this.setState({
      files: event.target.files,
    });
  };

  handleStubChange = (event) => {
    this.setState({
      stub: event.target.value,
    });
  };

  handleRadioChange = (value) => {
    this.setState({
      radioValue: value,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { files, stub, radioValue, repoName } = this.state;

    if (radioValue === 'plugin') {
      const reader = new FileReader();

      reader.onload = async () => {
        const zip = await JSZip.loadAsync(new Uint8Array(reader.result));
        const originalName = files[0].name
          .split('.')
          .slice(0, -1)
          .join('.');

        if (zip.files[`${originalName}/`] && zip.files[`${originalName}/`].dir) {
          zip.root = zip.files[`${originalName}/`].name;
        }

        const phar = await PHAR.ZipConverter.toPhar(
          await zip.generateAsync({ type: 'uint8array' }),
        );

        phar.setStub(stub);

        saveAs(
          new Blob([phar.savePharData()], {
            type: 'application/octet-stream',
          }),
          `${files[0].name
            .split('.')
            .slice(0, -1)
            .join('.')}.phar`,
        );
      };

      reader.readAsArrayBuffer(files[0]);
    } else if (radioValue === 'github') {
      const infoResponse = await fetch(`https://api.github.com/repos/${repoName}`);
      const { name, default_branch: defaultBranch } = await infoResponse.json();
      if (infoResponse.status !== 200) {
        return alert('Repository not found')
      }

      const pluginZipResponse = await fetch(`https://github-archive-proxy.nathfreder.workers.dev/?repoName=${repoName}&branch=${defaultBranch}`);
      if (pluginZipResponse.status !== 200) {
        return alert("Couldn't download repository")
      }
      const pluginZip = await pluginZipResponse.arrayBuffer();

      const zip = await JSZip.loadAsync(pluginZip);

      if (zip.files[`${name}/`] && zip.files[`${name}/`].dir) {
        zip.root = zip.files[`${name}/`].name;
      }

      const phar = await PHAR.ZipConverter.toPhar(
        await zip.generateAsync({ type: 'uint8array' }),
      );

      phar.setStub(stub);

      saveAs(
        new Blob([phar.savePharData()], {
          type: 'application/octet-stream',
        }),
        `${name}.phar`,
      );
    }
  };

  handleGitHubUrlChange = (event) => {
    const gitHubUrl = event.target.value;
    const regex = /^https:\/\/(?:www\.)?github\.com\/(?<name>[[a-zA-Z0-9-]+\/[a-zA-Z0-9-_]+)$/;
    const match = regex.exec(gitHubUrl);

    if (match && match.groups.name) {
      this.setState({
        repoUrl: event.target.value,
        repoName: match.groups.name,
        repoIsValid: true,
      });
    } else {
      this.setState({
        repoIsValid: false,
        repoUrl: event.target.value
      });
    }
  }

  shouldBeDisabled = () => {
    const { files, radioValue, repoIsValid } = this.state;
    if (radioValue === 'plugin') {
      return files.length < 1;
    } if (radioValue === 'github') {
      return !repoIsValid;
    }
  }

  render = () => {
    const { files, radioValue } = this.state;
    const { isIndex } = this.props;

    return (
      <Layout title={isIndex ? null : 'Create .phar'}>
        <ToggleButtonGroup className="mb-3" type="radio" value={radioValue} onChange={this.handleRadioChange} name="plugin-input-group">
          <ToggleButton value="plugin">Plugin</ToggleButton>
          <ToggleButton value="github">GitHub URL</ToggleButton>
        </ToggleButtonGroup>
        <Form onSubmit={this.handleSubmit}>
          {radioValue === 'plugin' ? (
            <>
              <Form.Label>Plugin</Form.Label>
              <InputGroup className="mb-3">
                <div className="custom-file">
                  <Form.Control
                    type="file"
                    className="custom-file-input"
                    accept=".zip"
                    onChange={this.handleFileChange}
                  />
                  <Form.Label className="custom-file-label" style={{ color: files[0] ? null : '#747c84' }}>
                    {files[0] ? files[0].name : 'No zip selected'}
                  </Form.Label>
                </div>
              </InputGroup>
            </>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>GitHub URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://github.com/pmmp/DevTools"
                  onChange={this.handleGitHubUrlChange}
                  value={this.state.repoUrl}
                />
                <Form.Text className="text-muted">
                  Paste a GitHub URL.
                </Form.Text>
              </Form.Group>
            </>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Stub</Form.Label>
            <Form.Control
              type="text"
              defaultValue="<?php __HALT_COMPILER();"
              onChange={this.handleStubChange}
            />
            <Form.Text className="text-muted">
              Don&#39;t change this unless you know what you&#39;re doing.
            </Form.Text>
          </Form.Group>
          <Button variant="secondary" type="submit" disabled={this.shouldBeDisabled()}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  };
}

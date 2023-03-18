// @ts-nocheck
import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Button, Form } from 'react-bootstrap';
const SELECTION_SIGN = '§';
const colourCodes = {
  0: {
    colour: '#000000',
    css: 'color:#000000;',
    textIsBlack: false,
  },
  1: {
    colour: '#0000AA',
    css: 'color:#0000AA;',
    textIsBlack: false,
  },
  2: {
    colour: '#00AA00',
    css: 'color:#00AA00;',
    textIsBlack: false,
  },
  3: {
    colour: '#00AAAA',
    css: 'color:#00AAAA;',
    textIsBlack: false,
  },
  4: {
    colour: '#AA0000',
    css: 'color:#AA0000;',
    textIsBlack: false,
  },
  5: {
    colour: '#AA00AA',
    css: 'color:#AA00AA;',
    textIsBlack: false,
  },
  6: {
    colour: '#FFAA00',
    css: 'color:#FFAA00;',
    textIsBlack: false,
  },
  7: {
    colour: '#AAAAAA',
    css: 'color:#AAAAAA;',
    textIsBlack: false,
  },
  8: {
    colour: '#555555',
    css: 'color:#555555;',
    textIsBlack: false,
  },
  9: {
    colour: '#5555FF',
    css: 'color:#5555FF;',
    textIsBlack: false,
  },
  a: {
    colour: '#55FF55',
    css: 'color:#55FF55;',
    textIsBlack: true,
  },
  b: {
    colour: '#55FFFF',
    css: 'color:#55FFFF;',
    textIsBlack: true,
  },
  c: {
    colour: '#FF5555',
    css: 'color:#FF5555;',
    textIsBlack: true,
  },
  d: {
    colour: '#FF55FF',
    css: 'color:#FF55FF;',
    textIsBlack: true,
  },
  e: {
    colour: '#FFFF55',
    css: 'color:#FFFF55;',
    textIsBlack: true,
  },
  f: {
    colour: '#FFFFFF',
    css: 'color:#FFFFFF;',
    textIsBlack: true,
  },
  g: {
    colour: '#DAD707',
    css: 'color:#DAD707;',
    textIsBlack: true,
  },
};
const formattingCodes = {
  l: {
    buttonName: 'Bold',
    buttonStyle: { fontWeight: 'bold' },
    css: 'font-weight:bold;',
  },
  m: {
    buttonName: 'Strikethrough',
    buttonStyle: { textDecoration: 'line-through' },
    css: 'text-decoration:line-through;',
  },
  n: {
    buttonName: 'Underline',
    buttonStyle: { textDecoration: 'underline' },
    css: 'text-decoration:underline;',
  },
  o: {
    buttonName: 'Italic',
    buttonStyle: { fontStyle: 'italic' },
    css: 'font-style:italic;',
  },
};
type MOTDGeneratorState = {
  motd: string;
  preview: string;
  colourButtons: any;
  formattingButtons: any;
  kError: boolean;
  htmlMotd: string;
};
export default class MOTDGenerator extends Component {
  state: MOTDGeneratorState = {
    motd: '',
    preview: '',
    colourButtons: null,
    formattingButtons: null,
    kError: false,
    htmlMotd: '',
    charsInMotd: 0,
  };
  textareaRef = React.createRef();
  componentDidMount = () => {
    const colourButtons = Object.entries(colourCodes).map(([key, val]) => (
      <Button
        key={key}
        className="colour-btn"
        style={{
          backgroundColor: val.colour,
          borderColor: val.colour,
          color: val.textIsBlack ? '#000000' : '#FFFFFF',
        }}
        onClick={() => this.insertCode(key)}
      >
        {`${SELECTION_SIGN}${key}`}
      </Button>
    ));
    const formattingButtons = Object.entries(formattingCodes).map(
      ([key, val]) => {
        return (
          <Button
            key={key}
            className="format-btn"
            style={{ ...val.buttonStyle }}
            onClick={() => this.insertCode(key)}
            variant="primary"
          >
            {val.buttonName}
          </Button>
        );
      },
    );
    this.setState({
      colourButtons,
      formattingButtons,
    });
  };
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMotd = event.currentTarget.value;
    if (newMotd.includes(`${SELECTION_SIGN}k`)) {
      this.setState({
        kError: true,
      });
    } else {
      this.setState({
        kError: false,
      });
    }
    this.setState({
      motd: newMotd,
    });
    this.renderMotd(newMotd);
  };
  renderMotd = (motd: string) => {
    let htmlMotd = '';
    let chars = 0;
    const regex = /§([0-9a-gl-or])([^§]*)/g;
    const matches = [...motd.matchAll(regex)];
    if (motd.charAt(0) !== '§') {
      htmlMotd += `<span>${motd.split('§')[0]}</span>`;
      chars += motd.split('§')[0].length;
    }
    let currentColour = null;
    let currentFormatting: string[] = [];
    for (const match of matches) {
      // If match is a colour
      const colour = colourCodes[match[1]];
      if (colour) {
        htmlMotd += `<span style="${colour.css}${currentFormatting.join('')}">${
          match[2]
        }</span>`;
        currentColour = colour.css;
      }
      // If match is a format
      const format = formattingCodes[match[1]];
      if (format) {
        if (match[1] === 'm') {
          currentFormatting = currentFormatting.filter(
            (e) => e !== 'text-decoration:underline;',
          );
        }
        if (match[1] === 'n') {
          currentFormatting = currentFormatting.filter(
            (e) => e !== 'text-decoration:line-through;',
          );
        }
        if (currentColour) {
          htmlMotd += `<span style="${currentColour}${currentFormatting.join(
            '',
          )}${format.css}">${match[2]}</span>`;
          currentFormatting.push(format.css);
        } else {
          htmlMotd += `<span style="${currentFormatting.join('')}${
            format.css
          }">${match[2]}</span>`;
          currentFormatting.push(format.css);
        }
      }
      if (match[1] === 'r') {
        currentFormatting = [];
        currentColour = null;
        htmlMotd += `<span>${match[2]}</span>`;
      }
      chars += match[2].length;
    }
    this.setState({
      htmlMotd,
      charsInMotd: chars,
    });
  };
  insertCode = (code) => {
    let oldMotd = this.state.motd;
    const insertAt = (str, sub, pos) =>
      `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
    const node = this.textareaRef.current;
    if (oldMotd === null) {
      oldMotd = `${SELECTION_SIGN}${code}`;
    } else {
      if (node) {
        const position = node.selectionStart;
        oldMotd = insertAt(oldMotd, `${SELECTION_SIGN}${code}`, position);
        node.focus();
      } else {
        oldMotd += `${SELECTION_SIGN}${code}`;
      }
    }
    this.setState({
      motd: oldMotd,
    });
  };
  render = () => (
    <Layout title="MOTD Generator" showNav={true}>
      {this.state.colourButtons}
      <br />
      {this.state.formattingButtons}
      <Button
        className="format-btn"
        onClick={() => this.insertCode('r')}
        variant="primary"
      >
        Reset
      </Button>
      <Form.Group className="mt-3">
        <Form.Control
          as="textarea"
          ref={this.textareaRef}
          autoFocus
          style={{ marginTop: 8, resize: 'none' }}
          placeholder={`${SELECTION_SIGN}cMy awesome MOTD`}
          value={this.state.motd}
          className="motd-textarea mt-3"
          onChange={this.handleChange}
          isInvalid={this.state.kError}
        />
        <Form.Control.Feedback type="invalid">
          The {`${SELECTION_SIGN}k`} format code is not supported.
        </Form.Control.Feedback>
      </Form.Group>
      {!this.state.kError && this.state.charsInMotd ? (
        <div
          className="preview mt-3"
          dangerouslySetInnerHTML={{ __html: this.state.htmlMotd }}
        />
      ) : null}
    </Layout>
  );
}

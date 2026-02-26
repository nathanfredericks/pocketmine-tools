"use client";
import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import DOMPurify from "dompurify";
import Layout from "../../components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SELECTION_SIGN = "\u00A7";
const colourCodes: Record<string, { colour: string; css: string; textIsBlack: boolean }> = {
  0: { colour: "#000000", css: "color:#000000;", textIsBlack: false },
  1: { colour: "#0000AA", css: "color:#0000AA;", textIsBlack: false },
  2: { colour: "#00AA00", css: "color:#00AA00;", textIsBlack: false },
  3: { colour: "#00AAAA", css: "color:#00AAAA;", textIsBlack: false },
  4: { colour: "#AA0000", css: "color:#AA0000;", textIsBlack: false },
  5: { colour: "#AA00AA", css: "color:#AA00AA;", textIsBlack: false },
  6: { colour: "#FFAA00", css: "color:#FFAA00;", textIsBlack: false },
  7: { colour: "#AAAAAA", css: "color:#AAAAAA;", textIsBlack: false },
  8: { colour: "#555555", css: "color:#555555;", textIsBlack: false },
  9: { colour: "#5555FF", css: "color:#5555FF;", textIsBlack: false },
  a: { colour: "#55FF55", css: "color:#55FF55;", textIsBlack: true },
  b: { colour: "#55FFFF", css: "color:#55FFFF;", textIsBlack: true },
  c: { colour: "#FF5555", css: "color:#FF5555;", textIsBlack: true },
  d: { colour: "#FF55FF", css: "color:#FF55FF;", textIsBlack: true },
  e: { colour: "#FFFF55", css: "color:#FFFF55;", textIsBlack: true },
  f: { colour: "#FFFFFF", css: "color:#FFFFFF;", textIsBlack: true },
  g: { colour: "#DAD707", css: "color:#DAD707;", textIsBlack: true },
};
const formattingCodes: Record<string, { buttonName: string; buttonStyle: React.CSSProperties; css: string }> = {
  l: { buttonName: "Bold", buttonStyle: { fontWeight: "bold" }, css: "font-weight:bold;" },
  m: { buttonName: "Strikethrough", buttonStyle: { textDecoration: "line-through" }, css: "text-decoration:line-through;" },
  n: { buttonName: "Underline", buttonStyle: { textDecoration: "underline" }, css: "text-decoration:underline;" },
  o: { buttonName: "Italic", buttonStyle: { fontStyle: "italic" }, css: "font-style:italic;" },
};

function renderMotd(motd: string): { htmlMotd: string; charsInMotd: number } {
  let htmlMotd = "";
  let chars = 0;
  const regex = /\u00A7([0-9a-gl-or])([^\u00A7]*)/g;
  const matches = [...motd.matchAll(regex)];

  if (motd.charAt(0) !== "\u00A7") {
    htmlMotd += `<span>${motd.split("\u00A7")[0]}</span>`;
    chars += motd.split("\u00A7")[0].length;
  }
  let currentColour: string | null = null;
  let currentFormatting: string[] = [];

  for (const match of matches) {
    const colour = colourCodes[match[1]];

    if (colour) {
      htmlMotd += `<span style="${colour.css}${currentFormatting.join("")}">${match[2]}</span>`;
      currentColour = colour.css;
    }
    const format = formattingCodes[match[1]];

    if (format) {
      if (match[1] === "m") {
        currentFormatting = currentFormatting.filter(
          (e) => e !== "text-decoration:underline;"
        );
      }
      if (match[1] === "n") {
        currentFormatting = currentFormatting.filter(
          (e) => e !== "text-decoration:line-through;"
        );
      }
      if (currentColour) {
        htmlMotd += `<span style="${currentColour}${currentFormatting.join("")}${format.css}">${match[2]}</span>`;
        currentFormatting.push(format.css);
      } else {
        htmlMotd += `<span style="${currentFormatting.join("")}${format.css}">${match[2]}</span>`;
        currentFormatting.push(format.css);
      }
    }
    if (match[1] === "r") {
      currentFormatting = [];
      currentColour = null;
      htmlMotd += `<span>${match[2]}</span>`;
    }
    chars += match[2].length;
  }

  return {
    htmlMotd: DOMPurify.sanitize(htmlMotd, { ALLOWED_TAGS: ["span"], ALLOWED_ATTR: ["style"] }),
    charsInMotd: chars,
  };
}
function MOTDGeneratorInner() {
  const searchParams = useSearchParams();
  const motdParam = searchParams.get("motd");
  const initialMotd = motdParam ?? "";
  const initialRendered = initialMotd ? renderMotd(initialMotd) : { htmlMotd: "", charsInMotd: 0 };
  const [motd, setMotd] = useState(initialMotd);
  const [htmlMotd, setHtmlMotd] = useState(initialRendered.htmlMotd);
  const [charsInMotd, setCharsInMotd] = useState(initialRendered.charsInMotd);
  const [kError, setKError] = useState(initialMotd.includes(`${SELECTION_SIGN}k`));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMotd = event.currentTarget.value;

    setKError(newMotd.includes(`${SELECTION_SIGN}k`));
    setMotd(newMotd);
    const { htmlMotd: html, charsInMotd: count } = renderMotd(newMotd);

    setHtmlMotd(html);
    setCharsInMotd(count);
  };
  const insertCode = (code: string) => {
    let oldMotd = motd;
    const insertAt = (str: string, sub: string, pos: number) =>
      `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
    const node = textareaRef.current;

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
    setMotd(oldMotd);
    const { htmlMotd: html, charsInMotd: count } = renderMotd(oldMotd);

    setHtmlMotd(html);
    setCharsInMotd(count);
  };
  const colourButtons = Object.entries(colourCodes).map(([key, val]) => (
    <Button
      key={key}
      className="mx-0.5"
      style={{
        backgroundColor: val.colour,
        borderColor: val.colour,
        color: val.textIsBlack ? "#000000" : "#FFFFFF",
      }}
      onClick={() => insertCode(key)}
    >
      {`${SELECTION_SIGN}${key}`}
    </Button>
  ));
  const formattingButtons = Object.entries(formattingCodes).map(([key, val]) => (
    <Button
      key={key}
      className="ml-0.5"
      style={{ ...val.buttonStyle }}
      onClick={() => insertCode(key)}
    >
      {val.buttonName}
    </Button>
  ));

  return (
    <Layout title="Generate MOTD" showNav={true}>
      <div className="space-y-2">
        <div className="flex flex-wrap">
          {colourButtons}
        </div>
        <div className="flex flex-wrap">
          {formattingButtons}
          <Button
            className="ml-0.5"
            onClick={() => insertCode("r")}
          >
            Reset
          </Button>
        </div>
      </div>
      <div>
        <Textarea
          ref={textareaRef}
          autoFocus
          style={{ resize: "none" }}
          placeholder={`${SELECTION_SIGN}cMy awesome MOTD`}
          value={motd}
          className={`motd-textarea${kError ? " border-destructive" : ""}`}
          onChange={handleChange}
        />
        {kError && (
          <p className="text-sm text-destructive">
            The {`${SELECTION_SIGN}k`} format code is not supported.
          </p>
        )}
      </div>
      {!kError && charsInMotd ? (
        <div
          className="preview mt-3"
          dangerouslySetInnerHTML={{ __html: htmlMotd }}
        />
      ) : null}
    </Layout>
  );
}
export default function MOTDGenerator() {
  return (
    <Suspense>
      <MOTDGeneratorInner />
    </Suspense>
  );
}

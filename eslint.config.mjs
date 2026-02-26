import { createRequire } from "module";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const require = createRequire(import.meta.url);
const coreWebVitals = require("eslint-config-next/core-web-vitals");

const eslintConfig = [
  ...coreWebVitals,
  {
    plugins: {
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "quotes": ["error", "double"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "import/newline-after-import": ["error", { count: 1 }],
      "padding-line-between-statements": ["error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
      "@stylistic/padding-line-between-statements": ["error",
        { blankLine: "always", prev: "type", next: "*" },
        { blankLine: "always", prev: "interface", next: "*" },
      ],
    },
  },
];

export default eslintConfig;

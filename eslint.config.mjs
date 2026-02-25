import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const coreWebVitals = require('eslint-config-next/core-web-vitals');
const eslintConfig = [
  ...coreWebVitals,
  {
    rules: {
      'quotes': ['error', 'single'],
      'no-multiple-empty-lines': ['error', { max: 0 }],
    },
  },
];
export default eslintConfig;

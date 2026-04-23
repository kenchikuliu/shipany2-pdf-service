import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: ['.next/**', '.open-next/**', 'coverage/**', 'node_modules/**'],
  },
  ...nextVitals,
];

export default config;

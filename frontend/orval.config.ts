import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'https://api.chungs.store/api-docs',
    output: {
      target: './src/api/generated.ts',
      schemas: './src/api/models',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: 'https://api.chungs.store',
    },
  },
});
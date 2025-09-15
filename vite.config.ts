import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins:
          process.env.NODE_ENV === 'development'
            ? [
                [
                  '@locator/babel-jsx/dist',
                  {
                    env: 'development',
                  },
                ],
              ]
            : [],
      },
    }),
  ],
});

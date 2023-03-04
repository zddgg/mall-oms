import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: false,
      fs: {
        strict: true,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
        '/file': {
          target: 'http://localhost:8081/',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/file/, ''),
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);

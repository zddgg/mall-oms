import { mergeConfig } from 'vite';
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
        '/oms': {
          target: 'http://localhost:8082/',
          changeOrigin: true,
        },
      },
    },
  },
  baseConfig
);

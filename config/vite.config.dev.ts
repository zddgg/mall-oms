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
          target: 'http://localhost:7001/',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '/api/product/'),
        },
        '/file': {
          target: 'http://localhost:7001/',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/file/, '/api/file/'),
        },
        '/oms': {
          target: 'http://localhost:7001/',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/oms/, '/api/oms/'),
        },
      },
    },
  },
  baseConfig
);

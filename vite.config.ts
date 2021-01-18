import {UserConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import mock from './mock'

export default {
  plugins: [
    vue(),
    mock(),
  ],
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
} as UserConfig

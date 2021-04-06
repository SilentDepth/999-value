import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'

import mock from './mock'

export default defineConfig({
  plugins: [
    vue(),
    windicss(),
    mock(),
  ],
})

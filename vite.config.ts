import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'

import unocssConfig from './unocss.config'
import mock from './mock'

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    unocss(unocssConfig),
    mock(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
})

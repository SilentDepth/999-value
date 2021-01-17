import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  root: './src',
  build: {
    outDir: '../dist',
  },
  server: {
    proxy: {
      '/data': {
        target: 'https://currency.world/exchange_rates/all/CNY',
        changeOrigin: true,
        rewrite: path => '',
      },
    },
  },
}

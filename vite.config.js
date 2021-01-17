import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  root: './src',
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

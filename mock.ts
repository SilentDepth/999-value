import { Plugin } from 'vite'
import fs from 'fs-extra'
import path from 'path'
import { $fetch } from 'ohmyfetch'

const MOCK_FILE = path.join(__dirname, '.mock/CNY.html')

export default function mock (): Plugin {
  return {
    name: 'api-mock',
    configureServer (server) {
      server.middlewares.use('/data', async (req, res) => {
        if (!fs.existsSync(MOCK_FILE)) {
          const data = await $fetch('https://currency.world/exchange_rates/all/CNY', {
            headers: { 'Accept-Language': 'zh-CN' },
          }).then(res => res.text())
          fs.ensureDirSync(path.resolve(MOCK_FILE, '..'))
          fs.writeFileSync(MOCK_FILE, data, 'utf-8')
        }
        res.end(fs.readFileSync(MOCK_FILE, 'utf-8'), 'utf-8')
      })
    },
  }
}

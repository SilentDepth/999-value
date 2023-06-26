import * as cheerio from 'cheerio'

export type CurrencyInfo = {
  code: string
  name: string
  result: number
}

const MAX_AGE = 3600000
let lastCheck = 0
let currencies: CurrencyInfo[]

export default defineEventHandler(async () => {
  if (Date.now() - lastCheck > MAX_AGE) {
    const html = await $fetch<string>('https://currency.world/exchange_rates/all/CNY', {
      headers: { 'Accept-Language': 'zh-CN' },
    })

    const q = cheerio.load(html)
    const data = q('.ratestable > .item').toArray()
      .map(el => ({
        code: q('.code', el).text(),
        name: q('.curname', el).text(),
        result: Number(q('.rate', el).text()) * 999,
      }))
      .filter(it => it.result <= 1000)
      .sort((a, b) => a.result - b.result)
    currencies = data.slice(Math.min(data.findIndex(it => it.code === 'JPY'), data.findIndex(it => it.result >= 50)))

    lastCheck = Date.now()
  }

  return currencies
})

const MAX_AGE = 3600000
let lastCheck = 0
let data = ''

export default defineEventHandler(async () => {
  if (Date.now() - lastCheck > MAX_AGE) {
    data = await $fetch('https://currency.world/exchange_rates/all/CNY', {
      headers: { 'Accept-Language': 'zh-CN' },
    })
    lastCheck = Date.now()
  }
  return data
})

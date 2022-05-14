<script lang="ts" setup>
import type { CurrencyInfo } from './server/api/currencies'
import type { Config } from './server/api/config'

const [{ data: _currencies }, { data: _config }] = await Promise.all([
  useAsyncData<CurrencyInfo[]>('currencies', () => $fetch('/api/currencies'), {
    server: false,
    default: () => [],
  }),
  useAsyncData<Partial<Config>>('config', () => $fetch('/api/config'), {
    server: false,
    default: () => ({}),
  }),
])
const currencies = $(_currencies)
const config = $(_config)

let rows = $ref<HTMLElement[]>([])
let pointer = $ref<HTMLElement>()
let currentCurrency = $ref<HTMLElement>()
let pointerTop = $ref(0)
let spinner = $ref(true)

function iterateRow (el: HTMLElement, code: string, result: number) {
  rows.push(el)
  if (code === config.currency) {
    currentCurrency = el
  }
}

function movePointer () {
  const end = currencies.findIndex(it => config.value < it.result)
  const start = end - 1
  const startValue = currencies[start].result
  const endValue = currencies[end].result
  const p = (config.value - startValue) / (endValue - startValue)
  const startBottom = rows[start].offsetTop + rows[start].offsetHeight
  const endTop = rows[end].offsetTop
  pointerTop = startBottom + p * (endTop - startBottom) - 3 // pointer itself is 6px height, so pull back 3px as half of it
}

function scrollToCurrent () {
  const scrollTop = document.documentElement.scrollTop
  const { top: cTop, height: cHeight } = currentCurrency!.getBoundingClientRect()
  const currencyTop = scrollTop + cTop
  const { top: pTop, height: pHeight } = pointer!.getBoundingClientRect()
  const pointerTop = scrollTop + pTop
  const top = Math.min(currencyTop, pointerTop)
  const bottom = Math.max(currencyTop + cHeight, pointerTop + pHeight)
  document.documentElement.scrollTo({
    top: (top + bottom) / 2 - window.innerHeight / 2,
    behavior: 'smooth',
  })
}

watch($$(currencies), async arr => {
  if (arr.length) {
    spinner = false
    await nextTick()
    movePointer()
    await nextTick()
    scrollToCurrent()
  }
})
</script>

<template lang="pug">
div#app(class="min-h-screen py-10 text-black dark:text-neutral-300 bg-white dark:bg-black relative transition duration-500 ease-in-out")
  div(class="relative mx-auto px-4 pt-3 sm:pt-0 space-y-4 font-sans" style="max-width: 400px;")
    div(
      v-for="{ code, name, result } of currencies"
      :ref="el => iterateRow(el, code, result)"
      class="flex justify-between items-start"
    )
      div(:class="{ 'px-3 -mx-3 py-2 pt-1 -my-2 text-white bg-red-600 rounded': code === config.currency }")
        p(class="text-2xl tabular-nums")
          | 999&nbsp;
          span(class="font-bold") {{ code }}
        p(:class="['text-sm', { 'text-neutral-500 dark:text-neutral-400': code !== config.currency }]") {{ name }}
      div(class="leading-8 tabular-nums text-neutral-600 dark:text-neutral-400") {{ result.toFixed(2) }} CNY
    div(
      ref="pointer"
      v-show="pointerTop"
      class="absolute right-1 h-1.5 w-24 bg-red-600 rounded-l-full shadow flex justify-end items-center"
      :style="{ marginTop: 0, top: pointerTop + 'px' }"
    )
      span(class="px-1 text-white bg-red-600 rounded shadow") {{ config.value }}

ThemeSwitch

transition(
  enter-from-class="opacity-0"
  leave-to-class  ="opacity-0"
  enter-active-class="transition duration-500 ease-in-out"
  leave-active-class="transition duration-500 ease-in-out"
  appear
)
  div(v-show="spinner" class="fixed inset-0 m-auto w-12 h-12 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-50 rounded-md flex justify-center items-center")
    svg(viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white dark:text-black animate-spin")
      path(d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z")
</template>

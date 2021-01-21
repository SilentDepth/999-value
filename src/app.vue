<template lang="pug">
div(class="relative mx-auto px-4 pt-3 sm:pt-0 space-y-4" style="max-width: 400px;")
  div(
    v-for="{code, name, result} of currencies"
    :ref="el => iterateRow(el, code, result)"
    class="flex justify-between items-start"
  )
    div(:class="{'px-3 -mx-3 py-2 pt-1 -my-2 text-white bg-red-600 rounded': code === CURRENCY}")
      p(class="text-2xl tabular-nums")
        | 999&nbsp;
        span(class="font-bold") {{ code }}
      p(:class="['text-sm', {'text-trueGray-500 dark:text-trueGray-400': code !== CURRENCY}]") {{ name }}
    div(class="leading-8 tabular-nums text-trueGray-600 dark:text-trueGray-400") {{ result.toFixed(2) }} CNY
  div(
    ref="pointer"
    v-show="pointerTop"
    class="absolute right-1 h-1.5 w-24 bg-red-600 rounded-l-full shadow flex justify-end items-center"
    :style="{marginTop: 0, top: pointerTop + 'px'}"
  )
    span(class="px-1 text-white bg-red-600 rounded shadow") {{ AMOUNT }}

theme-switch

transition(
  enter-from-class="opacity-0"
  leave-to-class  ="opacity-0"
  enter-active-class="transition duration-500 ease-in-out"
  leave-active-class="transition duration-500 ease-in-out"
  appear
)
  div(v-show="spinner" class="fixed inset-0 m-auto w-12 h-12 bg-black bg-opacity-50 rounded-md flex justify-center items-center")
    svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 text-white animate-spin"): path(d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z")
</template>

<script lang="ts">
import {defineComponent, nextTick, reactive, toRefs} from 'vue'

import ThemeSwitch from './components/theme-switch.vue'

const CURRENCY = import.meta.env.VITE_CURRENCY
const AMOUNT = Number(import.meta.env.VITE_AMOUNT)

export default defineComponent({
  components: {
    ThemeSwitch,
  },

  setup () {
    const refs = reactive({
      rows: [] as HTMLElement[],
      pointer: undefined as undefined | HTMLElement,
      currentCurrency: undefined as undefined | HTMLElement,
    })
    const state = reactive({
      currencies: [] as Array<{code: string, name: string, result: number}>,
      pointerTop: 0,
      spinner: true,
    })

    fetch('/data').then(res => res.text())
      .then(html => {
        const doc = document.implementation.createHTMLDocument()
        doc.body.innerHTML = html
        const items = doc.querySelectorAll('.ratestable > .item')
        let currencies =
          Array.from(items)
            .map(el => ({
              code: el.querySelector('.code')!.textContent!,
              name: el.querySelector('.curname')!.textContent!,
              result: 999 * Number(el.querySelector('.rate')!.textContent!),
            }))
            .filter(it => it.result <= 1000)
            .sort((a, b) => a.result - b.result)
        state.currencies = currencies.slice(Math.min(currencies.findIndex(it => it.code === 'JPY'), currencies.findIndex(it => it.result >= 50)))
      })
      .then(async () => {
        state.spinner = false
        await nextTick()
        movePointer()
        await nextTick()
        scrollToCurrent()
      })

    function iterateRow (el: HTMLElement, code: string, result: number) {
      refs.rows.push(el)
      if (code === CURRENCY) {
        refs.currentCurrency = el
      }
    }

    function movePointer () {
      const end = state.currencies.findIndex(it => AMOUNT < it.result)
      const start = end - 1
      const startValue = state.currencies[start].result
      const endValue = state.currencies[end].result
      const p = (AMOUNT - startValue) / (endValue - startValue)
      const startBottom = refs.rows[start].offsetTop + refs.rows[start].offsetHeight
      const endTop = refs.rows[end].offsetTop
      state.pointerTop = startBottom + p * (endTop - startBottom) - 3 // pointer itself is 6px height, so pull back 3px as half of it
    }

    function scrollToCurrent () {
      const scrollTop = document.documentElement.scrollTop
      const {top: cTop, height: cHeight} = refs.currentCurrency!.getBoundingClientRect()
      const currencyTop = scrollTop + cTop
      const {top: pTop, height: pHeight} = refs.pointer!.getBoundingClientRect()
      const pointerTop = scrollTop + pTop
      const top = Math.min(currencyTop, pointerTop)
      const bottom = Math.max(currencyTop + cHeight, pointerTop + pHeight)
      document.documentElement.scrollTo({
        top: (top + bottom) / 2 - window.innerHeight / 2,
        behavior: 'smooth',
      })
    }

    return {
      ...toRefs(refs),
      ...toRefs(state),
      iterateRow,
      CURRENCY,
      AMOUNT,
    }
  },
})
</script>

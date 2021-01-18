<template lang="pug">
div(class="relative mx-auto my-10 space-y-4" style="width: 400px;")
  div(:ref="el => rows.push(el)" v-for="{code, rate, name} of currencies" class="flex justify-between items-start")
    div(:class="{'px-3 -mx-3 py-2 pt-1 -my-2 text-white bg-red-600 rounded': code === CURRENCY}")
      p(class="text-2xl tabular-nums")
        | 999&nbsp;
        span(class="font-bold") {{ code }}
      p(:class="['text-sm', {'text-trueGray-500': code !== CURRENCY}]") {{ name }}
    div(class="leading-8 tabular-nums text-trueGray-600") {{ (999 * rate).toFixed(2) }} CNY
  div(v-show="pointerTop" class="absolute right-0 -mr-3 h-1.5 w-16 bg-red-600 rounded-l-full shadow flex items-center" :style="{marginTop: 0, top: pointerTop + 'px'}")
    span(class="absolute left-full top-1/2 transform -translate-y-1/2 px-1 text-white bg-red-600 rounded") {{ AMOUNT }}

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

const CURRENCY = import.meta.env.VITE_CURRENCY
const AMOUNT = Number(import.meta.env.VITE_AMOUNT)

export default defineComponent({
  setup () {
    const refs = reactive({
      rows: [],
    })
    const state = reactive({
      currencies: [] as Array<{code: string, rate: number, name: string}>,
      pointerTop: 0,
      spinner: true,
    })

    fetch('/data').then(res => res.text())
      .then(html => {
        const doc = document.implementation.createHTMLDocument()
        doc.body.innerHTML = html
        const items = doc.querySelectorAll('.ratestable > .item')
        state.currencies =
          Array.from(items)
            .map(el => ({
              code: el.querySelector('.code')!.textContent!,
              rate: Number(el.querySelector('.rate')!.textContent!),
              name: el.querySelector('.curname')!.textContent!,
            }))
            .filter(it => it.rate <= 1)
            .sort((a, b) => a.rate - b.rate)
      })
      .then(async () => {
        state.spinner = false
        await nextTick()
        movePointer()
      })

    function movePointer () {
      const end = state.currencies.findIndex(it => AMOUNT < 999 * it.rate)
      const start = end - 1
      const startValue = state.currencies[start].rate * 999
      const endValue = state.currencies[end].rate * 999
      const p = (AMOUNT - startValue) / (endValue - startValue)
      const startBottom = refs.rows[start].offsetTop + refs.rows[start].offsetHeight
      const endTop = refs.rows[end].offsetTop
      state.pointerTop = startBottom + p * (endTop - startBottom) - 3 // pointer itself is 6px height, so pull back 3px as half of it
    }

    return {
      ...toRefs(refs),
      ...toRefs(state),
      CURRENCY,
      AMOUNT,
    }
  },
})
</script>

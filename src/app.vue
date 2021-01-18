<template lang="pug">
div(class="mx-auto my-10 space-y-4" style="width: 400px;")
  div(v-for="{code, rate, name} of currencies" class="flex justify-between")
    div(:class="{'px-3 -mx-3 py-2 pt-1 -my-2 text-white bg-red-600 rounded': code === CURRENCY}")
      p(class="text-2xl tabular-nums")
        | 999&nbsp;
        span(class="font-bold") {{ code }}
      p(:class="['text-sm', {'text-trueGray-500': code !== CURRENCY}]") {{ name }}
    div(class="leading-8 tabular-nums text-trueGray-600") {{ (999 * rate).toFixed(2) }} CNY
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'

export default defineComponent({
  setup () {
    const state = reactive({
      currencies: [] as Array<{code: string, rate: number, name: string}>,
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

    return {
      CURRENCY: import.meta.env.VITE_CURRENCY,
      AMOUNT: Number(import.meta.env.VITE_AMOUNT),
      ...toRefs(state),
    }
  },
})
</script>

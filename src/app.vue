<template lang="pug">
div(class="mx-auto my-10 space-y-4" style="width: 400px;")
  div(v-for="{code, rate, name} of currencies" class="flex justify-between")
    div
      p(class="text-2xl")
        | 999&nbsp;
        span(class="font-bold") {{ code }}
      p(class="text-sm text-trueGray-500") {{ name }}
    div(class="leading-8 text-trueGray-600") {{ (999 * rate).toFixed(2) }} CNY
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'

export default defineComponent({
  components: {
    HelloWorld,
  },

  setup () {
    const state = reactive({
      currencies: [] as {code: string, rate: number, name: string}[],
    })

    fetch('/data').then(res => res.text())
      .then(html => {
        const doc = document.implementation.createHTMLDocument()
        doc.body.innerHTML = html
        const items = doc.querySelectorAll('.ratestable > .item')
        state.currencies =
          Array.from(items)
            .map(el => ({
              code: el.querySelector('.code').textContent,
              rate: Number(el.querySelector('.rate').textContent),
              name: el.querySelector('.curname').textContent,
            }))
            .filter(it => it.rate <= 1)
            .sort((a, b) => a.rate - b.rate)
      })

    return {
      ...toRefs(state),
    }
  },
})
</script>

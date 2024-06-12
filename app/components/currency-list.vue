<script lang="ts" setup>
const props = defineProps({
	currentCode: String,
	currentValue: Number,
})

const { data } = useAsyncData('currencies', () => $fetch('/api/currencies'))

const currencyEls = ref<HTMLElement[]>()
function scrollIntoView(idx: number) {
	currencyEls.value?.[idx]?.scrollIntoView({
		behavior: 'smooth',
		block: 'center',
	})
	return true
}

const currencyValueEls = ref<HTMLElement[]>()
const pointerPos = computed(() => {
	const { currentValue } = props
	if (!currentValue || !data.value || !currencyValueEls.value) return

	const idx = data.value.findIndex((it) => it.result > currentValue)
	if (idx == null) return

	const startEl = currencyValueEls.value[idx - 1]
	const endEl = currencyValueEls.value[idx]
	if (!startEl || !endEl) return

	const startValue = data.value[idx - 1]?.result
	const endValue = data.value[idx]?.result
	if (!startValue || !endValue) return

	const startPos = startEl.offsetTop + startEl.offsetHeight / 2
	const endPos = endEl.offsetTop + endEl.offsetHeight / 2
	return (
		startPos +
		((currentValue - startValue) / (endValue - startValue)) * // offset percentage
			(endPos - startPos)
	)
})
</script>

<template lang="pug">
div(class="group/list relative" style="max-width: 400px")
  div(class="space-y-1")
    div(
      v-for="(it, idx) of data ?? 6"
      ref="currencyEls"
      :data-currency="typeof it === 'number' ? null : it.code"
      :data-value="typeof it === 'number' ? null : it.result"
      :data-skeleton="typeof it === 'number' ? '' : null"
      :data-active="typeof it === 'object' && it.code === currentCode ? scrollIntoView(idx) : null"
      class="group flex justify-between items-start"
      :style="{ opacity: typeof it === 'number' ? 1 / 6 * (7 - it) : undefined }"
    )
      div(
        :class=`[
          'flex flex-col px-3 -ml-3 pt-1 pb-2 rounded-md',
          'group-data-[active]:(text-white bg-red-600)',
        ]`
      )
        span(class="text-2xl tabular-nums dark:text-neutral-100 group-data-[skeleton]:(text-transparent bg-black/20 dark:bg-white/30 rounded)")
          | 999&nbsp;
          strong {{ typeof it === 'number' ? 'ABC' : it.code }}
        span(class="text-sm text-neutral-500 dark:text-neutral-400 group-data-[skeleton]:invisible group-data-[active]:text-white") &ZeroWidthSpace;{{ typeof it === 'number' ? '' : it.name }}
      div(class="mt-1")
        span(ref="currencyValueEls" class="inline-flex items-center h-8 tabular-nums")
          span(v-if="typeof it === 'number'" class="inline-block text-transparent bg-black/20 dark:bg-white/30 rounded") 999.00 CNY
          span(v-else class="text-neutral-600 dark:text-neutral-400") {{ it.result.toFixed(2) }} CNY
  //- Pointer
  div(v-if="currentValue" class="absolute right-1 flex items-center h-0" :style="{ top: pointerPos + 'px' }")
    span(class="inline-block w-10 h-1 bg-red-600 rounded-l-full")
    span(class="px-1 text-white bg-red-600 rounded-md") {{ currentValue }}
</template>

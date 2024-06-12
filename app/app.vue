<script lang="ts" setup>
import type { Config } from 'server/api/config'

const { data: config } = useAsyncData<Partial<Config>>('config', () =>
	$fetch('/api/config'),
)

function scrollIntoView() {
	document
		.querySelector('[data-active]')
		?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template lang="pug">
NuxtRouteAnnouncer
div(class="flex flex-col items-center min-h-screen dark:bg-black")
  header(class="flex-none py-4")
    h1(
      class="-my-2 text-2xl font-display text-center dark:text-white"
      @click="scrollIntoView"
    )
      span(class="text-red-600") 999
      | ’s Value
  CurrencyList(
    :current-code="config?.currency"
    :current-value="config?.value"
    class="flex-1 w-full px-4 py-1"
  )
  footer(class="flex-none py-4 text-center") 🧧
</template>

<script lang="ts" setup>
import type { CurrencyInfo } from 'server/api/currencies'
import type { Config } from 'server/api/config'

const currencies = await $fetch<CurrencyInfo[]>('/api/currencies')
const config = await $fetch<Config>('/api/config')
</script>

<template lang="pug">
div
  Currency(
    v-for="{ code, name, result } of currencies"
    :code="code"
    :name="name"
    :value="result"
    :active="code === config.currency"
  )
  div#pointer(class="absolute right-1 h-1.5 w-24 bg-red-600 rounded-l-full shadow flex justify-end items-center")
    span(class="px-1 text-white bg-red-600 rounded shadow") {{ config.value }}
</template>

<script lang="ts" setup>
defineProps({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template lang="pug">
div(
  :data-currency="code"
  :data-value="value"
  class="flex justify-between items-start"
)
  div(:class="{ 'px-3 -mx-3 py-2 pt-1 -my-2 text-white bg-red-600 rounded': active }")
    p(class="text-2xl tabular-nums")
      | 999&nbsp;
      span(class="font-bold") {{ code }}
    p(:class="['text-sm', { 'text-neutral-500 dark:text-neutral-400': !active }]") {{ name }}
  div(class="leading-8 tabular-nums text-neutral-600 dark:text-neutral-400") {{ value.toFixed(2) }} CNY
</template>

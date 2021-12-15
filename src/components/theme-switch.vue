<template lang="pug">
button(class="absolute top-0 right-0 p-4 overflow-hidden group" @click="dark = !dark")
  div(class="w-5 h-5")
  transition(
    enter-from-class="rotate-90"
    leave-to-class="-rotate-90"
    enter-active-class="transform"
    leave-active-class="transform"
  )
    svg(
      v-if="dark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="absolute inset-0 m-auto w-5 text-neutral-500 group-hover:text-yellow-300 transition duration-500 ease-in-out transform-origin"
    ): path(d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z")
    svg(
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="absolute inset-0 m-auto w-5 text-neutral-400 group-hover:text-orange-400 transition duration-500 ease-in-out transform-origin"
    ): path(d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z")
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import useDark from '~/composables/dark'

export default defineComponent({
  setup () {
    const { dark } = useDark()

    return {
      dark,
    }
  },
})
</script>

<style scoped>
.transform-origin {
  transform-origin: 36px -16px;
}
</style>

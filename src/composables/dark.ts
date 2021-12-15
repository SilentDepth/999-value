import { reactive, toRefs, watch } from 'vue'

let loaded = false

const mql = window.matchMedia('(prefers-color-scheme: dark)')
const state = reactive({
  dark: mql.matches,
})
const refs = toRefs(state)

export default function useDark () {
  if (!loaded) {
    loaded = true

    mql.addEventListener('change', () => {
      state.dark = mql.matches
    })

    watch(() => state.dark, dark => {
      document.documentElement.classList.toggle('dark', dark)
    }, { immediate: true })
  }

  return refs
}

import { vScramble } from '../directives/scramble'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('scramble', vScramble)
})

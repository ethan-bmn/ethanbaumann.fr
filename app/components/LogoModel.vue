<script setup lang="ts">
import logo from '~/assets/img/EB_LOGO_SOURCE.svg'

const host = useTemplateRef('host')
const ready = ref(false)
const loading = ref(true)
let destroyed = false
let dispose: (() => void) | undefined

onMounted(async () => {
  try {
    const { createLogoScene } = await import('~/utils/logo-scene')
    if (destroyed || !host.value) return
    dispose = await createLogoScene(host.value, value => {
      if (!destroyed) {
        ready.value = value
        loading.value = false
      }
    })
    if (destroyed) dispose()
  } catch {
    // Keep the original artwork when WebGL or the model cannot load.
    ready.value = false
    loading.value = false
  }
})

onBeforeUnmount(() => {
  destroyed = true
  dispose?.()
})
</script>

<template>
  <div ref="host" class="logo-model" :data-ready="ready ? '' : undefined" :data-loading="loading ? '' : undefined">
    <img :src="logo" alt="" width="4356" height="4789" class="logo" fetchpriority="high">
    <!-- Match the model's opening pose before its client bundle has loaded. -->
    <svg class="logo-opening" viewBox="0 0 4356 4789" aria-hidden="true" focusable="false">
      <path transform="translate(1648.10125 1785.65945) scale(308.87086)" d="M-1-1H4V0H0V1H4V2H0V3H4V4H-1Z" fill="white" />
    </svg>
  </div>
</template>

<style scoped>
.logo-model { position: relative; aspect-ratio: 4356 / 4789; }
.logo { width: 100%; height: 100%; }
.logo-opening { position: absolute; inset: 0; display: none; width: 100%; height: 100%; }
.logo-model :deep(canvas) { position: absolute; inset: 0; display: block; width: 100%; height: 100%; opacity: 0; pointer-events: none; }
.logo-model[data-ready] :deep(canvas) { opacity: 1; }
.logo-model[data-ready] .logo { visibility: hidden; }

@media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
  .logo-model[data-loading] .logo { visibility: hidden; }
  .logo-model[data-loading] .logo-opening { display: block; }
}
</style>

<script setup lang="ts">
import { loadTurnstile, type TurnstileApi } from '~/utils/turnstile'

const token = defineModel<string>({ required: true })
const siteKey = useRuntimeConfig().public.turnstileSiteKey
const container = ref<HTMLElement>()
const error = ref('')
let api: TurnstileApi | undefined
let widget: string | undefined
let disposed = false

function reset() {
  token.value = ''
  if (api && widget !== undefined) api.reset(widget)
}

async function render() {
  error.value = ''
  try {
    api = await loadTurnstile()
    if (disposed || !container.value) return
    widget = api.render(container.value, {
      sitekey: siteKey,
      action: 'contact',
      theme: 'dark',
      size: 'compact',
      language: 'fr',
      'response-field': false,
      callback: value => { token.value = value; error.value = '' },
      'expired-callback': () => { token.value = '' },
      'timeout-callback': () => { token.value = '' },
      'error-callback': () => {
        token.value = ''
        error.value = 'La vérification a échoué. Réessayez ou contactez-moi par e-mail.'
      }
    })
  } catch {
    if (!disposed) error.value = 'La vérification n’a pas pu se charger. Réessayez ou contactez-moi par e-mail.'
  }
}

function retry() {
  if (api && widget !== undefined) api.remove(widget)
  widget = undefined
  token.value = ''
  void render()
}

onMounted(() => { if (siteKey) void render() })
onBeforeUnmount(() => {
  disposed = true
  if (api && widget !== undefined) api.remove(widget)
})
defineExpose({ reset })
</script>

<template>
  <div class="verification">
    <div ref="container" />
    <p v-if="!siteKey" role="status">Le formulaire est temporairement indisponible. Contactez-moi par e-mail.</p>
    <p v-if="error" role="alert">{{ error }} <button type="button" @click="retry">Réessayer la vérification</button></p>
  </div>
</template>

<style scoped>
.verification { margin-bottom: 24px; min-width: 0; }
.verification p { color: #ffb4ab; font-size: 13px; overflow-wrap: anywhere; }
button { padding: 0; border: 0; background: none; color: inherit; font: inherit; text-decoration: underline; cursor: pointer; }
</style>

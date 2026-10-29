<script setup lang="ts">
defineProps<{ question: string }>()

const details = ref<HTMLDetailsElement>()
const expanded = ref(false)
let animation: Animation | undefined

function toggle(event: MouseEvent) {
  const element = details.value
  if (!element) return

  event.preventDefault()
  const startHeight = element.getBoundingClientRect().height
  expanded.value = animation ? !expanded.value : !element.open
  animation?.cancel()
  animation = undefined

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.open = expanded.value
    return
  }

  // Measure the destination before keeping the answer visible during collapse.
  element.open = expanded.value
  const endHeight = element.getBoundingClientRect().height
  element.open = true

  const currentAnimation = element.animate(
    [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
    { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  )
  animation = currentAnimation
  currentAnimation.onfinish = () => {
    element.open = expanded.value
    animation = undefined
  }
}

onBeforeUnmount(() => animation?.cancel())
</script>

<template>
  <details ref="details" class="faq-accordion" :data-expanded="expanded ? '' : undefined">
    <summary @click="toggle">
      {{ question }}<span class="faq-toggle" aria-hidden="true" />
    </summary>
    <slot />
  </details>
</template>

<style scoped>
.faq-accordion { overflow: clip; }
summary:focus-visible { outline-offset: -2px; }
.faq-toggle { position: relative; flex: 0 0 12px; width: 12px; height: 12px; color: #11a8cd; }
.faq-toggle::before, .faq-toggle::after { content: ''; position: absolute; background: currentColor; }
.faq-toggle::before { top: 5px; left: 0; width: 12px; height: 1px; }
.faq-toggle::after { top: 0; left: 5px; width: 1px; height: 12px; transition: transform 280ms ease-out; }
.faq-accordion[data-expanded] .faq-toggle::after { transform: rotate(90deg); }

@media (scripting: none) {
  .faq-accordion[open] .faq-toggle::after { transform: rotate(90deg); }
}

@media (prefers-reduced-motion: reduce) {
  .faq-toggle::after { transition: none; }
}
</style>

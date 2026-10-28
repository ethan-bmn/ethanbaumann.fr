<script setup lang="ts">
defineProps<{ href: string }>()

const columns = 24
const rows = 8
const pixels = Array.from({ length: columns * rows }, (_, index) => {
  const column = index % columns
  const row = Math.floor(index / columns)
  // Diagonal wave from the top-left corner to the bottom-right corner.
  const progress = (column + row) / (columns + rows - 2)
  // Bound the ease-out tail so the final corner stays with the wave.
  const endProgress = .94
  const endTime = 1 - Math.cbrt(1 - endProgress)
  const arrivalTime = (1 - Math.cbrt(1 - progress * endProgress)) / endTime
  return arrivalTime * 720
})
</script>

<template>
  <a :href="href" class="contact-button">
    <span class="contact-pixels" aria-hidden="true">
      <span v-for="(delay, index) in pixels" :key="index" class="contact-pixel" :style="{ '--pixel-delay': `${delay}ms` }" />
    </span>
    <span class="contact-label"><slot>Contact</slot></span>
    <svg class="contact-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  </a>
</template>

<style scoped>
.contact-button {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 44px;
  padding: 9px 15px;
  border: 1px solid #555;
  background: transparent;
  color: white;
  font: inherit;
  line-height: 1.4;
  text-decoration: none;
  transition: border-color 200ms ease-out, color 180ms ease-out;
}

.contact-button:is(:hover, :focus-visible) {
  border-color: white;
  color: black;
  transition-delay: 0ms, 280ms;
}

.contact-pixels {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: repeat(8, 1fr);
  pointer-events: none;
}

.contact-pixel {
  background: white;
  opacity: 0;
  transform: scale(.1);
  transition: opacity 180ms ease-out, transform 180ms ease-out;
}

.contact-button:is(:hover, :focus-visible) .contact-pixel {
  opacity: 1;
  transform: scale(1.06);
  transition-delay: var(--pixel-delay);
}

.contact-arrow { display: block; flex-shrink: 0; }

@media (prefers-reduced-motion: reduce) {
  .contact-button, .contact-pixel {
    transition: none;
  }
}
</style>

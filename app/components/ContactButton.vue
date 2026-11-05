<script setup lang="ts">
defineProps<{ href: string }>()
</script>

<template>
  <a :href="href" class="contact-button">
    <span class="contact-label"><slot>Contact</slot></span>
    <svg class="contact-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  </a>
</template>

<style scoped>
.contact-button {
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
  transition: background-color 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out;
}

.contact-button:is(:hover, :focus-visible) {
  border-color: white;
  background-color: white;
  color: black;
}

.contact-arrow { display: block; flex-shrink: 0; }

@media (prefers-reduced-motion: reduce) {
  .contact-button {
    transition: none;
  }
}
</style>

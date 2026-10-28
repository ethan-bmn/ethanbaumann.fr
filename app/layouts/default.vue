<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <div class="portfolio">
    <header class="page-header">
      <a class="site-id" href="/" aria-label="Ethan Baumann, accueil">ethanbaumann.fr</a>
      <ContactButton href="mailto:contact@ethanbaumann.fr" />
    </header>

    <slot />

    <footer class="page-footer">
      <span class="copyright">ethanbaumann.fr © {{ year }} - Tous droits réservés</span>
    </footer>
  </div>
</template>

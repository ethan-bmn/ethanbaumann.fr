<script setup lang="ts">
const year = new Date().getFullYear()
const sections = [
  { id: 'about', label: 'À propos' },
  { id: 'services', label: 'Services' },
  { id: 'methode', label: 'Méthode' },
  { id: 'tarifs', label: 'Tarifs' },
  { id: 'portfolio', label: 'Portfolio' }
]
</script>

<template>
  <div class="portfolio">
    <header class="page-header">
      <a class="site-id" href="/" aria-label="Ethan Baumann, accueil">ethanbaumann.fr</a>
      <nav class="section-nav" aria-label="Navigation principale">
        <ul>
          <li v-for="section in sections" :key="section.id">
            <NuxtLink :to="`/#${section.id}`">{{ section.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <ContactButton href="/#contact" />
    </header>

    <slot />

    <footer class="page-footer">
      <span class="copyright">ethanbaumann.fr © {{ year }} - Tous droits réservés</span>
    </footer>
  </div>
</template>

<style scoped>
.section-nav { min-width: 0; margin-left: auto; }
.section-nav ul { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 24px; margin: 0; padding: 0; list-style: none; }
.section-nav a { position: relative; display: flex; align-items: center; min-height: 44px; color: #a3a3a3; font-size: 13px; text-decoration: none; transition: color .2s ease-out; }
.section-nav a::after { content: ''; position: absolute; right: 0; bottom: 6px; left: 0; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .2s ease-out; }
.section-nav a:hover, .section-nav a:focus-visible { color: white; }
.section-nav a:hover::after, .section-nav a:focus-visible::after { transform: scaleX(1); }

@media (max-width: 1100px) {
  .page-header { flex-wrap: wrap; gap: 12px 24px; padding-block: 20px; }
  .section-nav { order: 1; flex-basis: 100%; margin-left: 0; }
  .section-nav ul { gap: 4px 24px; }
  .page-header > :last-child { margin-left: auto; }
}

@media (prefers-reduced-motion: reduce) {
  .section-nav a, .section-nav a::after { transition: none; }
}
</style>

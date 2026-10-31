<script setup lang="ts">
const year = new Date().getFullYear()
const menuOpen = ref(false)
const menuToggle = useTemplateRef('menuToggle')
const route = useRoute()
const sections = [
  { id: 'about', label: 'À propos' },
  { id: 'services', label: 'Services' },
  { id: 'methode', label: 'Méthode' },
  { id: 'tarifs', label: 'Tarifs' },
  { id: 'portfolio', label: 'Portfolio' }
]

function closeMenu() {
  menuOpen.value = false
}

function escapeMenu() {
  if (!menuOpen.value) return
  closeMenu()
  menuToggle.value?.focus()
}

function navigate(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('a')) return
  if (menuOpen.value) menuToggle.value?.focus({ preventScroll: true })
  closeMenu()
}

watch(() => route.fullPath, closeMenu)

onMounted(() => {
  const mobile = window.matchMedia('(max-width: 700px)')
  mobile.addEventListener('change', closeMenu)
  onBeforeUnmount(() => mobile.removeEventListener('change', closeMenu))
})
</script>

<template>
  <div class="portfolio">
    <header class="page-header" @keydown.esc="escapeMenu">
      <a class="site-id" href="/" aria-label="Ethan Baumann, accueil">ethanbaumann.fr</a>
      <button ref="menuToggle" class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="header-navigation" :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'" @click="menuOpen = !menuOpen">
        <span class="menu-icon" :class="{ 'is-open': menuOpen }" aria-hidden="true"><span /><span /><span /></span>
      </button>
      <nav id="header-navigation" class="section-nav" :class="{ 'is-open': menuOpen }" aria-label="Navigation principale" @click="navigate">
        <ul class="section-links">
          <li v-for="section in sections" :key="section.id">
            <NuxtLink :to="`/#${section.id}`">{{ section.label }}</NuxtLink>
          </li>
        </ul>
        <ContactButton href="/#contact" />
      </nav>
    </header>

    <slot />

    <footer class="page-footer">
      <span class="copyright">ethanbaumann.fr © {{ year }} - Tous droits réservés</span>
    </footer>
  </div>
</template>

<style scoped>
.menu-toggle { display: none; }
.section-nav { display: flex; align-items: center; gap: 24px; min-width: 0; margin-left: auto; }
.section-links { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 24px; margin: 0; padding: 0; list-style: none; }
.section-links a { position: relative; display: flex; align-items: center; min-height: 44px; color: #a3a3a3; font-size: 13px; text-decoration: none; transition: color .2s ease-out; }
.section-links a::after { content: ''; position: absolute; right: 0; bottom: 6px; left: 0; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .2s ease-out; }
.section-links a:hover, .section-links a:focus-visible { color: white; }
.section-links a:hover::after, .section-links a:focus-visible::after { transform: scaleX(1); }

@media (max-width: 1100px) {
  .page-header { flex-wrap: wrap; gap: 12px 24px; padding-block: 20px; }
  .section-nav { order: 1; flex-basis: 100%; margin-left: 0; }
  .section-nav { flex-wrap: wrap; }
}

@media (max-width: 700px) {
  .page-header { padding-block: 16px; }
  .section-nav { align-items: stretch; flex-direction: column; gap: 20px; padding-block: 12px 8px; }
  .section-links { flex-direction: column; align-items: stretch; gap: 4px; }
  .section-links a { width: fit-content; }
  .menu-toggle { width: 44px; height: 44px; margin-left: auto; padding: 10px; border: 1px solid #555; background: transparent; color: white; cursor: pointer; }
  .menu-icon { display: flex; flex-direction: column; justify-content: center; gap: 5px; }
  .menu-icon > span { display: block; width: 22px; height: 1px; background: currentColor; transition: transform .2s ease-out, opacity .2s ease-out; }
  .menu-icon.is-open > span:first-child { transform: translateY(6px) rotate(45deg); }
  .menu-icon.is-open > span:nth-child(2) { opacity: 0; }
  .menu-icon.is-open > span:last-child { transform: translateY(-6px) rotate(-45deg); }
}

@media (max-width: 700px) and (scripting: enabled) {
  .menu-toggle { display: block; }
  .section-nav:not(.is-open) { display: none; }
}

@media (max-width: 700px) and (prefers-reduced-motion: no-preference) {
  .section-nav.is-open { animation: menu-unfold .28s ease-out; }
}

@keyframes menu-unfold {
  from { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateY(-8px); }
  to { clip-path: inset(0); opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .section-links a, .section-links a::after, .menu-icon > span { transition: none; }
}
</style>

<script setup lang="ts">
const titleComplete = ref(false)

useHead({
  htmlAttrs: { lang: 'fr' },
  title: 'Ethan Baumann - Concepteur développeur d’applications web et logicielles',
  meta: [
    { name: 'description', content: 'Ethan Baumann, concepteur développeur d’applications web et logicielles.' },
    { name: 'theme-color', content: '#000000' }
  ]
})
</script>

<template>
  <main class="hero" aria-labelledby="hero-name">
    <div class="hero-copy">
      <p class="command" aria-hidden="true">
        <span class="shell-user">ethan@portfolio</span>
        <span class="shell-arrow">➜</span>
        <span class="shell-directory">~</span>
        <span class="shell-git">git:(<span>main</span>)</span>
        <span class="shell-input">whoami</span>
      </p>
      <h1 id="hero-name" class="hero-name">
        <span class="sr-only">Ethan Baumann</span>
        <GeometricName word="ETHAN" :delay="100" />
        <GeometricName word="BAUMANN" :delay="900" @complete="titleComplete = true" />
      </h1>
      <div class="role" :data-awaiting-title="!titleComplete ? '' : undefined">
        <p v-scramble="{ enabled: titleComplete, duration: 1100, delay: 100 }" class="role-text">Concepteur développeur<br>d’applications web et logicielles</p>
      </div>
    </div>

    <div class="hero-mark" aria-hidden="true">
      <LogoModel />
    </div>
  </main>
</template>

<script setup lang="ts">
import { firstName, lastName } from './utils/name-art'

useHead({
  htmlAttrs: { lang: 'fr' },
  title: 'Ethan Baumann — Concepteur développeur d’applications logicielles',
  meta: [
    { name: 'description', content: 'Ethan Baumann, concepteur développeur d’applications logicielles.' },
    { name: 'theme-color', content: '#080808' }
  ]
})
</script>

<template>
  <main class="terminal">
    <AsciiFrame />

    <section class="hero" aria-labelledby="hero-name">
      <h1 id="hero-name" class="hero-name">
        <span class="sr-only">Ethan Baumann</span>
        <span class="ascii-name" aria-hidden="true">
          <span v-for="(word, wordIndex) in [firstName, lastName]" :key="wordIndex" class="ascii-word">
            <span
              v-for="(letter, letterIndex) in word"
              :key="letterIndex"
              v-scramble="{
                text: letter,
                delay: 500 + wordIndex * 450 + letterIndex * 100,
                duration: 1300,
                direction: 'diagonal',
                characters: '/\\|_-=+.: '
              }"
              class="ascii-letter"
            >{{ letter }}</span>
          </span>
        </span>
      </h1>
      <h2 v-scramble="{ delay: 1400, duration: 1500, direction: 'diagonal' }" class="hero-description">Concepteur développeur<br>d’applications logicielles</h2>
    </section>
  </main>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; }

:root {
  color-scheme: dark;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background: #080808;
  color: #f2f2ee;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
}

body { margin: 0; }
::selection { color: #080808; background: #f2f2ee; }

/* Prevent a flash of finished artwork before hydration, retaining the layout.
   Without JavaScript or with reduced motion, the readable SSR text stays visible. */
@media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
  [data-scramble-pending] { visibility: hidden; }
}

.terminal {
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 56px clamp(24px, 6vw, 112px);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(28px, 5svh, 56px);
  max-width: 100%;
}

.hero-name {
  margin: 0;
  font-size: clamp(8px, min(2.65vw, 4svh), 34px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: 0;
}

.ascii-name { display: flex; flex-direction: column; align-items: flex-start; }
.ascii-word { display: flex; }
.ascii-letter { display: block; white-space: pre; }

.hero-description {
  margin: 0;
  font-size: clamp(12px, 1.65vw, 23px);
  font-weight: 400;
  letter-spacing: -.035em;
  line-height: 1.55;
  color: #cecec7;
  text-align: left;
  white-space: pre-line;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 700px) {
  .terminal { padding: 40px 24px; }
  .hero-description { font-size: clamp(12px, 3.25vw, 19px); }
}
</style>

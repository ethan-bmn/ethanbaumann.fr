<script setup lang="ts">
import { firstName, lastName } from '~/utils/name-art'

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
  <main class="relative isolate flex min-h-svh items-center justify-start px-[clamp(24px,6vw,112px)] py-14 max-[700px]:px-6 max-[700px]:py-10">
    <section class="flex max-w-full flex-col items-start gap-[clamp(28px,5svh,56px)]" aria-labelledby="hero-name">
      <!-- Offset the artwork's leading space so its left stroke meets the subtitle. -->
      <h1 id="hero-name" class="m-0 -translate-x-[1ch] text-[clamp(6.8px,min(2.2525vw,3.4svh),28.9px)] leading-[1.05] font-normal tracking-normal">
        <span class="sr-only">Ethan Baumann</span>
        <span class="flex flex-col items-start" aria-hidden="true">
          <span v-for="(word, wordIndex) in [firstName, lastName]" :key="wordIndex" class="flex">
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
              class="block whitespace-pre"
            >{{ letter }}</span>
          </span>
        </span>
      </h1>
      <h2
        v-scramble="{ delay: 1400, duration: 1500, direction: 'diagonal' }"
        class="m-0 text-left text-[clamp(12px,1.65vw,23px)] leading-[1.55] font-normal tracking-[-0.035em] whitespace-pre-line text-[#cecec7] max-[700px]:text-[clamp(12px,3.25vw,19px)] after:invisible after:ml-[0.15ch] after:inline-block after:h-[1em] after:w-[0.6ch] after:translate-y-[0.12em] after:bg-current after:content-[''] data-[scramble-complete]:after:visible motion-safe:data-[scramble-complete]:after:animate-terminal-cursor"
      >Concepteur développeur<br>d’applications logicielles</h2>
    </section>
  </main>
</template>

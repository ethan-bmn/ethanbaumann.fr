<script setup lang="ts">
const title = 'Contact | Ethan Baumann, développeur à Lyon'
const description = 'Parlons de votre projet web ou logiciel. Contactez Ethan Baumann, développeur à Lyon.'

useHead({
  htmlAttrs: { lang: 'fr' },
  title,
  link: [{ rel: 'canonical', href: 'https://ethanbaumann.fr/contact' }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: 'https://ethanbaumann.fr/contact' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary' }
  ]
})

</script>

<template>
  <main>
    <ContactSection standalone />
  </main>
</template>

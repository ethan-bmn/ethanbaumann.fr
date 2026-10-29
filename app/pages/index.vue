<script setup lang="ts">
const titleComplete = ref(false)
const title = 'Développeur logiciel à Lyon | Ethan Baumann'
const description = 'Ethan Baumann, développeur logiciel à Lyon, France. Prestataire logiciel : conception, développement et déploiement de sites web et d’applications logicielles.'
const siteUrl = 'https://ethanbaumann.fr/'

useHead({
  htmlAttrs: { lang: 'fr' },
  title,
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:site_name', content: 'Ethan Baumann' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: siteUrl },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'theme-color', content: '#000000' }
  ],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}#website`,
          url: siteUrl,
          name: 'Ethan Baumann',
          inLanguage: 'fr-FR',
          publisher: { '@id': `${siteUrl}#person` }
        },
        {
          '@type': 'Person',
          '@id': `${siteUrl}#person`,
          name: 'Ethan Baumann',
          url: siteUrl,
          email: 'contact@ethanbaumann.fr',
          jobTitle: 'Développeur logiciel',
          homeLocation: { '@type': 'City', name: 'Lyon', containedInPlace: { '@type': 'Country', name: 'France' } }
        },
        {
          '@type': 'Service',
          '@id': `${siteUrl}#services`,
          name: 'Développement web et logiciel à Lyon',
          serviceType: ['Développement logiciel', 'Développement web', 'Conception et déploiement d’applications'],
          description,
          url: `${siteUrl}#services`,
          provider: { '@id': `${siteUrl}#person` },
          areaServed: { '@type': 'City', name: 'Lyon', containedInPlace: { '@type': 'Country', name: 'France' } }
        }
      ]
    })
  }]
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
        <span class="sr-only">Ethan Baumann, concepteur développeur d'applications à Lyon</span>
        <GeometricName word="ETHAN" :delay="100" />
        <GeometricName word="BAUMANN" :delay="900" @complete="titleComplete = true" />
      </h1>
      <div class="role" :data-awaiting-title="!titleComplete ? '' : undefined">
        <p v-scramble="{ enabled: titleComplete, duration: 1100, delay: 100 }" class="role-text">Concepteur développeur d’applications web et logicielles basé à Lyon</p>
      </div>
    </div>

    <div class="hero-mark" aria-hidden="true">
      <LogoModel />
    </div>

    <AboutMe />
    <ServicesSection />
    <HowIWork />
    <PricingSection />
    <FaqSection />
  </main>
</template>

<script setup lang="ts">
import { projects } from '~/data/projects'

definePageMeta({ key: route => route.path })

const route = useRoute()
const project = projects.find(project => project.slug === route.params.slug)
if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })
}

const title = `${project.title} - Projet | Ethan Baumann`
const description = project.description
const canonical = `https://ethanbaumann.fr/portfolio/${project.slug}`

useHead({
  htmlAttrs: { lang: 'fr' },
  title,
  link: [{ rel: 'canonical', href: canonical }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:image', content: `https://ethanbaumann.fr${project.image}` },
    { property: 'og:image:alt', content: project.alt },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>

<template>
  <main class="project-page" aria-labelledby="project-title">
    <NuxtLink class="back-link" to="/#portfolio">← Retour au portfolio</NuxtLink>

    <header class="project-header">
      <p class="project-command" aria-hidden="true"><span>~</span> cat projects/{{ project.slug }}.md</p>
      <h1 id="project-title">{{ project.title }}</h1>
      <a class="project-url" :href="project.url" target="_blank" rel="noopener noreferrer">
        {{ project.hostname }} <span aria-hidden="true">↗</span><span class="sr-only"> (nouvel onglet)</span>
      </a>
    </header>

    <img class="project-preview" :src="project.image" :alt="project.alt" width="1280" height="800" decoding="async">

    <dl class="project-facts">
      <div><dt>Client</dt><dd>{{ project.customer }}</dd></div>
      <div><dt>Domaine</dt><dd>{{ project.domain }}</dd></div>
      <div><dt>Type</dt><dd>{{ project.type }}</dd></div>
    </dl>

    <section class="project-section" aria-labelledby="overview-title">
      <h2 id="overview-title">Le projet</h2>
      <div class="project-copy">
        <p v-for="paragraph in project.overview" :key="paragraph">{{ paragraph }}</p>
      </div>
    </section>

    <section class="project-section" aria-labelledby="work-title">
      <h2 id="work-title">Mon accompagnement</h2>
      <div class="project-copy">
        <ul class="project-insights">
          <li v-for="insight in project.insights" :key="insight.title"><h3>{{ insight.title }}</h3><p>{{ insight.text }}</p></li>
        </ul>
      </div>
    </section>

    <section v-if="project.comment" class="project-section" aria-labelledby="comment-title">
      <h2 id="comment-title">Le retour du client</h2>
      <figure class="customer-comment">
        <blockquote><p>{{ project.comment }}</p></blockquote>
        <figcaption>{{ project.customer }} <span>- {{ project.title }}</span></figcaption>
      </figure>
    </section>

    <div class="project-contact">
      <p>Un projet à concrétiser ?</p>
      <ContactButton href="/#contact">Parlons-en</ContactButton>
    </div>
  </main>
</template>

<style scoped>
.project-page { min-width: 0; padding-block: clamp(40px, 7vw, 96px); }
.back-link { display: inline-block; color: #a3a3a3; font-size: 13px; }
.project-header { margin: clamp(40px, 6vw, 80px) 0 32px; text-align: center; }
.project-command { margin: 0 0 20px; color: #919191; font-size: 12px; overflow-wrap: anywhere; }
.project-command > span { color: #11a8cd; }
h1 { margin: 0; font-size: clamp(32px, 6vw, 72px); font-weight: 400; letter-spacing: -.05em; line-height: 1.1; }
.project-url { position: relative; display: inline-block; margin-top: 16px; color: #a3a3a3; font-size: 14px; }
.project-url:hover, .back-link:hover { color: white; }
.project-preview { display: block; width: 100%; max-width: 960px; height: auto; margin-inline: auto; border: 1px solid #242424; }
.project-facts { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px 64px; margin: 32px 0 clamp(48px, 7vw, 96px); font-size: 13px; }
dt { color: #919191; }
dd { margin: 8px 0 0; }
.project-section { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 32px; padding-block: clamp(32px, 5vw, 64px); border-top: 1px solid #242424; }
h2 { margin: 0; font-size: clamp(22px, 2.5vw, 32px); font-weight: 400; letter-spacing: -.04em; }
.project-copy, .customer-comment { max-width: 65ch; min-width: 0; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.project-copy p, blockquote p { margin: 0; line-height: 1.8; }
.project-copy p + p { margin-top: 16px; }
.project-insights { display: grid; gap: 28px; list-style: none; margin: 0; padding: 0; }
h3 { margin: 0 0 8px; color: white; font-size: 16px; font-weight: 400; }
.customer-comment { margin: 0; }
blockquote { margin: 0; padding-left: 24px; border-left: 1px solid #555; }
figcaption { margin: 24px 0 0 25px; color: white; font-size: 13px; line-height: 1.6; }
figcaption span { color: #919191; }
.project-contact { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; margin-top: 32px; padding-top: 32px; border-top: 1px solid #242424; }
.project-contact p { margin: 0; font-size: clamp(20px, 2.5vw, 28px); }
@media (max-width: 700px) {
  .project-section { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .project-facts { justify-content: space-between; gap: 24px; }
}
</style>

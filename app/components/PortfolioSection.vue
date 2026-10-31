<script setup lang="ts">
import { projects } from '~/data/projects'
</script>

<template>
  <section id="portfolio" class="portfolio-section" aria-labelledby="portfolio-title">
    <header>
      <p class="portfolio-command" aria-hidden="true"><span>~</span> ls projects/</p>
      <h2 id="portfolio-title">Portfolio</h2>
    </header>

    <ul class="project-carousel" aria-label="Projets réalisés" tabindex="0">
      <li v-for="project in projects" :key="project.url" class="project-card">
        <NuxtLink :to="`/portfolio/${project.slug}`" class="project-link">
          <h3>{{ project.title }}</h3>
          <p class="project-url">{{ project.hostname }}</p>
          <img :src="project.image" :alt="project.alt" width="1280" height="800" loading="lazy" decoding="async">
          <dl class="project-details">
            <div>
              <dt>Domaine</dt>
              <dd>{{ project.domain }}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{{ project.type }}</dd>
            </div>
          </dl>
        </NuxtLink>
      </li>
      <li class="project-card">
        <a href="#contact" class="project-link project-invitation">
          <h3>Votre projet</h3>
          <p class="project-url">La prochaine réalisation ?</p>
          <div class="project-placeholder" aria-hidden="true">
            <span>+</span>
          </div>
          <p class="project-invitation-label">Parlons de votre projet <span aria-hidden="true">↗</span></p>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.portfolio-section {
  grid-column: 1 / -1;
  min-width: 0;
  padding-top: clamp(48px, 8vw, 96px);
  border-top: 1px solid #242424;
  scroll-margin-top: 24px;
}

.portfolio-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.portfolio-command span { color: #11a8cd; }
h2 { margin: 0; font-size: clamp(24px, 3vw, 40px); font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.project-carousel {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: #555 #090909;
  margin: 32px 0 0;
  padding: 8px 8px 16px;
  list-style: none;
}

.project-card { flex: 0 0 min(360px, 100%); min-width: 0; scroll-snap-align: start; }
.project-link { position: relative; display: block; text-decoration: none; }
h3 { margin: 0; font-size: clamp(24px, 3vw, 30px); font-weight: 400; text-align: center; letter-spacing: -.04em; overflow-wrap: anywhere; }
.project-url { margin: 8px 0 20px; color: #a3a3a3; font-size: 14px; text-align: center; overflow-wrap: anywhere; }
img { display: block; width: 100%; height: auto; aspect-ratio: 8 / 5; object-fit: cover; border: 1px solid #242424; background: #090909; transition: border-color .2s ease-out; }
.project-link:hover img, .project-link:focus-visible img { border-color: #919191; }
.project-placeholder { display: grid; place-items: center; aspect-ratio: 8 / 5; border: 1px dashed #555; background: #090909; color: #919191; transition: border-color .2s ease-out, color .2s ease-out; }
.project-placeholder span { font-size: 64px; font-weight: 300; line-height: 1; }
.project-invitation:hover .project-placeholder, .project-invitation:focus-visible .project-placeholder { border-color: white; color: white; }
.project-invitation-label { display: flex; justify-content: space-between; gap: 12px; margin: 16px 0 0; font-size: 12px; line-height: 1.6; }
.project-details { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; margin: 16px 0 0; font-size: 12px; line-height: 1.6; }
dt { color: #919191; }
dd { margin: 4px 0 0; color: #e5e5e5; }

@media (prefers-reduced-motion: reduce) {
  img, .project-placeholder { transition: none; }
}
</style>

<script setup lang="ts">
</script>
<template>
  <section id="faq" class="faq" aria-labelledby="faq-title">
    <div>
      <p class="faq-command" aria-hidden="true"><span>~</span> cat faq.txt</p>
      <h2 id="faq-title">Questions fréquentes</h2>
      <p class="faq-intro">Quelques réponses pour préparer votre projet. Une autre question ?</p>
      <ContactButton href="mailto:contact@ethanbaumann.fr">Échangeons ensemble</ContactButton>
    </div>

    <div class="faq-questions">
      <FaqAccordion question="Quels types de projets réalisez-vous ?">
        <p>Je conçois et développe des sites web, des applications web et des logiciels sur mesure. Nous partons de votre activité et de vos besoins pour définir une solution adaptée.</p>
      </FaqAccordion>
      <FaqAccordion question="Combien de temps dure un projet ?">
        <p>Le délai dépend du périmètre, de la complexité et des contenus à préparer. Nous définissons un calendrier lors du cadrage, avec des points réguliers pour suivre l’avancement et valider les étapes.</p>
      </FaqAccordion>
      <FaqAccordion question="L’hébergement est-il inclus dans le tarif ?">
        <p>L’hébergement, le déploiement et les sauvegardes sont proposés en supplément du développement. Pour les sites vitrines, un hébergement sur un VPS mutualisé en France est possible. Les logiciels et applications web nécessitent une machine à votre charge ; leur déploiement sur cette machine fait l’objet d’un devis séparé.</p>
      </FaqAccordion>
      <FaqAccordion question="Comment se passe la livraison ?">
        <p>Nous vérifions ensemble le fonctionnement du site ou de l’application. Je vous transmets ensuite les éléments nécessaires à la prise en main. Si la mise en ligne est prévue au devis, je m’occupe également du déploiement.</p>
      </FaqAccordion>
      <FaqAccordion question="Comment mon site vitrine sera référencé sur Google ?">
        <p>Tous les sites vitrines que je produis contiennent les données suffisantes à un référencement organique sur les moteurs de recherche. À noter cependant que le SEO n'est pas mon domaine d'expertise, je ne peux donc pas garantir un référencement optimal.</p>
      </FaqAccordion>
    </div>
  </section>
</template>

<style scoped>
.faq {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 7vw, 120px);
  padding-top: clamp(48px, 8vw, 96px);
  border-top: 1px solid #242424;
}

.faq-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.faq-command span { color: #11a8cd; }
.faq h2 { margin: 0; font-size: clamp(24px, 3vw, 40px); font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.faq-intro { max-width: 38ch; margin: 24px 0 32px; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.faq-questions { min-width: 0; }
.faq :deep(details) { border-bottom: 1px solid #242424; }
.faq :deep(summary) { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; padding-block: 24px; cursor: pointer; list-style: none; font-size: clamp(17px, 1.5vw, 21px); line-height: 1.4; }
.faq :deep(details:first-child summary) { padding-top: 0; }
.faq :deep(summary::-webkit-details-marker) { display: none; }
.faq :deep(summary:hover), .faq :deep(summary:focus-visible) { color: #11a8cd; }
.faq details p { max-width: 48ch; margin: 0 0 24px; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.faq details a { color: white; text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }

@media (max-width: 700px) {
  .faq { grid-template-columns: minmax(0, 1fr); gap: 32px; }
}
</style>

<template>
  <section id="faq" class="faq" aria-labelledby="faq-title">
    <div>
      <p class="faq-command" aria-hidden="true"><span>~</span> cat faq.txt</p>
      <h2 id="faq-title">Questions fréquentes</h2>
      <p class="faq-intro">Quelques réponses pour préparer votre projet. Une autre question ?</p>
      <ContactButton href="mailto:contact@ethanbaumann.fr">Échangeons ensemble</ContactButton>
    </div>

    <div class="faq-questions">
      <details>
        <summary>Quels types de projets réalisez-vous ?<span class="faq-toggle" aria-hidden="true" /></summary>
        <p>Je conçois et développe des sites web, des applications web et des logiciels sur mesure. Nous partons de votre activité et de vos besoins pour définir une solution adaptée.</p>
      </details>
      <details>
        <summary>Comment obtenir un devis ?<span class="faq-toggle" aria-hidden="true" /></summary>
        <p>Envoyez-moi un e-mail à <a href="mailto:contact@ethanbaumann.fr">contact@ethanbaumann.fr</a> en présentant votre idée, les fonctionnalités souhaitées et vos contraintes de budget ou de calendrier. Nous précisons ensemble le périmètre pour établir un devis.</p>
      </details>
      <details>
        <summary>Combien de temps dure un projet ?<span class="faq-toggle" aria-hidden="true" /></summary>
        <p>Le délai dépend du périmètre, de la complexité et des contenus à préparer. Nous définissons un calendrier lors du cadrage, avec des points réguliers pour suivre l’avancement et valider les étapes.</p>
      </details>
      <details>
        <summary>L’hébergement est-il inclus dans le tarif ?<span class="faq-toggle" aria-hidden="true" /></summary>
        <p>L’hébergement, le déploiement et les sauvegardes sont proposés en supplément du développement. Pour les sites vitrines, un hébergement sur un VPS mutualisé en France est possible. Les logiciels et applications web nécessitent une machine à votre charge ; leur déploiement sur cette machine fait l’objet d’un devis séparé.</p>
      </details>
      <details>
        <summary>Comment se passe la livraison ?<span class="faq-toggle" aria-hidden="true" /></summary>
        <p>Nous vérifions ensemble le fonctionnement du site ou de l’application. Je vous transmets ensuite les éléments nécessaires à la prise en main. Si la mise en ligne est prévue au devis, je m’occupe également du déploiement.</p>
      </details>
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
.faq details { border-bottom: 1px solid #242424; }
.faq summary { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; padding-block: 24px; cursor: pointer; list-style: none; font-size: clamp(17px, 1.5vw, 21px); line-height: 1.4; }
.faq details:first-child summary { padding-top: 0; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary:hover, .faq summary:focus-visible { color: #11a8cd; }
.faq-toggle { position: relative; flex: 0 0 12px; width: 12px; height: 12px; color: #11a8cd; }
.faq-toggle::before, .faq-toggle::after { content: ''; position: absolute; background: currentColor; }
.faq-toggle::before { top: 5px; left: 0; width: 12px; height: 1px; }
.faq-toggle::after { top: 0; left: 5px; width: 1px; height: 12px; }
.faq details[open] .faq-toggle::after { display: none; }
.faq details p { max-width: 48ch; margin: 0 0 24px; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.faq details a { color: white; text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }

@media (max-width: 700px) {
  .faq { grid-template-columns: minmax(0, 1fr); gap: 32px; }
}
</style>

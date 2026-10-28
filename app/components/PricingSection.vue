<template>
  <section id="tarifs" class="pricing" aria-labelledby="pricing-title">
    <div class="pricing-heading">
      <p class="pricing-command" aria-hidden="true"><span>~</span> cat tarifs.txt</p>
      <h2 id="pricing-title">Tarifs</h2>
      <p class="pricing-intro">Chaque projet a ses besoins. Le tarif dépend du périmètre, des fonctionnalités et de la complexité de votre projet.</p>
    </div>

    <div class="pricing-content">
      <div class="pricing-options">
        <article class="pricing-option" aria-labelledby="website-pricing-title">
          <h3 id="website-pricing-title">Développement de sites web</h3>
          <p class="pricing-amount">À partir de 600€</p>
          <p>Conception et développement d’un site adapté à votre activité et à vos contenus.</p>
        </article>
        <article class="pricing-option" aria-labelledby="software-pricing-title">
          <h3 id="software-pricing-title">Développement logiciel</h3>
          <p class="pricing-amount">Sur devis</p>
          <p>Applications web et logiciels sur mesure, selon vos besoins métier et les fonctionnalités attendues.</p>
        </article>
      </div>

      <aside class="pricing-extras" aria-labelledby="hosting-pricing-title">
        <p class="pricing-label">Services complémentaires · en supplément</p>
        <h3 id="hosting-pricing-title">Hébergement & sauvegardes</h3>
        <p>L’hébergement et les sauvegardes sont proposés en supplément du développement.</p>
        <ul>
          <li>Hébergement sur un VPS mutualisé situé en France.</li>
          <li>Hébergement sur un VPS séparé : sur devis.</li>
          <li>Sauvegardes en option, selon les besoins de votre projet.</li>
        </ul>
      </aside>

      <ContactButton href="mailto:contact@ethanbaumann.fr">Demander un devis</ContactButton>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 7vw, 120px);
  padding-top: clamp(48px, 8vw, 96px);
  border-top: 1px solid #242424;
}

.pricing-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.pricing-command span { color: #11a8cd; }
.pricing h2 { margin: 0; font-size: clamp(24px, 3vw, 40px); font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.pricing-intro { max-width: 38ch; margin: 24px 0 0; }
.pricing p, .pricing li { color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.pricing-content { min-width: 0; }
.pricing-options { display: grid; gap: 28px; }
.pricing-option + .pricing-option { padding-top: 28px; border-top: 1px solid #242424; }
.pricing h3 { margin: 0; font-size: clamp(17px, 1.5vw, 21px); font-weight: 400; line-height: 1.4; }
.pricing-option .pricing-amount { margin: 12px 0; color: white; font-size: clamp(24px, 2.5vw, 32px); letter-spacing: -.04em; }
.pricing-option > p:last-child { max-width: 48ch; margin: 0; }
.pricing-extras { margin-block: 32px; padding: clamp(16px, 3vw, 28px); border: 1px solid #242424; }
.pricing-extras .pricing-label { margin: 0 0 16px; color: #919191; font-size: 12px; }
.pricing-extras > p:not(.pricing-label) { margin: 16px 0; }
.pricing-extras ul { margin: 0; padding-left: 1.25em; list-style: disc; }
.pricing-extras li + li { margin-top: 10px; }

@media (max-width: 700px) {
  .pricing { grid-template-columns: minmax(0, 1fr); gap: 32px; }
}
</style>

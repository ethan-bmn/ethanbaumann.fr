<template>
  <section id="services" class="services" aria-labelledby="services-title">
    <div>
      <p class="services-command" aria-hidden="true"><span>~</span> ls services/</p>
      <h2 id="services-title" class="services-title">Mes services</h2>
      <p class="services-intro">De la conception au déploiement, je vous accompagne dans vos projets web et logiciels.</p>
      <ContactButton href="/contact">Parlons de votre projet</ContactButton>
    </div>

    <ol class="services-list">
      <li>
        <span class="service-number" aria-hidden="true">01</span>
        <div>
          <h3>Sites web</h3>
          <p>Conception et développement de sites adaptés à votre activité, lisibles et accessibles sur mobile comme sur ordinateur.</p>
        </div>
      </li>
      <li>
        <span class="service-number" aria-hidden="true">02</span>
        <div>
          <h3>Applications logicielles</h3>
          <p>Développement d’applications web et de logiciels sur mesure pour vos besoins métier et vos tâches du quotidien.</p>
        </div>
      </li>
      <li>
        <span class="service-number" aria-hidden="true">03</span>
        <div>
          <h3>Déploiement</h3>
          <p>Préparation et mise en ligne de votre site ou application, pour passer du développement à un service utilisable.</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.services {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 7vw, 120px);
  padding-top: clamp(48px, 8vw, 96px);
  border-top: 1px solid #242424;
}

.services-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.services-command span { color: #11a8cd; }
.services-title { margin: 0; font-size: clamp(24px, 3vw, 40px); font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.services-intro { max-width: 38ch; margin: 24px 0 32px; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.services-list { margin: 0; padding: 0; list-style: none; }
.services-list li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 20px; padding-block: 28px; border-top: 1px solid #242424; }
.services-list li:first-child { padding-top: 0; border-top: 0; }
.services-list li:last-child { padding-bottom: 0; }
.service-number { padding-top: 4px; color: #919191; font-size: 12px; }
.services-list h3 { margin: 0 0 12px; font-size: clamp(17px, 1.5vw, 21px); font-weight: 400; line-height: 1.4; }
.services-list p { max-width: 48ch; margin: 0; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }

@media (max-width: 700px) {
  .services { grid-template-columns: minmax(0, 1fr); gap: 32px; }
}
</style>

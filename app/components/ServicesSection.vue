<template>
  <section id="services" class="services" aria-labelledby="services-title">
    <p class="services-command" aria-hidden="true"><span>~</span> ls services/</p>
    <h2 id="services-title">Prestataire logiciel à Lyon</h2>
    <p class="services-intro">Un interlocuteur freelance pour concevoir, développer et déployer votre projet web ou logiciel.</p>

    <div class="services-list">
      <div>
        <h3>Développeur logiciel</h3>
        <p>Je conçois et développe des applications logicielles selon vos besoins. Mon accompagnement couvre la conception de l’application, son développement et son déploiement.</p>
      </div>
      <div>
        <h3>Développement web</h3>
        <p>Je réalise des sites web et des applications web. Basé à Lyon, je vous accompagne dans la mise en place de votre projet, de la conception à la mise en ligne.</p>
      </div>
    </div>

    <p class="services-contact">Parlons de votre projet : <a href="mailto:contact@ethanbaumann.fr">contact@ethanbaumann.fr</a></p>
  </section>
</template>

<style scoped>
.services { grid-column: 1 / -1; border-top: 1px solid #242424; padding-top: clamp(48px, 8vw, 96px); }
.services-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.services-command span { color: #11a8cd; }
h2 { margin: 0; font-size: clamp(24px, 3vw, 40px); font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.services-intro { max-width: 65ch; margin: 24px 0 0; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.services-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(32px, 7vw, 120px); margin-top: 40px; }
h3 { margin: 0 0 16px; font-size: 18px; font-weight: 400; }
.services-list p { max-width: 48ch; margin: 0; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.services-contact { margin: 40px 0 0; font-size: 14px; color: #b8b8b8; overflow-wrap: anywhere; }
.services-contact a { color: white; text-decoration: underline; text-underline-offset: 4px; }

@media (max-width: 700px) {
  .services-list { grid-template-columns: minmax(0, 1fr); }
}
</style>

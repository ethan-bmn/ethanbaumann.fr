<template>
  <section id="about" class="about" aria-labelledby="about-title">
    <div>
      <p class="about-command" aria-hidden="true"><span>~</span> cat about.txt</p>
      <h2 id="about-title" class="about-title">À propos de moi</h2>
    </div>

    <div class="about-copy">
      <p>Développeur logiciel basé à Lyon, en France, je propose des prestations de <span>conception, développement et déploiement</span> de sites web et de logiciels.</p>
      <p>Issu d'un parcours entièrement en alternance à l'école d'ingénieur CESI, j'ai obtenu un <span>bachelor de conception et développement d'applications</span> (RNCP37873).</p>
      <p>J'ai 6 ans d'expérience dans le développement logiciel, <span>dont 3 en entreprise.</span></p>
    </div>
  </section>
</template>

<style scoped>
.about {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 7vw, 120px);
  padding-top: clamp(48px, 8vw, 96px);
  border-top: 1px solid #242424;
}

.about-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.about-command span { color: #11a8cd; }
.about-title { margin: 0; font-size: clamp(24px, 3vw, 40px); font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.about-copy { max-width: 48ch; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); line-height: 1.8; }
.about-copy p { margin: 0; }
.about-copy p + p { margin-top: 16px; }
.about-copy span { color: white; }

@media (max-width: 700px) {
  .about { grid-template-columns: minmax(0, 1fr); gap: 24px; }
}
</style>

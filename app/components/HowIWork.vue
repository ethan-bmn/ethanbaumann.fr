<template>
  <section id="methode" class="workflow" aria-labelledby="workflow-title">
    <div>
      <p class="workflow-command" aria-hidden="true"><span>~</span> cat methode.txt</p>
      <h2 id="workflow-title">Comment je travaille</h2>
      <p class="workflow-intro">Un projet se construit ensemble, étape par étape. Vous savez où nous en sommes et ce qui vient ensuite.</p>
    </div>

    <ol class="workflow-steps" role="list">
      <li>
        <span class="workflow-number" aria-hidden="true">01</span>
        <div>
          <h3>Échanger & cadrer</h3>
          <p>Nous échangeons sur votre activité, vos objectifs et vos contraintes. Je vous propose un périmètre, un devis et un calendrier à valider ensemble.</p>
        </div>
      </li>
      <li>
        <span class="workflow-number" aria-hidden="true">02</span>
        <div>
          <h3>Concevoir la solution</h3>
          <p>Je définis la structure, les parcours et les choix techniques adaptés à votre projet. Nous validons cette direction avant de passer au développement.</p>
        </div>
      </li>
      <li>
        <span class="workflow-number" aria-hidden="true">03</span>
        <div>
          <h3>Développer & ajuster</h3>
          <p>Je développe votre site ou application avec des points réguliers pour vous montrer les avancées. Vos retours permettent d’ajuster le résultat au fil du projet.</p>
        </div>
      </li>
      <li>
        <span class="workflow-number" aria-hidden="true">04</span>
        <div>
          <h3>Tester & livrer</h3>
          <p>Nous vérifions ensemble le fonctionnement avant la livraison. Je vous transmets les éléments nécessaires à la prise en main et, si prévu au devis, je m’occupe de la mise en ligne.</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.workflow {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 7vw, 120px);
  padding-top: clamp(48px, 8vw, 96px);
  border-top: 1px solid #242424;
}

.workflow-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.workflow-command span { color: #11a8cd; }
.workflow h2 { margin: 0; font-size: clamp(24px, 3vw, 40px); font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.workflow-intro { max-width: 38ch; margin: 24px 0 0; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }
.workflow-steps { margin: 0; padding: 0; list-style: none; }
.workflow-steps li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 20px; padding-block: 28px; border-top: 1px solid #242424; }
.workflow-steps li:first-child { padding-top: 0; border-top: 0; }
.workflow-steps li:last-child { padding-bottom: 0; }
.workflow-number { padding-top: 4px; color: #11a8cd; font-size: 12px; }
.workflow-steps h3 { margin: 0 0 12px; font-size: clamp(17px, 1.5vw, 21px); font-weight: 400; line-height: 1.4; }
.workflow-steps p { max-width: 48ch; margin: 0; color: #b8b8b8; font-size: clamp(14px, 1.15vw, 17px); }

@media (max-width: 700px) {
  .workflow { grid-template-columns: minmax(0, 1fr); gap: 32px; }
}
</style>

<script setup lang="ts">
const title = 'Mentions légales | Ethan Baumann'
const description = 'Mentions légales, hébergement et informations sur la protection des données du site ethanbaumann.fr.'
const siteUrl = 'https://ethanbaumann.fr/mentions-legales'

useHead({
  htmlAttrs: { lang: 'fr' },
  title,
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: siteUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary' }
  ]
})
</script>

<template>
  <main class="legal-page" aria-labelledby="legal-title">
    <header class="legal-header">
      <p class="legal-command" aria-hidden="true"><span>~</span> cat mentions-legales.txt</p>
      <h1 id="legal-title">Mentions légales</h1>
      <p>Informations relatives à l’édition du site et à la protection de vos données personnelles.</p>
    </header>

    <div class="legal-content">
      <section aria-labelledby="publisher-title">
        <h2 id="publisher-title">Édition du site</h2>
        <p>Le site <a href="https://ethanbaumann.fr">ethanbaumann.fr</a> est édité par Ethan Baumann, qui en assure également la direction de la publication.</p>
        <p>Contact : <a href="mailto:contact@ethanbaumann.fr">contact@ethanbaumann.fr</a></p>
      </section>

      <section aria-labelledby="hosting-title">
        <h2 id="hosting-title">Hébergement</h2>
        <p>Ce site est hébergé par OVH SAS, société immatriculée au RCS de Lille Métropole sous le numéro 424 761 419, dont le siège social est situé 2 rue Kellermann, 59100 Roubaix, France.</p>
        <p>Téléphone : <a href="tel:+33972101007">+33 9 72 10 10 07</a></p>
      </section>

      <section aria-labelledby="intellectual-property-title">
        <h2 id="intellectual-property-title">Propriété intellectuelle</h2>
        <p>Sauf mention contraire, les textes, créations graphiques, logos, éléments visuels et le code présentés sur ce site appartiennent à Ethan Baumann. Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation préalable est interdite, sous réserve des exceptions prévues par la loi.</p>
      </section>

      <section id="donnees-personnelles" aria-labelledby="privacy-title">
        <h2 id="privacy-title">Données personnelles</h2>
        <p>Lorsque vous utilisez le formulaire de contact, votre nom, votre adresse e-mail et votre message sont collectés afin de répondre à votre demande et, le cas échéant, de préparer une relation contractuelle. Ce traitement repose sur l’intérêt légitime à répondre aux sollicitations et sur les mesures précontractuelles prises à votre demande.</p>
        <p>Les champs signalés comme obligatoires sont nécessaires pour traiter votre message. Les données sont destinées uniquement à Ethan Baumann et aux prestataires techniques nécessaires au fonctionnement du site et de la messagerie. Elles sont conservées pendant la durée nécessaire au traitement de la demande, puis au maximum trois ans après le dernier contact, sauf obligation légale ou nécessité liée à la constatation, à l’exercice ou à la défense de droits en justice.</p>
        <p>Vous pouvez demander l’accès à vos données, leur rectification, leur effacement ou la limitation de leur traitement, et vous opposer au traitement dans les conditions prévues par la réglementation. Pour exercer ces droits, écrivez à <a href="mailto:contact@ethanbaumann.fr">contact@ethanbaumann.fr</a>. Si vous estimez, après avoir pris contact, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la <a href="https://www.cnil.fr/" rel="external">CNIL</a>.</p>
      </section>

      <section aria-labelledby="security-title">
        <h2 id="security-title">Sécurité et traceurs</h2>
        <p>Le site ne dépose pas de traceur publicitaire ni de mesure d’audience. Le formulaire utilise Cloudflare Turnstile pour limiter les envois automatisés et abusifs. Lors de cette vérification, Cloudflare peut traiter des données techniques nécessaires à la sécurité du service, conformément à sa <a href="https://www.cloudflare.com/fr-fr/privacypolicy/" rel="external">politique de confidentialité</a>.</p>
      </section>

      <section aria-labelledby="liability-title">
        <h2 id="liability-title">Responsabilité</h2>
        <p>Les informations publiées sont fournies à titre indicatif et peuvent évoluer. Ethan Baumann s’efforce d’en assurer l’exactitude et l’accessibilité, sans pouvoir garantir l’absence d’erreur ou d’interruption. Les sites externes accessibles par des liens hypertextes restent sous la responsabilité de leurs éditeurs.</p>
      </section>
    </div>

    <NuxtLink class="back-link" to="/">← Retour à l’accueil</NuxtLink>
  </main>
</template>

<style scoped>
.legal-page { width: min(100%, 900px); padding-block: clamp(48px, 8vw, 110px); }
.legal-header { margin-bottom: clamp(48px, 7vw, 80px); }
.legal-command { margin: 0 0 20px; color: #919191; font-size: 13px; }
.legal-command span { color: #11a8cd; }
h1 { margin: 0; font-size: clamp(34px, 5vw, 64px); font-weight: 400; letter-spacing: -.04em; line-height: 1.1; }
.legal-header > p:last-child { max-width: 62ch; margin: 24px 0 0; color: #b8b8b8; }
.legal-content { display: grid; gap: 0; }
section { padding-block: clamp(32px, 5vw, 48px); border-top: 1px solid #242424; scroll-margin-top: 24px; }
h2 { margin: 0 0 20px; font-size: clamp(20px, 2.5vw, 28px); font-weight: 400; letter-spacing: -.02em; }
section p { max-width: 78ch; margin: 0; color: #b8b8b8; line-height: 1.75; }
section p + p { margin-top: 16px; }
a { color: white; overflow-wrap: anywhere; text-underline-offset: 4px; }
.back-link { display: block; width: fit-content; margin-top: 32px; color: #919191; font-size: 13px; }

@media (max-width: 700px) {
  .legal-page { padding-block: 48px 64px; }
}
</style>
